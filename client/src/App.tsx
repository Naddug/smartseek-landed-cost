import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser, useProfile } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

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
    window.location.href = '/login';
    return null;
  }

  // Check email verification (unless requireVerified is false)
  if (requireVerified && user.emailVerified === false) {
    return <EmailVerificationRequired />;
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <div className="p-8 text-center text-destructive">Access Denied: Admin Only</div>;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/": "SmartSeek – Sourcing & Lead Intelligence",
  "/dashboard": "Dashboard | SmartSeek",
  "/smart-finder": "SmartSeek AI | SmartSeek",
  "/ai-agent": "AI Agent | SmartSeek",
  "/find-leads": "Find Leads | SmartSeek",
  "/reports": "My Reports | SmartSeek",
  "/billing": "Billing | SmartSeek",
  "/trade-data": "Trade Data | SmartSeek",
  "/landed-cost": "Landed Cost Calculator | SmartSeek",
  "/customs-calculator": "Customs Calculator | SmartSeek",
  "/shipping-estimator": "Shipping Estimator | SmartSeek",
  "/risk-intelligence": "Risk Intelligence | SmartSeek",
  "/compliance": "Compliance Check | SmartSeek",
  "/suppliers": "Suppliers | SmartSeek",
  "/tools": "Tools | SmartSeek",
  "/admin": "Admin | SmartSeek",
  "/login": "Login | SmartSeek",
  "/signup": "Sign Up | SmartSeek",
  "/pricing": "Pricing | SmartSeek",
  "/faq": "FAQ | SmartSeek",
  "/about": "About | SmartSeek",
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
      <Route path="/suppliers">
        <ProtectedRoute component={SupplierDiscovery} />
      </Route>
      <Route path="/rfq">
        <PublicLayout><RequestQuote /></PublicLayout>
      </Route>
      <Route path="/faq">
        <PublicLayout><FAQ /></PublicLayout>
      </Route>
      <Route path="/pricing">
        <PublicLayout><Pricing /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><Contact /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><About /></PublicLayout>
      </Route>
      <Route path="/privacy">
        <PublicLayout><Privacy /></PublicLayout>
      </Route>
      <Route path="/terms">
        <PublicLayout><Terms /></PublicLayout>
      </Route>
      <Route path="/integrations">
        <PublicLayout><Integrations /></PublicLayout>
      </Route>
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/reset-password" component={ResetPassword} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/smart-finder">
        <ProtectedRoute component={SmartFinder} />
      </Route>
      <Route path="/ai-agent">
        <ProtectedRoute component={AIAgent} />
      </Route>
      <Route path="/find-leads">
        <ProtectedRoute component={FindLeads} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      <Route path="/tools">
        <ProtectedRoute component={Tools} />
      </Route>
      <Route path="/landed-cost">
        <ProtectedRoute component={LandedCostCalculator} />
      </Route>
      <Route path="/customs-calculator">
        <ProtectedRoute component={CustomsCalculator} />
      </Route>
      <Route path="/shipping-estimator">
        <ProtectedRoute component={ShippingEstimator} />
      </Route>
      <Route path="/trade-data">
        <ProtectedRoute component={TradeData} />
      </Route>
      <Route path="/risk-intelligence">
        <ProtectedRoute component={RiskIntelligence} />
      </Route>
      <Route path="/compliance">
        <ProtectedRoute component={ComplianceCheck} />
      </Route>
      <Route path="/billing">
        <ProtectedRoute component={Billing} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={Admin} adminOnly />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;