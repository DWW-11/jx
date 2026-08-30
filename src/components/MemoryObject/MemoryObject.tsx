import type { MemoryObjectData } from '../../content/mentor';

type MemoryObjectProps = {
  data: MemoryObjectData;
  discovered: boolean;
  active: boolean;
  isNext: boolean;
  locked: boolean;
  activeText?: string;
  onOpen: () => void;
};

export function MemoryObject({ data, discovered, active, isNext, locked, activeText, onOpen }: MemoryObjectProps) {
  const depth = data.position.depth ?? 0;

  return (
    <button
      type="button"
      className={`memory-object memory-object--${data.type} memory-object--depth-${depth} ${discovered ? 'is-discovered' : ''} ${active ? 'is-active' : ''} ${isNext ? 'is-next' : ''} ${locked ? 'is-locked' : ''}`}
      style={{ left: `${data.position.x}%`, top: `${data.position.y}%`, '--memory-accent': data.accent } as React.CSSProperties}
      onClick={onOpen}
      disabled={locked}
      aria-current={isNext ? 'step' : undefined}
      aria-label={data.title ?? `打开${data.id}记忆`}
    >
      <span className="memory-object__halo" aria-hidden="true" />
      <span className="memory-object__visual" aria-hidden="true">
        <span className="memory-object__detail memory-object__detail--one" />
        <span className="memory-object__detail memory-object__detail--two" />
      </span>
      <span className="memory-object__title">{data.title}</span>
      {isNext && <span className="memory-object__cue" aria-hidden="true">下一件</span>}
      {active && activeText && <span className="memory-object__story" aria-live="polite">{activeText}</span>}
    </button>
  );
}
