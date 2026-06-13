// e:\VoltIQ\src\data\mockAiTrainingData.js

export const mockModels = [
  {
    id: "TRN-2026-001",
    version: "v1.0.0-stable",
    dataset: "Univ_Telemetry_Set_Q1",
    status: "DEPLOYED",
    accuracy: "91.4%",
    f1: "0.88",
    falseAlarm: "2.8%",
    dataQuality: "95.4%",
    records: "8.5K",
    driftRisk: "Low",
    started: "2026-06-10 02:00",
    completed: "2026-06-10 08:30",
    trainedBy: "Student Team",
    approval: "APPROVED",
    deployment: "LIVE"
  },
  {
    id: "TRN-2026-002",
    version: "v1.1.0-candidate",
    dataset: "Univ_Telemetry_Set_Q2",
    status: "CANDIDATE",
    accuracy: "93.2%",
    f1: "0.91",
    falseAlarm: "1.9%",
    dataQuality: "96.1%",
    records: "12.0K",
    driftRisk: "Low",
    started: "2026-06-11 14:00",
    completed: "2026-06-11 19:45",
    trainedBy: "Lead researcher",
    approval: "PENDING",
    deployment: "BLOCKED"
  },
  {
    id: "TRN-2026-003",
    version: "v0.9.0-archived",
    dataset: "Univ_Telemetry_Set_YTD",
    status: "ARCHIVED",
    accuracy: "87.5%",
    f1: "0.81",
    falseAlarm: "4.5%",
    dataQuality: "91.0%",
    records: "5.4K",
    driftRisk: "Medium",
    started: "2026-05-15 01:00",
    completed: "2026-05-15 06:20",
    trainedBy: "Student Team",
    approval: "APPROVED",
    deployment: "ROLLED BACK"
  }
];

export const confusionMatrix = [
  [95, 2, 0, 0, 1, 0, 0, 2], // F0
  [1, 88, 5, 0, 0, 2, 0, 4], // F1
  [0, 2, 92, 4, 0, 0, 0, 2], // F2
  [0, 0, 3, 85, 10, 0, 0, 2], // F3 - Overlap with F4
  [0, 0, 0, 8, 90, 0, 0, 2], // F4 - Overlap with F3
  [0, 1, 0, 0, 0, 96, 2, 1], // F5
  [0, 0, 0, 0, 0, 1, 98, 1], // F6
  [1, 3, 0, 0, 0, 0, 0, 96], // F7
];

export const faultClasses = ["F0: Normal", "F1: Inverter", "F2: Grid", "F3: Thermal", "F4: Cooling", "F5: Comm", "F6: Sensor", "F7: Panel"];

export const heroAiStats = {
  liveModel: "v1.0.0-stable",
  status: "ACTIVE",
  lastRun: "Yesterday",
  trainAcc: "92.5%",
  valAcc: "91.4%",
  f1: "0.88",
  records: "8.5K",
  dataScore: "95.4%",
  driftRisk: "Low"
};
