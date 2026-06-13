import { Sparkles } from 'lucide-react';

const routeQuickActions = {
  dashboard: [
    "Explain system health",
    "Analyze sensor values",
    "Explain AI prediction",
    "Summarize recent activity"
  ],
  systems: [
    "Check offline systems",
    "System performance",
    "What should I fix?"
  ],
  devices: [
    "Overheating devices?",
    "Connection status",
    "Health summary"
  ],
  analytics: [
    "Explain this chart",
    "Show export trends",
    "Peak demand"
  ],

  alerts: [
    "Show critical alerts",
    "What should I acknowledge first?",
    "Explain SLA risk",
    "Suggest escalation"
  ],
  reports: [
    "Suggest report type",
    "Write executive summary",
    "Prepare PDF outline",
    "Explain report quality"
  ],
  "ai-training": [
    "Explain model accuracy",
    "Explain confusion matrix",
    "Check deployment readiness",
    "Suggest dataset improvements"
  ],
  settings: [
    "Explain this page",
    "API integrations",
    "Sync limits"
  ],
  users: [
    "Pending invites",
    "Admin roles",
    "Access scopes"
  ],
  security: [
    "Explain risky event",
    "Review protected routes",
    "Summarize sessions",
    "Suggest hardening"
  ],
  logs: [
    "Explain latest event",
    "Summarize failed events",
    "Generate audit summary",
    "Find events needing review"
  ]
};

const globalQuickActions = [
  "Explain this page",
  "What should I check first?",
  "Recommend next action"
];

export default function WattsonQuickActions({ currentPath, onActionClick }) {
  const route = currentPath.split('/').filter(Boolean).pop() || 'dashboard';
  const specificActions = routeQuickActions[route] || [];
  
  // Combine some specific actions and some global actions
  const actionsToShow = [...specificActions.slice(0, 3), ...globalQuickActions.slice(0, 1)];

  return (
    <div className="wattson-quick-actions-panel">
      <div className="wattson-quick-actions-title">
        <Sparkles size={11} />
        <span>Suggested Queries</span>
      </div>
      <div className="wattson-quick-actions-container">
        {actionsToShow.map((action, idx) => (
          <button
            key={idx}
            type="button"
            className="wattson-quick-action-btn"
            onClick={() => onActionClick(action)}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
