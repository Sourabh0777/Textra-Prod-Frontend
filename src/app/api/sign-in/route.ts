/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Call the external backend to sync user/session
    // We don't care about the response body for now, just ensuring it's called.
    // If you need to handle errors (e.g. backend down), add logic here.
    const response = await fetch(`http://localhost:5000/api/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    console.log('🚀 ~ GET ~ response:', response);
    const data: { success: boolean; user: any } = await response.json();
    console.log('🚀 ~ GET ~ data:', data);
    if (!data.success) {
      redirect('/not-found');
    }
    if (data.success && data.user) {
      redirect('/select-business-type');
    }
  } catch (error) {
    console.error('Error calling backend sign-in:', error);
    return new Response('Error identifying user on the backend', { status: 500 });
  }
  // Redirect to dashboard where Redux will fetch user data
}
