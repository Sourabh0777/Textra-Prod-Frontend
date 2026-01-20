import { env } from '@/env';
import { API_BASE_URL } from '@/lib/api';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  try {
    const token = await getToken();
    const apiUrl = API_BASE_URL;

    // Call the external backend to sync user/session
    // We don't care about the response body for now, just ensuring it's called.
    // If you need to handle errors (e.g. backend down), add logic here.
    const response = await fetch(`${apiUrl}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Backend verification failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error calling backend sign-in:', error);
    return new Response('Error identifying user on the backend', { status: 500 });
  }
  // Redirect to dashboard where Redux will fetch user data
  redirect('/select-business-type');
}
