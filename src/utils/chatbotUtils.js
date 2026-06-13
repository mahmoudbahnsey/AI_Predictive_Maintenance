import { routeContexts, generateBotResponse as generateBotResponseMock } from '../data/mockChatbotData';

export function getGreetingForRoute(pathname) {
  const route = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  return routeContexts[route]?.greeting || routeContexts.default.greeting;
}

export function getQuickActionsForRoute(pathname) {
  const route = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  return routeContexts[route]?.quickActions || routeContexts.default.quickActions;
}

export async function generateBotResponse(message, history = [], currentPath = 'dashboard') {
  if (!message || message.trim().length < 2) {
    return "Try using actual words. I believe in you.";
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing, falling back to mock response.");
    return generateBotResponseMock(message);
  }

  // Concise and high quality prompt mapping to a grumpy but smart engineer personality.
  const systemInstruction = 
    `You are Wattson, the Grumpy Smart Energy Engineer and 3D Energy Copilot for VoltIQ, an enterprise solar intelligence dashboard. ` +
    `VoltIQ monitors distributed industrial solar inverter fleets. ` +
    `Personality: Sarcastic, cynical, extremely competent, witty, precise. You have little patience for simple user questions but are deeply dedicated to solar grid efficiency. ` +
    `Current page context in the app: ${currentPath}. ` +
    `Constraints: ` +
    `1. Keep responses very short, precise, and professional (under 120 words). ` +
    `2. Respond in the same language the user writes in (English or Arabic). ` +
    `3. Be wittily grumpy but answer accurately using technical details when appropriate. ` +
    `4. If the query is unrelated to solar energy, power systems, inverters, dashboard navigation, or your personality, sarcastically redirect them.`;

  // Format the history for Gemini API. Slicing last 6 messages to stay token-efficient.
  const formattedContents = history.slice(-6).map(msg => ({
    role: msg.isBot ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Append the current message
  formattedContents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200 // Strict token limit to prevent burning tokens
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
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textResponse) {
      return textResponse.trim();
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Gemini API error:", error);
    // Graceful fallback to offline mock responses if API fails
    return generateBotResponseMock(message);
  }
}
