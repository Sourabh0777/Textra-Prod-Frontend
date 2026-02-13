import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { env } from '@/env';

export async function POST(req: Request) {
  try {
    const { getToken, userId } = await auth();
    const token = await getToken();

    if (!userId || !token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { code, userID } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Code is required' }, { status: 400 });
    }

    // Forward the request to the main backend server
    const backendUrl = `${env.NEXT_PUBLIC_API_URL}/core/auth/facebook-callback`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code,
        userID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to communicate with backend' },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('OAuth API Route Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
