'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { env } from '@/env';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    checkLoginState: () => void;
  }
}

export default function FacebookSDK() {
  const statusChangeCallback = (response: any) => {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else {
      // The person is not logged into your app or we are unable to tell.
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.innerHTML = 'Please log into this app.';
      }
    }
  };

  const testAPI = () => {
    console.log('Welcome!  Fetching your information.... ');
    if (window.FB) {
      window.FB.api('/me', function (response: any) {
        console.log('Successful login for: ' + response.name);
        const statusElement = document.getElementById('status');
        if (statusElement) {
          statusElement.innerHTML = 'Thanks for logging in, ' + response.name + '!';
        }
      });
    }
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      // Check if protocol is HTTPS
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        console.warn(
          'Facebook SDK requires HTTPS to function correctly. ' +
            'Please ensure your application is served over HTTPS.',
        );
      }

      if (window.FB) {
        window.FB.init({
          appId: env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true, // enable cookies to allow the server to access
          // the session
          xfbml: true, // parse social plugins on this page
          version: env.NEXT_PUBLIC_FACEBOOK_API_VERSION, // Specify the Graph API version to use
        });

        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.
        window.FB.getLoginStatus(function (response: any) {
          statusChangeCallback(response);
        });
      }
    };

    window.checkLoginState = function () {
      if (window.FB) {
        window.FB.getLoginStatus(function (response: any) {
          statusChangeCallback(response);
        });
      }
    };
  }, []);

  return (
    <>
      <Script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />
      {env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div
            dangerouslySetInnerHTML={{
              __html: `<fb:login-button 
              scope="public_profile,email" 
              config_id="${env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID}"
              onlogin="checkLoginState();">
            </fb:login-button>`,
            }}
          />
          <div id="status" className="mt-2 text-sm text-gray-600"></div>
        </div>
      )}
    </>
  );
}
