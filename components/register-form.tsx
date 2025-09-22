"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User } from "lucide-react";
import { signUp } from "@/lib/auth-client";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')!.toString();
    const password = formData.get('password')!.toString();
    
    try {
      const { data, error } = await signUp.email({
        email: email,
        password: password,
        name: ""
      });


      if (error) {
        console.error("SignUp error:", error);
        throw error;
      }
      setError("Registration successful! Please check your email to verify your account.");
      
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 3000);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message?.includes("email")) {
        setError("Failed to send verification email. Please try again later or contact support.");
      } else {
        setError(error.message || "An error occurred during registration");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    {error && (
      <Alert variant={error.includes("successful") ? "default" : "destructive"}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">Create an Account</h1>
      <p className="text-muted-foreground text-sm text-balance">
        Enter your information to create your account
      </p>
    </div>
  
    {/* added mt-6 so form fields sit further below the header */}
    <div className="grid gap-6 mt-6">
      {/* optionally give this specific group extra top margin */}
      <div className="grid gap-3 mt-2">
        <Label htmlFor="email" className="mb-1">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
  
      <div className="grid gap-3">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          minLength={8}
        />
      </div>
    </div>
  
    {/* add vertical spacing around the button */}
    <Button type="submit" className="w-full mt-4 mb-6" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <User className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Creating account..." : "Create account"}
    </Button>
  
    <div className="text-center text-sm">
      <span className="text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </span>
    </div>
  </form>
  
  );
}