/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWattsonMood } from '../../hooks/useWattsonMood';
import WattsonLauncher from './WattsonLauncher';
import WattsonPanel from './WattsonPanel';
import WattsonPresenceController from './WattsonPresenceController';
import { useWattsonChat } from '../../hooks/useWattsonChat';
import { getGreetingForRoute } from '../../utils/chatbotUtils';
import { playWattsonSound } from '../../utils/wattsonSound';
import '../../styles/chatbot.css';

const BOT_POSITION_KEY = 'voltiq.wattson.position';
const SOUND_ENABLED_KEY = 'voltiq.wattson.soundEnabled';
const BOT_BOX = { width: 124, height: 128 };
const EDGE_PADDING = 12;
const DRAG_THRESHOLD = 6;

function getViewport() {
  if (typeof window === 'undefined') {
    return { width: 1280, height: 720 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

function clampBotPosition(position, viewport = getViewport()) {
  const maxLeft = Math.max(EDGE_PADDING, viewport.width - BOT_BOX.width - EDGE_PADDING);
  const maxTop = Math.max(EDGE_PADDING, viewport.height - BOT_BOX.height - EDGE_PADDING);

  return {
    left: Math.min(Math.max(EDGE_PADDING, position.left), maxLeft),
    top: Math.min(Math.max(EDGE_PADDING, position.top), maxTop),
  };
}

function getDefaultBotPosition() {
  const viewport = getViewport();
  return clampBotPosition({
    left: viewport.width - BOT_BOX.width - 32,
    top: viewport.height - BOT_BOX.height - 32,
  }, viewport);
}

function readStoredBotPosition() {
  if (typeof window === 'undefined') return getDefaultBotPosition();
  try {
    const stored = window.localStorage.getItem(BOT_POSITION_KEY);
    if (!stored) return getDefaultBotPosition();
    const parsed = JSON.parse(stored);
    if (Number.isFinite(parsed?.left) && Number.isFinite(parsed?.top)) {
      return clampBotPosition(parsed);
    }
  } catch {
    return getDefaultBotPosition();
  }
  return getDefaultBotPosition();
}

function saveBotPosition(position) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BOT_POSITION_KEY, JSON.stringify(position));
  } catch {}
}

