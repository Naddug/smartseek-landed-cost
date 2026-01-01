import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import SmartFinder from "@/pages/SmartFinder";
import Shortlists from "@/pages/Shortlists";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import Tools from "@/pages/Tools";
import Billing from "@/pages/Billing";
import SampleReport from "@/pages/SampleReport"; // Import new page
import AppLayout from "@/components/layout/AppLayout";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user } = useStore();
  const [_, setLocation] = useLocation();

  if (!user) {
    // Delay redirect to avoid render cycle conflicts
    setTimeout(() => setLocation('/auth'), 0);
    return null;
  }

  if (adminOnly && user.role !== 'admin') {
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
      <Route path="/auth" component={Auth} />
      <Route path="/sample-report" component={SampleReport} /> {/* Add public route */}
      
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