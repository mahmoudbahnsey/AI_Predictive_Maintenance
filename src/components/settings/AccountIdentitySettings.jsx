import { motion } from 'framer-motion';
import { initialSettingsState } from '../../data/mockSettingsData';

import { useState } from 'react';
import SettingsDropdown from './SettingsDropdown';

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (GMT)' },
  { value: 'UTC-8', label: 'UTC-8 (Pacific Time)' },
  { value: 'UTC+4', label: 'UTC+4 (Dubai)' },
];

export default function AccountIdentitySettings({ onChange }) {
  const { account } = initialSettingsState;
  const [timezone, setTimezone] = useState('UTC');

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <h2 className="cfg-title">Account & Profile</h2>
      
      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Display Name</label>
          <input type="text" className="cfg-input" defaultValue={account.name} onChange={onChange} />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Email Address</label>
          <input type="email" className="cfg-input" defaultValue={account.email} disabled />
          <span style={{ fontSize: '10px', color: '#a3b3aa', marginTop: '4px', display: 'block' }}>Email cannot be changed directly. Contact IT.</span>
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Role</label>
          <input type="text" className="cfg-input" defaultValue={account.role} disabled />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Time Zone</label>
          <SettingsDropdown 
            options={timezoneOptions} 
            value={timezone} 
            onChange={(val) => {
              setTimezone(val);
              onChange();
            }} 
          />
        </div>
      </div>
    </motion.div>
  );
}
