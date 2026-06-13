import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { ref, onValue, set, remove } from 'firebase/database';
import { db } from '../../config/firebase';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import { mockFleetData, mockInsights } from '../../data/mockFleetData';
import '../../styles/systems.css';

import SystemsCommandHero from '../../components/systems/SystemsCommandHero';
import FleetKpiMatrix from '../../components/systems/FleetKpiMatrix';
import LiveSystemNetworkMap from '../../components/systems/LiveSystemNetworkMap';
import PriorityCommandPanel from '../../components/systems/PriorityCommandPanel';
import FleetHealthRadar from '../../components/systems/FleetHealthRadar';
import AiFleetInsights from '../../components/systems/AiFleetInsights';
import CriticalSystemsSpotlight from '../../components/systems/CriticalSystemsSpotlight';
import SystemCardsGrid from '../../components/systems/SystemCardsGrid';

import SystemDiagnosticsModal from '../../components/systems/SystemDiagnosticsModal';
import SystemDetailsModal from '../../components/systems/SystemDetailsModal';

export default function SystemsPage() {
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDiagSystem, setActiveDiagSystem] = useState(null);
  const [activeDetailSystem, setActiveDetailSystem] = useState(null);
  
  // Add System Form Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState('online');
  const [newHealth, setNewHealth] = useState(100);
  const [newPower, setNewPower] = useState(1000);
  const [newEnergy, setNewEnergy] = useState(10);

  // Sync systems with Firebase Realtime Database
  useEffect(() => {
    const systemsRef = ref(db, 'systems');
    const unsubscribe = onValue(systemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let list = [];
        if (Array.isArray(data)) {
          list = data.filter(Boolean);
        } else {
          list = Object.keys(data).map(key => ({
            ...data[key],
            id: key
          }));
        }
        setFleetData(list);
      } else {
        // Seeding database with default mock fleet data (4 systems)
        const seedData = {};
        mockFleetData.forEach(sys => {
          seedData[sys.id] = sys;
        });
        set(systemsRef, seedData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read error on /systems: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const total = fleetData.length;
    if (total === 0) {
      return { total: 0, online: 0, warning: 0, fault: 0, offline: 0, avgHealth: 0 };
    }
    const online = fleetData.filter(s => s.status === 'online').length;
    const warning = fleetData.filter(s => s.status === 'warning').length;
    const fault = fleetData.filter(s => s.status === 'fault').length;
    const offline = fleetData.filter(s => s.status === 'offline').length;
    const avgHealth = Math.round(fleetData.reduce((acc, s) => acc + s.health, 0) / total);
    
    return { total, online, warning, fault, offline, avgHealth };
  }, [fleetData]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newLocation) return;

    const newId = 'SYS-' + Math.floor(100 + Math.random() * 900);
    const systemPayload = {
      id: newId,
      name: newName,
      location: newLocation,
      status: newStatus,
      health: Number(newHealth),
      currentPower: Number(newPower),
      todayEnergy: Number(newEnergy),
      activeAlerts: newStatus === 'fault' ? 2 : newStatus === 'warning' ? 1 : 0,
      aiStatus: newStatus === 'online' ? 'ready' : newStatus === 'warning' ? 'analyzing' : newStatus === 'fault' ? 'failed' : 'offline',
      riskLevel: newStatus === 'fault' ? 'high' : newStatus === 'warning' ? 'medium' : 'low',
      lastUpdated: new Date().toISOString(),
      devices: Math.floor(4 + Math.random() * 12),
      faults: newStatus === 'fault' ? ['F1 - Hardware Anomaly Alert'] : newStatus === 'warning' ? ['F3 - Minor Sensor Deviation'] : []
    };

    try {
      const systemRef = ref(db, `systems/${newId}`);
      await set(systemRef, systemPayload);
      
      // Reset form
      setNewName('');
      setNewLocation('');
      setNewStatus('online');
      setNewHealth(100);
      setNewPower(1000);
      setNewEnergy(10);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding system: ", error);
    }
  };

  const handleDeleteSystem = async (systemId) => {
    if (window.confirm(`Are you sure you want to delete ${systemId}?`)) {
      try {
        const systemRef = ref(db, `systems/${systemId}`);
        await remove(systemRef);
      } catch (error) {
        console.error("Error deleting system: ", error);
      }
    }
  };

  // Sync activeDiagSystem if it's currently open and the status changes (e.g. on reset)
  const syncDiagSystem = activeDiagSystem 
    ? fleetData.find(sys => sys.id === activeDiagSystem.id) 
    : null;

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="systems" />
      <div className="dashboard-main">
        <CommandHeader activePage="systems" />
        
        <main className="systems-page-wrapper">
          {loading ? (
            <div className="identity-loading-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)' }}>
              Loading Solar Systems Command...
            </div>
          ) : (
            <>
              <SystemsCommandHero stats={stats} />
              
              <FleetKpiMatrix stats={stats} />

              <div className="sys-grid-2">
                <LiveSystemNetworkMap fleetData={fleetData} />
                <PriorityCommandPanel 
                  fleetData={fleetData} 
                  onInvestigate={(sys) => setActiveDiagSystem(sys)} 
                />
              </div>

              <div className="sys-grid-2">
                <FleetHealthRadar fleetData={fleetData} />
                <AiFleetInsights insights={mockInsights} />
              </div>

              <CriticalSystemsSpotlight fleetData={fleetData} />

              <SystemCardsGrid 
                fleetData={fleetData} 
                onDiagnostics={(sys) => setActiveDiagSystem(sys)}
                onViewDetails={(sys) => setActiveDetailSystem(sys)}
                onAddSystem={() => setIsAddModalOpen(true)}
                onDeleteSystem={handleDeleteSystem}
              />
            </>
          )}

        </main>
      </div>

      {/* Diagnostics Cockpit Modal */}
      <SystemDiagnosticsModal 
        system={syncDiagSystem || activeDiagSystem} 
        onClose={() => setActiveDiagSystem(null)} 
        setFleetData={setFleetData} 
      />

      {/* Configuration Detail Ledger Modal */}
      <SystemDetailsModal 
        system={activeDetailSystem} 
        onClose={() => setActiveDetailSystem(null)} 
      />

      {/* Commission System Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="investigate-overlay" onClick={() => setIsAddModalOpen(false)}>
            <motion.div 
              className="investigate-modal small"
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="investigate-modal-header" style={{ borderBottomColor: 'rgba(212, 175, 55, 0.15)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} color="var(--gold)" />
                  Commission New Solar System
                </h3>
                <button 
                  className="investigate-modal-close" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="cyber-form-group">
                  <label className="cyber-form-label">System Name</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. VoltIQ Solar Array A-1" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="cyber-form-group">
                  <label className="cyber-form-label">Geographic Location / Tag</label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. Rooftop Lab, Simulation Env" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="cyber-form-group">
                    <label className="cyber-form-label">Initial Status</label>
                    <select 
                      className="cyber-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="online">Online</option>
                      <option value="warning">Warning</option>
                      <option value="fault">Fault</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>

                  <div className="cyber-form-group">
                    <label className="cyber-form-label">System Health (%)</label>
                    <input 
                      type="number" 
                      className="cyber-input" 
                      min="0"
                      max="100"
                      value={newHealth}
                      onChange={(e) => setNewHealth(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="cyber-form-group">
                    <label className="cyber-form-label">Current Power (W)</label>
                    <input 
                      type="number" 
                      className="cyber-input" 
                      min="0"
                      value={newPower}
                      onChange={(e) => setNewPower(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="cyber-form-group">
                    <label className="cyber-form-label">Today's Energy (kWh)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="cyber-input" 
                      min="0"
                      value={newEnergy}
                      onChange={(e) => setNewEnergy(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="modal-action-row" style={{ marginTop: '12px' }}>
                  <button 
                    type="button" 
                    className="cyber-btn"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="cyber-btn primary"
                  >
                    Commission System
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
