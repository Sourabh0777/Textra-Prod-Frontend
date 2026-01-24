import { env } from './src/env';

try {
  console.log('Environment validation successful!');
  console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  // Do NOT log the secret key for security reasons, just check it exists
  if (env.CLERK_SECRET_KEY) {
    console.log('CLERK_SECRET_KEY is present and validated.');
  }
} catch (error) {
  console.error('Environment validation failed:');
  console.error(error);
}
