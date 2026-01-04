import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser, useProfile } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import SmartFinder from "@/pages/SmartFinder";
import Shortlists from "@/pages/Shortlists";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import Tools from "@/pages/Tools";
import Billing from "@/pages/Billing";
import SampleReport from "@/pages/SampleReport";
import CustomsCalculator from "@/pages/CustomsCalculator";
import ShippingEstimator from "@/pages/ShippingEstimator";
import TradeData from "@/pages/TradeData";
import UniversalSearch from "@/pages/UniversalSearch";
import AppLayout from "@/components/layout/AppLayout";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
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
    // Redirect to login
    window.location.href = '/login';
    return null;
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/sample-report" component={SampleReport} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/smart-finder">
        <ProtectedRoute component={SmartFinder} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      <Route path="/shortlists">
        <ProtectedRoute component={Shortlists} />
      </Route>
      <Route path="/tools">
        <ProtectedRoute component={Tools} />
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
      <Route path="/search">
        <ProtectedRoute component={UniversalSearch} />
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