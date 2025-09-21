import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DraftEditor from "./pages/DraftEditor";
import ClausesLibrary from "./pages/ClausesLibrary";
import NegotiationWorkspace from "./pages/NegotiationWorkspace";
import LoginPage from "./pages/LoginPage";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Layout>
              <Documents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/draft"
        element={
          <ProtectedRoute>
            <Layout>
              <DraftEditor />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/draft/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DraftEditor />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clauses"
        element={
          <ProtectedRoute>
            <Layout>
              <ClausesLibrary />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/negotiation"
        element={
          <ProtectedRoute>
            <Layout>
              <NegotiationWorkspace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/negotiation/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <NegotiationWorkspace />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
