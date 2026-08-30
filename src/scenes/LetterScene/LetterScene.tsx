import { useEffect, useRef, useState } from 'react';
import { mentorStory } from '../../content/mentor';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';

type LetterSceneProps = { active: boolean; onRestart: () => void };

export function LetterScene({ active, onRestart }: LetterSceneProps) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [showReturn, setShowReturn] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisibleParagraphs([]);
      setShowReturn(false);
      document.body.classList.remove('letter-open');
      return;
    }
    document.body.classList.add('letter-open');
    enterScene(sceneRef.current);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLElement).dataset.paragraphIndex);
        setVisibleParagraphs((current) => current.includes(index) ? current : [...current, index]);
      });
    }, { threshold: 0.28 });
    paragraphRefs.current.forEach((paragraph) => paragraph && observer.observe(paragraph));
    const returnTimer = window.setTimeout(() => setShowReturn(true), 9000);
    return () => {
      observer.disconnect();
      window.clearTimeout(returnTimer);
      document.body.classList.remove('letter-open');
    };
  }, [active]);

  return (
    <section ref={sceneRef} className={`scene scene--letter ${active ? 'is-active' : ''}`}>
      <article className="letter" aria-labelledby="letter-salutation">
        <p className="letter__eyebrow">{mentorStory.letter.eyebrow}</p>
        <h1 id="letter-salutation">{mentorStory.letter.salutation}</h1>
        <div className="letter__body">
          {mentorStory.letter.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              ref={(node) => { paragraphRefs.current[index] = node; }}
              data-paragraph-index={index}
              className={visibleParagraphs.includes(index) ? 'is-visible' : ''}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <p className="letter__closing">{mentorStory.letter.closing}</p>
        <p className="letter__signature">{mentorStory.letter.signature}</p>
        <p className="letter__final-line">{mentorStory.letter.finalLine}</p>
        {showReturn && (
          <button type="button" className="letter__return" onClick={() => { playSoundEffect('soft-chime'); onRestart(); }}>{mentorStory.letter.returnText}</button>
        )}
      </article>
    </section>
  );
}
