export const mockFleetData = [
  {
    id: 'SYS-001',
    name: 'VoltIQ Hardware Prototype',
    location: 'Lab Workbench',
    status: 'online', // online, warning, fault, offline
    health: 96,
    currentPower: 8.5, // in W
    todayEnergy: 0.04, // in kWh
    activeAlerts: 0,
    aiStatus: 'ready', // ready, analyzing, training, failed, offline
    riskLevel: 'low',
    lastUpdated: new Date().toISOString(),
    devices: 8,
    faults: []
  },
  {
    id: 'SYS-002',
    name: 'VoltIQ Digital Twin Node',
    location: 'Simulation Environment',
    status: 'warning',
    health: 88,
    currentPower: 6.2,
    todayEnergy: 0.03,
    activeAlerts: 1,
    aiStatus: 'analyzing',
    riskLevel: 'medium',
    lastUpdated: new Date().toISOString(),
    devices: 8,
    faults: ['F3 - Simulated High Temperature']
  },
  {
    id: 'SYS-003',
    name: 'VoltIQ Solar Array A-1',
    location: 'Rooftop Lab',
    status: 'online',
    health: 99,
    currentPower: 1500,
    todayEnergy: 12.5,
    activeAlerts: 0,
    aiStatus: 'ready',
    riskLevel: 'low',
    lastUpdated: new Date().toISOString(),
    devices: 12,
    faults: []
  },
  {
    id: 'SYS-004',
    name: 'VoltIQ Storage Pack B1',
    location: 'Energy Storage Bay',
    status: 'fault',
    health: 42,
    currentPower: 0,
    todayEnergy: 0.0,
    activeAlerts: 2,
    aiStatus: 'offline',
    riskLevel: 'high',
    lastUpdated: new Date().toISOString(),
    devices: 6,
    faults: ['F1 - Battery Over-temperature', 'F8 - Charge Controller Failure']
  }
];

export const mockInsights = [
  "Prototype ESP32 DevKit v1 is maintaining stable Wi-Fi connection.",
  "Digital Twin node shows a 27% drop in simulated output compared to baseline.",
  "ACS712 current readings indicate normal load across all monitored channels.",
  "Most common simulated anomaly: F3 high temperature warning.",
  "Telemetry data sync is functioning normally across the prototype network."
];
