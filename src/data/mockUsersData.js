// e:\VoltIQ\src\data\mockUsersData.js

export const identityHeroStats = {
  total: 42,
  active: 38,
  admin: 5,
  operators: 24,
  viewers: 10,
  guests: 3,
  privileged: 8,
  pendingInvites: 4,
  suspended: 1,
  locked: 2,
  accessReviews: 7,
  elevatedReqs: 2,
  inactive: 3,
  postureScore: 84
};

export const privilegedRisks = [
  { user: "David C.", email: "david.c@voltiq.com", role: "Administrator", risk: "Inactive Admin Account", severity: "HIGH", lastActive: "42 days ago", action: "Review User" },
  { user: "Elena S.", email: "elena.s@voltiq.com", role: "Operator", risk: "Dangerous Permissions", severity: "CRITICAL", lastActive: "Today", action: "Reduce Access" }
];

export const mockUsersList = [
  { id: "U-1001", name: "Sarah Jenkins", email: "sarah.j@voltiq.com", role: "Administrator", permissionLevel: "Full Access", status: "Active", lastLogin: "10 mins ago", joined: "Jan 12, 2024", systems: "All", verification: "Verified", riskScore: "Low" },
  { id: "U-1002", name: "Mike Roberts", email: "mike.r@voltiq.com", role: "Operator", permissionLevel: "Operations", status: "Review Required", lastLogin: "1 hr ago", joined: "Feb 05, 2024", systems: "Solar Farm A, Site B", verification: "Verified", riskScore: "Medium" },
  { id: "U-1003", name: "Alex Chen", email: "alex.c@voltiq.com", role: "Viewer", permissionLevel: "Read-Only", status: "Active", lastLogin: "2 days ago", joined: "Mar 10, 2024", systems: "Solar Farm A", verification: "Verified", riskScore: "Low" },
  { id: "U-1004", name: "Guest Audit", email: "audit@external.com", role: "Guest", permissionLevel: "Limited", status: "Inactive", lastLogin: "30 days ago", joined: "Apr 01, 2024", systems: "Reports Only", verification: "Pending", riskScore: "High" },
  { id: "U-1005", name: "David C.", email: "david.c@voltiq.com", role: "Administrator", permissionLevel: "Full Access", status: "Suspended", lastLogin: "42 days ago", joined: "Jan 15, 2024", systems: "All", verification: "Verified", riskScore: "Critical" }
];

export const mockPermissionCategories = [
  {
    name: "Core Navigation Access",
    permissions: [
      { name: "Dashboard", admin: "Allowed", operator: "Allowed", viewer: "Allowed", guest: "Allowed" },
      { name: "Systems", admin: "Allowed", operator: "Allowed", viewer: "Allowed", guest: "Blocked" },
      { name: "Devices", admin: "Allowed", operator: "Allowed", viewer: "Allowed", guest: "Blocked" },
      { name: "Analytics", admin: "Allowed", operator: "Allowed", viewer: "Allowed", guest: "Blocked" }
    ]
  },
  {
    name: "Operations Access",
    permissions: [
      { name: "Alerts", admin: "Allowed", operator: "Allowed", viewer: "Blocked", guest: "Blocked" },
      { name: "Reports", admin: "Allowed", operator: "Allowed", viewer: "Allowed", guest: "Allowed" },
      { name: "Export", admin: "Allowed", operator: "Review Required", viewer: "Blocked", guest: "Blocked" }
    ]
  },
  {
    name: "Admin Governance",
    permissions: [
      { name: "Settings", admin: "Allowed", operator: "Blocked", viewer: "Blocked", guest: "Blocked" },
      { name: "Users", admin: "Allowed", operator: "Blocked", viewer: "Blocked", guest: "Blocked" },
      { name: "Security Center", admin: "Allowed", operator: "Blocked", viewer: "Blocked", guest: "Blocked" }
    ]
  },
  {
    name: "AI & Advanced Controls",
    permissions: [
      { name: "AI Training", admin: "Allowed", operator: "Blocked", viewer: "Blocked", guest: "Blocked" },
      { name: "Deploy AI Model", admin: "Allowed", operator: "Blocked", viewer: "Blocked", guest: "Blocked" }
    ]
  }
];

export const mockInvitations = [
  { email: "new.eng@voltiq.com", role: "Operator", scope: "Solar Farm B", status: "Pending", sent: "2 days ago", expiry: "5 days", by: "Sarah Jenkins" },
  { email: "temp.audit@ext.com", role: "Guest", scope: "Reports", status: "Expired", sent: "10 days ago", expiry: "Expired", by: "Mike Roberts" }
];

export const mockAuditTrail = [
  { action: "Suspended Account", user: "David C.", by: "System Auto", time: "Today 10:45 AM", status: "Success", risk: "Low" },
  { action: "Elevated Access Approved", user: "Elena S.", by: "Sarah Jenkins", time: "Yesterday", status: "Approved", risk: "Critical" },
  { action: "Invited User", user: "new.eng@voltiq.com", by: "Sarah Jenkins", time: "2 days ago", status: "Pending", risk: "Low" }
];

export const mockApprovals = [
  { action: "Approve Elevated Access", target: "Elena S.", priority: "High", risk: "Critical", requestedBy: "Elena S." },
  { action: "Review Role Change", target: "Mike Roberts (Operator -> Admin)", priority: "Urgent", risk: "Critical", requestedBy: "Mike Roberts" }
];
