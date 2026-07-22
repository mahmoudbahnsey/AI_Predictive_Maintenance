import { useState, useRef, useEffect } from 'react';
import { getFallbackResponse } from '../utils/wattsonFallbacks';
import { buildSystemInstruction, formatHistoryForGemini } from '../utils/wattsonPromptBuilder';
import { useAuth } from './useAuth';

export function useWattsonChat() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('ask'); // ask, analyze, diagnose, summarize, report, troubleshoot
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, fallback, offline

  const abortControllerRef = useRef(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus(prev => prev === 'offline' ? 'connected' : prev);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
  };

  const sendMessage = async (text, pathname = 'dashboard', context = null) => {
    if (!text || text.trim().length === 0) return;

    // Create user message
    const userMsg = { id: Date.now(), text, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const payload = {
      message: text,
      history: messages,
      currentPath: pathname,
      mode,
      userRole: userProfile?.role || 'User',
      pageContext: context?.pageContext || null,
      selectedItem: context?.selectedItem || null,
      dashboardData: context?.dashboardData || null,
      currentTimezone: localStorage.getItem('voltiq-timezone') || 'UTC-8'
    };

    let responseText = "";
    let status = "connected";

    // 1. Check if user is offline
    if (!navigator.onLine) {
      responseText = getFallbackResponse(pathname);
      status = "offline";
    } else {
      // 2. Try the secure Firebase onRequest API proxy
      try {
        const response = await fetch("/api/wattson/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal
        });

        if (response.ok) {
          const data = await response.json();
          responseText = data.response;
          status = "connected";
        } else {
          throw new Error("Proxy returned error " + response.status);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Request aborted");
          return;
        }

        // 3. Fallback to client-side direct call using VITE_GEMINI_API_KEY
        console.warn("Proxy call failed, falling back to direct client call:", err);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey) {
          try {
            const systemText = buildSystemInstruction(
              pathname, 
              payload.userRole, 
              mode, 
              payload.pageContext, 
              payload.selectedItem, 
              payload.dashboardData,
              payload.currentTimezone
            );
            const geminiHistory = formatHistoryForGemini(messages);
            geminiHistory.push({ role: 'user', parts: [{ text: text }] });

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: geminiHistory,
                systemInstruction: { parts: [{ text: systemText }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
              }),
              signal: abortControllerRef.current.signal
            });

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
              status = "fallback";
            } else {
              throw new Error("Direct Gemini call failed");
            }
          } catch (directErr) {
            if (directErr.name === 'AbortError') return;
            console.error("Direct call failed too. Falling back to local responses:", directErr);
            responseText = getFallbackResponse(pathname);
            status = "fallback";
          }
        } else {
          // No API key on client, use local fallback
          responseText = getFallbackResponse(pathname);
          status = "fallback";
        }
      }
    }

    setConnectionStatus(status);
    setIsTyping(false);

    // If API failed/warned, inject a warning in response
    let finalText = responseText.trim();
    if (status === "fallback" && !finalText.includes("unavailable")) {
      // Direct call fallback warning
      console.log("Direct API client fallback active.");
    } else if (status === "offline" || (status === "fallback" && !navigator.onLine)) {
      finalText = "⚠️ AI connection is unavailable. I'll use local guidance for now.\n\n" + finalText;
    }

    const botMsg = { id: Date.now() + 1, text: finalText, isBot: true, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleClearChat = (initialGreeting) => {
    setMessages([{ id: Date.now(), text: initialGreeting, isBot: true, timestamp: new Date() }]);
  };

  // Modify a message (make shorter, explain simpler, create action list)
  const modifyMessage = async (msgId, actionType, pathname = 'dashboard') => {
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg || !targetMsg.isBot) return;

    setIsTyping(true);
    let prompt = "";
    switch (actionType) {
      case "shorter":
        prompt = `Make this response much shorter, keeping only the core technical recommendation: "${targetMsg.text}"`;
        break;
      case "simpler":
        prompt = `Explain this response in much simpler terms, avoiding dense technical jargon: "${targetMsg.text}"`;
        break;
      case "action":
        prompt = `Convert this response into a clear, bulleted, step-by-step action list: "${targetMsg.text}"`;
        break;
      default:
        setIsTyping(false);
        return;
    }

    // Call sendMessage on behalf of user to get a modified response
    await sendMessage(prompt, pathname);
  };

  return {
    messages,
    mode,
    setMode,
    isTyping,
    connectionStatus,
    setMessages,
    sendMessage,
    handleClearChat,
    handleStopGenerating,
    modifyMessage
  };
}
