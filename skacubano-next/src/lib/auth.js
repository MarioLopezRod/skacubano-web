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

  if (!adminPassword || !adminSecret) {
    const generatedSecret = crypto.randomBytes(32).toString('hex');
    const defaultPassword = adminPassword || 'skacubano2026';
    
    const newEnvLines = [];
    if (!adminPassword) newEnvLines.push(`ADMIN_PASSWORD=${defaultPassword}`);
    if (!adminSecret) newEnvLines.push(`ADMIN_SECRET=${generatedSecret}`);

    try {
      const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      fs.writeFileSync(envPath, `${existing}\n${newEnvLines.join('\n')}\n`.trim(), 'utf8');
      
      if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = defaultPassword;
      if (!process.env.ADMIN_SECRET) process.env.ADMIN_SECRET = generatedSecret;
    } catch (e) {
      console.error('Error writing .env.local:', e);
    }
  }
}

export function getAdminPassword() {
  ensureEnvConfigured();
  const pass = getEnvVariable('ADMIN_PASSWORD');
  if (!pass) {
    throw new Error('ADMIN_PASSWORD is not set in environment or .env.local');
  }
  return pass;
}

export function getAdminSecret() {
  ensureEnvConfigured();
  const secret = getEnvVariable('ADMIN_SECRET');
  if (!secret) {
    throw new Error('ADMIN_SECRET is not set in environment or .env.local');
  }
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
