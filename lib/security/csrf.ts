import { randomBytes, createHash, timingSafeEqual } from 'crypto';

// Generate CSRF token
export const generateCsrfToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Hash token for storage
export const hashCsrfToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

// Verify CSRF token
export const verifyCsrfToken = (token: string, hashedToken: string): boolean => {
  try {
    const hashed = hashCsrfToken(token);
    return timingSafeEqual(Buffer.from(hashed), Buffer.from(hashedToken));
  } catch {
    return false;
  }
};

// Session security
export const SESSION_CONFIG = {
  cookieName: '__rize session',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Security headers for Next.js
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

export default {
  generateCsrfToken,
  hashCsrfToken,
  verifyCsrfToken,
  SESSION_CONFIG,
  SECURITY_HEADERS
};