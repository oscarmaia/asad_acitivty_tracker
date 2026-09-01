import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ActivityForm from './pages/ActivityForm';
import Utentes from './pages/Utentes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors duration={1000} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/utentes" 
            element={
              <ProtectedRoute>
                <Utentes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/atividade/nova" 
            element={
              <ProtectedRoute>
                <ActivityForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/atividade/:id" 
            element={
              <ProtectedRoute>
                <ActivityForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
