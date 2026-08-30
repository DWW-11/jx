import { isValidSession, passwordsMatch, readCookie, SESSION_COOKIE, sessionCookie } from '../server/auth.js';

declare const process: { env: Record<string, string | undefined> };

type Request = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type Response = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

function send(res: Response, statusCode: number, body: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function parseBody(body: unknown) {
  if (typeof body === 'object' && body !== null) return body as { password?: unknown };
  if (typeof body !== 'string') return {};
  try { return JSON.parse(body) as { password?: unknown }; } catch { return {}; }
}

export default function handler(req: Request, res: Response) {
  const secret = process.env.SESSION_SECRET?.trim();
  const configuredPassword = process.env.MENTOR_PASSWORD;
  if (!secret || !configuredPassword) {
    send(res, 503, { error: 'auth_not_configured' });
    return;
  }

  if (req.method === 'GET') {
    const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
    send(res, 200, { authenticated: isValidSession(readCookie(cookie, SESSION_COOKIE), secret) });
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end();
    return;
  }

  const password = parseBody(req.body).password;
  if (typeof password !== 'string' || !passwordsMatch(password, configuredPassword)) {
    send(res, 401, { error: 'invalid_password' });
    return;
  }

  res.statusCode = 204;
  res.setHeader('Set-Cookie', sessionCookie(secret, process.env.NODE_ENV === 'production'));
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}
