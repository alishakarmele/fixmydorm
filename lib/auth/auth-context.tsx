/**
 * FixMyDorm - Auth Context Provider
 *
 * Provides authentication state across the entire app via React Context.
 * Wraps Amplify's Cognito auth with a clean, type-safe API.
 *
 * Usage:
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 *
 *   const { user, isAuthenticated, signIn, signOut } = useAuth();
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { configureAmplify } from "@/lib/auth/amplify-config";
import {
  getCurrentUser,
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  signOut as cognitoSignOut,
  confirmSignUp as cognitoConfirmSignUp,
  type CognitoUser,
} from "@/lib/auth/cognito-client";
import type { UserRole } from "@/types";

// Initialize Amplify on the client side
configureAmplify();

// ============================================================================
// Types
// ============================================================================

interface AuthState {
  user: CognitoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  /** Sign in with email and password */
  handleSignIn: (email: string, password: string) => Promise<boolean>;
  /** Register a new user */
  handleSignUp: (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    hostelName?: string;
    roomNumber?: string;
  }) => Promise<boolean>;
  /** Confirm sign-up with verification code */
  handleConfirmSignUp: (email: string, code: string) => Promise<boolean>;
  /** Sign out the current user */
  handleSignOut: () => Promise<void>;
  /** Clear any auth errors */
  clearError: () => void;
  /** Refresh the current user's data */
  refreshUser: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
    error: null,
  });

  // Check for existing session on mount
  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        role: user?.role || null,
        error: null,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        role: null,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Sign In
  const handleSignIn = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await cognitoSignIn(email, password);
        await refreshUser();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Sign in failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return false;
      }
    },
    [refreshUser]
  );

  // Sign Up
  const handleSignUp = useCallback(
    async (params: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
      hostelName?: string;
      roomNumber?: string;
    }): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await cognitoSignUp(params);
        setState((prev) => ({ ...prev, isLoading: false }));
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Sign up failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return false;
      }
    },
    []
  );

  // Confirm Sign Up
  const handleConfirmSignUp = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await cognitoConfirmSignUp(email, code);
        setState((prev) => ({ ...prev, isLoading: false }));
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Verification failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return false;
      }
    },
    []
  );

  // Sign Out
  const handleSignOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await cognitoSignOut();
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        role: null,
        error: null,
      });
    }
  }, []);

  // Clear Error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    handleSignIn,
    handleSignUp,
    handleConfirmSignUp,
    handleSignOut,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access auth state and actions.
 * Must be used within an <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
