import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, companies } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  userId: string;
  companyId: string;
  email: string;
  role: string;
}

export interface AuthTenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

export const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
};

export const authenticateRequest = async (request: NextRequest): Promise<{
  user: AuthUser;
  tenant: AuthTenant;
} & NextRequest> => {
  // Check rate limit by IP
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip') 
    || 'unknown';
  
  if (!checkRateLimit(`ip:${clientIp}`)) {
    throw new Error('Too many requests');
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  // Verify JWT
  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new Error('Unauthorized: Invalid or expired token');
  }

  // Rate limit by user
  if (!checkRateLimit(`user:${payload.userId}`)) {
    throw new Error('Too many requests');
  }

  // Get user from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (!user || !user.isActive) {
    throw new Error('Unauthorized: User not found or inactive');
  }

  // Get company (tenant) from database
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, payload.companyId))
    .limit(1);

  if (!company) {
    throw new Error('Unauthorized: Company not found');
  }

  const authenticatedRequest = request as any;
  authenticatedRequest.user = {
    userId: payload.userId,
    companyId: payload.companyId,
    email: payload.email,
    role: payload.role
  };
  authenticatedRequest.tenant = {
    id: company.id,
    name: company.name,
    slug: company.slug,
    plan: company.plan
  };

  return authenticatedRequest;
};

// Middleware for authenticating API routes with security hardening
export const authMiddleware = async (
  request: NextRequest,
  handler: (request: any) => Promise<NextResponse>
): Promise<NextResponse> => {
  try {
    // Security headers
    const startTime = Date.now();
    
    const authRequest = await authenticateRequest(request);
    const response = await handler(authRequest);
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('X-Response-Time', String(Date.now() - startTime));
    
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    const status = message.includes('Too many requests') ? 429 : 401;
    return NextResponse.json({ error: message }, { status });
  }
};

// Role-based access control
export const requireRole = (...allowedRoles: string[]) => {
  return (request: any): boolean => {
    return request.user && allowedRoles.includes(request.user.role);
  };
};

export default { 
  authenticateRequest, 
  authMiddleware, 
  checkRateLimit,
  requireRole 
};