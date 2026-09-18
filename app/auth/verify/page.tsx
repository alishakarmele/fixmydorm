/**
 * FixMyDorm - Email Verification Page
 *
 * Server component wrapper with Suspense boundary
 * for the client-side verify form (which uses useSearchParams).
 */

import { Suspense } from "react";
import { VerifyForm } from "./verify-form";

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifySkeleton />}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifySkeleton() {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-lg animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-48 mx-auto bg-muted rounded" />
        <div className="h-4 w-64 mx-auto bg-muted rounded" />
        <div className="space-y-3 pt-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
