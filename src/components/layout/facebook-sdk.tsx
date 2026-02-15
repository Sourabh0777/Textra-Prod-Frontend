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
  redirect_uri: env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
};

/**
 * Initialize Facebook SDK
 */
const initFacebook = (): Promise<void> => {
  return new Promise((resolve) => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FB_CONFIG.appId,
        cookie: true,
        xfbml: true,
        version: FB_CONFIG.version,
      });

      window.FB.AppEvents.logPageView();
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

    window.FB.getLoginStatus((statusResponse: any) => {});

    const loginOptions: any = {
      auth_type: 'rerequest',
      response_type: 'code',
      config_id: FB_CONFIG.configId,
      redirect_uri: FB_CONFIG.redirect_uri,
      override_default_response_type: true,
    };

    console.log('[FB SDK] URI used for login:', `[${loginOptions.redirect_uri}]`);

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
