/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Eye, EyeOff, Mail, Lock, User, Zap,
  Shield, ArrowRight, AlertCircle, CheckCircle2,
  BarChart2,
} from 'lucide-react';
import SolarSystemIllustration from '../../components/SolarSystemIllustration';
import '../../styles/auth.css';

/* ── Conversational Dynamic Headline & Tagline Component ──────── */
function DynamicWelcomeText() {
  const MESSAGES = [
    {
      headline: 'smarter energy',
      tagline: 'Real-time inverter monitoring, advanced analytics and intelligent control — all in one powerful platform.'
    },
    {
      headline: 'maximum uptime',
      tagline: 'Instantly detect inverter faults, track performance, and keep your solar fleet running at 100% efficiency.'
    },
    {
      headline: 'intelligent control',
      tagline: "We're analyzing your solar data in real-time to prevent failures before they happen. Welcome to the future."
    },
    {
      headline: 'secure operations',
      tagline: 'Manage team roles, track activity logs, and approve operators securely. Your fleet is safe with VoltIQ.'
    },
    {
      headline: 'clean intelligence',
      tagline: 'Ready to optimize your clean energy generation? Sign in now to explore live inverter diagnostics.'
    }
  ];

  const [curr, setCurr] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taglineClass, setTaglineClass] = useState('au-tagline au-fade-in');

  useEffect(() => {
    let timer;
    const fullText = MESSAGES[curr].headline;
    const speed = isDeleting ? 40 : 80;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, speed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, speed);
    }

    if (!isDeleting && charIndex === fullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
        setTaglineClass('au-tagline au-fade-out');
      }, 6000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      const nextIndex = (curr + 1) % MESSAGES.length;
      setCurr(nextIndex);
      setTaglineClass('au-tagline au-fade-in');
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, curr]);

  return (
    <>
      <h1 className="au-headline">
        Welcome to<br />
        <span><span className="au-typewriter">{displayText}</span></span>
      </h1>
      <p className={taglineClass} key={curr}>
        {MESSAGES[curr].tagline}
      </p>
    </>
  );
}




/* ── Stats row ─────────────────────────────────────────────────── */
const STATS = [
  { icon: <Zap size={16} />,      val: '48',    lbl: 'Inverters Monitored' },
  { icon: <BarChart2 size={16} />, val: '97.4%', lbl: 'Avg. Efficiency'     },
  { icon: <Shield size={16} />,   val: '99.9%', lbl: 'System Uptime'       },
];

