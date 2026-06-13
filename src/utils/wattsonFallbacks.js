/**
 * Premium offline/error fallbacks for Wattson, organized by route.
 */

export const wattsonFallbacks = {
  dashboard: {
    responses: [
      "I can't connect to Gemini, but looking at the local dashboard: Your system health is stable. Try to keep an eye on inverter temp, and don't click anything too fast.",
      "Vitals are stable locally. The fleet's health index is solid, though F3 and F5 warnings need a lookup on the Alerts page. What else is on your mind?",
      "No AI link? Fine. Power output is currently optimal. Prediction models show normal solar yield. I suggest checking the Alerts page if you want real excitement."
    ]
  },
  systems: {
    responses: [
      "Offline system view: The fleet has a couple of warnings, mostly F2 grid imbalances. Make sure to check the Systems layout to see which inverters need a cooling fan cleanup.",
      "Local system summary: 48 inverters are active. 2 are currently flagging warning levels. No system-wide outages detected yet. Safe to proceed."
    ]
  },
  devices: {
    responses: [
      "Diagnostics fallback: Telemetry looks clean, but signal quality on Inverter #4 is dropping. Check the Devices tab to verify its RSSI status.",
      "Hardware check: Telemetry reports normal inverter voltages. If you are worried about temperature spikes, check the device details directly."
    ]
  },
  analytics: {
    responses: [
      "Analytics mode fallback: Standard efficiency is at 97.4%. Daily export trends show a slight dip during morning cloud covers. Nothing to panic about.",
      "Daily peak demand remains normal. Standard deviation of inverter efficiency is within 1.2%. Check the charts on the page to analyze further."
    ]
  },

  alerts: {
    responses: [
      "Alerts triage fallback: Triage the Critical alerts first before SLA breaches. We have active warning logs. Click 'Acknowledge' on the alert card to begin.",
      "SLA risk warning: Unacknowledged F3 critical faults can escalate after 30 minutes. Suggest notifying the technician immediately."
    ]
  },
  reports: {
    responses: [
      "Report builder guidance: Choose 'Monthly Analytics Summary' or 'Hardware Maintenance Report' from the dropdown, then click 'Generate' to export Excel/PDF.",
      "Local outline: A standard VoltIQ report contains fleet metrics, energy export trends, incident history, and predicted maintenance schedules. Boardroom-safe."
    ]
  },
  "ai-training": {
    responses: [
      "Model training fallback: Model accuracy is currently resting at 96.2%. The confusion matrix shows minor false positives for F5 classifications. Ready to deploy.",
      "Dataset tips: To increase model precision, verify that feature mappings are clean and filter out noisy temperature records before running another training loop."
    ]
  },
  settings: {
    responses: [
      "Configuration fallback: Set threshold limits carefully. Imbalance thresholds are currently configured for standard tolerance. Do not change them unless authorized.",
      "API integrations look fine. Notification alerts are enabled for Admin roles only. Let me know if you need to adjust Sync Limits."
    ]
  },
  users: {
    responses: [
      "Access control: Check pending invitations and admin roles to verify scopes. Ensure all accounts have 'approved' status to access dashboards.",
      "Current audit shows 3 Admins and 15 normal users. Suggest reviewing roles if you're audited this quarter."
    ]
  },
  security: {
    responses: [
      "Defense summary: Active sessions are secured. Hardened CSP is blocking unauthorized cross-origin requests. Security score is stable."
    ]
  },
  logs: {
    responses: [
      "Logs lookup: Click on any event to see detailed stack traces. Logs don't lie. Humans do. Check for failed login events if you suspect anything."
    ]
  },
  default: {
    responses: [
      "Wattson online (Local Fallback). I'm keeping the core running while the AI brain is taking a nap. What page are you trying to troubleshoot?",
      "No AI connection, but I'm still here to guide you. Use the quick actions below to navigate VoltIQ or find critical faults."
    ]
  }
};

export function getFallbackResponse(pathname = 'dashboard') {
  const route = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  const data = wattsonFallbacks[route] || wattsonFallbacks.default;
  const randomIndex = Math.floor(Math.random() * data.responses.length);
  return data.responses[randomIndex];
}
