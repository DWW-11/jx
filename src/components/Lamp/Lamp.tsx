type LampProps = {
  className?: string;
  active?: boolean;
  dimmed?: boolean;
};

export function Lamp({ className = '', active = true, dimmed = false }: LampProps) {
  return (
    <div className={`lamp ${active ? 'lamp--active' : ''} ${dimmed ? 'lamp--dimmed' : ''} ${className}`} aria-hidden="true">
      <div className="lamp__halo" />
      <div className="lamp__shade"><span /><i /></div>
      <div className="lamp__bulb" />
      <div className="lamp__arm" />
      <div className="lamp__joint" />
      <div className="lamp__neck" />
      <div className="lamp__switch" />
      <div className="lamp__base" />
    </div>
  );
}
