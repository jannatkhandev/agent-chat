"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, User, Users } from "lucide-react";
import Link from "next/link"
import { forgetPassword, signIn } from "@/lib/auth-client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") || null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')!.toString();
    const password = !isForgotPassword ? formData.get('password')!.toString() : '';

    if (isForgotPassword) {
      try {
        const { data, error } = await forgetPassword({
          email: email,
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setError("Check your email for password reset instructions");
      } catch (error: any) {
        setError(error.message || "An error occurred");
      }
      setIsLoading(false);
      return;
    }

    try {
        const { data, error } = await signIn.email({
          email: email,
          password: password,
        });
        if (error) throw error;
      router.push("/dashboard");
    } catch (error: any) {
      if (error.status === 403) {
        setError("Please verify your email address before logging in");
      } else {
        setError(error.message || "An error occurred");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
        {error && (
          <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        {registered && (
          <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded-md">
            Registration successful! Please login with your credentials.
          </div>
        )}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <User className="mr-2 h-4 w-4" />
              )}
              {isLoading
                ? "Loading..."
                : isForgotPassword
                ? "Send Reset Link"
                : "Login"}
            </Button>
            <div className="text-center text-sm">
              {isForgotPassword ? (
                <Button
                  variant="link"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-muted-foreground"
                >
                  Back to login
                </Button>
              ) : (
                <>
                  <Button
                    variant="link"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </Button>
                  <span className="mx-2">•</span>
                  <Link href="/register" className="text-muted-foreground hover:underline">
                    Create an account
                  </Link>
                </>
              )}
            </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          type="button"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            setError(null);
            try {
              const { data, error } = await signIn.email({
                email: "jannatkhandev@gmail.com",
                password: "abcd1234",
              });
              if (error) throw error;
              router.push("/dashboard");
            } catch (error: any) {
              setError(error.message || "Demo login failed");
              setIsLoading(false);
            }
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          Login with Demo User
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
