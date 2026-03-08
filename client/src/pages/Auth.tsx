import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/** Apple logo per Apple HIG - Sign in with Apple (official silhouette) */
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-white" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.237-1.75 1.745-3.45 1.794-3.539-.039-.013-3.427-1.353-3.46-5.354-.026-3.339 2.713-4.943 2.819-5.013-1.529-2.35-3.923-2.402-4.763-2.402zM15.53 3.83c.843-1.096 1.405-2.595 1.222-4.07-1.207.052-2.649.804-3.532 1.818-.735.948-1.413 2.471-1.205 3.927 1.26.094 2.649-.638 3.515-1.675z"/>
  </svg>
);

export default function Auth() {
  const { t } = useTranslation();
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

  const [providers, setProviders] = useState({ google: false, facebook: false, linkedin: false, apple: false });

  useEffect(() => {
    fetch("/api/auth/providers", { credentials: "include" })
      .then((r) => r.json())
      .then(setProviders)
      .catch(() => {});
  }, []);


  const passwordStrength = mode === "signup" ? getPasswordStrength(formData.password) : 0;
  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  const handleOAuthClick = (provider: string) => {
    toast({
      title: `${provider} sign-in coming soon`,
      description: "Please use email/password for now.",
    });
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-1.5 mb-4">
            <Logo size="lg" className="w-10 h-10" />
            <span className="text-2xl font-heading font-bold">SmartSeek</span>
          </Link>
          <CardTitle className="text-2xl">
            {mode === "login" && t("auth.welcomeBack")}
            {mode === "signup" && t("auth.createAccount")}
            {mode === "forgot" && t("auth.forgotPassword")}
          </CardTitle>
          <CardDescription>
            {mode === "login" && t("auth.signInDesc")}
            {mode === "signup" && t("auth.signupDesc")}
            {mode === "forgot" && t("auth.forgotDesc")}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {urlError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <p className="font-medium text-center mb-1">Sign-in failed.</p>
                <p className="text-center text-xs opacity-90">{urlError}</p>
                <p className="text-center mt-2 text-xs">Please try again or use email/password.</p>
              </div>
            )}
            {mode !== "forgot" && (
              <>
                <div className="space-y-2">
                  {providers.google ? (
                    <a
                      href="/api/auth/google"
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <GoogleIcon />
                      <span className="ml-2 text-gray-800">Continue with Google</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOAuthClick("Google")}
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 font-medium cursor-not-allowed opacity-75"
                      title="Coming soon"
                    >
                      <GoogleIcon />
                      <span className="ml-2">Continue with Google</span>
                    </button>
                  )}
                  {providers.facebook ? (
                    <a
                      href="/api/auth/facebook"
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-[#1877F2] bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] transition-colors"
                    >
                      <FacebookIcon />
                      <span className="ml-2 text-white">Continue with Facebook</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOAuthClick("Facebook")}
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-400 bg-gray-600 text-gray-300 font-medium cursor-not-allowed opacity-75"
                      title="Coming soon"
                    >
                      <FacebookIcon />
                      <span className="ml-2 text-white">Continue with Facebook</span>
                    </button>
                  )}
                  {providers.linkedin ? (
                    <a
                      href="/api/auth/linkedin"
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-[#0A66C2] bg-[#0A66C2] text-white font-medium hover:bg-[#0958a8] transition-colors"
                    >
                      <LinkedInIcon />
                      <span className="ml-2 text-white">Continue with LinkedIn</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOAuthClick("LinkedIn")}
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-400 bg-gray-600 text-gray-300 font-medium cursor-not-allowed opacity-75"
                      title="Coming soon"
                    >
                      <LinkedInIcon />
                      <span className="ml-2 text-white">Continue with LinkedIn</span>
                    </button>
                  )}
                  {providers.apple ? (
                    <a
                      href="/api/auth/apple"
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-600 bg-black text-white font-medium hover:bg-gray-900 transition-colors"
                    >
                      <AppleIcon />
                      <span className="ml-2 text-white">Continue with Apple</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOAuthClick("Apple")}
                      className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-400 font-medium cursor-not-allowed opacity-75"
                      title="Coming soon"
                    >
                      <AppleIcon />
                      <span className="ml-2 text-white">Continue with Apple</span>
                    </button>
                  )}
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
