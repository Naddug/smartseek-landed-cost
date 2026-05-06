import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser, useProfile } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

/** Invalidate auth cache when page restored from back-forward cache to prevent stale logged-in state */
function AuthCacheBuster() {
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);
  return null;
}

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import SmartFinder from "@/pages/SmartFinder";
import AIAgent from "@/pages/AIAgent";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import Tools from "@/pages/Tools";
import Billing from "@/pages/Billing";
import SampleReport from "@/pages/SampleReport";
import CustomsCalculator from "@/pages/CustomsCalculator";
import ShippingEstimator from "@/pages/ShippingEstimator";
import LandedCostCalculator from "@/pages/LandedCostCalculator";
import RiskIntelligence from "@/pages/RiskIntelligence";
import ComplianceCheck from "@/pages/ComplianceCheck";
import TradeData from "@/pages/TradeData";
import FindLeads from "@/pages/FindLeads";
import VerifyEmail from "@/pages/VerifyEmail";
import ResetPassword from "@/pages/ResetPassword";
import EmailVerificationRequired from "@/pages/EmailVerificationRequired";
import AppLayout from "@/components/layout/AppLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import SupplierDiscovery from "@/pages/SupplierDiscovery";
import RequestQuote from "@/pages/RequestQuote";
import FAQ from "@/pages/FAQ";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Integrations from "@/pages/Integrations";
import AdminIndexes from "@/pages/AdminIndexes";
import SupplierCategoryPage from "@/pages/SupplierCategoryPage";
import PublicSearchResults from "@/pages/PublicSearchResults";
import SupplierDetailPage from "@/pages/SupplierDetailPage";
import BecomeASupplier from "@/pages/BecomeASupplier";
import Trust from "@/pages/Trust";
import Verification from "@/pages/Verification";
import Methodology from "@/pages/Methodology";
import RfqStatus from "@/pages/RfqStatus";
import type { ReactNode } from "react";

