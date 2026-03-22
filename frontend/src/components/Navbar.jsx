import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imgUrl, getAvatar } from '../utils/helpers';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showLogoutModal, setShowLogout] = useState(false);

  const active = (p) => pathname === p ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  const avatar = user?.profilePicture ? imgUrl(user.profilePicture) : getAvatar(user?.name);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogout(false);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-black text-gray-900">Job<span className="text-blue-600">Portal</span></Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/"         className={`text-sm font-medium transition ${active('/')}`}>Jobs</Link>
            <Link to="/companies" className={`text-sm font-medium transition ${active('/companies')}`}>Companies</Link>
            <Link to="/network"  className={`text-sm font-medium transition ${active('/network')}`}>Network</Link>
            {user && <Link to="/inbox" className={`text-sm font-medium transition ${active('/inbox')}`}>Inbox</Link>}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
                  <img src={avatar} className="w-8 h-8 rounded-full object-cover border-2 border-blue-100" alt="" />
                  <span className="text-sm font-semibold text-gray-700">{user.name.split(' ')[0]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'employer' ? 'bg-purple-100 text-purple-700' : user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </button>
                {user.role !== 'jobseeker' && (
                  <Link to="/postjob" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                    + Post Job
                  </Link>
                )}
                <button onClick={() => setShowLogout(true)}
                  className="text-sm text-gray-500 hover:text-red-600 transition px-2 flex items-center gap-1.5">
                  <i className="fas fa-sign-out-alt text-xs"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Sign in</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-gray-600`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {[['/', <><i className="fas fa-briefcase w-5"></i>Jobs</>],
              ['/companies', <><i className="fas fa-building w-5"></i>Companies</>],
              ['/network', <><i className="fas fa-users w-5"></i>Network</>]
            ].map(([p, label]) => (
              <Link key={p} to={p} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">{label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/inbox" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <i className="fas fa-inbox w-5"></i>Inbox
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <i className="fas fa-tachometer-alt w-5"></i>Dashboard
                </Link>
                {user.role !== 'jobseeker' && (
                  <Link to="/postjob" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
                    <i className="fas fa-plus w-5"></i>Post Job
                  </Link>
                )}
                <button onClick={() => { setMenuOpen(false); setShowLogout(true); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-medium w-full">
                  <i className="fas fa-sign-out-alt w-5"></i>Logout
                </button>
              </>
            ) : (
              <Link to="/signin" onClick={() => setMenuOpen(false)}
                className="block bg-blue-600 text-white text-center px-4 py-2 rounded-xl font-semibold">Sign in</Link>
            )}
          </div>
        )}
      </nav>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-sign-out-alt text-red-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center">Sign out?</h3>
            <p className="text-gray-500 text-sm text-center mt-1 mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition">
                <i className="fas fa-sign-out-alt mr-1.5"></i>Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
