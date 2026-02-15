import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { env } from '@/env';

export async function POST(req: Request) {
  try {
    const { getToken, userId } = await auth();
    const token = await getToken();

    console.log('--- OAuth API Route Started ---');
    console.log('UserId from Clerk:', userId);

    if (!userId) {
      console.warn('Warning: No userId found. Continuing for debugging...');
    }

    const body = await req.json();
    const { code, redirect_uri } = body;

    console.log('--- OAuth API Route Started ---');
    console.log('UserId:', userId);
    console.log('Code (first 10):', code ? code.substring(0, 10) + '...' : 'MISSING');
    console.log('Redirect URI from body:', `[${redirect_uri}]`);
    console.log('Redirect URI from env:', `[${env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI}]`);

    const finalRedirectUri = redirect_uri || env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
    console.log('Using Final Redirect URI:', `[${finalRedirectUri}]`);

    if (!code) {
      return NextResponse.json({ success: false, message: 'Code is required' }, { status: 400 });
    }

    // Exchange code for short-lived access token
    const getParams = (uri?: string) => {
      const params: any = {
        client_id: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        client_secret: env.FACEBOOK_APP_SECRET,
        code,
      };
      if (uri) params.redirect_uri = uri;
      return new URLSearchParams(params).toString();
    };

    console.log('1. Attempting short-lived token exchange...');
    let tokenResponse = await fetch(
      `https://graph.facebook.com/${env.NEXT_PUBLIC_FACEBOOK_API_VERSION}/oauth/access_token?` +
        getParams(finalRedirectUri),
    );
    let tokenData = await tokenResponse.json();

    // If mismatch error, try without redirect_uri (common when using JS SDK)
    if (!tokenResponse.ok && tokenData.error?.error_subcode === 36008) {
      console.warn('Redirect URI mismatch detected. Retrying without redirect_uri...');
      const fallbackUrl =
        `https://graph.facebook.com/${env.NEXT_PUBLIC_FACEBOOK_API_VERSION}/oauth/access_token?` + getParams();
      tokenResponse = await fetch(fallbackUrl);
      tokenData = await tokenResponse.json();
    }

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

    console.log('Long-lived token response status:', longLivedResponse.status);
    console.log('Long-lived token response data:', JSON.stringify(longLivedData, null, 2));

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
