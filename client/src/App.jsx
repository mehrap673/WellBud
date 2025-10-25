import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HealthProvider } from './context/HealthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import DietTracker from './pages/DietTracker';
import FitnessTracker from './pages/FitnessTracker';
import SleepTracker from './pages/SleepTracker';
import MoodTracker from './pages/MoodTracker';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <HealthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="diet" element={<DietTracker />} />
                <Route path="fitness" element={<FitnessTracker />} />
                <Route path="sleep" element={<SleepTracker />} />
                <Route path="mood" element={<MoodTracker />} />
                <Route path="profile" element={<Profile />} />
                <Route path='insights' element={<Insights />} />
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HealthProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
