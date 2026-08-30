import { VolumeIcon, VolumeOffIcon } from '../Icons';

type SceneChromeProps = {
  scene: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
};

export function SceneChrome({ scene, soundEnabled, onToggleSound }: SceneChromeProps) {
  return (
    <div className="scene-chrome">
      <div className="scene-chrome__right">
        <span className="scene-chrome__chapter">{scene}</span>
        <button
          className="sound-button"
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? '关闭环境声音' : '开启环境声音'}
          title={soundEnabled ? '关闭环境声音' : '开启环境声音'}
        >
          {soundEnabled ? <VolumeIcon /> : <VolumeOffIcon />}
          <span>{soundEnabled ? '声音' : '静音'}</span>
        </button>
      </div>
    </div>
  );
}