/* ── Main Login Component ──────────────────────────────────────── */
export default function Login() {
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPassword,  setShowPassword]  = useState(false);
  const [rememberMe,    setRememberMe]    = useState(true);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sessionClearing, setSessionClearing] = useState(false);

  const { user, loading: authLoading, isApproved, userStatus, login, loginWithGoogle, forceLogout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';
  const pending   = location.state?.pendingApproval;

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, from, navigate, user]);

  const validate = () => {
    if (!email.trim())       { setError('Please enter your email address.');         return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return false; }
    if (!password)           { setError('Please enter your password.');              return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    if (user && !isApproved) {
      setError('Sign out of the current pending account first, then sign in with an approved admin account.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      let msg = 'Failed to sign in. Please check your credentials.';
      if (['auth/user-not-found','auth/wrong-password','auth/invalid-credential'].includes(err.code))
        msg = 'Invalid email or password. Please try again.';
      else if (err.code === 'auth/too-many-requests')
        msg = 'Too many failed attempts. Please try again later.';
      else if (err.code === 'auth/invalid-email')
        msg = 'The email address is not valid.';
      else if (err.code === 'auth/timeout')
        msg = err.message;
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError('');
    if (user && !isApproved) {
      setError('Sign out of the current pending account first, then continue with Google.');
      return;
    }
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.message !== 'Google sign-in was cancelled.') {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally { setGoogleLoading(false); }
  };

  const handleSignOutCurrent = async () => {
    setError('');
    setSessionClearing(true);
    try {
      await forceLogout();
      window.location.replace('/login');
    } catch {
      setError('Could not sign out the current account. Please refresh and try again.');
    } finally {
      setSessionClearing(false);
    }
  };

  return (
    <div className="au-page">

      {/* ══════════ LEFT SIDE ══════════ */}
      <div className="au-left">
        <div className="au-left__bg" />
        <div className="au-left__overlay" />
        <div className="au-left__content">

          {/* Brand */}
          <Link to="/" className="au-brand">
            <Zap size={22} className="au-brand__icon" />
            <span className="au-brand__name">VoltIQ</span>
          </Link>

          {/* Badge */}
          <div className="au-badge">
            <Zap size={11} />
            Enterprise Solar Intelligence
          </div>

          {/* Headline & Tagline (Dynamic & Conversational) */}
          <DynamicWelcomeText />

          {/* Stats */}
          <div className="au-stats">
            {STATS.map(s => (
              <div key={s.lbl} className="au-stat">
                <div className="au-stat__icon">{s.icon}</div>
                <div>
                  <span className="au-stat__val">{s.val}</span>
                  <span className="au-stat__lbl">{s.lbl}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Illustration Component */}
          <SolarSystemIllustration />

        </div>
      </div>

      {/* ══════════ RIGHT SIDE ══════════ */}
      <div className="au-right">
        <div className="au-card">

          {/* Tabs */}
          <div className="au-tabs">
            <span className="au-tab au-tab--active">
              <Lock size={13} /> Log in
            </span>
            <Link to="/register" className="au-tab au-tab--inactive">
              <User size={13} /> Create account
            </Link>
          </div>

          <div className="au-card__body">

            {/* Icon */}
            <div className="au-card__icon"><Lock size={20} /></div>

            <h2 className="au-card__title">Welcome back</h2>
            <p className="au-card__sub">Sign in to access your VoltIQ dashboard.</p>

            {user && !isApproved && (
              <div className="au-alert au-alert--error">
                <AlertCircle size={15} />
                <span>
                  Current account is {userStatus}. Sign out first, then use an approved admin account.
                </span>
                <button type="button" className="au-alert-action" onClick={handleSignOutCurrent}>
                  {sessionClearing ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}

            {/* Pending approval message */}
            {pending && (
              <div className="au-alert au-alert--success">
                <CheckCircle2 size={15} />
                Account created — awaiting administrator approval.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="au-alert au-alert--error" role="alert">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="au-field">
                <label className="au-label" htmlFor="login-email">Email Address</label>
                <div className="au-input-wrap">
                  <span className="au-input-icon"><Mail size={15} /></span>
                  <input
                    id="login-email"
                    type="email"
                    className="au-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading || googleLoading || sessionClearing}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="au-field">
                <label className="au-label" htmlFor="login-password">Password</label>
                <div className="au-input-wrap">
                  <span className="au-input-icon"><Lock size={15} /></span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="au-input au-input--pr"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading || googleLoading || sessionClearing}
                    required
                  />
                  <button
                    type="button"
                    className="au-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="au-meta">
                <label className="au-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    disabled={loading || sessionClearing}
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="au-forgot">Forgot password?</a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit-btn"
                className="au-btn-primary"
                disabled={loading || googleLoading || sessionClearing || (user && !isApproved)}
              >
                {loading
                  ? <><span className="au-spinner" /> Signing in…</>
                  : <><ArrowRight size={16} /> Sign in to VoltIQ</>
                }
              </button>
            </form>

            {/* OR */}
            <div className="au-or">OR</div>

            {/* Google */}
            <button
              id="google-signin-btn"
              className="au-btn-google"
              onClick={handleGoogle}
              disabled={loading || googleLoading || sessionClearing || (user && !isApproved)}
            >
              {googleLoading ? (
                <><span className="au-spinner au-spinner--white" /> Connecting…</>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Switch */}
            <p className="au-switch">
              Don't have an account?
              <button className="au-switch__link" onClick={() => navigate('/register')} type="button">
                Create account
              </button>
            </p>

            {/* Security */}
            <div className="au-security">
              <span className="au-security__item"><Shield size={11} /> 256-bit encrypted</span>
              <span className="au-security__sep">|</span>
              <span className="au-security__item"><Lock size={11} /> Firebase Auth</span>
              <span className="au-security__sep">|</span>
              <span className="au-security__item"><Shield size={11} /> GDPR compliant</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