function PublicPage({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
function ProtectedRoute({ component: Component, adminOnly = false, requireVerified = true }: { component: React.ComponentType, adminOnly?: boolean, requireVerified?: boolean }) {
  const { data: user, isLoading, error } = useUser();
  const { data: profile } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    const current = window.location.pathname + window.location.search;
    window.location.replace('/login?redirect=' + encodeURIComponent(current || '/app/dashboard'));
    return null;
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <div className="p-8 text-center text-destructive">Access Denied: Admin Only</div>;
  }

  // Show non-blocking email verification banner instead of hard-blocking the page
  const needsVerification = requireVerified && user.emailVerified === false;

  return (
    <AppLayout unverifiedEmail={needsVerification}>
      <Component />
    </AppLayout>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/": "SmartSeek – Sourcing & Lead Intelligence",
  "/search": "Search Suppliers | SmartSeek",
  "/app/dashboard": "Dashboard | SmartSeek",
  "/app/smart-finder": "SmartSeek AI | SmartSeek",
  "/app/ai-agent": "AI Agent | SmartSeek",
  "/app/find-leads": "Find Leads | SmartSeek",
  "/app/reports": "My Reports | SmartSeek",
  "/app/billing": "Billing | SmartSeek",
  "/app/trade-data": "Trade Data | SmartSeek",
  "/app/landed-cost": "Landed Cost Calculator | SmartSeek",
  "/app/customs-calculator": "Customs Calculator | SmartSeek",
  "/app/shipping-estimator": "Shipping Estimator | SmartSeek",
  "/app/risk-intelligence": "Risk Intelligence | SmartSeek",
  "/app/compliance": "Compliance Check | SmartSeek",
  "/app/suppliers": "Supplier Search | SmartSeek",
  "/app/tools": "Tools | SmartSeek",
  "/app/admin": "Admin | SmartSeek",
  "/login": "Login | SmartSeek",
  "/signup": "Sign Up | SmartSeek",
  "/forgot-password": "Reset Password | SmartSeek",
  "/pricing": "Pricing | SmartSeek",
  "/faq": "FAQ | SmartSeek",
  "/about": "About | SmartSeek",
  "/become-a-supplier": "Become a Supplier | SmartSeek",
  "/trust": "Trust & Verification | SmartSeek",
  "/verification": "Verification Standards | SmartSeek",
  "/methodology": "Sourcing Methodology | SmartSeek",
  "/rfq-status": "RFQ Status | SmartSeek",
};

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    const base = location.split("?")[0];
    document.title = PAGE_TITLES[base] || "SmartSeek – Sourcing & Lead Intelligence";
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Auth} />
      <Route path="/signup" component={Auth} />
      <Route path="/forgot-password" component={Auth} />
      <Route path="/sample-report" component={SampleReport} />
      {/* Public search results — no auth required */}
      <Route path="/search" component={PublicSearchResults} />
      {/* Public SEO-friendly category landing pages: /suppliers/copper, /suppliers/antimony, etc. */}
      <Route path="/supplier/:slug">
        <PublicPage><SupplierDetailPage /></PublicPage>
      </Route>
      <Route path="/suppliers/:category" component={SupplierCategoryPage} />
      <Route path="/rfq">
        <PublicPage><RequestQuote /></PublicPage>
      </Route>
      <Route path="/rfq-status">
        <RfqStatus />
      </Route>
      <Route path="/become-a-supplier">
        <BecomeASupplier />
      </Route>
      <Route path="/trust">
        <Trust />
      </Route>
      <Route path="/verification">
        <Verification />
      </Route>
      <Route path="/methodology">
        <Methodology />
      </Route>
      <Route path="/faq">
        <PublicPage><FAQ /></PublicPage>
      </Route>
      <Route path="/pricing">
        <PublicPage><Pricing /></PublicPage>
      </Route>
      <Route path="/contact">
        <PublicPage><Contact /></PublicPage>
      </Route>
      <Route path="/about">
        <PublicPage><About /></PublicPage>
      </Route>
      <Route path="/privacy">
        <PublicPage><Privacy /></PublicPage>
      </Route>
      <Route path="/terms">
        <PublicPage><Terms /></PublicPage>
      </Route>
      <Route path="/integrations">
        <PublicPage><Integrations /></PublicPage>
      </Route>
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/reset-password" component={ResetPassword} />
      
      {/* Legacy redirects — old dashboard routes → /app/* (no breaking changes) */}
      <Route path="/dashboard">
        {() => { window.location.replace("/app/dashboard" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/smart-finder">
        {() => { window.location.replace("/app/smart-finder" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/ai-agent">
        {() => { window.location.replace("/app/ai-agent" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/find-leads">
        {() => { window.location.replace("/app/find-leads" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/reports">
        {() => { window.location.replace("/app/reports" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/tools">
        {() => { window.location.replace("/app/tools" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/landed-cost">
        {() => { window.location.replace("/app/landed-cost" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/customs-calculator">
        {() => { window.location.replace("/app/customs-calculator" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/shipping-estimator">
        {() => { window.location.replace("/app/shipping-estimator" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/trade-data">
        {() => { window.location.replace("/app/trade-data" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/risk-intelligence">
        {() => { window.location.replace("/app/risk-intelligence" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/compliance">
        {() => { window.location.replace("/app/compliance" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/billing">
        {() => { window.location.replace("/app/billing" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/admin">
        {() => { window.location.replace("/app/admin" + (window.location.search || "")); return null; }}
      </Route>
      <Route path="/suppliers">
        {() => {
          // Always funnel /suppliers to the public /search page.
          // Sending guests to /app/suppliers triggered ProtectedRoute's login redirect —
          // the "search redirects to /app routes" symptom.
          const q = new URLSearchParams(window.location.search).get("q");
          window.location.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
          return null;
        }}
      </Route>
      
      {/* Protected Routes — all under /app */}
      <Route path="/app/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/app/smart-finder">
        <ProtectedRoute component={SmartFinder} />
      </Route>
      <Route path="/app/ai-agent">
        <ProtectedRoute component={AIAgent} />
      </Route>
      <Route path="/app/find-leads">
        <ProtectedRoute component={FindLeads} />
      </Route>
      <Route path="/app/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      <Route path="/app/tools">
        <ProtectedRoute component={Tools} />
      </Route>
      <Route path="/app/landed-cost">
        <ProtectedRoute component={LandedCostCalculator} />
      </Route>
      <Route path="/app/customs-calculator">
        <ProtectedRoute component={CustomsCalculator} />
      </Route>
      <Route path="/app/shipping-estimator">
        <ProtectedRoute component={ShippingEstimator} />
      </Route>
      <Route path="/app/trade-data">
        <ProtectedRoute component={TradeData} />
      </Route>
      <Route path="/app/risk-intelligence">
        <ProtectedRoute component={RiskIntelligence} />
      </Route>
      <Route path="/app/compliance">
        <ProtectedRoute component={ComplianceCheck} />
      </Route>
      <Route path="/app/billing">
        <ProtectedRoute component={Billing} />
      </Route>
      <Route path="/app/suppliers">
        <ProtectedRoute component={SupplierDiscovery} />
      </Route>
      <Route path="/app/admin">
        <ProtectedRoute component={Admin} adminOnly />
      </Route>
      <Route path="/admin-indexes" component={AdminIndexes} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthCacheBuster />
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;