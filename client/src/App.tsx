import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import GlobalIssues from "@/pages/GlobalIssues";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import KnowledgeCommons from "@/pages/KnowledgeCommons";
import Rewards from "@/pages/Rewards";
import KidsZone from "@/pages/KidsZone";
import Governance from "@/pages/Governance";
import LearningPaths from "@/pages/LearningPaths";
import LearningPathDetail from "@/pages/LearningPathDetail";
import Marketplace from "@/pages/Marketplace";
import AuthPage from "@/pages/auth-page"; 
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";

  if (isAuthPage) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/issues" component={GlobalIssues} />
      <ProtectedRoute path="/projects" component={Projects} />
      <ProtectedRoute path="/projects/:id" component={ProjectDetail} />
      <ProtectedRoute path="/knowledge" component={KnowledgeCommons} />
      <ProtectedRoute path="/learning-paths" component={LearningPaths} />
      <ProtectedRoute path="/learning-paths/:id" component={LearningPathDetail} />
      <ProtectedRoute path="/rewards" component={Rewards} />
      <ProtectedRoute path="/kids" component={KidsZone} />
      <ProtectedRoute path="/governance" component={Governance} />
      <ProtectedRoute path="/marketplace" component={Marketplace} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";

  // Render auth page without the app layout
  if (isAuthPage) {
    return <Router />;
  }

  // Render the main app with the app layout
  return (
    <AppLayout>
      <Router />
    </AppLayout>
  );
}

export default App;
