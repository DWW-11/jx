// @ts-expect-error The Vite/Vercel Node runtime provides this built-in module.
import { createHmac, timingSafeEqual } from 'node:crypto';

declare const Buffer: { from: (value: string) => Uint8Array };

export const SESSION_COOKIE = 'mentor_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function passwordsMatch(password: string, configuredPassword: string) {
  const provided = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export function createSessionToken(secret: string, now = Date.now()) {
  const expiresAt = now + SESSION_MAX_AGE * 1000;
  const signature = createHmac('sha256', secret).update(`mentor-session:${expiresAt}`).digest('hex');
  return `${expiresAt}.${signature}`;
}

export function isValidSession(token: string | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const [expiresAtText, signature] = token.split('.');
  const expiresAt = Number(expiresAtText);
  if (!Number.isFinite(expiresAt) || expiresAt <= now || !signature) return false;
  const expected = createHmac('sha256', secret).update(`mentor-session:${expiresAt}`).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function readCookie(cookieHeader: string | undefined, name: string) {
  return cookieHeader?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function sessionCookie(secret: string, secure: boolean) {
  const token = createSessionToken(secret);
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax${secure ? '; Secure' : ''}`;
}
