import { Lamp } from '../Lamp/Lamp';

type WorkspaceIllustrationProps = {
  variant: 'owned' | 'departure';
  objectStage?: number;
  lampActive?: boolean;
  onOpenDocument?: () => void;
};

export function WorkspaceIllustration({ variant, objectStage = 0, lampActive = false, onOpenDocument }: WorkspaceIllustrationProps) {
  const departure = variant === 'departure';

  return (
    <div className={`owned-workspace owned-workspace--${variant}`} aria-hidden={onOpenDocument ? undefined : true}>
      <div className="owned-workspace__window" />
      <div className="owned-workspace__desk"><span /><i /><b /></div>
      <div className={`owned-workspace__laptop ${departure && objectStage >= 3 ? 'is-gone' : ''}`}><span /></div>
      <div className={`owned-workspace__notes ${departure && objectStage >= 1 ? 'is-gone' : ''}`} />
      <div className={`owned-workspace__message ${departure && objectStage >= 4 ? 'is-gone' : ''}`} />
      <div className={`owned-workspace__chair ${departure && objectStage >= 5 ? 'is-moved' : ''}`} />
      <div className={`owned-workspace__badge ${departure && objectStage >= 6 ? 'is-gone' : ''}`}>U&amp;M</div>
      {onOpenDocument ? (
        <button type="button" className="owned-workspace__document" onClick={onOpenDocument} aria-label="Open document">
          <span /><span /><i aria-hidden="true" />
        </button>
      ) : (
        <div className={`owned-workspace__document owned-workspace__document--static ${departure && objectStage >= 2 ? 'is-gone' : ''}`}>
          <span /><span /><i />
        </div>
      )}
      <Lamp className="owned-workspace__lamp" active={lampActive} dimmed={!lampActive} />
      <div className="owned-workspace__shadow" />
    </div>
  );
}
