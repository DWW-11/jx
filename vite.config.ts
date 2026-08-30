import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { isValidSession, passwordsMatch, readCookie, SESSION_COOKIE, sessionCookie } from './server/auth';

declare const process: { env: Record<string, string | undefined>; cwd: () => string };

function mentorAuthPlugin(env: Record<string, string | undefined>): Plugin {
  return {
    name: 'mentor-auth',
    configureServer(server) {
      server.middlewares.use('/api/auth', (req, res, next) => {
        const request = req as unknown as {
          method?: string;
          headers: { cookie?: string };
          setEncoding: (encoding: string) => void;
          on: (event: string, callback: (chunk?: string) => void) => void;
        };
        const response = res as unknown as { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void };
        if (request.method !== 'POST' && request.method !== 'GET') {
          next();
          return;
        }

        const secret = env.SESSION_SECRET?.trim();
        const configuredPassword = env.MENTOR_PASSWORD;
        if (!secret || !configuredPassword) {
          response.statusCode = 503;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'auth_not_configured' }));
          return;
        }

        if (request.method === 'GET') {
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ authenticated: isValidSession(readCookie(request.headers.cookie, SESSION_COOKIE), secret) }));
          return;
        }

        let body = '';
        request.setEncoding('utf8');
        request.on('data', (chunk) => { body += chunk ?? ''; });
        request.on('end', () => {
          let password = '';
          try { password = JSON.parse(body).password ?? ''; } catch { /* malformed input is simply invalid */ }
          if (typeof password !== 'string' || !passwordsMatch(password, configuredPassword)) {
            response.statusCode = 401;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ error: 'invalid_password' }));
            return;
          }
          response.statusCode = 204;
          response.setHeader('Set-Cookie', sessionCookie(secret, env.NODE_ENV === 'production'));
          response.end();
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return {
    plugins: [react(), mentorAuthPlugin(env)],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  };
});
