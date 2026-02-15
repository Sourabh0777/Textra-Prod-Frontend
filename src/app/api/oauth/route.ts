import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { env } from '@/env';

export async function POST(req: Request) {
  try {
    const { getToken, userId } = await auth();
    const token = await getToken();

    if (!userId) {
      console.warn('Warning: No userId found. Continuing for debugging...');
    }
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: 'Code is required' }, { status: 400 });
    }

    // Exchange code for short-lived access token
    console.log('1. Attempting short-lived token exchange...');
    console.log('Using Redirect URI:', `[${env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI}]`);

    const tokenExchangeUrl =
      `https://graph.facebook.com/${env.NEXT_PUBLIC_FACEBOOK_API_VERSION}/oauth/access_token?` +
      new URLSearchParams({
        client_id: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        redirect_uri: env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
        client_secret: env.FACEBOOK_APP_SECRET,
        code,
      });

    const tokenResponse = await fetch(tokenExchangeUrl);
    const tokenData = await tokenResponse.json();

    console.log('Short-lived token response status:', tokenResponse.status);
    console.log('Short-lived token response data:', JSON.stringify(tokenData, null, 2));

    if (!tokenResponse.ok) {
      console.error('Facebook Token Exchange Error:', tokenData);
      return NextResponse.json(
        { success: false, message: tokenData.error?.message || 'Failed to exchange code' },
        { status: tokenResponse.status },
      );
    }

    const shortLivedToken = tokenData.access_token;
    console.log('Short-lived Token obtained successfully');

    // Exchange short-lived token for long-lived access token
    const longLivedUrl =
      `https://graph.facebook.com/${env.NEXT_PUBLIC_FACEBOOK_API_VERSION}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        client_secret: env.FACEBOOK_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      });

    console.log('2. Attempting long-lived token exchange...');
    const longLivedResponse = await fetch(longLivedUrl);
    const longLivedData = await longLivedResponse.json();

    if (!longLivedResponse.ok) {
      console.error('Facebook Long-lived Token Error:', longLivedData);
      return NextResponse.json(
        { success: false, message: longLivedData.error?.message || 'Failed to get long-lived token' },
        { status: longLivedResponse.status },
      );
    }

    const longLivedToken = longLivedData.access_token;
    console.log('--- OAuth API Route Success ---');
    console.log('Final Long-lived Token:', longLivedToken);

    return NextResponse.json({ success: true, longLivedToken });
  } catch (error) {
    console.error('OAuth API Route Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
