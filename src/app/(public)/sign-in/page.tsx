"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

function SignInForm() {
  const router = useRouter();
  // Set when arriving from an invitation link -- send them back to
  // /invite/accept instead of the dashboard once they're signed in.
  // Only same-origin relative paths are honoured: anything else (an absolute
  // URL, or a protocol-relative "//evil.example") would make this an open
  // redirect that hands a freshly-authenticated user to an attacker's site.
  const rawCallbackUrl = useSearchParams().get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl?.startsWith("/") && !rawCallbackUrl.startsWith("//") ? rawCallbackUrl : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-warning/5 rounded-full blur-[160px]" />
      </div>

      <main className="z-10 w-full max-w-[420px] px-4">
        {/* Auth Card */}
        <div className="bg-surface/80 backdrop-blur-md rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-border">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-sm text-text-secondary">Sign in to access your meeting insights.</p>
          </div>

          {/* Google Login */}
          <Button 
            variant="secondary" 
            className="w-full h-12 gap-3" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg height="18" viewBox="0 0 18 18" width="18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
            {error && <p className="text-xs text-danger bg-danger/10 p-2 rounded">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary px-1">Email address</label>
              <Input 
                placeholder="name@company.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs text-text-secondary">Password</label>
                <Link href="#" className="text-xs text-success hover:underline">Forgot password?</Link>
              </div>
              <PasswordInput
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button variant="primary" className="w-full h-12 mt-2" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-success font-medium hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

// useSearchParams needs a Suspense boundary to keep the page prerenderable.
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
