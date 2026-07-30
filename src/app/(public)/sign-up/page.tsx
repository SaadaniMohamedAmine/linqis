"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    // Redirect to Google for now as Credentials provider is not fully configured
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden selection:bg-success selection:text-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-success/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-info/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "-4s" }} />
      </div>

      <main className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        {/* Branding */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🔗</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-success">Lynqis</span>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-[420px] bg-surface border border-border rounded-xl shadow-lg p-8 overflow-hidden relative">
          <header className="mb-8 text-center">
            <h1 className="text-xl font-semibold mb-1">Create your account</h1>
            <p className="text-text-secondary">Elevate your meetings with AI intelligence.</p>
          </header>

          {/* Google Login */}
          <Button 
            variant="secondary" 
            className="w-full h-12 gap-3 mb-8" 
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg height="20" viewBox="0 0 24 24" width="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            {isLoading ? "Creating account..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface px-4 text-text-secondary">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            {error && <p className="text-xs text-danger bg-danger/10 p-2 rounded">{error}</p>}
            <div className="space-y-1">
              <label className="text-sm text-text-secondary ml-1">Full name</label>
              <Input 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-secondary ml-1">Email address</label>
              <Input 
                placeholder="name@company.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-text-secondary ml-1">Password</label>
              <Input 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex gap-1 mt-2 px-1">
                <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-success' : 'bg-border'}`} />
                <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) ? 'bg-success' : 'bg-border'}`} />
                <div className={`h-1 flex-1 rounded ${/[0-9]/.test(password) ? 'bg-success' : 'bg-border'}`} />
                <div className={`h-1 flex-1 rounded ${/[^A-Za-z0-9]/.test(password) ? 'bg-success' : 'bg-border'}`} />
              </div>
              <p className="text-xs text-text-secondary mt-1 ml-1">At least 8 characters</p>
            </div>
            <Button variant="primary" className="w-full h-12 font-bold mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <footer className="mt-8 text-center space-y-4">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-success hover:underline">Sign in</Link>
            </p>
            <p className="text-xs text-text-secondary leading-relaxed px-4 opacity-60">
              By clicking Create Account, you agree to our{" "}
              <Link href="#" className="underline hover:text-text-primary">Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-text-primary">Privacy Policy</Link>.
            </p>
          </footer>
        </div>

        {/* Status Bar */}
        <div className="mt-12 flex items-center gap-8 opacity-40">
          <div className="flex items-center gap-1">
            <span className="text-sm"></span>
            <span className="text-xs">Enterprise Security</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">✨</span>
            <span className="text-xs">AI Ready</span>
          </div>
        </div>
      </main>
    </div>
  );
}
