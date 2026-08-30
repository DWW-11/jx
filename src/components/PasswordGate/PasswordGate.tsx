import { FormEvent, useEffect, useRef, useState } from 'react';

type PasswordGateProps = { onSuccess: () => void };

export function PasswordGate({ onSuccess }: PasswordGateProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'unlocking' | 'wrong' | 'unavailable'>('idle');

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Fallback client-side password check for static hosts like GitHub Pages.
  // Default matches the local .env MENTOR_PASSWORD value.
  const CLIENT_PASSWORD = import.meta.env.VITE_MENTOR_PASSWORD ?? 'ZY';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || status === 'checking' || status === 'unlocking') return;
    setStatus('checking');

    // Try backend auth first (used in local dev)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setStatus('unlocking');
        window.setTimeout(onSuccess, 1150);
        return;
      }
      // 401 means wrong password; other errors may mean no backend, fall through
      if (response.status === 401) {
        setStatus('wrong');
        window.setTimeout(() => {
          setStatus('idle');
          inputRef.current?.focus();
        }, 1500);
        return;
      }
    } catch {
      // Network error: no backend available, fall through to client check
    }

    // Client-side fallback
    if (password !== CLIENT_PASSWORD) {
      setStatus('wrong');
      window.setTimeout(() => {
        setStatus('idle');
        inputRef.current?.focus();
      }, 1500);
      return;
    }

    setStatus('unlocking');
    window.setTimeout(onSuccess, 1150);
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
