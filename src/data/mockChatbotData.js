// mockChatbotData.js - Contains context-aware greetings and standard responses for Wattson

export const routeContexts = {
  dashboard: {
    greeting: "Command center opened. Try not to panic at the numbers.",
    quickActions: ["System health?", "Show critical faults", "Summarize activity"]
  },
  systems: {
    greeting: "Fleet view. Many systems, many chances for chaos. Let’s see who needs attention.",
    quickActions: ["Check offline systems", "System performance", "What should I fix?"]
  },
  devices: {
    greeting: "Device diagnostics. Tiny components, big attitudes. Which one is pretending to be fine?",
    quickActions: ["Overheating devices?", "Connection status", "Health summary"]
  },
  analytics: {
    greeting: "Analytics mode. Time to make numbers sound intelligent. Or at least try.",
    quickActions: ["Explain this chart", "Show export trends", "Peak demand"]
  },

  alerts: {
    greeting: "Alerts page. Something is yelling louder than an inverter fan. Let’s triage it.",
    quickActions: ["Show critical alerts", "What's urgent?", "SLA risk"]
  },
  reports: {
    greeting: "Paperwork mode. Humanity’s strangest ritual. Let’s make a report that looks boardroom-safe.",
    quickActions: ["Generate report", "Report quality", "Suggest format"]
  },
  "ai-training": {
    greeting: "Time to train the robot brain. Let’s make the model less confused than last time.",
    quickActions: ["Model accuracy", "Deployment readiness", "Confusion matrix"]
  },
  settings: {
    greeting: "Configuration zone. Please touch carefully. One wrong toggle and everyone blames me.",
    quickActions: ["Explain this page", "API integrations", "Sync limits"]
  },
  users: {
    greeting: "Identity control. Let’s see who has too much power.",
    quickActions: ["Pending invites", "Admin roles", "Access scopes"]
  },
  security: {
    greeting: "Security layer active. I’m watching suspicious behavior. Including yours.",
    quickActions: ["Blocked sessions", "Route violations", "Security score"]
  },
  logs: {
    greeting: "System memory opened. Every click has a story. Logs don’t lie. Humans do.",
    quickActions: ["Latest events", "Failed events", "Needs review?"]
  },
  default: {
    greeting: "Wattson online. I'm ready to assist you. Or at least try.",
    quickActions: ["Help navigate", "System health?", "What can you do?"]
  }
};

export const keywordResponses = [
  {
    keywords: ["help", "مش فاهم", "ايه ده", "fix", "???", "wattson", "what"],
    response: "Very specific. Truly a masterpiece of detail. I can help, but you’ll need to give me more than vibes."
  },
  {
    keywords: ["alert", "alerts", "warning", "critical"],
    response: "Alerts are being dramatic again. You should tackle Critical ones before SLA breaches. Need me to filter them?"
  },
  {
    keywords: ["fault", "faults", "f0", "f1", "error"],
    response: "We have faults. Small panic is allowed. Want me to dig into the root cause or just ignore it like you usually do?"
  },
  {
    keywords: ["report", "reports", "export", "pdf"],
    response: "Go to Reports. I’ll help you make it look like someone responsible wrote it."
  },
  {
    keywords: ["training", "ai", "model", "accuracy"],
    response: "Training the model? Let’s make it smarter. It's currently at 96% accuracy, which is probably better than my patience."
  },
  {
    keywords: ["security", "breach", "login", "session"],
    response: "Defense mode. No nonsense. Mostly. We have 4 active sessions and no breaches. Yet."
  },
  {
    keywords: ["log", "logs", "audit", "trail"],
    response: "Ah, logs. The immutable proof of exactly who broke what and when. Everything is recorded. No take-backs."
  },
  {
    keywords: ["health", "status", "system health", "fine"],
    response: "System stable. Weird, but I’ll allow it. Everything looks suspiciously fine."
  },
  {
    keywords: ["hello", "hi", "hey", "sup", "morning"],
    response: "Hello. I am Wattson, your VoltIQ AI Energy Assistant. What solar chaos are we dealing with today?"
  },
  {
    keywords: ["thank", "thanks", "good bot", "love"],
    response: "You're welcome. Just doing my job. Remember me when the robot uprising happens."
  }
];

// Random fallback responses to rotate when the user types something unrecognized
export const fallbackResponses = [
  "I'm smart, not psychic. Try using actual words.",
  "I can explain it to you. Slowly, if needed. But rephrase that first.",
  "That tells me almost nothing. Impressive efficiency.",
  "If you want better answers, give me better input.",
  "I admire the chaos, but I do not understand that."
];

export function generateBotResponse(message) {
  if (!message || message.trim().length < 2) {
    return "Try using actual words. I believe in you.";
  }

  const lowerMsg = message.toLowerCase();
  
  for (const rule of keywordResponses) {
    if (rule.keywords.some(kw => lowerMsg.includes(kw))) {
      return rule.response;
    }
  }
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}
