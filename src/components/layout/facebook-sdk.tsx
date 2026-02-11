'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '{your-app-id}',
          cookie: true,
          xfbml: true,
          version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || 'v18.0',
        });

        window.FB.AppEvents.logPageView();
      }
    };
  }, []);

  return <Script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />;
}
