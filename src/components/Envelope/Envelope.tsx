type EnvelopeProps = {
  label: string;
  proximity: number;
  onOpen: () => void;
};

export function Envelope({ label, proximity, onOpen }: EnvelopeProps) {
  return (
    <button
      type="button"
      className={`envelope ${proximity > 0.72 ? 'is-found' : ''}`}
      style={{ '--envelope-proximity': proximity } as React.CSSProperties}
      onClick={onOpen}
      aria-label={`打开信封，${label}`}
    >
      <span className="envelope__paper" aria-hidden="true" />
      <span className="envelope__flap" aria-hidden="true" />
      <span className="envelope__label">{label}</span>
    </button>
  );
}
