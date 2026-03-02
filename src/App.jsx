import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AnalysisTool from './pages/AnalysisTool';
import PricingPage from './pages/PricingPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import './styles/main.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/analyze" element={
            <ProtectedRoute>
              <AnalysisTool />
            </ProtectedRoute>
          } />

          <Route path="/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} AI Resume Analyzer Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
