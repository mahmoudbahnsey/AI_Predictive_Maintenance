import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import '../../styles/settings.css';
import { initialSettingsState } from '../../data/mockSettingsData';

import PlatformControlNexusHero from '../../components/settings/PlatformControlNexusHero';
import ConfigurationCommandRail from '../../components/settings/ConfigurationCommandRail';
import AccountIdentitySettings from '../../components/settings/AccountIdentitySettings';
import NotificationDefaultsCenter from '../../components/settings/NotificationDefaultsCenter';
import UnitsLimitsThresholdControl from '../../components/settings/UnitsLimitsThresholdControl';
import MonitoringBehaviorConsole from '../../components/settings/MonitoringBehaviorConsole';
import SecurityPreferenceLayer from '../../components/settings/SecurityPreferenceLayer';
import UnsavedChangesReviewBar from '../../components/settings/UnsavedChangesReviewBar';
import ConfigurationDiffReview from '../../components/settings/ConfigurationDiffReview';

export default function SettingsPage() {
  const { user, userProfile, isAdmin, logAction: authLogAction } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [pendingDiffs, setPendingDiffs] = useState([]);

  // Real persisted data (loaded from Firebase). Always authoritative for the whole page.
  const [realThresholds, setRealThresholds] = useState(initialSettingsState.thresholds);
  const [realNotifications, setRealNotifications] = useState(initialSettingsState.notifications);
  const [realMonitoring, setRealMonitoring] = useState(initialSettingsState.monitoring || { showVoltage: true, showTemp: true, showAI: true, animations: true });
  const [realSecurity, setRealSecurity] = useState(initialSettingsState.security || { sessionTimeout: 60, requireConfirmation: true, auditLogging: true });
  const [lastLoaded, setLastLoaded] = useState(null);

  // Baselines capture the last *saved* values (from load or post-save) so we can compute true diffs.
  // These stay stable during an edit session; updated on first user change (snapshot) and on clean loads/saves.
  const [baselineThresholds, setBaselineThresholds] = useState(initialSettingsState.thresholds);
  const [baselineMonitoring, setBaselineMonitoring] = useState(initialSettingsState.monitoring || { showVoltage: true, showTemp: true, showAI: true, animations: true });
  const [baselineSecurity, setBaselineSecurity] = useState(initialSettingsState.security || { sessionTimeout: 60, requireConfirmation: true, auditLogging: true });
  const [baselineNotifications, setBaselineNotifications] = useState(initialSettingsState.notifications);

  const unsavedCountRef = useRef(0);

  // Load REAL global settings + user personal settings from Firebase (live)
  useEffect(() => {
    if (!user?.uid) return;

    const unsubs = [];

    // Global / platform settings (admin writable)
    const settingsRef = ref(db, 'settings');
    unsubs.push(onValue(settingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      if (data.thresholds) {
        const loadedT = { ...initialSettingsState.thresholds, ...data.thresholds };
        setRealThresholds(loadedT);
        if (unsavedCountRef.current === 0) setBaselineThresholds(loadedT);
      }
      if (data.monitoring) {
        const loadedM = { ...initialSettingsState.monitoring, ...data.monitoring };
        setRealMonitoring(loadedM);
        if (unsavedCountRef.current === 0) setBaselineMonitoring(loadedM);
      }
      if (data.security) {
        const loadedS = { ...initialSettingsState.security, ...data.security };
        setRealSecurity(loadedS);
        if (unsavedCountRef.current === 0) setBaselineSecurity(loadedS);
      }
      if (data.notifications) {
        const loadedN = { ...initialSettingsState.notifications, ...data.notifications };
        setRealNotifications(loadedN);
        if (unsavedCountRef.current === 0) setBaselineNotifications(loadedN);
      }
      setLastLoaded(new Date());
    }, (err) => console.warn('Global settings load failed:', err)));

    // Per-user settings (self or admin writable) - for notifications etc if split, but we merge for simplicity
    const userSettingsRef = ref(db, `userSettings/${user.uid}`);
    unsubs.push(onValue(userSettingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      if (data.notifications) {
        setRealNotifications(prev => {
          const merged = { ...prev, ...data.notifications };
          if (unsavedCountRef.current === 0) {
            setBaselineNotifications(merged);
          }
          return merged;
        });
      }
      // Can extend for appearance prefs etc.
      setLastLoaded(new Date());
    }, (err) => console.warn('User settings load failed:', err)));

    return () => unsubs.forEach(u => u && u());

  }, [user?.uid, isAdmin]);

  const handleInputChange = () => {
    const currentCount = unsavedCountRef.current;
    if (currentCount === 0) {
      // First change in this edit session: snapshot the *current* real values (which are the last saved / loaded)
      // as the true "old" baselines for diff review.
      setBaselineThresholds(realThresholds);
      setBaselineMonitoring(realMonitoring);
      setBaselineSecurity(realSecurity);
      setBaselineNotifications(realNotifications);
    }
    const newCount = currentCount + 1;
    unsavedCountRef.current = newCount;
    setUnsavedChanges(newCount);
  };

  // Smart persist: global settings for platform-wide (thresholds, monitoring, security), userSettings for personal
  const persistRealSettings = async (globalPartial = {}, userPartial = {}) => {
    try {
      if (Object.keys(globalPartial).length > 0 && isAdmin) {
        await update(ref(db, 'settings'), { ...globalPartial, lastUpdated: Date.now(), updatedBy: userProfile?.email || user?.email });
      }
      if (Object.keys(userPartial).length > 0 && user?.uid) {
        await update(ref(db, `userSettings/${user.uid}`), { ...userPartial, lastUpdated: Date.now() });
      }

      const doLog = authLogAction || (async (action, details) => console.log('[settings] logged', action, details));
      await doLog('update_settings', { global: Object.keys(globalPartial), user: Object.keys(userPartial), by: userProfile?.email || user?.email });
    } catch (e) {
      console.error('Failed to persist settings to Firebase:', e);
    }
  };

  const buildRealDiffs = () => {
    const d = [];
    // Compute *actual* diffs using baselines (pre-edit saved values) vs current live editing state.
    // Only include fields that truly changed. This prevents bogus "65 → 65" reviews.
    const baseT = baselineThresholds || initialSettingsState.thresholds;
    const currT = realThresholds || {};
    if (String(baseT.tempWarning) !== String(currT.tempWarning)) {
      d.push({
        setting: 'High Temp Warning (°C)',
        old: String(baseT.tempWarning),
        new: String(currT.tempWarning),
        type: (currT.tempWarning >= 70 ? 'danger' : 'warning')
      });
    }
    if (String(baseT.tempCritical) !== String(currT.tempCritical)) {
      d.push({
        setting: 'High Temp Critical (°C)',
        old: String(baseT.tempCritical),
        new: String(currT.tempCritical),
        type: 'danger'
      });
    }
    const baseM = baselineMonitoring || initialSettingsState.monitoring;
    const currM = realMonitoring || {};
    if (baseM && currM && (baseM.showAI !== currM.showAI)) {
      d.push({
        setting: 'Show AI Confidence Scores',
        old: baseM.showAI ? 'On' : 'Off',
        new: currM.showAI ? 'On' : 'Off',
        type: 'warning'
      });
    }
    const baseS = baselineSecurity || initialSettingsState.security;
    const currS = realSecurity || {};
    if (baseS && currS && String(baseS.sessionTimeout ?? 60) !== String(currS.sessionTimeout)) {
      d.push({
        setting: 'Session Timeout (min)',
        old: String(baseS.sessionTimeout ?? 60),
        new: String(currS.sessionTimeout),
        type: 'warning'
      });
    }
    return d;
  };

  // Centralized save that also promotes current values to new baselines and clears dirty state.
  const performSave = () => {
    const globalPayload = { thresholds: realThresholds, monitoring: realMonitoring, security: realSecurity };
    const userPayload = { notifications: realNotifications };
    persistRealSettings(globalPayload, userPayload);
    // Current reals are now saved -> become the baselines for next edit session
    setBaselineThresholds(realThresholds);
    setBaselineMonitoring(realMonitoring);
    setBaselineSecurity(realSecurity);
    setBaselineNotifications(realNotifications);
    unsavedCountRef.current = 0;
    setUnsavedChanges(0);
  };

  // Direct save from the primary bar button: always just save without interposing the review/diff modal.
  // "Review" button is the one that shows the change summary when the user wants it.
  const handleBarSave = () => {
    performSave();
  };

  const handleConfirmDiff = () => {
    setShowDiff(false);
    performSave();
  };

  const handleSectionSelect = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update handlers for real state (value set + count bump)
  const updateThresholds = (newThresholds) => { setRealThresholds(newThresholds); handleInputChange(); };
  const updateNotifications = (newNotifs) => { setRealNotifications(newNotifs); handleInputChange(); };
  const updateMonitoring = (newMon) => { setRealMonitoring(newMon); handleInputChange(); };
  const updateSecurity = (newSec) => { setRealSecurity(newSec); handleInputChange(); };

  const handleDiscard = () => {
    // Revert live editing state back to the captured baselines so UI reflects pre-edit saved values
    if (baselineThresholds) setRealThresholds(baselineThresholds);
    if (baselineMonitoring) setRealMonitoring(baselineMonitoring);
    if (baselineSecurity) setRealSecurity(baselineSecurity);
    if (baselineNotifications) setRealNotifications(baselineNotifications);
    unsavedCountRef.current = 0;
    setUnsavedChanges(0);
  };

  // Purposeful action for the "Review" button in the unsaved bar:
  // Opens the Configuration Diff Review (if there are real material diffs to show).
  // This gives the button a clear, strong purpose instead of being decorative.
  const reviewPendingChanges = () => {
    const actualDiffs = buildRealDiffs();
    setPendingDiffs(actualDiffs);
    if (actualDiffs.length > 0) {
      setShowDiff(true);
    } else {
      // Nothing critical changed (user may have edited fields back to original or only touched non-review fields).
      // Clear the bar to remove phantom "unsaved" state — the Save path already handles this too.
      unsavedCountRef.current = 0;
      setUnsavedChanges(0);
    }
  };

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="settings" />
      <div className="dashboard-main">
        <CommandHeader activePage="settings" />
        
        <main className="settings-page-wrapper">
          <PlatformControlNexusHero lastLoaded={lastLoaded} isAdmin={isAdmin} />

          <div className="settings-layout-split">
            {/* Sticky Left Rail - now with more real sections */}
            <div style={{ position: 'relative' }}>
              <ConfigurationCommandRail 
                activeSection={activeSection} 
                onSelect={handleSectionSelect} 
              />
            </div>

            {/* Right Content Area - always fed real data from Firebase listeners */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '600px' }}
            >
              {activeSection === 'account' && (
                <AccountIdentitySettings 
                  userProfile={userProfile}
                  user={user}
                />
              )}
              {activeSection === 'notifications' && (
                <NotificationDefaultsCenter 
                  onChange={handleInputChange} 
                  notifications={realNotifications}
                  onUpdateNotifications={updateNotifications}
                />
              )}
              {activeSection === 'thresholds' && (
                <UnitsLimitsThresholdControl 
                  onChange={handleInputChange} 
                  thresholds={realThresholds}
                  onUpdateThresholds={updateThresholds}
                  isAdmin={isAdmin}
                />
              )}
              {activeSection === 'monitoring' && (
                <MonitoringBehaviorConsole 
                  onChange={handleInputChange} 
                  monitoring={realMonitoring}
                  onUpdateMonitoring={updateMonitoring}
                />
              )}
              {activeSection === 'security' && (
                <SecurityPreferenceLayer 
                  onChange={handleInputChange} 
                  security={realSecurity}
                  onUpdateSecurity={updateSecurity}
                />
              )}
            </motion.div>
          </div>

          {/* Real unsaved bar and diff review for complete flow (counter removed from bar) */}
          {unsavedChanges > 0 && (
            <UnsavedChangesReviewBar 
              onSave={handleBarSave} 
              onDiscard={handleDiscard} 
              onReview={reviewPendingChanges}
            />
          )}

          {showDiff && pendingDiffs && pendingDiffs.length > 0 && (
            <ConfigurationDiffReview 
              diffs={pendingDiffs}
              onConfirm={handleConfirmDiff} 
              onCancel={() => setShowDiff(false)} 
            />
          )}
          
        </main>
      </div>
    </div>
  );
}
