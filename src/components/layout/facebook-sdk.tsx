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
  const statusChangeCallback = (response: any) => {
    console.log('FB login status response:', response);
    // status => connected , not_authorized , unknown
    console.log('Successfully logged in with Facebook', response.status);

    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      // authResponse is included if the status is connected and is made up of the following:
      // accessToken - contains an access token for the person using the app.
      // expiresIn - indicates the UNIX time when the token expires and needs to be renewed.
      // signedRequest - a signed parameter that contains information about the person using the app.
      // userID - the ID of the person using the app.

      console.log('Successfully logged in with Facebook', response.authResponse);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.log('Logged into Facebook, but not authorized for this app');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('Not logged into Facebook');
    }
  };

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

        window.FB.getLoginStatus(function (response: any) {
          statusChangeCallback(response);
        });
      }
    };
  }, []);

  return <Script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />;
}
