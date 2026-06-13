import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import '../../styles/settings.css';
import { initialSettingsState } from '../../data/mockSettingsData';

import PlatformControlNexusHero from '../../components/settings/PlatformControlNexusHero';
import ConfigurationCommandRail from '../../components/settings/ConfigurationCommandRail';
import AccountIdentitySettings from '../../components/settings/AccountIdentitySettings';
import AppearanceInterfaceControl from '../../components/settings/AppearanceInterfaceControl';
import NotificationDefaultsCenter from '../../components/settings/NotificationDefaultsCenter';
import UnitsLimitsThresholdControl from '../../components/settings/UnitsLimitsThresholdControl';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  // Intersection Observer for tracking scroll position
  const sections = ['account', 'workspace', 'monitoring', 'thresholds', 'notifications', 'datasync', 'integrations', 'appearance', 'backup', 'security', 'advanced', 'audit'];
  
  const handleInputChange = () => {
    setUnsavedChanges(prev => prev + 1);
  };

  const handleSaveAttempt = () => {
    if (unsavedChanges > 3) {
      setShowDiff(true); // Require review for major changes
    } else {
      setUnsavedChanges(0);
      setPendingSave(true);
      setTimeout(() => setPendingSave(false), 2000);
    }
  };

  const handleConfirmDiff = () => {
    setShowDiff(false);
    setUnsavedChanges(0);
    setPendingSave(true);
    setTimeout(() => setPendingSave(false), 2000);
  };

  const handleSectionSelect = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="settings" />
      <div className="dashboard-main">
        <CommandHeader activePage="settings" />
        
        <main className="settings-page-wrapper">
          <PlatformControlNexusHero />

          <div className="settings-layout-split">
            {/* Sticky Left Rail */}
            <div style={{ position: 'relative' }}>
              <ConfigurationCommandRail 
                activeSection={activeSection} 
                onSelect={handleSectionSelect} 
                unsavedCount={unsavedChanges}
              />
            </div>

            {/* Right Content Area */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '600px' }}
            >
              {activeSection === 'account' && <AccountIdentitySettings onChange={handleInputChange} />}
              {activeSection === 'appearance' && <AppearanceInterfaceControl onChange={handleInputChange} />}
              {activeSection === 'notifications' && <NotificationDefaultsCenter onChange={handleInputChange} />}
              {activeSection === 'thresholds' && <UnitsLimitsThresholdControl onChange={handleInputChange} />}
            </motion.div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
