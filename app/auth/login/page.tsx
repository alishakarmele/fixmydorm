/**
 * FixMyDorm - Login Page
 *
 * Server component wrapper that provides Suspense boundary
 * for the client-side login form (which uses useSearchParams).
 */

import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-lg animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-48 mx-auto bg-muted rounded" />
        <div className="h-4 w-64 mx-auto bg-muted rounded" />
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
