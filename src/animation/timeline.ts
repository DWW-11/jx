import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const motion = {
  soft: 'power2.out',
  paper: 'power1.out',
  float: 'sine.inOut',
};

export function enterScene(target: Element | null) {
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.fromTo(
    target,
    { y: 12 },
    { y: 0, duration: 1.1, ease: motion.soft, clearProps: 'transform' },
  );
}

export function drawPath(target: SVGPathElement | null, reducedMotion: boolean) {
  if (!target) return;
  const length = target.getTotalLength();
  target.style.strokeDasharray = `${length}`;
  target.style.strokeDashoffset = `${reducedMotion ? 0 : length}`;

  if (reducedMotion) return;

  gsap.to(target, {
    strokeDashoffset: 0,
    duration: 1.35,
    ease: motion.paper,
  });
}

export function createSceneScrollParallax(target: Element | null, onProgress: (value: number) => void) {
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined;

  const trigger = ScrollTrigger.create({
    trigger: target,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: (self) => onProgress(self.progress),
  });

  return () => trigger.kill();
}
