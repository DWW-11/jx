import { FormEvent, useEffect, useRef, useState } from 'react';

type PasswordGateProps = { onSuccess: () => void };

export function PasswordGate({ onSuccess }: PasswordGateProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'unlocking' | 'wrong' | 'unavailable'>('idle');

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || status === 'checking' || status === 'unlocking') return;
    setStatus('checking');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setStatus(response.status === 401 ? 'wrong' : 'unavailable');
        window.setTimeout(() => {
          setStatus('idle');
          inputRef.current?.focus();
        }, 1500);
        return;
      }
      setStatus('unlocking');
      window.setTimeout(onSuccess, 1150);
    } catch {
      setStatus('unavailable');
      window.setTimeout(() => {
        setStatus('idle');
        inputRef.current?.focus();
      }, 1800);
    }
  }

  const message = status === 'wrong'
    ? '灯还未点亮'
    : status === 'unavailable'
      ? '灯还未点亮'
      : '';

  return (
    <section className={`password-gate ${status === 'wrong' ? 'is-shaking' : ''} ${status === 'unlocking' ? 'is-unlocking' : ''}`} aria-labelledby="password-gate-title">
      <div className="password-gate__light" aria-hidden="true" />
      <div className="password-gate__lamp" aria-hidden="true"><span /></div>
      <div className="password-gate__content">
        <p id="password-gate-title">自由的灵魂追求自由的温度</p>
        <form className="password-gate__form" onSubmit={submit}>
          <input
            ref={inputRef}
            className="password-gate__input"
            type="password"
            value={password}
            placeholder="输入进入口令"
            aria-label="输入进入口令"
            autoComplete="off"
            disabled={status === 'checking' || status === 'unlocking'}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="password-gate__submit" disabled={!password || status === 'checking' || status === 'unlocking'}>
            进入
          </button>
        </form>
        <p className={`password-gate__message ${message ? 'is-visible' : ''}`} role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
