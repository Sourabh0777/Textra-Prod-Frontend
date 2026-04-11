'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { env } from '@/env';
import { useFacebookOAuthMutation } from '@/lib/api/oAuthApi';
import { toast } from 'sonner';

export function useFacebookAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get('code');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [facebookOAuth] = useFacebookOAuthMutation();

  const handleReturnWithCode = async (code: string) => {
    setIsLoggingIn(true);
    setIsCompleted(false);
    try {
      console.log('--- Detected OAuth Code in URL ---');
      console.log('Code:', code.substring(0, 10) + '...');

      console.log('Calling internal OAuth API...');
      const result = await facebookOAuth({ code, userID: '' }).unwrap();

      if (result.success) {
        console.log('Backend OAuth Success:', result);
        toast.success('Successfully connected to Facebook Business');
        setIsCompleted(true);
        // Optional: Clean up URL by removing the code param
        window.history.replaceState({}, '', window.location.pathname);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Backend OAuth Error:', result.message);
        toast.error(result.message || 'Facebook connection failed');
      }
    } catch (error: any) {
      console.error('Error in OAuth return handler:', error);
      toast.error(error?.data?.message || 'Error connecting to Facebook');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (codeFromUrl) {
      handleReturnWithCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  const onFacebookLogin = async () => {
    try {
      const YOUR_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const YOUR_REDIRECT_URI = env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
      const YOUR_STATE = Math.random().toString(36).substring(7); // Random state for security
      const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION;

      const scopes = [
        'whatsapp_business_messaging',
        'whatsapp_business_management',
        'whatsapp_business_manage_events',
        'public_profile',
      ].join(',');

      const dialogUrl = `https://www.facebook.com/${WHATSAPP_API_VERSION}/dialog/oauth?client_id=${YOUR_APP_ID}&redirect_uri=${encodeURIComponent(YOUR_REDIRECT_URI)}&state=${YOUR_STATE}&scope=${scopes}&response_type=code`;

      console.log('Redirecting to Manual Facebook Login Dialog...');
      console.log('URL:', dialogUrl);

      window.location.href = dialogUrl;
    } catch (error) {
      console.error('Facebook Login Error:', error);
      toast.error('Failed to initiate Facebook login');
    }
  };

  return {
    onFacebookLogin,
    isLoggingIn,
    isCompleted,
    handleReturnWithCode,
  };
}