function readStoredSoundEnabled() {
  if (typeof window === 'undefined') return true;
  try {
    const stored = window.localStorage.getItem(SOUND_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

function saveSoundEnabled(enabled) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  } catch {}
}

export default function VoltIQBot() {
  const { user, loading, isApproved, userStatus, userProfile } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [viewport, setViewport] = useState(getViewport);
  const [botPosition, setBotPosition] = useState(readStoredBotPosition);
  const [isDraggingBot, setIsDraggingBot] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(readStoredSoundEnabled);
  
  // Interactive Eye Coordinates State
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0, blink: false });

  const {
    messages,
    mode,
    setMode,
    isTyping,
    connectionStatus,
    sendMessage,
    handleClearChat,
    handleStopGenerating,
    modifyMessage,
    setMessages
  } = useWattsonChat();

  const [userTyping, setUserTyping] = useState(false);
  const { mood, triggerMood, resetTimer } = useWattsonMood({ isTyping, userTyping });
  
  const dragState = useRef(null);
  const lastDragEndAt = useRef(0);

  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');
  const canShowBot = !loading && user && isApproved && userStatus === 'approved' && !isAuthPage;

  useEffect(() => {
    const handleResize = () => {
      const nextViewport = getViewport();
      setViewport(nextViewport);
      setBotPosition((prev) => {
        const nextPosition = clampBotPosition(prev, nextViewport);
        saveBotPosition(nextPosition);
        return nextPosition;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Route Greeting
  useEffect(() => {
    if (!canShowBot) return;

    triggerMood(location.pathname === '/alerts' ? 'warning' : 'idle', location.pathname === '/alerts' ? 5000 : 0);

    const greeting = getGreetingForRoute(location.pathname);
    setIsOpen(false);
    setHasUnread(true);

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (!lastMsg || lastMsg.text !== greeting) {
        if (!isOpen && prev.length > 0) setHasUnread(true);
        return [{ id: Date.now(), text: greeting, isBot: true }];
      }
      return prev;
    });
  }, [location.pathname, canShowBot]);

  // Handle Sounds on Message reply
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].isBot) {
      void playWattsonSound('reply', soundEnabled);
      const lastMsgText = messages[messages.length - 1].text.toLowerCase();
      
      // Animate mood based on keywords
      if (lastMsgText.includes('warning') || lastMsgText.includes('critical') || lastMsgText.includes('alert') || lastMsgText.includes('fail')) {
        triggerMood('warning', 3000);
      } else if (lastMsgText.includes('stable') || lastMsgText.includes('optimal') || lastMsgText.includes('success') || lastMsgText.includes('resolved')) {
        triggerMood('happy', 3000);
      }
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) setIsOpen(false);
    };
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-voltiq-bot', handleToggleEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-voltiq-bot', handleToggleEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const toggleChat = () => {
    if (Date.now() - lastDragEndAt.current < 220) return;

    setIsOpen((prev) => {
      if (!prev) void playWattsonSound('open', soundEnabled);
      return !prev;
    });
    resetTimer();
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundEnabled(next);
      void playWattsonSound(next ? 'enable' : 'disable', true);
      return next;
    });
  };

  const handleLauncherPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: botPosition.left,
      originTop: botPosition.top,
      moved: false,
    };
  };

  const handleLauncherPointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    drag.moved = true;
    setIsDraggingBot(true);
    event.preventDefault();

    setBotPosition(clampBotPosition({
      left: drag.originLeft + dx,
      top: drag.originTop + dy,
    }, viewport));
  };

  const finishLauncherDrag = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragState.current = null;
    setIsDraggingBot(false);

    if (drag.moved) {
      lastDragEndAt.current = Date.now();
      setBotPosition((prev) => {
        const nextPosition = clampBotPosition(prev, viewport);
        saveBotPosition(nextPosition);
        return nextPosition;
      });
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleSendMessage = (text) => {
    void playWattsonSound('send', soundEnabled);
    sendMessage(text, location.pathname);
  };

  const handleRegenerateMessage = (msgId) => {
    // find the user message right before this message
    const botMsgIndex = messages.findIndex(m => m.id === msgId);
    if (botMsgIndex <= 0) return;
    const userMsg = messages[botMsgIndex - 1];
    if (userMsg && !userMsg.isBot) {
      // remove the old bot message
      setMessages(prev => prev.filter(m => m.id !== msgId));
      handleSendMessage(userMsg.text);
    }
  };

  const handleClear = () => {
    const greeting = getGreetingForRoute(location.pathname);
    handleClearChat(greeting);
  };

  if (!canShowBot) return null;

  const isLeftSide = botPosition.left + BOT_BOX.width / 2 < viewport.width / 2;
  const opensBelow = botPosition.top < Math.min(430, viewport.height * 0.55);

  return (
    <div
      className={`chatbot-wrapper is-floating ${isDraggingBot ? 'is-dragging' : ''} ${isLeftSide ? 'is-left-side' : ''} ${opensBelow ? 'opens-below' : ''}`}
      style={{
        '--wattson-left': `${botPosition.left}px`,
        '--wattson-top': `${botPosition.top}px`,
      }}
    >
      <WattsonPresenceController
        mood={mood}
        triggerMood={triggerMood}
        resetTimer={resetTimer}
        onEyeMovement={setEyeOffset}
      />

      <WattsonPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        mood={mood}
        onClearChat={handleClear}
        onTypingStart={() => setUserTyping(true)}
        onTypingEnd={() => setUserTyping(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        eyeOffset={eyeOffset}
        mode={mode}
        onModeChange={setMode}
        connectionStatus={connectionStatus}
        currentPath={location.pathname}
        userRole={userProfile?.role || 'User'}
        onStopGenerating={handleStopGenerating}
        onModifyMessage={modifyMessage}
        onRegenerateMessage={handleRegenerateMessage}
      />

      <WattsonLauncher
        isOpen={isOpen}
        onClick={toggleChat}
        mood={mood}
        hasUnread={hasUnread}
        isDragging={isDraggingBot}
        onPointerDown={handleLauncherPointerDown}
        onPointerMove={handleLauncherPointerMove}
        onPointerUp={finishLauncherDrag}
        eyeOffset={eyeOffset}
      />
    </div>
  );
}
