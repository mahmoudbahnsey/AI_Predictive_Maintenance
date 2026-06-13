// e:\VoltIQ\src\data\mockLogsData.js

export const logsHeroStats = {
  total: "1.2M",
  today: 3450,
  successful: 3410,
  warnings: 35,
  failed: 4,
  critical: 1,
  auditRecords: 1420,
  exported: 12,
  lastEvent: "Just now",
  retention: "1 Year",
  coverage: "100%",
  integrity: "Verified"
};

export const liveIntelligenceEvents = [
  { id: "LOG-5501", type: "Security Policy Updated", module: "Security", user: "sarah.j@voltiq.com", status: "Success", time: "2m ago", severity: "Info", action: "Open Event" },
  { id: "LOG-5502", type: "Failed Report Export", module: "Reports", user: "alex.c@voltiq.com", status: "Failed", time: "15m ago", severity: "Warning", action: "Review" },
  { id: "LOG-5503", type: "Role Elevated", module: "Users", user: "sarah.j@voltiq.com", status: "Success", time: "1h ago", severity: "Critical", action: "Mark Reviewed" }
];

export const auditTimelineEvents = [
  { id: "EVT-8921", time: "10:45:02 AM", user: "sarah.j@voltiq.com", role: "Administrator", module: "Security", route: "/security", action: "Updated Session Timeout Policy", status: "Success", severity: "Warning", prevVal: "8 Hours", newVal: "4 Hours", hash: "a8f3b1...9c" },
  { id: "EVT-8920", time: "10:30:15 AM", user: "mike.r@voltiq.com", role: "Operator", module: "Reports", route: "/reports", action: "Generated Compliance Report", status: "Failed", severity: "Error", prevVal: null, newVal: null, error: "Database connection timeout during generation.", hash: "e2d7a9...4f" },
  { id: "EVT-8919", time: "09:15:00 AM", user: "System", role: "System", module: "Firebase", route: "/sync", action: "Daily Data Sync Completed", status: "Success", severity: "Info", prevVal: null, newVal: "2.4GB Synced", hash: "b1c4e8...7d" },
  { id: "EVT-8918", time: "08:05:22 AM", user: "sarah.j@voltiq.com", role: "Administrator", module: "Users", route: "/users", action: "Suspended Inactive Account", status: "Success", severity: "Warning", relatedEntity: "david.c@voltiq.com", hash: "f9a2d1...3b" },
  { id: "EVT-8917", time: "07:30:00 AM", user: "alex.c@voltiq.com", role: "Viewer", module: "Alerts", route: "/alerts", action: "Acknowledged Critical Alert", status: "Success", severity: "Info", relatedEntity: "Inverter Fault A-42", hash: "c3b1a8...9e" }
];

export const categoryIntelligence = [
  { name: "Authentication Events", count: 1240, successRate: "98%", warnings: 15, failed: 10, latest: "5m ago", reviewReq: 2 },
  { name: "User Management", count: 45, successRate: "100%", warnings: 5, failed: 0, latest: "2h ago", reviewReq: 1 },
  { name: "Security & Policies", count: 18, successRate: "100%", warnings: 0, failed: 0, latest: "1h ago", reviewReq: 0 },
  { name: "Firebase / Data Sync", count: 320, successRate: "99%", warnings: 3, failed: 1, latest: "15m ago", reviewReq: 1 }
];

export const reviewQueue = [
  { id: "REV-101", reason: "Failed Report Export", severity: "Warning", module: "Reports", user: "alex.c@voltiq.com", time: "15m ago", action: "Review Configuration" },
  { id: "REV-102", reason: "Blocked Admin Access", severity: "Critical", module: "Security", user: "mike.r@voltiq.com", time: "2h ago", action: "Review User Role" }
];

export const exportPacks = [
  { type: "Full Security Audit Pack", range: "Last 30 Days", status: "Ready", generated: "Today 08:00 AM", format: "PDF + JSON", size: "4.2 MB", records: 45000 },
  { type: "User Activity Logs", range: "Last 7 Days", status: "Ready", generated: "Yesterday", format: "CSV", size: "1.5 MB", records: 12000 },
  { type: "Settings Change Logs", range: "Q1 2026", status: "Archived", generated: "Apr 01, 2026", format: "JSON", size: "850 KB", records: 420 }
];

export const logStreamData = [
  { time: "10:45:02.124", level: "WARNING", module: "Security", message: "Session timeout policy modified.", source: "Web Client" },
  { time: "10:45:01.005", level: "INFO", module: "Auth", message: "User sarah.j@voltiq.com authenticated via MFA.", source: "Firebase Auth" },
  { time: "10:30:15.892", level: "ERROR", module: "Reports", message: "Compliance report generation failed: Timeout.", source: "Report Engine" },
  { time: "10:15:00.000", level: "SUCCESS", module: "Firebase", message: "Realtime snapshot synced successfully.", source: "Sync Service" },
  { time: "09:55:22.441", level: "AUDIT", module: "Users", message: "Admin role assigned to target user.", source: "Admin Panel" },
  { time: "09:55:10.112", level: "INFO", module: "Systems", message: "Solar Farm B performance metrics refreshed.", source: "Telemetry" }
];

export const flowMapData = [
  { id: "core", x: 400, y: 300, name: "System Memory Core", status: "success" },
  { id: "dashboard", x: 400, y: 100, name: "Dashboard", status: "success", count: "14.2k" },
  { id: "systems", x: 600, y: 150, name: "Systems", status: "success", count: "8.5k" },
  { id: "alerts", x: 650, y: 300, name: "Alerts", status: "warning", count: "2.1k" },
  { id: "faults", x: 600, y: 450, name: "Fault History", status: "success", count: "450" },
  { id: "reports", x: 400, y: 500, name: "Reports", status: "error", count: "120" },
  { id: "settings", x: 200, y: 450, name: "Settings", status: "warning", count: "45" },
  { id: "security", x: 150, y: 300, name: "Security", status: "error", count: "312" },
  { id: "users", x: 200, y: 150, name: "Users", status: "success", count: "89" }
];
