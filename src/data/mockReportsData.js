// e:\VoltIQ\src\data\mockReportsData.js

export const mockReports = [
  {
    id: "REP-2026-1042",
    name: "Weekly Operations Review (HQ)",
    type: "Executive Summary",
    status: "GENERATED", // GENERATED, DRAFT, FAILED, SCHEDULED
    createdBy: "Auto-System",
    date: "2026-06-12",
    format: "PDF",
    size: "4.2 MB",
    delivery: "DELIVERED",
    recipients: "Board, Regional Directors"
  },
  {
    id: "REP-2026-1041",
    name: "Nevada Solar 3 Fault Pack",
    type: "Fault Investigation",
    status: "GENERATED",
    createdBy: "Sarah J.",
    date: "2026-06-11",
    format: "ZIP (Evidence)",
    size: "18.5 MB",
    delivery: "DELIVERED",
    recipients: "Maintenance Team"
  },
  {
    id: "REP-2026-1040",
    name: "Q2 Energy Performance Audit",
    type: "Compliance & Audit",
    status: "DRAFT",
    createdBy: "Mike R.",
    date: "2026-06-11",
    format: "PDF + Excel",
    size: "Pending",
    delivery: "PENDING",
    recipients: "External Auditors"
  },
  {
    id: "REP-2026-1039",
    name: "California Telemetry Loss Incident",
    type: "Alert Response Report",
    status: "FAILED",
    createdBy: "Network Team",
    date: "2026-06-10",
    format: "PDF",
    size: "0 MB",
    delivery: "FAILED",
    recipients: "CTO"
  }
];

export const heroReportStats = {
  generated: 8420,
  scheduled: 14,
  draft: 3,
  pdfs: 6241,
  excel: 2179,
  failed: 2,
  templates: 12,
  dataCoverage: "99.8%",
  latest: "2 mins ago"
};
