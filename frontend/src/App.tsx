import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './app/providers/AuthProvider';
import { ToastProvider } from './shared/ui/notification';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { HomePage } from './pages/home';
import { BrowseGigsPage, GigDetailPage } from './pages/gigs';
import { BrowseProjectsPage, ProjectDetailPage } from './pages/projects';
import { FreelancerDashboard, ClientDashboard } from './pages/dashboard';
import { OrderDetailPage } from './pages/orders';
import { SubmitProposalPage, ProposalListPage } from './pages/proposals';
import { MessagesPage } from './pages/messages';
import { Loading } from './shared/ui';
import { ProtectedLayout } from './app/layouts/ProtectedLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function ProtectedOutlet() {
  return (
    <ProtectedRoute>
      <ProtectedLayout />
    </ProtectedRoute>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    const redirectPath = user?.role === 'freelancer'
      ? '/dashboard/freelancer'
      : '/dashboard/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider position="top-right">
          <Routes>
          <Route element={<ProtectedOutlet />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gigs" element={<BrowseGigsPage />} />
            <Route path="/gigs/:id" element={<GigDetailPage />} />
            <Route path="/projects" element={<BrowseProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/proposals/submit" element={<SubmitProposalPage />} />
            <Route path="/proposals/project/:projectId" element={<ProposalListPage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
