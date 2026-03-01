import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server and never exposed to the client
   */
  server: {
    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CLERK_SECRET_KEY: z.string().min(1),
    FACEBOOK_APP_SECRET: z.string().min(1),
  },

  /**
   * Client-side environment variables schema
   * These must be prefixed with NEXT_PUBLIC_ and are exposed to the browser
   */
  client: {
    // API Configuration
    NEXT_PUBLIC_API_URL: z.string().url(),

    // Clerk Client Configuration
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().min(1),

    // Facebook Configuration
    NEXT_PUBLIC_FACEBOOK_APP_ID: z.string().min(1),
    NEXT_PUBLIC_FACEBOOK_API_VERSION: z.string().min(1),
    NEXT_PUBLIC_FACEBOOK_CONFIG_ID: z.string().min(1),
    NEXT_PUBLIC_FACEBOOK_REDIRECT_URI: z.string().url(),
  },

  /**
   * Runtime environment variables mapping
   * Map process.env to the schema above
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

    // Client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,

    // Facebook
    NEXT_PUBLIC_FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    NEXT_PUBLIC_FACEBOOK_API_VERSION: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION,
    NEXT_PUBLIC_FACEBOOK_CONFIG_ID: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
    NEXT_PUBLIC_FACEBOOK_REDIRECT_URI: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
  },

  /**
   * Skip validation during build time in CI/CD
   * Set to true if you want to skip validation during build
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
