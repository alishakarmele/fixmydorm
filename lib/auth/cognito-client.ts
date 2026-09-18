/**
 * FixMyDorm - Cognito Auth Client
 *
 * Type-safe wrapper functions around AWS Amplify Auth v6 APIs.
 * These functions handle sign-up, sign-in, sign-out, verification,
 * and user attribute management.
 */

import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes as amplifyFetchUserAttributes,
  fetchAuthSession,
  type SignUpInput,
  type ConfirmSignUpInput,
  type SignInInput,
} from "aws-amplify/auth";

import type { UserRole } from "@/types";

/** User profile extracted from Cognito attributes */
export interface CognitoUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  hostelName?: string;
  roomNumber?: string;
}

/**
 * Sign up a new user with Cognito.
 */
export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  hostelName?: string;
  roomNumber?: string;
}) {
  const signUpInput: SignUpInput = {
    username: params.email,
    password: params.password,
    options: {
      userAttributes: {
        email: params.email,
        name: params.name,
        "custom:role": params.role,
        ...(params.hostelName && { "custom:hostelName": params.hostelName }),
        ...(params.roomNumber && { "custom:roomNumber": params.roomNumber }),
      },
    },
  };

  return amplifySignUp(signUpInput);
}

/**
 * Confirm sign-up with the verification code sent via email.
 */
export async function confirmSignUp(email: string, code: string) {
  const input: ConfirmSignUpInput = {
    username: email,
    confirmationCode: code,
  };
  return amplifyConfirmSignUp(input);
}

/**
 * Sign in an existing user.
 */
export async function signIn(email: string, password: string) {
  const input: SignInInput = {
    username: email,
    password: password,
  };
  return amplifySignIn(input);
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  return amplifySignOut();
}

/**
 * Get the currently authenticated user's basic info.
 * Returns null if no user is signed in.
 */
export async function getCurrentUser(): Promise<CognitoUser | null> {
  try {
    const user = await amplifyGetCurrentUser();
    const attributes = await amplifyFetchUserAttributes();

    return {
      userId: user.userId,
      email: attributes.email || "",
      name: attributes.name || "",
      role: (attributes["custom:role"] as UserRole) || "student",
      hostelName: attributes["custom:hostelName"],
      roomNumber: attributes["custom:roomNumber"],
    };
  } catch {
    return null;
  }
}

/**
 * Get the current auth session tokens.
 * Useful for making authenticated API calls.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch {
    return null;
  }
}

/**
 * Check if user belongs to a specific Cognito group.
 */
export async function getUserGroups(): Promise<string[]> {
  try {
    const session = await fetchAuthSession();
    const groups =
      (session.tokens?.accessToken?.payload?.["cognito:groups"] as string[]) ||
      [];
    return groups;
  } catch {
    return [];
  }
}
