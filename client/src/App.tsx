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
import AuthPage from "@/pages/auth-page"; 
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
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
  return (
    <AppLayout>
      <Router />
    </AppLayout>
  );
}

export default App;
