/**
 * Edge and Cloudflare Workers compatible JWT signing and verification using standard Web Crypto API
 */

const toBase64Url = (obj) => {
  const json = JSON.stringify(obj);
  const b64 = Buffer.from(json).toString('base64');
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const fromBase64Url = (str) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return Buffer.from(pad, 'base64').toString('utf8');
};

export const signToken = async (payload, secret, expiresInSeconds = 900) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const headB64 = toBase64Url(header);
  const payB64 = toBase64Url(fullPayload);
  const data = new TextEncoder().encode(headB64 + '.' + payB64);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuffer = await crypto.subtle.sign('HMAC', key, data);
  const sigB64 = Buffer.from(sigBuffer).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return headB64 + '.' + payB64 + '.' + sigB64;
};

export const verifyToken = async (token, secret) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token format');
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const data = new TextEncoder().encode(headerB64 + '.' + payloadB64);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const base64 = sigB64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const sigBytes = Buffer.from(pad, 'base64');

  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
  if (!isValid) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(fromBase64Url(payloadB64));
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    const error = new Error('TokenExpiredError');
    error.name = 'TokenExpiredError';
    throw error;
  }

  return payload;
};
