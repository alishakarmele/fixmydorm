/**
 * FixMyDorm - Verify Form (Client Component)
 *
 * OTP input form for confirming sign-up.
 * Receives email via query param from signup redirect.
 */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParam = searchParams.get("email") || "";

  const { handleConfirmSignUp, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState(emailFromParam);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    const result = await handleConfirmSignUp(email, code);
    if (result) {
      setSuccess(true);
      // Redirect to login after a brief success message
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  }

  return (
    <Card className="border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          We sent a verification code to{" "}
          {emailFromParam ? (
            <span className="font-medium text-foreground">
              {emailFromParam}
            </span>
          ) : (
            "your email"
          )}
        </CardDescription>
      </CardHeader>

      {success ? (
        <CardContent className="text-center py-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">Email verified!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Redirecting to login...
          </p>
        </CardContent>
      ) : (
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Email (if not pre-filled) */}
            {!emailFromParam && (
              <div className="space-y-2">
                <Label htmlFor="verify-email">Email</Label>
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Verification Code */}
            <div className="space-y-2">
              <Label htmlFor="verify-code">Verification Code</Label>
              <Input
                id="verify-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-[0.5em] font-mono"
                maxLength={6}
                required
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Check your email inbox (and spam folder) for the code.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Verify Email
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
