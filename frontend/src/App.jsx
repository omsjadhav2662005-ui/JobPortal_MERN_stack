import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Inbox from './pages/Inbox';
import Network from './pages/Network';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import UserProfile from './pages/UserProfile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex justify-center items-center py-40"><div className="text-center"><i className="fas fa-spinner fa-spin text-blue-600 text-3xl mb-3 block"></i><p className="text-gray-400 text-sm">Loading...</p></div></div>;
  return user ? children : <Navigate to="/signin" state={{ from: location.pathname }} replace />;
}

function EmployerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role === 'jobseeker') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/companies"     element={<Companies />} />
            <Route path="/company/:name" element={<CompanyDetail />} />
            <Route path="/network"       element={<Network />} />
            <Route path="/job/:id"       element={<JobDetail />} />
            <Route path="/signin"        element={<SignIn />} />
            <Route path="/signup"        element={<SignUp />} />
            <Route path="/profile/:id"   element={<UserProfile />} />
            <Route path="/inbox"         element={<PrivateRoute><Inbox /></PrivateRoute>} />
            <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/postjob"       element={<EmployerRoute><PostJob /></EmployerRoute>} />
            <Route path="*" element={
              <div className="text-center py-32">
                <i className="fas fa-exclamation-circle text-gray-200 text-5xl mb-4 block"></i>
                <h2 className="text-2xl font-bold text-gray-500">Page Not Found</h2>
                <a href="/" className="text-blue-600 hover:underline mt-2 block">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-black text-gray-800">Job<span className="text-blue-600">Portal</span></div>
            <p className="text-sm text-gray-400">© 2025 JobPortal · Built with MERN Stack · Final Year Project</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="/" className="hover:text-blue-600">Jobs</a>
              <a href="/companies" className="hover:text-blue-600">Companies</a>
              <a href="/network" className="hover:text-blue-600">Network</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
