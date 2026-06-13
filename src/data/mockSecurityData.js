// e:\VoltIQ\src\data\mockSecurityData.js

export const securityHeroStats = {
  score: 94,
  protectedRoutes: 12,
  activeSessions: 38,
  trustedSessions: 36,
  suspiciousSessions: 2,
  failedLogins: 14,
  blockedAccess: 5,
  adminViolations: 3,
  criticalEvents: 1,
  firebaseHealth: "Secure",
  apiHealth: "Secure",
  auditCoverage: "100%",
  activePolicies: 18,
  lastScan: "2 mins ago"
};

export const criticalDefenseEvents = [
  { id: "SEC-9001", type: "Blocked Admin Access", user: "mike.r@voltiq.com", role: "Operator", route: "/security", device: "Chrome / Windows", time: "10 mins ago", severity: "CRITICAL", action: "Block Source" },
  { id: "SEC-9002", type: "Suspicious Session", user: "alex.c@voltiq.com", role: "Viewer", route: "Multiple", device: "Safari / iOS (New Region)", time: "1 hr ago", severity: "HIGH", action: "Require Re-login" }
];

export const routeShieldData = [
  { name: "/dashboard", role: "All Users", sensitivity: "Low", status: "Protected", lastAccess: "Just now", violations: 0, directAttempts: 0, risk: "Low" },
  { name: "/settings", role: "Administrator", sensitivity: "High", status: "Protected", lastAccess: "10 mins ago", violations: 2, directAttempts: 1, risk: "Medium" },
  { name: "/users", role: "Administrator", sensitivity: "Critical", status: "Protected", lastAccess: "5 mins ago", violations: 1, directAttempts: 2, risk: "Medium" },
  { name: "/security", role: "Administrator", sensitivity: "Critical", status: "Violation Detected", lastAccess: "Just now", violations: 5, directAttempts: 3, risk: "High" },
  { name: "/ai-training", role: "Administrator", sensitivity: "High", status: "Protected", lastAccess: "2 hrs ago", violations: 0, directAttempts: 0, risk: "Low" }
];

export const activeSessions = [
  { user: "Sarah Jenkins", email: "sarah.j@voltiq.com", role: "Administrator", device: "Chrome / macOS", region: "US-West", started: "4 hrs ago", active: "Just now", duration: "4h 12m", auth: "MFA Verified", trust: "Trusted", risk: "Low" },
  { user: "Alex Chen", email: "alex.c@voltiq.com", role: "Viewer", device: "Safari / iOS", region: "EU-Central (Unusual)", started: "1 hr ago", active: "5 mins ago", duration: "1h 5m", auth: "Password Only", trust: "Suspicious", risk: "High" }
];

export const failedLogins = [
  { route: "/security", reason: "Blocked Admin Access", user: "mike.r@voltiq.com", role: "Operator", source: "192.168.1.45", device: "Chrome / Windows", time: "10 mins ago", risk: "Critical" },
  { route: "/login", reason: "Invalid Password (x4)", user: "Unknown", role: "Unknown", source: "10.0.0.12", device: "Firefox / Linux", time: "25 mins ago", risk: "High" }
];

export const securityTimeline = [
  { action: "Admin Route Access Blocked", detail: "Non-admin attempted to access /security", time: "10 mins ago", status: "Blocked", risk: "Critical" },
  { action: "Security Policy Updated", detail: "Session timeout reduced to 4 hours", time: "1 hour ago", status: "Success", risk: "Low" },
  { action: "Suspicious Session Detected", detail: "Login from new geographic region", time: "1 hour ago", status: "Review", risk: "High" }
];

export const securityPolicies = [
  { name: "Require MFA for Admin Routes", status: "Enforced", impact: "High", updated: "Jan 15, 2024", result: "100% Compliant" },
  { name: "Block Non-Admin Direct URL Access", status: "Enforced", impact: "Critical", updated: "Feb 02, 2024", result: "12 Blocks Today" },
  { name: "Auto-Logout Inactive Sessions (4h)", status: "Enforced", impact: "Medium", updated: "1 hour ago", result: "Active" },
  { name: "Strict IP Whitelisting", status: "Disabled", impact: "High", updated: "Never", result: "Not Enforced" }
];

export const threatRecommendations = [
  { priority: "P1", risk: "High", reason: "3 blocked attempts to /security from Operator accounts today.", action: "Review Operator Role Permissions", impact: "Prevents internal privilege escalation.", target: "/security route" },
  { priority: "P2", risk: "Medium", reason: "Suspicious session detected for Alex Chen.", action: "Require Re-login", impact: "Secures potentially compromised session.", target: "Alex Chen (Session)" }
];

export const defenseQueue = [
  { action: "Terminate Suspicious Session", event: "Alex Chen (Safari/iOS)", priority: "Urgent", risk: "High", time: "1 hr ago", decision: "Terminate" },
  { action: "Review Firebase Rule Warning", event: "Firestore Read Access", priority: "Normal", risk: "Medium", time: "2 hrs ago", decision: "Review" }
];

export const auditExports = [
  { type: "Full Security Audit Pack", range: "Last 30 Days", status: "Ready", generated: "Today 08:00 AM", format: "PDF + CSV", size: "4.2 MB", audit: "Verified" },
  { type: "Protected Route Report", range: "Last 7 Days", status: "Ready", generated: "Yesterday", format: "CSV", size: "125 KB", audit: "Verified" }
];
