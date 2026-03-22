import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Role', 'Details', 'Password'];

export default function SignUp() {
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '', role: 'jobseeker' });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const next = (e) => {
    e.preventDefault();
    setError('');
    if (step === 0) { setStep(1); return; }
    if (step === 1) {
      if (!form.name.trim())  { setError('Full name is required'); return; }
      if (!form.email.trim()) { setError('Email is required'); return; }
      setStep(2); return;
    }
    // step 2 — submit
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (form.password.length < 6)         { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm)   { setError('Passwords do not match'); return; }
    setLoading(true);
    const r = await signup(form.name.trim(), form.email.trim(), form.password, form.role);
    setLoading(false);
    if (r.success) navigate('/');
    else setError(r.message);
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)                    s++;
    if (p.length >= 10)                   s++;
    if (/[A-Z]/.test(p))                  s++;
    if (/[0-9]/.test(p))                  s++;
    if (/[^A-Za-z0-9]/.test(p))           s++;
    return s;
  })();
  const strengthLabel = ['','Weak','Fair','Good','Strong','Very strong'][strength];
  const strengthColor = ['','bg-red-400','bg-orange-400','bg-yellow-400','bg-green-400','bg-emerald-500'][strength];

  return (
    <div className="min-h-[90vh] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-20 right-10 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i className="fas fa-briefcase text-white text-lg"></i>
            </div>
            <span className="text-white text-2xl font-black">Job<span className="text-blue-200">Portal</span></span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight">
            Join the community<br />of professionals.
          </h2>
          <p className="text-blue-100 mt-4 text-lg leading-relaxed">
            Create your profile, connect with employers, and take the next step in your career.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3">
          {[
            ['fa-search','Browse thousands of job listings'],
            ['fa-users','Build your professional network'],
            ['fa-bell','Get notified about new opportunities'],
            ['fa-file-alt','Apply with your profile in one click'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-blue-100">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className={`fas ${icon} text-sm text-white`}></i>
              </div>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-briefcase text-white text-xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Job<span className="text-blue-600">Portal</span></h2>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 mb-6">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5 text-sm flex items-center gap-2.5">
              <i className="fas fa-exclamation-circle flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={next} className="space-y-5">

            {/* Step 0 — Role */}
            {step === 0 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">I want to join as a…</p>
                {[
                  ['jobseeker','fa-user','Job Seeker','Browse and apply for jobs','blue'],
                  ['employer','fa-building','Employer','Post jobs and hire talent','purple'],
                ].map(([val, icon, title, desc, color]) => (
                  <label key={val} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${form.role === val
                      ? color === 'blue' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <input type="radio" name="role" value={val} checked={form.role === val} onChange={set('role')} className="sr-only" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${form.role === val
                        ? color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'
                        : 'bg-gray-100'}`}>
                      <i className={`fas ${icon} ${form.role === val ? 'text-white' : 'text-gray-500'} text-lg`}></i>
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${form.role === val ? color === 'blue' ? 'text-blue-700' : 'text-purple-700' : 'text-gray-800'}`}>{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    {form.role === val && (
                      <i className={`fas fa-check-circle ml-auto text-lg ${color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}></i>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* Step 1 — Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <i className="fas fa-user mr-1.5 text-gray-400"></i>Full name
                  </label>
                  <input type="text" required autoFocus placeholder="John Doe"
                    value={form.name} onChange={set('name')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <i className="fas fa-envelope mr-1.5 text-gray-400"></i>Email address
                  </label>
                  <input type="email" required placeholder="you@example.com"
                    value={form.email} onChange={set('email')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm" />
                </div>
              </div>
            )}

            {/* Step 2 — Password */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <i className="fas fa-lock mr-1.5 text-gray-400"></i>Password
                  </label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required autoFocus
                      placeholder="Min. 6 characters"
                      value={form.password} onChange={set('password')}
                      className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm" />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1">
                      <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>
                  {/* Strength bar */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${['','text-red-500','text-orange-500','text-yellow-500','text-green-500','text-emerald-600'][strength]}`}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <i className="fas fa-lock mr-1.5 text-gray-400"></i>Confirm password
                  </label>
                  <div className="relative">
                    <input type={showConf ? 'text' : 'password'} required
                      placeholder="Re-enter password"
                      value={form.confirm} onChange={set('confirm')}
                      className={`w-full px-4 py-3 pr-11 border rounded-xl bg-white focus:outline-none focus:ring-2 transition text-sm
                        ${form.confirm && form.confirm !== form.password
                          ? 'border-red-300 focus:ring-red-400'
                          : form.confirm && form.confirm === form.password
                          ? 'border-green-300 focus:ring-green-400'
                          : 'border-gray-200 focus:ring-blue-500'}`} />
                    <button type="button" onClick={() => setShowConf(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1">
                      <i className={`fas ${showConf ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                    {form.confirm && (
                      <i className={`fas ${form.confirm === form.password ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-400'} absolute right-9 top-1/2 -translate-y-1/2 text-sm pointer-events-none`}></i>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1.5 text-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account summary</p>
                  <div className="flex items-center gap-2 text-gray-700"><i className="fas fa-user w-4 text-gray-400"></i>{form.name}</div>
                  <div className="flex items-center gap-2 text-gray-700"><i className="fas fa-envelope w-4 text-gray-400"></i>{form.email}</div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <i className={`fas ${form.role === 'employer' ? 'fa-building' : 'fa-user'} w-4 text-gray-400`}></i>
                    <span className="capitalize">{form.role}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={() => { setStep(s => s - 1); setError(''); }}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition">
                  <i className="fas fa-arrow-left mr-2"></i>Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> Creating…</>
                  : step < 2
                  ? <>Continue <i className="fas fa-arrow-right"></i></>
                  : <><i className="fas fa-user-plus"></i> Create account</>}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
