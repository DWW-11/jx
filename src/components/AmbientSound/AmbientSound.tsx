import { useEffect, useRef } from 'react';

export type SoundEffect =
  | 'lamp-on'
  | 'lamp-off'
  | 'paper-turn'
  | 'pencil'
  | 'paper-lift'
  | 'paper-settle'
  | 'memory-chime'
  | 'envelope-arrive'
  | 'envelope-open'
  | 'soft-chime';

type AmbientNodes = {
  musicGain: GainNode;
  scheduler: number;
  voices: Set<OscillatorNode>;
  nextPhraseAt: number;
  phraseIndex: number;
};

let sharedContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let soundscapeEnabled = false;
let lastEffectAt = new Map<SoundEffect, number>();

function getAudioContext() {
  if (sharedContext?.state === 'closed') {
    sharedContext = null;
    masterGain = null;
  }

  const AudioContextClass = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextClass) return null;
  sharedContext ??= new AudioContextClass();
  return sharedContext;
}

function getMasterGain(context: AudioContext) {
  if (masterGain) return masterGain;
  masterGain = context.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(context.destination);
  return masterGain;
}

function ramp(gain: AudioParam, value: number, at: number, duration: number) {
  gain.cancelScheduledValues(at);
  gain.setValueAtTime(Math.max(gain.value, 0.0001), at);
  gain.linearRampToValueAtTime(value, at + duration);
}

/** Unlock the shared context from a direct user gesture for Safari and mobile browsers. */
export function prepareAmbientAudio() {
  const context = getAudioContext();
  if (!context) return;
  getMasterGain(context);
  if (context.state !== 'running') void context.resume().catch(() => undefined);
}

export function setSoundscapeEnabled(enabled: boolean) {
  soundscapeEnabled = enabled;
  if (!enabled && !sharedContext) return;
  const context = getAudioContext();
  if (!context) return;
  const output = getMasterGain(context);
  const now = context.currentTime;
  ramp(output.gain, enabled ? 0.34 : 0.0001, now, enabled ? 0.24 : 0.18);
}

function createNoiseBuffer(context: AudioContext, duration: number) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;

  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.84 + white * 0.16;
    data[index] = previous;
  }

  return buffer;
}

function playTone(
  context: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  endFrequency?: number,
  destination: AudioNode = getMasterGain(context),
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + Math.min(0.045, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain).connect(destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playNoise(
  context: AudioContext,
  duration: number,
  volume: number,
  filterType: BiquadFilterType,
  frequency: number,
  q = 0.7,
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;

  source.buffer = createNoiseBuffer(context, duration);
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, now);
  filter.Q.setValueAtTime(q, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter).connect(gain).connect(getMasterGain(context));
  source.start(now);
  source.stop(now + duration + 0.03);
}

function playEffectNow(context: AudioContext, effect: SoundEffect) {
  switch (effect) {
    case 'lamp-on':
      playNoise(context, 0.055, 0.11, 'lowpass', 1400);
      playTone(context, 740, 0.23, 0.055, 'sine', 1130);
      playTone(context, 146.83, 0.34, 0.025, 'triangle', 164.81);
      break;
    case 'lamp-off':
      playNoise(context, 0.045, 0.085, 'highpass', 900);
      playTone(context, 420, 0.14, 0.035, 'triangle', 190);
      break;
    case 'paper-turn':
      playNoise(context, 0.52, 0.12, 'bandpass', 1150, 0.55);
      playNoise(context, 0.22, 0.05, 'lowpass', 460);
      break;
    case 'pencil':
      playNoise(context, 0.32, 0.07, 'bandpass', 2050, 1.2);
      playNoise(context, 0.12, 0.035, 'highpass', 3200, 0.5);
      break;
    case 'paper-lift':
      playNoise(context, 0.16, 0.055, 'bandpass', 980, 0.75);
      break;
    case 'paper-settle':
      playNoise(context, 0.11, 0.06, 'lowpass', 760);
      playTone(context, 246.94, 0.11, 0.012, 'sine', 220);
      break;
    case 'memory-chime':
      playTone(context, 659.25, 0.62, 0.042, 'sine', 783.99);
      window.setTimeout(() => playTone(context, 987.77, 0.48, 0.025, 'sine', 1174.66), 115);
      break;
    case 'envelope-arrive':
      playNoise(context, 0.18, 0.045, 'lowpass', 630);
      playTone(context, 293.66, 0.28, 0.025, 'triangle', 369.99);
      break;
    case 'envelope-open':
      playNoise(context, 0.44, 0.095, 'bandpass', 1020, 0.6);
      playTone(context, 523.25, 0.52, 0.04, 'sine', 659.25);
      break;
    case 'soft-chime':
      playTone(context, 523.25, 0.4, 0.03, 'sine', 659.25);
      window.setTimeout(() => playTone(context, 783.99, 0.45, 0.022, 'sine', 987.77), 95);
      break;
  }
}

export function playSoundEffect(effect: SoundEffect) {
  if (!soundscapeEnabled) return;
  const context = getAudioContext();
  if (!context) return;

  const now = performance.now();
  const cooldown = effect === 'pencil' ? 180 : effect === 'paper-settle' ? 120 : 80;
  if (now - (lastEffectAt.get(effect) ?? 0) < cooldown) return;
  lastEffectAt.set(effect, now);

  const play = () => playEffectNow(context, effect);
  if (context.state === 'suspended') {
    void context.resume().then(play).catch(() => undefined);
    return;
  }
  play();
}

const chords = [
  [146.83, 184.99, 220],
  [130.81, 164.81, 196],
  [174.61, 220, 261.63],
  [146.83, 184.99, 220],
];

function scheduleAmbientVoice(context: AudioContext, destination: AudioNode, frequency: number, startAt: number, duration: number, volume: number, voices: Set<OscillatorNode>) {
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1180, startAt);
  filter.Q.setValueAtTime(0.38, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.72);
  gain.gain.exponentialRampToValueAtTime(volume * 0.52, startAt + duration * 0.58);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(filter).connect(gain).connect(destination);
  oscillator.onended = () => voices.delete(oscillator);
  voices.add(oscillator);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.04);
}

