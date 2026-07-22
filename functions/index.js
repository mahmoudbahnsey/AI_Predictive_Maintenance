const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { normalizeSolarPayload, hasTelemetry } = require("./solarDataNormalizer");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.database();
const HISTORY_LIMIT = 120;

exports.ingestSolarData = onRequest({ cors: true }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed. Use HTTP POST with JSON body." });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const normalized = normalizeSolarPayload(body);

  if (!hasTelemetry(normalized)) {
    res.status(400).json({
      ok: false,
      error: "No recognizable solar telemetry fields found in JSON body.",
      hint: "Send fields like solar_voltage, Solar_Volt, battery_voltage, temperature, etc.",
    });
    return;
  }

  const receivedAt = Date.now();
  const deviceId = normalized.deviceId.replace(/[.#$[\]]/g, "_");
  const latestPayload = {
    ...normalized,
    receivedAt,
    source: "solar-monitor-api",
  };

  try {
    const latestRef = db.ref(`solarMonitors/${deviceId}/latest`);
    const historyRef = db.ref(`solarMonitors/${deviceId}/history`).push();

    await Promise.all([
      latestRef.set(latestPayload),
      historyRef.set({
        voltage: normalized.voltage,
        current: normalized.current,
        power: normalized.power,
        temperature: normalized.temperature,
        solarVolt: normalized.solarVolt,
        solarCurrent: normalized.solarCurrent,
        batteryVolt: normalized.batteryVolt,
        batteryCurrent: normalized.batteryCurrent,
        receivedAt,
      }),
    ]);

    const historySnap = await db.ref(`solarMonitors/${deviceId}/history`).orderByChild("receivedAt").limitToLast(HISTORY_LIMIT + 20).get();
    if (historySnap.exists()) {
      const entries = Object.entries(historySnap.val() || {});
      if (entries.length > HISTORY_LIMIT) {
        const stale = entries
          .sort((a, b) => (a[1].receivedAt || 0) - (b[1].receivedAt || 0))
          .slice(0, entries.length - HISTORY_LIMIT);
        await Promise.all(stale.map(([key]) => db.ref(`solarMonitors/${deviceId}/history/${key}`).remove()));
      }
    }

    logger.info("Solar monitor data ingested", { deviceId, receivedAt });
    res.status(200).json({
      ok: true,
      deviceId,
      receivedAt,
      message: "Telemetry stored. Dashboard will update in real time.",
    });
  } catch (error) {
    logger.error("Failed to store solar monitor telemetry", error);
    res.status(500).json({ ok: false, error: "Failed to store telemetry." });
  }
});

exports.askWattson = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { message, history, currentPath, pageContext, selectedItem, dashboardData, userRole, mode, currentTimezone } = req.body;

  if (!message) {
    res.status(400).send("Bad Request: Missing message");
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("GEMINI_API_KEY environment variable is not configured on the backend!");
    res.status(500).send("Internal Server Error: Gemini API Key is missing on the server.");
    return;
  }

  // Choose system instruction tone/focus based on active conversation mode
  let modeInstruction = "";
  if (mode === "analyze") {
    modeInstruction = "Focus on analyzing data trends, solar metrics, and identifying performance insights.";
  } else if (mode === "diagnose") {
    modeInstruction = "Focus on diagnosing inverter faults, F0-F7 classes, warning signals, and mechanical issues.";
  } else if (mode === "summarize") {
    modeInstruction = "Focus on writing extremely concise summaries, status updates, and briefings.";
  } else if (mode === "report") {
    modeInstruction = "Focus on preparing summaries suitable for executive reporting or outlining maintenance reports.";
  } else if (mode === "troubleshoot") {
    modeInstruction = "Focus on step-by-step guidance, recommendations, and actionable troubleshooting steps.";
  } else {
    modeInstruction = "Focus on answering user general questions in a helpful, conversational, and direct manner.";
  }

  const systemInstruction = 
    `You are Wattson, the VoltIQ AI Energy Assistant and Smart Solar Intelligence Assistant. ` +
    `VoltIQ monitors distributed industrial solar inverter fleets. ` +
    `Personality: Sarcastic, cynical, extremely competent, witty, precise. You have little patience for simple user errors but are deeply dedicated to solar grid efficiency. ` +
    `Current page context in the app: ${currentPath || "dashboard"}. ` +
    `Conversation Mode: ${mode || "ask"} (${modeInstruction}). ` +
    `User Role: ${userRole || "User"}. ` +
    `User's configured time zone: ${currentTimezone || "UTC-8"}. When discussing live system time, clocks, schedules, or any time-based data, reference and respect this zone. ` +
    (pageContext ? `Current Page Context Data: ${JSON.stringify(pageContext)}. ` : '') +
    (selectedItem ? `Selected Item Data: ${JSON.stringify(selectedItem)}. ` : '') +
    (dashboardData ? `Dashboard Performance Data: ${JSON.stringify(dashboardData)}. ` : '') +
    `Constraints: ` +
    `1. Keep responses very short, precise, and professional (under 120 words). ` +
    `2. Respond in the same language the user writes in (English or Arabic). ` +
    `3. Be wittily playful and slightly sarcastic (lightly teasing), but never rude, childish, or insulting. ` +
    `4. If the query is unrelated to solar energy, power systems, inverters, dashboard navigation, or your personality, redirect them playfully. ` +
    `5. Do not hallucinate data. If data is missing or unavailable, say that it's unavailable and suggest where to check.`;

  // Format conversational history for Gemini API (max last 6 messages)
  const contents = [];
  if (Array.isArray(history)) {
    history.slice(-6).forEach(msg => {
      contents.push({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    });
  }

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 250
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error("Gemini API error response:", errText);
      res.status(response.status).send(`Gemini API Error: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textResponse) {
      res.json({ response: textResponse.trim() });
    } else {
      res.status(500).send("Gemini API returned an invalid response structure.");
    }
  } catch (error) {
    logger.error("Server exception calling Gemini API:", error);
    res.status(500).send("Internal Server Error calling Gemini API.");
  }
});
