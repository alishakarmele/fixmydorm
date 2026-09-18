/**
 * FixMyDorm - AWS Amplify Configuration
 *
 * Configures AWS Amplify with Cognito User Pool settings.
 * Values are read from environment variables.
 *
 * IMPORTANT: Call `configureAmplify()` once at app startup
 * (in the root layout or a client-side provider).
 */

import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as const,
      userAttributes: {
        email: { required: true },
        name: { required: true },
        "custom:hostelName": { required: false },
        "custom:roomNumber": { required: false },
        "custom:role": { required: false },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

/**
 * Initializes Amplify with SSR support for Next.js.
 * Call this once in the app — typically in a client component provider.
 */
export function configureAmplify() {
  Amplify.configure(amplifyConfig, { ssr: true });
}

export default amplifyConfig;
