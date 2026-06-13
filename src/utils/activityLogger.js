import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

/**
 * VoltIQ Activity Logger
 * 
 * Use this for important security-relevant and admin-visible actions.
 * 
 * Security note:
 * - Regular users can only write logs (enforced by database.rules.json)
 * - Only approved admins can read the logs collection.
 */
export async function logAction(user, action, details = {}) {
  if (!user || !user.uid) {
    console.warn('[ActivityLogger] No authenticated user. Skipping log.');
    return;
  }

  try {
    // Use a composite key that is roughly time-sortable
    const logId = `${Date.now()}-${user.uid.substring(0, 6)}`;
    const logRef = ref(db, `activityLogs/${logId}`);

    await set(logRef, {
      uid: user.uid,
      email: user.email || 'unknown',
      action: String(action),
      details: details || {},
      timestamp: Date.now(), // client timestamp as fallback (serverTimestamp is better but harder for keys)
    });
  } catch (error) {
    // Logging must never break the user experience
    console.error('[ActivityLogger] Failed to write log:', error);
  }
}

// Convenience helpers
export const LOG_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  APPROVE_USER: 'approve_user',
  REJECT_USER: 'reject_user',
  PROMOTE_ADMIN: 'promote_to_admin',
  DEMOTE_USER: 'demote_to_user',
  SUSPEND_USER: 'suspend_user',
  VIEW_USERS: 'view_users_list',
  VIEW_LOGS: 'view_activity_logs',
  DASHBOARD_VIEW: 'dashboard_view',
};
