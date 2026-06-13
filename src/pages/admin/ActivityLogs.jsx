import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../../config/firebase';
import { Activity, ArrowLeft, Shield } from 'lucide-react';

/**
 * Activity Logs Page
 * Organized under pages/admin/
 */
export default function ActivityLogs() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    // Limited to last 50 entries to stay within Firebase free tier data download limits
    const logsRef = query(ref(db, 'activityLogs'), orderByChild('timestamp'), limitToLast(50));

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter(Boolean).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setLogs(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const formatTime = (ts) => ts ? new Date(ts).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

  const getActionColor = (action) => {
    if (action.includes('approve') || action.includes('promote')) return 'text-[#7CFF00]';
    if (action.includes('reject') || action.includes('suspend')) return 'text-[#FF4D4D]';
    if (action.includes('login')) return 'text-sky-400';
    return 'text-[#D8E2DC]';
  };

  if (!isAdmin) {
    return (
      <div className="dashboard">
        <Sidebar active="logs" />
        <div className="dashboard-main flex items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto text-[#FF4D4D] mb-4" size={48} />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-[#8A9A8F] mt-2">Only administrators can view activity logs.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar active="logs" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost !p-2"><ArrowLeft size={18} /></button>
            <div>
              <h1 className="flex items-center gap-2"><Activity size={22} /> Activity Logs</h1>
              <p className="text-xs text-[#8A9A8F]">Complete audit trail of user and admin actions</p>
            </div>
          </div>
          <div className="header-right text-sm text-[#8A9A8F]">Showing last {logs.length} events</div>
        </header>

        <div className="dashboard-content">
          <div className="card rounded-3xl p-6">
            {loading ? <div className="py-12 text-center text-[#8A9A8F]">Loading activity logs...</div> : logs.length === 0 ? <div className="py-12 text-center text-[#8A9A8F]">No activity recorded yet.</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1F2B24] text-[#8A9A8F] text-left">
                      <th className="py-3 px-4 w-44">Time</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2B24]">
                    {logs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#10210D]/50">
                        <td className="py-3 px-4 font-mono text-xs text-[#8A9A8F]">{formatTime(log.timestamp)}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{log.email}</div>
                          <div className="text-[10px] text-[#8A9A8F] font-mono">{log.uid?.substring(0, 8)}...</div>
                        </td>
                        <td className="py-3 px-4"><span className={`font-semibold ${getActionColor(log.action)}`}>{log.action.replace(/_/g, ' ').toUpperCase()}</span></td>
                        <td className="py-3 px-4 text-xs text-[#D8E2DC]">{log.details && Object.keys(log.details).length > 0 ? <pre className="whitespace-pre-wrap text-[#8A9A8F] font-mono text-[11px]">{JSON.stringify(log.details, null, 0)}</pre> : <span className="text-[#8A9A8F]">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-[#1F2B24] text-xs text-[#8A9A8F]">
              Logs stored under <code>/activityLogs</code> (last 50 only — limited to respect Firebase free tier download quotas). Only approved admins can read (enforced by security rules).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
