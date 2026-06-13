// e:\VoltIQ\src\data\mockSettingsData.js

export const initialSettingsState = {
  account: {
    name: "Admin User",
    email: "admin@voltiq.com",
    role: "Administrator",
    timezone: "UTC-8 (Pacific Time)",
    dateFormat: "YYYY-MM-DD"
  },
  workspace: {
    name: "VoltIQ Enterprise",
    mode: "Standard",
    refreshInterval: 5000,
    compactMode: false
  },
  monitoring: {
    showVoltage: true,
    showTemp: true,
    showAI: true,
    animations: true
  },
  thresholds: {
    tempWarning: 65,
    tempCritical: 85,
    voltWarning: 110,
    offlineTimeout: 15
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    dailySummary: true
  },
  sync: {
    firebaseConnected: true,
    autoSync: true,
    syncInterval: 30
  },
  security: {
    sessionTimeout: 60,
    requireConfirmation: true,
    auditLogging: true
  },
  advanced: {
    maintenanceMode: false,
    debugMode: false,
    apiRetry: 3
  }
};

export const integrationStatus = [
  { name: "Firebase Realtime DB", status: "CONNECTED", type: "Core Database", lastSync: "2 mins ago" },
  { name: "SendGrid Email Gateway", status: "CONNECTED", type: "Notifications", lastSync: "1 hr ago" },
  { name: "Twilio SMS", status: "DEGRADED", type: "Notifications", lastSync: "4 hrs ago" },
  { name: "AWS S3 Backup Storage", status: "CONNECTED", type: "Data Export", lastSync: "Yesterday" }
];

export const auditLogs = [
  { setting: "High Temp Threshold", oldVal: "80°C", newVal: "85°C", by: "Admin User", time: "Today 10:42 AM", status: "Saved" },
  { setting: "Workspace Mode", oldVal: "Standard", newVal: "Executive", by: "Sarah J.", time: "Yesterday 14:15 PM", status: "Saved" },
  { setting: "Maintenance Mode", oldVal: "false", newVal: "true", by: "Mike R.", time: "Jun 10, 02:00 AM", status: "Saved" }
];

export const heroSettingsStats = {
  healthScore: 98,
  activeSettings: 142,
  integrations: 4,
  lastBackup: "4 hrs ago"
};
