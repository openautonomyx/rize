// Security configuration for production

export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    maxTokens: 500,
    maxIp: 200
  },

  // Password requirements
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxAge: 90 // days
  },

  // Session
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxPerUser: 5,
    idleTimeout: 30 * 60 * 1000 // 30 minutes
  },

  // Account lockout
  lockout: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutDuration: 30 * 60 * 1000 // 30 minutes
  },

  // API keys
  apiKeys: {
    maxPerCompany: 10,
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  },

  // Audit logging
  audit: {
    logAuthAttempts: true,
    logDataAccess: true,
    logModifications: true,
    retentionDays: 90
  },

  // Tenant limits by plan
  limits: {
    free: {
      users: 5,
      apiKeys: 3,
      storage: 1 * 1024 * 1024 * 1024 // 1GB
    },
    starter: {
      users: 20,
      apiKeys: 10,
      storage: 10 * 1024 * 1024 * 1024 // 10GB
    },
    pro: {
      users: 100,
      apiKeys: 50,
      storage: 100 * 1024 * 1024 * 1024 // 100GB
    },
    enterprise: {
      users: Infinity,
      apiKeys: Infinity,
      storage: Infinity
    }
  }
} as const;

export type SubscriptionTier = keyof typeof SECURITY_CONFIG.limits;

export const getTenantLimit = (tier: SubscriptionTier) => {
  return SECURITY_CONFIG.limits[tier];
};

export default SECURITY_CONFIG;