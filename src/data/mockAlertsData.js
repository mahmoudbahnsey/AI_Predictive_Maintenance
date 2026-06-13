export const mockAlerts = [
  {
    id: "ALT-0092",
    severity: "critical",
    type: "Thermal Overload",
    message: "KY-013 Thermistor operating temperature exceeded 45°C critical limit.",
    device: "Thermistor Probe",
    system: "VoltIQ Hardware Prototype",
    value: "46.4°C",
    threshold: "45.0°C",
    status: "UNACKNOWLEDGED",
    assignedTo: "Unassigned",
    timeTriggered: "2 mins ago",
    slaRemaining: "13m 42s",
    slaState: "at-risk", // normal, at-risk, breached
    escalationLevel: "Level 1: Pending",
    channel: "SMS / Push",
    recommendedAction: "Immediate shutdown of 12V Inverter or add cooling.",
    history: [
      { time: "10:15", event: "Alert Triggered" },
      { time: "10:16", event: "Notification sent to Dashboard" }
    ]
  },
  {
    id: "ALT-0091",
    severity: "warning",
    type: "Voltage Sag",
    message: "Solar Panel voltage dropped below 5.5V expected baseline.",
    device: "Mini Solar Panel Array",
    system: "VoltIQ Hardware Prototype",
    value: "5.2V",
    threshold: "5.5V",
    status: "ACKNOWLEDGED",
    assignedTo: "Lab Tech",
    timeTriggered: "14 mins ago",
    slaRemaining: "46m 10s",
    slaState: "normal",
    escalationLevel: "Level 2: Acknowledged",
    channel: "In-App",
    recommendedAction: "Check light source intensity over panels.",
    history: [
      { time: "10:03", event: "Alert Triggered" },
      { time: "10:08", event: "Acknowledged by Lab Tech" }
    ]
  },
  {
    id: "ALT-0089",
    severity: "warning",
    type: "Telemetry Sync Delay",
    message: "ESP32 DevKit failed to report within 30s window.",
    device: "ESP32 DevKit v1",
    system: "VoltIQ Digital Twin Node",
    value: "45s",
    threshold: "30s",
    status: "ESCALATED",
    assignedTo: "Network Team",
    timeTriggered: "32 mins ago",
    slaRemaining: "0m 0s",
    slaState: "breached",
    escalationLevel: "Level 3: Escalated",
    channel: "Email",
    recommendedAction: "Restart ESP32 or check Wi-Fi connection.",
    history: [
      { time: "09:45", event: "Alert Triggered" },
      { time: "10:15", event: "SLA Breached" },
      { time: "10:15", event: "Escalated to Network Team" }
    ]
  },
  {
    id: "ALT-0085",
    severity: "info",
    type: "System Efficiency Drop",
    message: "Gradual output drop detected on inverter load.",
    device: "12V DC to 220V AC Inverter",
    system: "VoltIQ Hardware Prototype",
    value: "88%",
    threshold: "90%",
    status: "MUTED",
    assignedTo: "Auto-System",
    timeTriggered: "2 hours ago",
    slaRemaining: "N/A",
    slaState: "normal",
    escalationLevel: "Level 1: Pending",
    channel: "Log Only",
    recommendedAction: "Check load resistance.",
    history: [
      { time: "08:00", event: "Alert Triggered" },
      { time: "08:05", event: "Muted automatically" }
    ]
  }
];

export const heroAlertStats = {
  active: 4,
  critical: 1,
  warning: 2,
  unack: 1,
  escalating: 1,
  slaRisk: 1,
  responders: 2,
  channels: 2,
  avgResponse: "1m 45s"
};
