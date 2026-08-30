import { useCallback, useEffect, useRef, useState } from 'react';
import { AmbientSound, playSoundEffect, prepareAmbientAudio, setSoundscapeEnabled } from './components/AmbientSound/AmbientSound';
import { PasswordGate } from './components/PasswordGate/PasswordGate';
import { SceneChrome } from './components/Scene/SceneChrome';
import { IntroScene } from './scenes/IntroScene/IntroScene';
import { FirstDayScene } from './scenes/FirstDayScene/FirstDayScene';
import { DocumentScene } from './scenes/DocumentScene/DocumentScene';
import { ThinkingScene } from './scenes/ThinkingScene/ThinkingScene';
import { MemoriesScene } from './scenes/MemoriesScene/MemoriesScene';
import { InternalizedScene } from './scenes/InternalizedScene/InternalizedScene';
import { DepartureScene } from './scenes/DepartureScene/DepartureScene';
import { LetterScene } from './scenes/LetterScene/LetterScene';

type Scene = 'intro' | 'first-day' | 'document' | 'thinking' | 'memories' | 'internalized' | 'departure' | 'letter';

const sceneLabels: Record<Scene, string> = {
  intro: '00 / 微光',
  'first-day': '01 / 第一天',
  document: '02 / 第一次评审',
  thinking: '03 / 学会看见',
  memories: '04 / 小小的记忆',
  internalized: '05 / 它留下来了',
  departure: '06 / 离开',
  letter: '07 / 一封信',
};

function SoundGate({ onChoose }: { onChoose: (enabled: boolean) => void }) {
  return (
    <div className="sound-gate" role="dialog" aria-modal="true" aria-labelledby="sound-gate-title">
      <p className="sound-gate__label">开始之前</p>
      <h2 id="sound-gate-title">让这段记忆保持安静，<br />或给它一点伴奏</h2>
      <div className="sound-gate__actions">
        <button type="button" className="sound-gate__option sound-gate__option--quiet" onClick={() => onChoose(false)}>
          静默进入
        </button>
        <button type="button" className="sound-gate__option" onClick={() => onChoose(true)}>
          开启声音
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [scene, setScene] = useState<Scene>('intro');
  const [authenticated, setAuthenticated] = useState(false);
  const [started, setStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [discoveredMemories, setDiscoveredMemories] = useState<string[]>([]);
  const sceneTransitionRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (sceneTransitionRef.current !== null) window.clearTimeout(sceneTransitionRef.current);
  }, []);

  const transitionTo = useCallback((nextScene: Scene) => {
    if (sceneTransitionRef.current !== null) return;
    sceneTransitionRef.current = window.setTimeout(() => {
      sceneTransitionRef.current = null;
      setScene(nextScene);
    }, 850);
  }, []);

  const moveToFirstDay = useCallback(() => transitionTo('first-day'), [transitionTo]);
  const moveToDocument = useCallback(() => transitionTo('document'), [transitionTo]);
  const moveToThinking = useCallback(() => transitionTo('thinking'), [transitionTo]);
  const moveToMemories = useCallback(() => transitionTo('memories'), [transitionTo]);
  const moveToInternalized = useCallback(() => transitionTo('internalized'), [transitionTo]);
  const moveToDeparture = useCallback(() => transitionTo('departure'), [transitionTo]);
  const moveToLetter = useCallback(() => transitionTo('letter'), [transitionTo]);
  const discoverMemory = useCallback((id: string) => {
    setDiscoveredMemories((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  function chooseSound(enabled: boolean) {
    if (enabled) {
      prepareAmbientAudio();
      setSoundscapeEnabled(true);
      playSoundEffect('soft-chime');
    } else {
      setSoundscapeEnabled(false);
    }
    setSoundEnabled(enabled);
    setStarted(true);
  }

  const restart = useCallback(() => {
    setSoundscapeEnabled(false);
    setDiscoveredMemories([]);
    setSoundEnabled(false);
    setStarted(false);
    setScene('intro');
  }, []);

  const soundIntensity = scene === 'departure' ? 0.2 : scene === 'letter' ? 0 : scene === 'internalized' ? 0.45 : 1;

  return (
    <main className={`experience experience--${scene}`}>
      <AmbientSound enabled={started && soundEnabled} intensity={soundIntensity} />
      <IntroScene active={scene === 'intro'} started={started} onComplete={moveToFirstDay} />
      <FirstDayScene active={scene === 'first-day'} onOpenDocument={moveToDocument} />
      <DocumentScene active={scene === 'document'} onComplete={moveToThinking} />
      <ThinkingScene active={scene === 'thinking'} onComplete={moveToMemories} />
      <MemoriesScene
        active={scene === 'memories'}
        discoveredMemories={discoveredMemories}
        onDiscover={discoverMemory}
        onComplete={moveToInternalized}
      />
      <InternalizedScene active={scene === 'internalized'} onComplete={moveToDeparture} />
      <DepartureScene active={scene === 'departure'} onOpenLetter={moveToLetter} />
      <LetterScene active={scene === 'letter'} onRestart={restart} />
      {started && (
        <SceneChrome
          scene={sceneLabels[scene]}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const nextEnabled = !soundEnabled;
            if (nextEnabled) {
              prepareAmbientAudio();
              setSoundscapeEnabled(true);
              playSoundEffect('soft-chime');
            } else {
              setSoundscapeEnabled(false);
            }
            setSoundEnabled(nextEnabled);
          }}
        />
      )}
      {authenticated && !started && <SoundGate onChoose={chooseSound} />}
      {!authenticated && <PasswordGate onSuccess={() => setAuthenticated(true)} />}
    </main>
  );
}
