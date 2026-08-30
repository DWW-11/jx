import { useEffect, useRef } from 'react';
import { drawPath } from '../../animation/timeline';

type AnnotationProps = {
  text: string;
  path: string;
  revealed: boolean;
  index: number;
};

export function Annotation({ text, path, revealed, index }: AnnotationProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!revealed) return;
    drawPath(pathRef.current, reducedMotion);
  }, [revealed, reducedMotion]);

  return (
    <div className={`annotation annotation--${index + 1} ${revealed ? 'is-revealed' : ''}`}>
      <svg className="annotation__mark" viewBox="0 0 760 560" aria-hidden="true" preserveAspectRatio="none">
        <path ref={pathRef} d={path} />
      </svg>
      <p>{text}</p>
    </div>
  );
}
