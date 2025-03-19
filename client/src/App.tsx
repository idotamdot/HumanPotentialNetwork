import { Switch, Route } from "wouter";
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
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/issues" component={GlobalIssues} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/knowledge" component={KnowledgeCommons} />
      <Route path="/rewards" component={Rewards} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
