import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail } from 'lucide-react';

/**
 * Forgot Password Page
 * Organized under pages/auth/
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccess(
        'Password reset email sent! Check your inbox (and spam folder) for instructions.'
      );
      setEmail('');
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        setSuccess('If an account exists for this email, a reset link has been sent.');
      } else {
        setError('Failed to send reset email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <div>
          <div className="brand-logo">VoltIQ</div>
          <h1 className="brand-title">Smart Inverter Fault Monitoring</h1>
          <p className="brand-desc">
            Monitor faults, alerts, devices and system health in real time.
          </p>
          <div className="features">
            <div className="feature">Real-time fault tracking</div>
            <div className="feature">Secure user access</div>
            <div className="feature">Smart inverter analytics</div>
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Reset your password</h1>
            <p>Enter your email and we&apos;ll send you a link to reset your password.</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">{error}</div>
          )}
          {success && (
            <div className="alert alert-success" role="status">{success}</div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="input-group">
                <label htmlFor="reset-email">Email address</label>
                <div className="input-wrapper">
                  <Mail className="icon" size={18} />
                  <input
                    id="reset-email"
                    type="email"
                    className="input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          )}

          <div className="form-footer">
            <Link to="/login">← Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
