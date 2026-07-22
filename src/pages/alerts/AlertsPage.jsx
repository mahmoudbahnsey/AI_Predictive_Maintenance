import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Filter,
  Radio,
  Search,
  Send,
  ShieldAlert,
  UserRoundCheck,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import { mockAlerts as initialMockAlerts } from '../../data/mockAlertsData';
import { loadTelemetryAnalysis, FAULT_DEFINITIONS } from '../../utils/faultAnalyzer';
import { useEffect } from 'react';
import '../../styles/alerts.css';

const severityOptions = ['all', 'critical', 'warning', 'info'];
const statusOptions = ['all', 'UNACKNOWLEDGED', 'ACKNOWLEDGED', 'ESCALATED', 'MUTED'];

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: ShieldAlert,
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
  },
  info: {
    label: 'Info',
    icon: Bell,
  },
};

const statusLabels = {
  all: 'All status',
  UNACKNOWLEDGED: 'Unacknowledged',
  ACKNOWLEDGED: 'Acknowledged',
  ESCALATED: 'Escalated',
  MUTED: 'Muted',
};

export default function AlertsPage() {
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());

  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);
    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  const activeAlerts = useMemo(() => {
    if (!analysis || !analysis.alerts || analysis.alerts.length === 0) {
      return initialMockAlerts;
    }
    return analysis.alerts.map((a, i) => ({
      id: `ALT-${new Date().getTime().toString().slice(-4)}-${i}`,
      type: FAULT_DEFINITIONS[a.code]?.title || a.code,
      device: 'Telemetry Data',
      system: analysis.sourceName || 'Unknown System',
      message: a.message,
      severity: a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'warning' : 'info',
      status: 'UNACKNOWLEDGED',
      timeTriggered: analysis.analyzedAt,
      assignedTo: 'Unassigned',
      slaState: a.severity === 'critical' ? 'breached' : 'active',
      slaRemaining: a.severity === 'critical' ? '-0h 15m' : '1h 30m',
      value: a.count + ' occurrences',
      threshold: 'Any',
      recommendedAction: a.repair || 'Investigate',
      history: [
        { time: analysis.analyzedAt, event: `Rule analyzer flagged ${a.code} via ingestion.` }
      ]
    }));
  }, [analysis]);

  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const critical = activeAlerts.filter((alert) => alert.severity === 'critical').length;
    const unassigned = activeAlerts.filter((alert) => alert.assignedTo === 'Unassigned').length;
    const breached = activeAlerts.filter((alert) => alert.slaState === 'breached').length;

    return [
      { label: 'Active alerts', value: activeAlerts.length, icon: Radio, tone: 'neutral' },
      { label: 'Critical', value: critical, icon: ShieldAlert, tone: 'critical' },
      { label: 'Unassigned', value: unassigned, icon: UserRoundCheck, tone: 'warning' },
      { label: 'SLA breached', value: breached, icon: Clock3, tone: 'danger' },
    ];
  }, []);

  const filteredAlerts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return activeAlerts.filter((alert) => {
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [alert.id, alert.type, alert.device, alert.system, alert.message, alert.assignedTo, alert.slaState]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [searchTerm, severityFilter, statusFilter]);

  const selectedAlert =
    filteredAlerts.find((alert) => alert.id === (selectedAlertId || activeAlerts[0]?.id)) ||
    filteredAlerts[0] ||
    null;

  const selectedSeverity = severityConfig[selectedAlert?.severity] || severityConfig.info;
  const SelectedSeverityIcon = selectedSeverity.icon;

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="alerts" />
      <div className="dashboard-main">
        <CommandHeader activePage="alerts" />

        <main className="alerts-page">
          <section className="alerts-heading">
            <div>
              <span className="alerts-kicker">
                <Bell size={15} />
                Alerts
              </span>
              <h1>Alert triage</h1>
              <p>Review live incidents, assign ownership, and keep SLA risk visible.</p>
            </div>
            <button type="button" className="alerts-primary-action" onClick={() => navigate('/reports')}>
              <Send size={17} />
              Send update
            </button>
          </section>

          <section className="alerts-summary" aria-label="Alert summary">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <article 
                  className={`alerts-stat is-${item.tone}`} 
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'Active alerts') {
                      setSeverityFilter('all');
                      setStatusFilter('all');
                      setSearchTerm('');
                    } else if (item.label === 'Critical') {
                      setSeverityFilter('critical');
                    } else if (item.label === 'Unassigned') {
                      setSearchTerm('Unassigned');
                    } else if (item.label === 'SLA breached') {
                      setSearchTerm('breached');
                    }
                  }}
                >
                  <span className="alerts-stat-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="alerts-workspace">
            <div className="alerts-list-panel">
              <div className="alerts-toolbar">
                <label className="alerts-search">
                  <Search size={16} />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search alerts"
                  />
                </label>

                <div className="alerts-filter-row" aria-label="Severity filters">
                  {severityOptions.map((option) => (
                    <button
                      type="button"
                      className={severityFilter === option ? 'active' : ''}
                      key={option}
                      onClick={() => setSeverityFilter(option)}
                    >
                      <Filter size={14} />
                      {option === 'all' ? 'All' : severityConfig[option].label}
                    </button>
                  ))}
                </div>

                <div className="alerts-status-row" aria-label="Status filters">
                  {statusOptions.map((option) => (
                    <button
                      type="button"
                      className={statusFilter === option ? 'active' : ''}
                      key={option}
                      onClick={() => setStatusFilter(option)}
                    >
                      {statusLabels[option]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="alerts-list" aria-label="Alert list">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => {
                    const config = severityConfig[alert.severity] || severityConfig.info;
                    const AlertIcon = config.icon;
                    const isSelected = selectedAlert?.id === alert.id;

                    return (
                      <button
                        type="button"
                        className={`alert-row is-${alert.severity} ${isSelected ? 'active' : ''}`}
                        key={alert.id}
                        onClick={() => setSelectedAlertId(alert.id)}
                      >
                        <span className="alert-row-icon">
                          <AlertIcon size={18} />
                        </span>
                        <span className="alert-row-main">
                          <span>
                            <strong>{alert.type}</strong>
                            <small>{alert.id}</small>
                          </span>
                          <em>{alert.system}</em>
                        </span>
                        <span className="alert-row-meta">
                          <strong>{alert.timeTriggered}</strong>
                          <small>{alert.status.replace('_', ' ')}</small>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="alerts-empty-state">
                    <CheckCircle2 size={22} />
                    <strong>No alerts match the current filters.</strong>
                    <span>Clear a filter or search for another device.</span>
                  </div>
                )}
              </div>
            </div>

            <aside className="alert-detail-panel" aria-label="Selected alert details">
              {selectedAlert ? (
                <>
                  <div className={`alert-detail-header is-${selectedAlert.severity}`}>
                    <span>
                      <SelectedSeverityIcon size={20} />
                    </span>
                    <div>
                      <small>{selectedAlert.id}</small>
                      <h2>{selectedAlert.type}</h2>
                      <p>{selectedAlert.message}</p>
                    </div>
                  </div>

                  <dl className="alert-detail-grid">
                    <div>
                      <dt>Device</dt>
                      <dd>{selectedAlert.device}</dd>
                    </div>
                    <div>
                      <dt>System</dt>
                      <dd>{selectedAlert.system}</dd>
                    </div>
                    <div>
                      <dt>Reading</dt>
                      <dd>{selectedAlert.value}</dd>
                    </div>
                    <div>
                      <dt>Threshold</dt>
                      <dd>{selectedAlert.threshold}</dd>
                    </div>
                    <div>
                      <dt>Owner</dt>
                      <dd>{selectedAlert.assignedTo}</dd>
                    </div>
                    <div>
                      <dt>SLA</dt>
                      <dd className={`sla-text is-${selectedAlert.slaState}`}>
                        {selectedAlert.slaRemaining}
                      </dd>
                    </div>
                  </dl>

                  <div className="alert-recommendation">
                    <span>Recommended next step</span>
                    <strong>{selectedAlert.recommendedAction}</strong>
                  </div>

                  <div className="alert-history">
                    <h3>Recent activity</h3>
                    <div className="timeline-track">
                      {selectedAlert.history.map((event) => (
                        <div key={`${event.time}-${event.event}`} className="timeline-event">
                          <div className="timeline-node"></div>
                          <div className="timeline-content">
                            <span>{event.time}</span>
                            <p>{event.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="alert-action-row">
                    <button 
                      type="button" 
                      onClick={() => setAcknowledgedIds(prev => new Set(prev).add(selectedAlert.id))}
                      style={acknowledgedIds.has(selectedAlert.id) ? { background: '#22c55e', borderColor: '#16a34a', color: '#fff' } : {}}
                      disabled={acknowledgedIds.has(selectedAlert.id)}
                    >
                      <CheckCircle2 size={16} />
                      {acknowledgedIds.has(selectedAlert.id) ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                    <button type="button" className="secondary" onClick={() => navigate('/users')}>
                      <UserRoundCheck size={16} />
                      Assign
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert-detail-empty">
                  <CheckCircle2 size={24} />
                  <strong>No alert selected</strong>
                  <span>Adjust the filters to show alert details.</span>
                </div>
              )}
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
