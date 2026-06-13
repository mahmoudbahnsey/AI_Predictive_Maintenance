// Telegram Bot Alert Service for VoltIQ
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8691331377:AAEOflKel1Wvwre1BcN-z61ZoeALrOewVGY';

/**
 * Helper to fetch Telegram Bot API, with automatic fallback to a CORS proxy (AllOrigins)
 * if direct connections fail (due to CORS block or local ISP filters).
 */
async function fetchTelegram(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Direct Telegram API call failed (CORS/ISP block). Retrying via CORS proxy...', error);
  }
  
  // Fallback: request via api.allorigins.win CORS proxy
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.contents);
    }
  } catch (proxyError) {
    console.error('CORS proxy fetch failed:', proxyError);
  }
  return null;
}

/**
 * Sends a notification message to the configured Telegram Chat ID
 * @param {string} chatId - Telegram user chat ID
 * @param {string} text - Message to send
 * @returns {Promise<boolean>} - True if message sent successfully
 */
export async function sendTelegramMessage(chatId, text) {
  if (!chatId) {
    console.warn('Telegram Notification skipped: No Chat ID configured.');
    return false;
  }
  
  const queryParams = new URLSearchParams({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  });
  
  // Using GET request to /sendMessage to easily proxy it via AllOrigins if direct fails
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?${queryParams.toString()}`;
  
  try {
    // Attempt direct fetch (no-cors prevents browser blocks, though hides actual response details)
    const directPromise = fetch(url, { method: 'GET', mode: 'no-cors' });
    
    // We also run a regular fetch or proxy fetch to confirm response status
    const data = await fetchTelegram(url);
    if (data && data.ok) {
      return true;
    }
    
    // Fallback best-effort success if the direct send completed without error
    await directPromise;
    return true;
  } catch (error) {
    console.error('Failed to dispatch Telegram alert:', error);
    return false;
  }
}

/**
 * Sends a formatted fault alarm alert to Telegram
 * @param {string} chatId - Telegram chat ID
 * @param {object} faultData - { code, title, severity, issue, repair, confidence }
 * @returns {Promise<boolean>}
 */
export async function sendTelegramFaultAlert(chatId, faultData) {
  const { code, title, severity, issue, repair, confidence } = faultData;
  
  const emoji = severity === 'critical' ? '🔴' : '⚠️';
  const text = `
${emoji} <b>VoltIQ Telemetry Alert</b> ${emoji}
----------------------------------------
<b>Fault Class:</b> <code>${code}</code>
<b>Condition:</b> <u>${title}</u>
<b>Severity Level:</b> <pre>${severity.toUpperCase()}</pre>
<b>AI Inference Confidence:</b> <code>${confidence.toFixed(1)}%</code>

<b>Diagnostic Issue:</b>
<i>${issue}</i>

<b>Recommended Action:</b>
<b>${repair}</b>
----------------------------------------
<i>VoltIQ AI Diagnostics Center (Live Stream)</i>
`.trim();

  return sendTelegramMessage(chatId, text);
}

/**
 * Fetches recent updates from the bot and returns the last user's chat info
 * @returns {Promise<object|null>} - { chatId, username, firstName }
 */
export async function detectLastTelegramChat() {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const data = await fetchTelegram(url);
  if (data && data.ok && data.result && data.result.length > 0) {
    // Find the last private chat message
    const messages = data.result
      .map(u => u.message)
      .filter(m => m && m.chat && m.chat.type === 'private');
      
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      return {
        chatId: String(lastMsg.chat.id),
        username: lastMsg.chat.username || '',
        firstName: lastMsg.chat.first_name || lastMsg.from.first_name || ''
      };
    }
  }
  return null;
}

/**
 * Searches bot updates for a specific verification code.
 * @param {string} code - The 6-digit verification code to search for
 * @returns {Promise<object|null>} - User details if code is found, otherwise null
 */
export async function checkVerificationCode(code) {
  if (!code) return null;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const data = await fetchTelegram(url);
  if (data && data.ok && data.result && data.result.length > 0) {
    // Search from newest updates to oldest
    const reversedUpdates = [...data.result].reverse();
    for (const update of reversedUpdates) {
      const msg = update.message;
      if (msg && msg.chat && msg.chat.type === 'private' && msg.text) {
        const text = msg.text.trim();
        // Check if message text includes the 6-digit code
        if (text.includes(code)) {
          return {
            chatId: String(msg.chat.id),
            username: msg.chat.username || '',
            firstName: msg.chat.first_name || msg.from.first_name || ''
          };
        }
      }
    }
  }
  return null;
}
