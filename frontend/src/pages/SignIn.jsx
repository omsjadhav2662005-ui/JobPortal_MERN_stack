import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signin } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/';

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const r = await signin(form.email, form.password);
    setLoading(false);
    if (r.success) navigate(from, { replace: true });
    else setError(r.message);
  };

  return (
    <div className="min-h-[90vh] flex">

      {/* Left branding panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i className="fas fa-briefcase text-white text-lg"></i>
            </div>
            <span className="text-white text-2xl font-black">Job<span className="text-blue-200">Portal</span></span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight">
            Your next great<br />opportunity awaits.
          </h2>
          <p className="text-blue-100 mt-4 text-lg leading-relaxed">
            Connect with top employers, showcase your skills, and land the career you deserve.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['10k+','Job Listings'],['5k+','Companies'],['50k+','Professionals']].map(([n, l]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-black text-white">{n}</div>
              <div className="text-blue-200 text-sm mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Logo — shown on all screens */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
              <i className="fas fa-briefcase text-white text-xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Job<span className="text-blue-600">Portal</span></h2>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to continue to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5 text-sm flex items-center gap-2.5">
              <i className="fas fa-exclamation-circle flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fas fa-envelope mr-1.5 text-gray-400"></i>Email address
              </label>
              <input
                type="email" required autoComplete="email"
                placeholder="you@example.com"
                value={form.email} onChange={set('email')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fas fa-lock mr-1.5 text-gray-400"></i>Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password} onChange={set('password')}
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1">
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm shadow-sm shadow-blue-200">
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i> Signing in…</>
                : <><i className="fas fa-sign-in-alt"></i> Sign in</>}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">DEMO ACCOUNTS</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['alice@jobportal.com','alice123','fa-building','Employer','purple'],
              ['bob@jobportal.com','bob123','fa-user','Job Seeker','blue'],
            ].map(([email, pass, icon, label, color]) => (
              <button key={email} type="button"
                onClick={() => setForm({ email, password: pass })}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition text-left
                  ${color === 'purple'
                    ? 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
                    : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                <i className={`fas ${icon} text-base flex-shrink-0`}></i>
                <div>
                  <div className="font-semibold text-xs">{label}</div>
                  <div className="text-[10px] opacity-70 truncate">{email}</div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
