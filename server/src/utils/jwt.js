/**
 * 100% Web Standards (Web Crypto API) JWT signing and verification
 * Compatible with Cloudflare Workers V8 isolates, Node.js, and Browsers
 */

const toBase64Url = (strOrObj) => {
  const str = typeof strOrObj === 'string' ? strOrObj : JSON.stringify(strOrObj);
  const binString = Array.from(new TextEncoder().encode(str), (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const fromBase64Url = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binString = atob(pad);
  const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const signToken = async (payload, secret, expiresInSeconds = 86400) => {
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
  const sigBytes = new Uint8Array(sigBuffer);
  const sigBin = Array.from(sigBytes, (b) => String.fromCharCode(b)).join('');
  const sigB64 = btoa(sigBin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return headB64 + '.' + payB64 + '.' + sigB64;
};

export const verifyToken = async (token, secret) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token string');
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
  const binString = atob(pad);
  const sigBytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));

  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
  if (!isValid) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(fromBase64Url(payloadB64));
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    const error = new Error('TokenExpiredError');
    error.name = 'TokenExpiredError';
    throw error;
  }

  return payload;
};
