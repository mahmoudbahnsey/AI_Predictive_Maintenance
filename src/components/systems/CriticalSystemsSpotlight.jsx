import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Wrench, 
  X, 
  AlertOctagon, 
  RefreshCw, 
  ChevronDown
} from 'lucide-react';

// Custom Select Component for theme styling
function CustomSelect({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown size={14} className={`custom-select-caret ${isOpen ? 'open' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {options.map(opt => (
              <div 
                key={opt.value} 
                className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CriticalSystemsSpotlight({ fleetData }) {
  const [activeIncidentSystem, setActiveIncidentSystem] = useState(null);
  const [activeMaintenanceSystem, setActiveMaintenanceSystem] = useState(null);

  // Local dictionaries tracking states for each system
  const [incidents, setIncidents] = useState({}); // { systemId: ticketNumber }
  const [maintenance, setMaintenance] = useState({}); // { systemId: technicianName }

  // Form states for Incident Modal
  const [incidentSeverity, setIncidentSeverity] = useState('critical');
  const [incidentAssignee, setIncidentAssignee] = useState('wattson');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [isCreatingIncident, setIsCreatingIncident] = useState(false);

  // Form states for Maintenance Modal
  const [maintTech, setMaintTech] = useState('sarah');
  const [maintPriority, setMaintPriority] = useState('immediate');
  const [isAssigningMaint, setIsAssigningMaint] = useState(false);

  const criticalSystems = fleetData.filter(s => s.status === 'fault' || s.health < 60);

  if (criticalSystems.length === 0) {
    return null;
  }

  // Handle opening Incident Dialog
  const openIncidentDialog = (sys) => {
    setIncidentDesc(sys.faults.join(', ') || 'Critical hardware anomaly detected.');
    setIncidentSeverity('critical');
    setIncidentAssignee('wattson');
    setActiveIncidentSystem(sys);
  };

  // Handle Incident Submission
  const submitIncident = (e) => {
    e.preventDefault();
    setIsCreatingIncident(true);

    setTimeout(() => {
      const ticketNum = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
      setIncidents(prev => ({
        ...prev,
        [activeIncidentSystem.id]: ticketNum
      }));
      setIsCreatingIncident(false);
      setActiveIncidentSystem(null);
    }, 1200);
  };

  // Handle opening Maintenance Dialog
  const openMaintenanceDialog = (sys) => {
    setMaintTech(sys.id === 'tx-wind-solar' ? 'sarah' : sys.id === 'nv-solar-3' ? 'marcus' : 'elena');
    setMaintPriority('immediate');
    setActiveMaintenanceSystem(sys);
  };

  // Handle Maintenance Dispatch
  const submitMaintenance = (e) => {
    e.preventDefault();
    setIsAssigningMaint(true);

    setTimeout(() => {
      const techNames = {
        sarah: 'Sarah Connor (ETA 35m)',
        marcus: 'Marcus Vance (ETA 50m)',
        elena: 'Elena Rostova (ETA 1h 15m)'
      };
      
      setMaintenance(prev => ({
        ...prev,
        [activeMaintenanceSystem.id]: techNames[maintTech] || 'Field Tech Dispatched'
      }));
      setIsAssigningMaint(false);
      setActiveMaintenanceSystem(null);
    }, 1200);
  };

  // Options lists for selects
  const severityOptions = [
    { value: 'critical', label: 'CRITICAL (S1)' },
    { value: 'high', label: 'HIGH (S2)' },
    { value: 'medium', label: 'MEDIUM (S3)' }
  ];

  const assigneeOptions = [
    { value: 'wattson', label: 'Wattson AI Command' },
    { value: 'operator', label: 'Operations Manager' },
    { value: 'unassigned', label: 'Leave Unassigned' }
  ];

  const techOptions = [
    { value: 'sarah', label: 'Sarah Connor (Lead Wind Specialist)' },
    { value: 'marcus', label: 'Marcus Vance (Senior Solar Tech)' },
    { value: 'elena', label: 'Elena Rostova (Grid Electrician)' }
  ];

  const priorityOptions = [
    { value: 'immediate', label: 'IMMEDIATE DISPATCH (ETA < 30m)' },
    { value: 'urgent', label: 'URGENT CALLOUT (ETA < 2h)' },
    { value: 'scheduled', label: 'SCHEDULED PLAN (Next Shift)' }
  ];

  return (
    <>
      <motion.div 
        style={{
          marginTop: '24px',
          background: 'rgba(255, 77, 77, 0.03)',
          border: '1px solid rgba(255, 77, 77, 0.15)',
          borderRadius: '8px',
          padding: '24px'
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldAlert size={20} color="var(--color-critical)" />
          <h2 style={{ fontSize: '18px', margin: 0, color: '#fff', fontWeight: 800 }}>Critical Systems Spotlight</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {criticalSystems.map(sys => {
            const hasIncident = incidents[sys.id];
            const hasMaint = maintenance[sys.id];

            return (
              <div 
                key={sys.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: '18px 20px', 
                  borderRadius: '8px', 
                  borderLeft: '4px solid var(--color-critical)',
                  border: '1px solid rgba(255, 77, 77, 0.08)',
                  borderLeftColor: 'var(--color-critical)'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {sys.name} 
                    <span style={{ fontSize: '11px', color: '#5a6b63', fontFamily: 'monospace', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                      {sys.id.toUpperCase()}
                    </span>
                  </h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12.5px', color: '#8A9A8F' }}>
                    {sys.faults.join(', ') || 'System requires operator inspection'}
                  </p>
                  
                  {/* Interactive Status Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {hasIncident && (
                      <div className="spotlight-status-tag incident">
                        <AlertOctagon size={11} style={{ marginRight: '4px' }} /> Incident Active: {hasIncident}
                      </div>
                    )}
                    {hasMaint && (
                      <div className="spotlight-status-tag maintenance">
                        <Wrench size={11} style={{ marginRight: '4px' }} /> Dispatch: {hasMaint}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Open Incident Button */}
                  <button 
                    className="cyber-btn accent"
                    disabled={hasIncident}
                    style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase' }}
                    onClick={() => openIncidentDialog(sys)}
                  >
                    {hasIncident ? 'Incident Active' : 'Open Incident'}
                  </button>

                  {/* Assign Maintenance Button */}
                  <button 
                    className="cyber-btn primary"
                    disabled={hasMaint}
                    style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase' }}
                    onClick={() => openMaintenanceDialog(sys)}
                  >
                    <Wrench size={11} style={{ marginRight: '4px' }} /> 
                    {hasMaint ? 'Crew Assigned' : 'Assign Maintenance'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 1. Open Incident Modal */}
      <AnimatePresence>
        {activeIncidentSystem && (
          <div 
            className="investigate-overlay"
            onClick={() => {
              if (!isCreatingIncident) setActiveIncidentSystem(null);
            }}
          >
            <motion.div 
              className="investigate-modal small"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="investigate-modal-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.15)' }}>
                <h3>
                  <AlertOctagon size={16} color="var(--color-critical)" />
                  Open Incident: {activeIncidentSystem.name}
                </h3>
                <button 
                  className="investigate-modal-close" 
                  disabled={isCreatingIncident}
                  onClick={() => setActiveIncidentSystem(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={submitIncident} style={{ padding: '24px' }}>
                <div className="cyber-form-group">
                  <label className="cyber-form-label">Incident Title</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    disabled 
                    value={`[EMERGENCY] System Fault Event - ${activeIncidentSystem.name}`}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                    <label className="cyber-form-label" style={{ marginBottom: '6px' }}>Severity Level</label>
                    <CustomSelect 
                      options={severityOptions}
                      value={incidentSeverity}
                      onChange={setIncidentSeverity}
                      disabled={isCreatingIncident}
                    />
                  </div>

                  <div className="cyber-form-group" style={{ marginBottom: 0 }}>
                    <label className="cyber-form-label" style={{ marginBottom: '6px' }}>Assignee Owner</label>
                    <CustomSelect 
                      options={assigneeOptions}
                      value={incidentAssignee}
                      onChange={setIncidentAssignee}
                      disabled={isCreatingIncident}
                    />
                  </div>
                </div>

                <div className="cyber-form-group">
                  <label className="cyber-form-label">Fault Description & Telemetry</label>
                  <textarea 
                    className="cyber-input"
                    rows={3}
                    style={{ resize: 'none', fontFamily: 'monospace', fontSize: '12px' }}
                    value={incidentDesc}
                    onChange={(e) => setIncidentDesc(e.target.value)}
                    disabled={isCreatingIncident}
                    required
                  />
                </div>

                <div className="modal-action-row">
                  <button 
                    type="button" 
                    className="cyber-btn"
                    disabled={isCreatingIncident}
                    onClick={() => setActiveIncidentSystem(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="cyber-btn accent"
                    disabled={isCreatingIncident}
                  >
                    {isCreatingIncident ? (
                      <>
                        <RefreshCw size={14} className="cyber-btn-spinner" /> Creating ticket...
                      </>
                    ) : (
                      'Open Incident Ticket'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Assign Maintenance Modal */}
      <AnimatePresence>
        {activeMaintenanceSystem && (
          <div 
            className="investigate-overlay"
            onClick={() => {
              if (!isAssigningMaint) setActiveMaintenanceSystem(null);
            }}
          >
            <motion.div 
              className="investigate-modal small"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="investigate-modal-header" style={{ borderBottomColor: 'rgba(212, 175, 55, 0.15)' }}>
                <h3>
                  <Wrench size={16} color="var(--color-warning)" />
                  Assign Maintenance: {activeMaintenanceSystem.name}
                </h3>
                <button 
                  className="investigate-modal-close" 
                  disabled={isAssigningMaint}
                  onClick={() => setActiveMaintenanceSystem(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={submitMaintenance} style={{ padding: '24px' }}>
                <div className="cyber-form-group">
                  <label className="cyber-form-label">System Target ID</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    disabled 
                    value={`${activeMaintenanceSystem.name} (${activeMaintenanceSystem.id.toUpperCase()})`}
                  />
                </div>

                <div className="cyber-form-group">
                  <label className="cyber-form-label" style={{ marginBottom: '6px' }}>Select Field Technician</label>
                  <CustomSelect 
                    options={techOptions}
                    value={maintTech}
                    onChange={setMaintTech}
                    disabled={isAssigningMaint}
                  />
                </div>

                <div className="cyber-form-group">
                  <label className="cyber-form-label" style={{ marginBottom: '6px' }}>Dispatch Urgency</label>
                  <CustomSelect 
                    options={priorityOptions}
                    value={maintPriority}
                    onChange={setMaintPriority}
                    disabled={isAssigningMaint}
                  />
                </div>

                <div className="modal-action-row">
                  <button 
                    type="button" 
                    className="cyber-btn"
                    disabled={isAssigningMaint}
                    onClick={() => setActiveMaintenanceSystem(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="cyber-btn success"
                    disabled={isAssigningMaint}
                  >
                    {isAssigningMaint ? (
                      <>
                        <RefreshCw size={14} className="cyber-btn-spinner" /> Routing crew...
                      </>
                    ) : (
                      'Dispatch Technician'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
