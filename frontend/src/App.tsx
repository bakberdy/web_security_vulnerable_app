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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/gigs"
            element={
              <ProtectedRoute>
                <BrowseGigsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gigs/:id"
            element={
              <ProtectedRoute>
                <GigDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <BrowseProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/freelancer"
            element={
              <ProtectedRoute>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/submit"
            element={
              <ProtectedRoute>
                <SubmitProposalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/project/:projectId"
            element={
              <ProtectedRoute>
                <ProposalListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