function schedulePhrase(context: AudioContext, nodes: AmbientNodes) {
  const startAt = Math.max(nodes.nextPhraseAt, context.currentTime + 0.06);
  const chord = chords[nodes.phraseIndex % chords.length];
  const pattern = [0, 2, 1, 2];

  pattern.forEach((toneIndex, index) => {
    const noteAt = startAt + index * 2.85;
    scheduleAmbientVoice(context, nodes.musicGain, chord[toneIndex], noteAt, 4.6, 0.045, nodes.voices);
    if (index === 0 || index === 2) {
      scheduleAmbientVoice(context, nodes.musicGain, chord[(toneIndex + 1) % chord.length] * 2, noteAt + 0.18, 3.7, 0.012, nodes.voices);
    }
  });

  nodes.nextPhraseAt = startAt + 11.4;
  nodes.phraseIndex += 1;
}

function createAmbient(context: AudioContext, intensity: number): AmbientNodes {
  const musicGain = context.createGain();
  const now = context.currentTime;
  musicGain.gain.setValueAtTime(0.0001, now);
  musicGain.gain.linearRampToValueAtTime(0.72 * intensity, now + 1.5);
  musicGain.connect(getMasterGain(context));

  const nodes: AmbientNodes = {
    musicGain,
    scheduler: 0,
    voices: new Set(),
    nextPhraseAt: now + 0.08,
    phraseIndex: 0,
  };

  schedulePhrase(context, nodes);
  nodes.scheduler = window.setInterval(() => schedulePhrase(context, nodes), 8500);
  return nodes;
}

function stopAmbient(nodes: AmbientNodes | null) {
  if (!nodes || !sharedContext) return;
  window.clearInterval(nodes.scheduler);
  const now = sharedContext.currentTime;
  nodes.musicGain.gain.cancelScheduledValues(now);
  nodes.musicGain.gain.setValueAtTime(Math.max(nodes.musicGain.gain.value, 0.0001), now);
  nodes.musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  window.setTimeout(() => {
    nodes.voices.forEach((voice) => {
      try { voice.stop(); } catch { /* Voice already completed. */ }
    });
    nodes.voices.clear();
    nodes.musicGain.disconnect();
  }, 480);
}

export function AmbientSound({ enabled, intensity = 1 }: { enabled: boolean; intensity?: number }) {
  const nodesRef = useRef<AmbientNodes | null>(null);

  useEffect(() => {
    setSoundscapeEnabled(enabled);
    if (!enabled) {
      stopAmbient(nodesRef.current);
      nodesRef.current = null;
      return;
    }

    const context = getAudioContext();
    if (!context) return;
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    const nodes = createAmbient(context, intensity);
    nodesRef.current = nodes;

    return () => {
      stopAmbient(nodes);
      if (nodesRef.current === nodes) nodesRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const context = sharedContext;
    const nodes = nodesRef.current;
    if (!context || !nodes || !enabled) return;
    nodes.musicGain.gain.setTargetAtTime(0.72 * intensity, context.currentTime, 0.65);
  }, [enabled, intensity]);

  useEffect(() => {
    if (!enabled) return;
    const resume = () => prepareAmbientAudio();
    window.addEventListener('pointerdown', resume, { passive: true });
    document.addEventListener('visibilitychange', resume);
    return () => {
      window.removeEventListener('pointerdown', resume);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [enabled]);

  return null;
}
