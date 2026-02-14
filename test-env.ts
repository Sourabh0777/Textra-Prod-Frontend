import { env } from './src/env';

try {
  // Do NOT log the secret key for security reasons, just check it exists
  if (env.CLERK_SECRET_KEY) {
  }
} catch (error) {
  console.error('Environment validation failed:');
  console.error(error);
}
