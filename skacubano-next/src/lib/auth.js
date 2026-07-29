import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');

function getEnvVariable(key) {
  if (process.env[key]) {
    return process.env[key];
  }

  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (e) {
      console.error('Error reading .env.local:', e);
    }
  }

  return null;
}

export function ensureEnvConfigured() {
  let adminPassword = getEnvVariable('ADMIN_PASSWORD');
  let adminSecret = getEnvVariable('ADMIN_SECRET');

  const defaultPassword = adminPassword || process.env.ADMIN_PASSWORD || 'skacubano2026';
  const defaultSecret = adminSecret || process.env.ADMIN_SECRET || 'skacubano_default_secret_key_2026';

  if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = defaultPassword;
  if (!process.env.ADMIN_SECRET) process.env.ADMIN_SECRET = defaultSecret;

  if (!adminPassword || !adminSecret) {
    const newEnvLines = [];
    if (!adminPassword) newEnvLines.push(`ADMIN_PASSWORD=${defaultPassword}`);
    if (!adminSecret) newEnvLines.push(`ADMIN_SECRET=${defaultSecret}`);

    try {
      const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      fs.writeFileSync(envPath, `${existing}\n${newEnvLines.join('\n')}\n`.trim(), 'utf8');
    } catch (e) {
      // Ignorar errores en sistemas de archivos de solo lectura (como Vercel)
      console.warn('Cannot write to .env.local (read-only environment like Vercel):', e.message);
    }
  }
}

export function getAdminPassword() {
  ensureEnvConfigured();
  const pass = process.env.ADMIN_PASSWORD || getEnvVariable('ADMIN_PASSWORD') || 'skacubano2026';
  return pass;
}

export function getAdminSecret() {
  ensureEnvConfigured();
  const secret = process.env.ADMIN_SECRET || getEnvVariable('ADMIN_SECRET') || 'skacubano_default_secret_key_2026';
  return secret;
}

export function createSignedToken() {
  const secret = getAdminSecret();
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('hex');

  return `${payloadBase64}.${signature}`;
}

export function verifySignedToken(token) {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadBase64, signatureHex] = parts;

  try {
    const secret = getAdminSecret();
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('hex');

    const sigBuffer = Buffer.from(signatureHex, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export async function getAdminTokenFromRequest(request) {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('skacubano_admin_token')?.value;
    if (token) return token;
  } catch (e) {
    // Fallback if cookies() from next/headers is not available
  }
  return request?.cookies?.get?.('skacubano_admin_token')?.value || null;
}
