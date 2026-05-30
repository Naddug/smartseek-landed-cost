import { Route, Switch } from "wouter";
import HomePage from "@ortaq/pages/HomePage";
import TrustPage from "@ortaq/pages/TrustPage";
import RiskPage from "@ortaq/pages/RiskPage";
import CompanyDetailPage from "@ortaq/pages/CompanyDetailPage";
import OnboardingPage from "@ortaq/pages/OnboardingPage";
import PrivacyPage, { LegalPage } from "@ortaq/pages/LegalPage";
import NotFoundPage from "@ortaq/pages/NotFoundPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/guven" component={TrustPage} />
      <Route path="/riskler" component={RiskPage} />
      <Route path="/sirket/ornek" component={CompanyDetailPage} />
      <Route path="/basla" component={OnboardingPage} />
      <Route path="/gizlilik" component={PrivacyPage} />
      <Route path="/kullanim">{() => <LegalPage type="terms" />}</Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}
