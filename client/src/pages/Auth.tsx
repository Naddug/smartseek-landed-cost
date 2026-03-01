import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";

type AuthMode = "login" | "signup" | "forgot";

function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(5, score);
}

function getStrengthColor(level: number): string {
  if (level <= 1) return "bg-red-500";
  if (level <= 2) return "bg-amber-500";
  if (level <= 3) return "bg-yellow-500";
  if (level <= 4) return "bg-lime-500";
  return "bg-green-500";
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c1.32-1.58 1.1-3.93-.22-5.28-1.32-1.35-3.55-1.6-4.86-.04-1.31 1.57-1.1 3.92.22 5.27 1.32 1.35 3.54 1.6 4.86.05z"/>
  </svg>
);

export default function Auth() {
  const [, setLocation] = useLocation();
  const [matchForgot] = useRoute("/forgot-password");
  const [matchSignup] = useRoute("/signup");
  const searchString = typeof window !== "undefined" ? window.location.search : "";
  const { toast } = useToast();
  const routeMode: AuthMode = matchForgot ? "forgot" : matchSignup ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(routeMode);

  useEffect(() => {
    setMode(routeMode);
  }, [routeMode]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const urlParams = new URLSearchParams(searchString);
  const urlError = urlParams.get("error");

  useEffect(() => {
    if (urlError) {
      toast({ title: "Authentication failed", description: decodeURIComponent(urlError), variant: "destructive" });
      window.history.replaceState({}, "", "/login");
    }
  }, [urlError, toast]);

  const passwordStrength = mode === "signup" ? getPasswordStrength(formData.password) : 0;
  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode !== "forgot") {
      if (!formData.email) errs.email = "Email is required";
      else if (!emailRegex.test(formData.email)) errs.email = "Invalid email format";
    }

    if (mode === "login") {
      if (!formData.password) errs.password = "Password is required";
    }

    if (mode === "signup") {
      if (!formData.firstName?.trim()) errs.firstName = "First name is required";
      if (!formData.lastName?.trim()) errs.lastName = "Last name is required";
      if (!formData.password) errs.password = "Password is required";
      else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
      else if (!passwordsMatch) errs.confirmPassword = "Passwords do not match";
      if (!formData.acceptTerms) errs.acceptTerms = "You must accept the Terms of Service";
    }

    if (mode === "forgot" && !formData.email) errs.email = "Email is required";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFieldErrors({});

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        toast({ title: "Check your email", description: "If an account exists, we've sent a reset link." });
        setLocation("/login");
        return;
      }

      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
          }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        toast({ title: "Account created!", description: "Welcome to SmartSeek. You've received 2 free credits." });
        setLocation("/dashboard");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: mode === "forgot" ? "Error" : mode === "signup" ? "Signup failed" : "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-1.5 mb-4">
            <Logo size="lg" className="w-10 h-10" />
            <span className="text-2xl font-heading font-bold">SmartSeek</span>
          </Link>
          <CardTitle className="text-2xl">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Forgot password"}
          </CardTitle>
          <CardDescription>
            {mode === "login" && "Sign in to your account to continue"}
            {mode === "signup" && "Start sourcing smarter with AI-powered insights"}
            {mode === "forgot" && "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {mode !== "forgot" && (
              <>
                <div className="space-y-2">
                  <Button type="button" variant="outline" className="w-full bg-white border hover:bg-gray-50" asChild>
                    <a href={`${baseUrl}/api/auth/google`}>
                      <GoogleIcon />
                      <span className="ml-2">Continue with Google</span>
                    </a>
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#166FE5]" asChild>
                    <a href={`${baseUrl}/api/auth/facebook`}>
                      <FacebookIcon />
                      <span className="ml-2">Continue with Facebook</span>
                    </a>
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#004182]" asChild>
                    <a href={`${baseUrl}/api/auth/linkedin`}>
                      <LinkedInIcon />
                      <span className="ml-2">Continue with LinkedIn</span>
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-black text-white border-black hover:bg-gray-800"
                    onClick={async () => {
                      const res = await fetch(`${baseUrl}/api/auth/apple`);
                      const data = await res.json().catch(() => ({}));
                      toast({ title: "Apple Sign In", description: data.error || "Coming soon", variant: "destructive" });
                    }}
                  >
                    <AppleIcon />
                    <span className="ml-2">Continue with Apple</span>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                  </div>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={fieldErrors.firstName ? "border-red-500" : ""}
                  />
                  {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={fieldErrors.lastName ? "border-red-500" : ""}
                  />
                  {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            {(mode === "login" || mode === "signup") && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                  {mode === "signup" && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={fieldErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                    {formData.confirmPassword && !passwordsMatch && <p className="text-xs text-red-500">Passwords do not match</p>}
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(c) => setFormData({ ...formData, rememberMe: !!c })}
                    />
                    <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">Remember me</Label>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(c) => setFormData({ ...formData, acceptTerms: !!c })}
                        className={fieldErrors.acceptTerms ? "border-red-500" : ""}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer leading-tight">
                        I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      </Label>
                    </div>
                    {fieldErrors.acceptTerms && <p className="text-xs text-red-500">{fieldErrors.acceptTerms}</p>}
                  </div>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "forgot" && "Send Reset Link"}
            </Button>

            <div className="flex flex-wrap justify-center gap-x-2 text-xs text-muted-foreground">
              <span>256-bit SSL</span>
              <span>·</span>
              <span>GDPR Compliant</span>
              <span>·</span>
              <span>No spam</span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {mode === "login" && (
                <>
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </>
              )}
              {mode === "signup" && (
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              )}
              {mode === "forgot" && (
                <>
                  <Link href="/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
