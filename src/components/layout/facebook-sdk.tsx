'use client';

import { useEffect } from 'react';
import { env } from '@/env';

export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  grantedScopes?: string;
  code?: string;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

// Facebook SDK initialization configuration
const FB_CONFIG = {
  appId: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  configId: env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
  version: env.NEXT_PUBLIC_FACEBOOK_API_VERSION,
};

console.log('Facebook SDK Config Loaded:', {
  appId: FB_CONFIG.appId,
  configId: FB_CONFIG.configId,
  version: FB_CONFIG.version,
  isAppIdPresent: !!FB_CONFIG.appId,
  isConfigIdPresent: !!FB_CONFIG.configId,
  currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
});

/**
 * Initialize Facebook SDK
 */
const initFacebook = (): Promise<void> => {
  return new Promise((resolve) => {
    window.fbAsyncInit = () => {
      console.log('fbAsyncInit triggered - window.FB:', !!window.FB);
      window.FB.init({
        appId: FB_CONFIG.appId,
        cookie: true,
        xfbml: true,
        version: FB_CONFIG.version,
      });
      console.log('window.FB.init() called');
      resolve();
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  });
};

/**
 * Triggers the Facebook login process.
 * Supports both standard auth response and the 'code' response type used in Login for Business.
 */
export const handleFacebookLogin = (): Promise<FacebookAuthResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not initialized'));
      return;
    }

    window.FB.getLoginStatus((statusResponse: any) => {
      console.log('Current Facebook login status:', statusResponse);
    });

    const loginOptions: any = {
      auth_type: 'rerequest',
      response_type: 'code',
      config_id: FB_CONFIG.configId,
      override_default_response_type: true,
    };

    try {
      window.FB.login((response: any) => {
        // When response_type: 'code' is used, the code might be directly in the response
        // or inside authResponse depending on the SDK version and configuration.
        const authResponse = response.authResponse || (response.code ? response : null);

        if (authResponse && (authResponse.accessToken || authResponse.code)) {
          resolve(authResponse as FacebookAuthResponse);
        } else {
          const errorMsg =
            response.status === 'unknown'
              ? 'Facebook login failed: Status unknown. Ensure you are a tester for this app and localhost is whitelisted.'
              : 'Facebook login failed or was cancelled';
          console.error('Facebook Login Error details:', {
            status: response.status,
            errorMsg,
            response,
          });
          reject(new Error(errorMsg));
        }
      }, loginOptions);
    } catch (error) {
      console.error('Synchronous error during window.FB.login call:', error);
      reject(error);
    }
  });
};

export default function FacebookSDK() {
  useEffect(() => {
    initFacebook().then(() => {});
  }, []);

  return null;
}
