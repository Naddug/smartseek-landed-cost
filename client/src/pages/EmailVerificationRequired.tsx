import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/lib/hooks";

export default function EmailVerificationRequired() {
  const { data: user } = useUser();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const res = await apiRequest("POST", "/api/auth/resend-verification");
      const data = await res.json();

      if (res.ok) {
        setResendSuccess(true);
      } else {
        setError(data.error || "Failed to send verification email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/80 border-slate-700">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-amber-400" />
          </div>
          <CardTitle className="text-2xl text-white">Verify Your Email</CardTitle>
          <CardDescription className="text-slate-400">
            Please verify your email address to access SmartSeek.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-300 text-sm text-center">
              We sent a verification email to:
            </p>
            <p className="text-white font-medium text-center mt-1">
              {user?.email || "your email"}
            </p>
          </div>

          <div className="text-slate-400 text-sm space-y-2">
            <p>Please check your inbox and click the verification link to activate your account.</p>
            <p>Don't see the email? Check your spam folder.</p>
          </div>

          {resendSuccess && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">Verification email sent!</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleResend}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              disabled={isResending}
            >
              {isResending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Resend Verification Email
            </Button>

            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              I've Verified, Refresh
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-700">
            <Link href="/api/auth/logout">
              <Button variant="link" className="text-slate-400 hover:text-white">
                Sign out
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
