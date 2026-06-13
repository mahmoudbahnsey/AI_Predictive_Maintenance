import { Navigate, useLocation } from 'react-router-dom';
import { Clock3, LogOut, ShieldX, WifiOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute
 *
 * Security layers:
 * 1. Must be authenticated through Firebase Auth.
 * 2. Must have a verified Realtime Database profile with status === "approved".
 * 3. Admin-only pages require an approved admin role.
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, isApproved, isAdmin, userStatus, forceLogout } = useAuth();
  const location = useLocation();

  const returnToLogin = async () => {
    await forceLogout();
    window.location.href = '/login';
  };

  const renderBlockedState = ({ tone, Icon, eyebrow, title, description, statusLabel, statusValue }) => (
    <main className={`route-block-page route-block-page--${tone}`}>
      <section className="route-block-card" aria-live="polite">
        <div className="route-block-orb">
          <Icon size={26} strokeWidth={1.8} />
        </div>
        <div className="route-block-copy">
          <span className="route-block-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="route-block-status">
          <span>{statusLabel}</span>
          <strong>{statusValue}</strong>
        </div>
        <button type="button" onClick={returnToLogin} className="route-block-action">
          <LogOut size={17} />
          Sign out and return to login
        </button>
      </section>
    </main>
  );

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Loading VoltIQ...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userStatus === 'adblock_error') {
    return renderBlockedState({
      tone: 'danger',
      Icon: WifiOff,
      eyebrow: 'Protected session blocked',
      title: 'Database connection blocked',
      description: 'Brave Shields, an ad blocker, or a network policy is preventing VoltIQ from verifying this account. The dashboard stays locked until verification works.',
      statusLabel: 'Access state',
      statusValue: 'Blocked by browser protection',
    });
  }

  if (!isApproved) {
    const isPending = userStatus === 'pending' || userStatus === 'unknown';

    return renderBlockedState({
      tone: isPending ? 'pending' : 'danger',
      Icon: isPending ? Clock3 : ShieldX,
      eyebrow: isPending ? 'Approval required' : 'Account access blocked',
      title: isPending ? 'Account pending approval' : 'This account cannot access VoltIQ',
      description: isPending
        ? 'Your account exists, but an administrator must approve it before any dashboard tools or assistants become available.'
        : 'This account is not currently allowed to enter the VoltIQ dashboard. Sign out and use an approved account.',
      statusLabel: 'Current status',
      statusValue: userStatus,
    });
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
