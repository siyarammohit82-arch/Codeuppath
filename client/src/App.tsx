import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Analytics } from "@/components/Analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RouteSeo } from "@/components/RouteSeo";
import { KeepAlivePing } from "@/components/KeepAlivePing";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Hackathons from "@/pages/Hackathons";
import HackathonDetails from "@/pages/HackathonDetails";
import LearningResources from "@/pages/LearningResources";
import LearningResourceDetails from "@/pages/LearningResourceDetails";
import Blog from "@/pages/Blog";
import BlogDetails from "@/pages/BlogDetails";
import AiRoadmap from "@/pages/AiRoadmap";
import Contact from "@/pages/Contact";
import ProductPage from "@/pages/Product";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import RefundPolicy from "@/pages/RefundPolicy";
import PlayStoreListing from "@/pages/PlayStoreListing";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHackathons from "@/pages/AdminHackathons";
import AdminLearningResources from "@/pages/AdminLearningResources";
import AdminBlog from "@/pages/AdminBlog";
import AdminProducts from "@/pages/AdminProducts";
import AdminUsers from "@/pages/AdminUsers";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminSettings from "@/pages/AdminSettings";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/hackathons" component={Hackathons} />
      <Route path="/hackathons/:slug" component={HackathonDetails} />
      <Route path="/learning-resources" component={LearningResources} />
      <Route path="/learning-resources/:slug" component={LearningResourceDetails} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetails} />
      <Route path="/product" component={ProductPage} />
      <Route path="/ai-roadmap">
        <ProtectedRoute>
          <AiRoadmap />
        </ProtectedRoute>
      </Route>
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/play-store" component={PlayStoreListing} />
      <Route path="/admin">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>
      <Route path="/admin/hackathons">
        <AdminRoute>
          <AdminHackathons />
        </AdminRoute>
      </Route>
      <Route path="/admin/learning-resources">
        <AdminRoute>
          <AdminLearningResources />
        </AdminRoute>
      </Route>
      <Route path="/admin/blog">
        <AdminRoute>
          <AdminBlog />
        </AdminRoute>
      </Route>
      <Route path="/admin/products">
        <AdminRoute>
          <AdminProducts />
        </AdminRoute>
      </Route>
      <Route path="/admin/users">
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      </Route>
      <Route path="/admin/analytics">
        <AdminRoute>
          <AdminAnalytics />
        </AdminRoute>
      </Route>
      <Route path="/admin/settings">
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Analytics />
          <KeepAlivePing />
          <RouteSeo />
          <Toaster />
          <AuthGate>
            <Router />
          </AuthGate>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return <>{children}</>;
}

export default App;
