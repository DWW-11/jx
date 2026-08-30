import type { PointerEvent as ReactPointerEvent } from 'react';
import type { ThinkingGroupId } from '../../content/mentor';

export type QuestionFragmentData = {
  id: string;
  text: string;
  group: ThinkingGroupId;
  position: { x: number; y: number; rotate: number; depth: number };
};

type QuestionFragmentProps = {
  data: QuestionFragmentData;
  style: React.CSSProperties;
  isSettled: boolean;
  isDragging: boolean;
  isFocused?: boolean;
  isHint?: boolean;
  interactionEnabled?: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onTap: () => void;
};

export function QuestionFragment({
  data,
  style,
  isSettled,
  isDragging,
  isFocused = false,
  isHint = false,
  interactionEnabled = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onTap,
}: QuestionFragmentProps) {
  return (
    <button
      type="button"
      className={`question-fragment question-fragment--depth-${data.position.depth} ${isSettled ? 'is-settled' : ''} ${isDragging ? 'is-dragging' : ''} ${isFocused ? 'is-focused' : ''}`}
      style={style}
      data-question-id={data.id}
      tabIndex={interactionEnabled ? 0 : -1}
      disabled={!interactionEnabled || isSettled}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onTap}
      aria-label={`问题：${data.text}`}
    >
      <span>{data.text}</span>
    </button>
  );
}
