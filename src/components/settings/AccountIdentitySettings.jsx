import { motion } from 'framer-motion';
import { useState } from 'react';
import SettingsDropdown from './SettingsDropdown';
import { useAuth } from '../../hooks/useAuth';

const timezoneOptions = [
  { value: 'UTC-12', label: 'UTC-12' },
  { value: 'UTC-11', label: 'UTC-11' },
  { value: 'UTC-10', label: 'UTC-10 (Hawaii)' },
  { value: 'UTC-9:30', label: 'UTC-9:30' },
  { value: 'UTC-9', label: 'UTC-9 (Alaska)' },
  { value: 'UTC-8', label: 'UTC-8 (Pacific Time)' },
  { value: 'UTC-7', label: 'UTC-7 (Mountain Time)' },
  { value: 'UTC-6', label: 'UTC-6 (Central Time)' },
  { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
  { value: 'UTC-4', label: 'UTC-4 (Atlantic)' },
  { value: 'UTC-3:30', label: 'UTC-3:30' },
  { value: 'UTC-3', label: 'UTC-3 (Brasília)' },
  { value: 'UTC-2', label: 'UTC-2' },
  { value: 'UTC-1', label: 'UTC-1 (Azores)' },
  { value: 'UTC', label: 'UTC (GMT)' },
  { value: 'UTC+1', label: 'UTC+1 (Central European)' },
  { value: 'UTC+2', label: 'UTC+2 (South Africa)' },
  { value: 'UTC+3', label: 'UTC+3 (Moscow)' },
  { value: 'UTC+3:30', label: 'UTC+3:30 (Iran)' },
  { value: 'UTC+4', label: 'UTC+4 (Dubai)' },
  { value: 'UTC+4:30', label: 'UTC+4:30 (Afghanistan)' },
  { value: 'UTC+5', label: 'UTC+5 (Pakistan)' },
  { value: 'UTC+5:30', label: 'UTC+5:30 (India)' },
  { value: 'UTC+5:45', label: 'UTC+5:45 (Nepal)' },
  { value: 'UTC+6', label: 'UTC+6 (Bangladesh)' },
  { value: 'UTC+6:30', label: 'UTC+6:30 (Myanmar)' },
  { value: 'UTC+7', label: 'UTC+7 (Bangkok)' },
  { value: 'UTC+8', label: 'UTC+8 (China / Singapore)' },
  { value: 'UTC+8:45', label: 'UTC+8:45' },
  { value: 'UTC+9', label: 'UTC+9 (Japan / Korea)' },
  { value: 'UTC+9:30', label: 'UTC+9:30 (Central Australia)' },
  { value: 'UTC+10', label: 'UTC+10 (Sydney)' },
  { value: 'UTC+10:30', label: 'UTC+10:30' },
  { value: 'UTC+11', label: 'UTC+11' },
  { value: 'UTC+12', label: 'UTC+12 (New Zealand)' },
  { value: 'UTC+12:45', label: 'UTC+12:45 (Chatham)' },
  { value: 'UTC+13', label: 'UTC+13 (Tonga)' },
  { value: 'UTC+14', label: 'UTC+14 (Kiritimati)' },
];

export default function AccountIdentitySettings({ onChange, userProfile, user }) {
  // Always prefer REAL data from Firebase Auth + Realtime profile (synced live)
  const displayName = userProfile?.displayName || user?.displayName || 'VoltIQ Operator';
  const email = userProfile?.email || user?.email || '';
  const role = (userProfile?.role || 'user').toUpperCase();

  const [timezone, setTimezone] = useState(() => localStorage.getItem('voltiq-timezone') || 'UTC-8');
  const [editingName, setEditingName] = useState(displayName);

  const { updateDisplayName } = useAuth();

  const handleNameChange = (e) => {
    setEditingName(e.target.value);
    if (onChange) onChange();
  };

  // Persist to BOTH Auth + DB via context (so name updates header + everywhere immediately and forever)
  const saveNameToProfile = async () => {
    if (!editingName || editingName === displayName) return;
    const success = await updateDisplayName(editingName);
    if (success && onChange) onChange();
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <h2 className="cfg-title">Account & Profile</h2>
      <p style={{ color: '#a8b5ae', fontSize: '12px', marginTop: '-8px', marginBottom: '16px' }}>
        Data loaded live from Firebase Authentication + Realtime Database user profile.
      </p>
      
      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Display Name</label>
          <input 
            type="text" 
            className="cfg-input" 
            value={editingName} 
            onChange={handleNameChange} 
            onBlur={saveNameToProfile}
          />
          <span style={{ fontSize: '10px', color: '#a3b3aa', marginTop: '4px', display: 'block' }}>Updates your profile across VoltIQ instantly (persisted).</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Email Address</label>
          <input type="email" className="cfg-input" value={email} disabled />
          <span style={{ fontSize: '10px', color: '#a3b3aa', marginTop: '4px', display: 'block' }}>Email cannot be changed directly. Contact IT.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Role</label>
          <input type="text" className="cfg-input" value={role} disabled />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Time Zone</label>
          <SettingsDropdown 
            options={timezoneOptions} 
            value={timezone} 
            onChange={(val) => {
              setTimezone(val);
              localStorage.setItem('voltiq-timezone', val);
              window.dispatchEvent(new CustomEvent('voltiq-timezone-change', { detail: { timezone: val } }));
              // Note: no global unsaved bump — TZ is a personal preference; the save bar is for platform config only
            }} 
            searchable={true}
            placeholder="Search time zones (enter numbers like -8, +4)..."
          />
        </div>
      </div>
    </motion.div>
  );
}
