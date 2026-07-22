import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Bot, QrCode, RefreshCw, ExternalLink, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { sendTelegramMessage, detectLastTelegramChat, checkVerificationCode } from '../../utils/telegramService';

function ToggleRow({ label, desc, initialChecked, onChange }) {
  const [active, setActive] = useState(initialChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', background: 'rgba(255,255,255,0.015)' }}>
      <div>
        <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '11px', color: '#a8b5ae' }}>{desc}</span>
      </div>
      <div className={`cfg-toggle ${active ? 'active' : ''}`} onClick={() => { setActive(!active); onChange(); }}>
        <div className="cfg-toggle-thumb" />
      </div>
    </div>
  );
}

export default function NotificationDefaultsCenter({ onChange, notifications: realNotificationsProp, onUpdateNotifications }) {
  // Prefer REAL persisted notifications from parent (Firebase-backed). Fall back gracefully.
  const notifications = realNotificationsProp || { email: true, sms: false, push: true, dailySummary: true };

  const [telegramEnabled, setTelegramEnabled] = useState(() => {
    return localStorage.getItem('voltiq.telegram.enabled') === 'true';
  });
  const [telegramChatId, setTelegramChatId] = useState(() => {
    return localStorage.getItem('voltiq.telegram.chatId') || '';
  });
  const [botInfo, setBotInfo] = useState(null);
  const [testStatus, setTestStatus] = useState(null); // 'sending', 'success', 'error'
  const [detectStatus, setDetectStatus] = useState(null); // 'detecting', 'found', 'not_found'
  const [detectedUser, setDetectedUser] = useState(null); // { chatId, username, firstName }

  // QR Code linking states
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isPolling, setIsPolling] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [linkedUser, setLinkedUser] = useState(() => {
    const saved = localStorage.getItem('voltiq.telegram.user');
    return saved ? JSON.parse(saved) : null;
  });

  // Controlled toggles that write back to real Firebase-backed state when possible
  const toggleRealNotif = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    if (onUpdateNotifications) onUpdateNotifications(updated);
    if (onChange) onChange();
  };

  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleRegenerateCode = () => {
    setIsSpinning(true);
    setVerificationCode(generateRandomCode());
    setTimeout(() => setIsSpinning(false), 600);
  };

  const handleDisconnect = () => {
    setTelegramChatId('');
    setLinkedUser(null);
    localStorage.removeItem('voltiq.telegram.chatId');
    localStorage.removeItem('voltiq.telegram.user');
    setVerificationCode(generateRandomCode());
    if (onChange) onChange();
  };

  const handleDetectChat = async () => {
    setDetectStatus('detecting');
    const detected = await detectLastTelegramChat();
    if (detected) {
      setDetectedUser(detected);
      setDetectStatus('found');
    } else {
      setDetectStatus('not_found');
      setTimeout(() => setDetectStatus(null), 6000);
    }
  };

  const handleApplyDetected = () => {
    if (detectedUser) {
      setTelegramChatId(detectedUser.chatId);
      localStorage.setItem('voltiq.telegram.chatId', detectedUser.chatId);
      setLinkedUser({
        firstName: detectedUser.firstName,
        username: detectedUser.username
      });
      localStorage.setItem('voltiq.telegram.user', JSON.stringify({
        firstName: detectedUser.firstName,
        username: detectedUser.username
      }));
      setDetectStatus(null);
      setDetectedUser(null);
      if (onChange) onChange();
    }
  };

  useEffect(() => {
    const fetchBotInfo = async () => {
      // ALWAYS use environment variable (no hardcoded secrets) for real security
      const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      if (!token) {
        console.warn('VITE_TELEGRAM_BOT_TOKEN not configured — Telegram features limited.');
        return;
      }
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const data = await res.json();
        if (data.ok) {
          setBotInfo(data.result);
        }
      } catch (err) {
        console.error('Failed to fetch bot info:', err);
      }
    };
    fetchBotInfo();
  }, []);

  // Generate code on mount / enable if not linked
  useEffect(() => {
    if (telegramEnabled && !telegramChatId && !verificationCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVerificationCode(generateRandomCode());
    }
  }, [telegramEnabled, telegramChatId, verificationCode]);

  // Auto-rotate verification code every 30 seconds
  useEffect(() => {
    if (telegramEnabled && !telegramChatId && verificationCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdown(30);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setVerificationCode(generateRandomCode());
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [telegramEnabled, telegramChatId, verificationCode]);

  // Polling for bot start message
  useEffect(() => {
    let intervalId = null;
    if (telegramEnabled && !telegramChatId && verificationCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPolling(true);
      intervalId = setInterval(async () => {
        const result = await checkVerificationCode(verificationCode);
        if (result) {
          clearInterval(intervalId);
          setIsPolling(false);
          
          setTelegramChatId(result.chatId);
          setLinkedUser({
            firstName: result.firstName,
            username: result.username
          });
          
          localStorage.setItem('voltiq.telegram.chatId', result.chatId);
          localStorage.setItem('voltiq.telegram.enabled', 'true');
          localStorage.setItem('voltiq.telegram.user', JSON.stringify({
            firstName: result.firstName,
            username: result.username
          }));
          
          // Send welcome message
          const welcomeText = `
🎉 <b>VoltIQ Bot Linked Successfully!</b> 🎉
----------------------------------------
Hello <b>${result.firstName}</b> ${result.username ? `(@${result.username})` : ''},
Your Telegram account is now connected to VoltIQ.

💡 You will receive real-time solar inverter failure & diagnostic alerts on this chat.
----------------------------------------
<i>VoltIQ AI Platform</i>
          `.trim();
          await sendTelegramMessage(result.chatId, welcomeText);
          
          if (onChange) onChange();
        }
      }, 2500);
    } else {
      setIsPolling(false);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [telegramEnabled, telegramChatId, verificationCode, onChange]);

  const handleToggleTelegram = () => {
    const nextVal = !telegramEnabled;
    setTelegramEnabled(nextVal);
    localStorage.setItem('voltiq.telegram.enabled', String(nextVal));
    if (onChange) onChange();
  };

  const handleChatIdChange = (e) => {
    const val = e.target.value.trim();
    setTelegramChatId(val);
    localStorage.setItem('voltiq.telegram.chatId', val);
    if (onChange) onChange();
  };

  const handleSendTest = async () => {
    if (!telegramChatId) {
      setTestStatus('error');
      return;
    }
    setTestStatus('sending');
    const text = `
🤖 <b>VoltIQ Connection Test</b> 🤖
----------------------------------------
Congratulations! Your Telegram notification link is now <b>ACTIVE</b>.
Your Chat ID <code>${telegramChatId}</code> is linked successfully.

You will receive real-time alerts when inverter anomalies are detected by VoltIQ AI.
----------------------------------------
<i>VoltIQ Platform Nexus</i>
`.trim();
    const success = await sendTelegramMessage(telegramChatId, text);
    if (success) {
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 3000);
    } else {
      setTestStatus('error');
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0; }
          50% { opacity: 0.35; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes pulse-dot {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .live-pulse-dot {
          animation: pulse-dot 2s infinite ease-in-out;
        }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin-once 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cyber-refresh-btn {
          width: 38px !important;
          height: 38px !important;
          padding: 0 !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
          background: rgba(212, 175, 55, 0.04) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          color: var(--gold) !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.02) !important;
        }
        .cyber-refresh-btn:hover {
          color: #fff !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.3) !important;
          background: rgba(212, 175, 55, 0.12) !important;
        }
        .cyber-refresh-btn:active {
          transform: scale(0.92) !important;
        }
        @media (max-width: 768px) {
          .integrated-link-container {
            flex-direction: column !important;
          }
          .integrated-link-left {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
            padding-right: 0 !important;
            padding-bottom: 24px !important;
          }
        }
      `}</style>

      <h2 className="cfg-title">Notifications & Alerts</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <ToggleRow label="Email Notifications" desc="Send daily summaries and critical alerts via email." initialChecked={notifications.email} onChange={() => toggleRealNotif('email')} />
        <ToggleRow label="SMS Notifications" desc="Send critical hardware alerts via text message." initialChecked={notifications.sms} onChange={() => toggleRealNotif('sms')} />
        <ToggleRow label="Push Notifications" desc="Send real-time alerts to mobile app." initialChecked={notifications.push} onChange={() => toggleRealNotif('push')} />
        <ToggleRow label="Daily Summary Report" desc="Generate and send end-of-day performance summary." initialChecked={notifications.dailySummary} onChange={() => toggleRealNotif('dailySummary')} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} style={{ color: 'var(--gold)' }} />
              Telegram Instant Alerts
            </h3>
            <p style={{ fontSize: '11px', color: '#a8b5ae', margin: 0, lineHeight: '1.4' }}>
              Receive instant inverter fault telemetry alerts on your phone.
            </p>
          </div>
          <div className={`cfg-toggle ${telegramEnabled ? 'active' : ''}`} onClick={handleToggleTelegram}>
            <div className="cfg-toggle-thumb" />
          </div>
        </div>

        {telegramEnabled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', padding: '16px' }}
          >
            {botInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', padding: '10px 12px', borderRadius: '4px', fontSize: '11.5px', color: 'var(--gold)' }}>
                <Bot size={14} />
                <span>Connected Telegram Bot: <b>{botInfo.first_name}</b> (<code>@{botInfo.username}</code>)</span>
              </div>
            )}

            {telegramChatId ? (
              /* LINKED STATE */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: 'rgba(101, 216, 59, 0.03)', 
                  border: '1px solid rgba(101, 216, 59, 0.15)', 
                  borderRadius: '6px', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ 
                    position: 'absolute', 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    border: '2px solid #65d83b', 
                    animation: 'pulse-ring 2s infinite ease-out'
                  }} />
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'rgba(101, 216, 59, 0.15)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    zIndex: 1
                  }}>
                    <CheckCircle size={28} style={{ color: '#65d83b' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px 0', fontWeight: 'bold' }}>Bot Linked Successfully!</h4>
                  <p style={{ fontSize: '11.5px', color: '#a8b5ae', margin: '0 0 12px 0' }}>
                    VoltIQ notifications are actively listening on your Telegram chat.
                  </p>
                  
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '8px 16px', fontSize: '12px', fontFamily: 'monospace' }}>
                    <span style={{ color: '#fff' }}>Chat ID: <code style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{telegramChatId}</code></span>
                    {linkedUser && (
                      <span style={{ fontSize: '10.5px', color: '#8c9f93', marginTop: '4px' }}>
                        User: {linkedUser.firstName} {linkedUser.username ? `(@${linkedUser.username})` : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                  <button 
                    className="interactive-btn"
                    onClick={handleSendTest}
                    disabled={testStatus === 'sending'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      background: testStatus === 'success' ? 'rgba(101, 216, 59, 0.15)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212,175,55,0.1)',
                      color: testStatus === 'success' ? '#65d83b' : testStatus === 'error' ? '#ef4444' : 'var(--gold)',
                      borderColor: testStatus === 'success' ? 'rgba(101,216,59,0.3)' : testStatus === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(212,175,55,0.3)',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {testStatus === 'sending' ? (
                      'Sending...'
                    ) : testStatus === 'success' ? (
                      <><CheckCircle size={13} /> Test Sent</>
                    ) : testStatus === 'error' ? (
                      <><AlertCircle size={13} /> Send Failed</>
                    ) : (
                      <><Send size={12} /> Test Connection</>
                    )}
                  </button>

                  <button 
                    className="interactive-btn"
                    onClick={handleDisconnect}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      color: '#ef4444',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <Trash2 size={12} />
                    Disconnect Bot
                  </button>
                </div>
              </motion.div>
            ) : (
              /* UNLINKED STATE - INTEGRATED AUTO & MANUAL PANEL */
              <div 
                className="integrated-link-container"
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '24px', 
                  background: 'rgba(255,255,255,0.015)', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '6px', 
                  padding: '20px' 
                }}
              >
                {/* Left Side: Automatic Link via QR */}
                <div 
                  className="integrated-link-left"
                  style={{ 
                    flex: '1 1 300px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px', 
                    borderRight: '1px solid rgba(255,255,255,0.05)', 
                    paddingRight: '24px' 
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>
                      Option A: Automatic Link (Recommended)
                    </h4>
                    <p style={{ fontSize: '11px', color: '#a8b5ae', margin: 0, lineHeight: '1.4' }}>
                      Scan the QR code or click it to open the bot, then click Start to link.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    {/* QR Code Graphic Wrapper */}
                    <a 
                      href={`https://t.me/${botInfo?.username || 'VoltIQAssistantBot'}?start=${verificationCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Click to open Telegram Bot"
                      style={{ 
                        position: 'relative',
                        padding: '12px', 
                        background: '#151817', 
                        borderRadius: '8px', 
                        border: '1px dashed rgba(212,175,55,0.3)',
                        display: 'inline-flex',
                        boxShadow: '0 0 15px rgba(212,175,55,0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(212,175,55,0.05)';
                      }}
                    >
                      {verificationCode ? (
                        <div style={{ padding: '8px', background: '#151817', borderRadius: '4px' }}>
                          <QRCodeSVG 
                            value={`https://t.me/${botInfo?.username || 'VoltIQAssistantBot'}?start=${verificationCode}`}
                            size={120}
                            bgColor="#151817"
                            fgColor="#d4af37"
                            level="Q"
                            includeMargin={false}
                            style={{ display: 'block' }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: '130px', height: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                          <QrCode size={36} style={{ color: 'rgba(212,175,55,0.3)' }} />
                        </div>
                      )}
                      
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        opacity: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '8px',
                        transition: 'opacity 0.2s ease',
                        color: 'var(--gold)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <ExternalLink size={18} />
                        <span style={{ fontSize: '9px', fontWeight: 'bold' }}>OPEN BOT</span>
                      </div>
                    </a>

                    {/* Numeric Code Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
                      <span style={{ fontSize: '10px', color: '#8c9f93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Connection Code</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold', 
                          fontFamily: 'monospace', 
                          color: '#fff', 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.08)',
                          padding: '4px 16px', 
                          borderRadius: '6px',
                          letterSpacing: '3px',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                        }}>
                          {verificationCode ? `${verificationCode.slice(0, 3)} ${verificationCode.slice(3)}` : '------'}
                        </div>
                        
                        <button 
                          type="button"
                          onClick={handleRegenerateCode}
                          title="Refresh verification code"
                          className="cyber-refresh-btn"
                        >
                          <RefreshCw size={16} className={isSpinning ? 'spin-animation' : ''} />
                        </button>
                      </div>

                      {/* Auto-rotation Countdown & Progress Bar */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '2px', width: '100%' }}>
                        <div style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${(countdown / 30) * 100}%`, 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #d4af37, #ffd700)', 
                            boxShadow: '0 0 4px var(--gold)',
                            transition: countdown === 30 ? 'none' : 'width 1s linear'
                          }} />
                        </div>
                        <span style={{ fontSize: '9px', color: '#8c9f93', fontFamily: 'monospace' }}>
                          Auto-rotates in <strong style={{ color: 'var(--gold)' }}>{countdown}s</strong>
                        </span>
                      </div>
                    </div>

                    {/* Scanning / Live Polling Alert Box */}
                    <div style={{ 
                      width: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '2px', 
                      background: 'rgba(212,175,55,0.02)', 
                      border: '1px solid rgba(212,175,55,0.08)', 
                      borderRadius: '4px', 
                      padding: '8px 10px',
                      fontSize: '11px',
                      color: 'var(--gold)',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="live-pulse-dot" style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: 'var(--gold)',
                          boxShadow: '0 0 6px var(--gold)'
                        }} />
                        <span style={{ fontWeight: 'bold' }}>
                          {isPolling ? 'Waiting for your message...' : 'Connection listener paused.'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <a 
                      href={`https://t.me/${botInfo?.username || 'VoltIQAssistantBot'}?start=${verificationCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '8px 12px',
                        background: 'var(--gold)',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(212,175,55,0.15)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <Bot size={14} />
                      Open @{botInfo?.username || 'VoltIQAssistantBot'}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Right Side: Manual Link */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>
                      Option B: Manual Connection
                    </h4>
                    <p style={{ fontSize: '11px', color: '#a8b5ae', margin: 0, lineHeight: '1.4' }}>
                      Configure your Chat ID manually if automatic QR linking fails.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="cyber-form-label" style={{ fontSize: '11px', color: '#a8b5ae' }}>Your Telegram Chat ID</label>
                        <button 
                          type="button" 
                          onClick={handleDetectChat} 
                          disabled={detectStatus === 'detecting'}
                          style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                        >
                          {detectStatus === 'detecting' ? '🔍 Checking...' : '🔍 Auto-Detect Chat ID'}
                        </button>
                      </div>
                      
                      {detectStatus === 'found' && detectedUser && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(101,216,59,0.08)', border: '1px solid rgba(101,216,59,0.2)', padding: '10px 12px', borderRadius: '4px', fontSize: '11.5px', marginBottom: '8px' }}
                        >
                          <span style={{ color: '#65d83b' }}>
                            Detected Account: <b>{detectedUser.firstName}</b> {detectedUser.username ? `(@${detectedUser.username})` : ''} (ID: <code>{detectedUser.chatId}</code>)
                          </span>
                          <button 
                            type="button"
                            onClick={handleApplyDetected}
                            style={{ background: 'var(--gold)', border: 'none', padding: '4px 10px', color: '#000', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            Use ID
                          </button>
                        </motion.div>
                      )}

                      {detectStatus === 'not_found' && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 12px', borderRadius: '4px', fontSize: '11.5px', color: '#ef4444', marginBottom: '8px', lineHeight: '1.4' }}
                        >
                          <AlertCircle size={14} style={{ flexShrink: 0 }} />
                          <span>No recent messages found. Open Telegram, send /start to @VoltIQAssistantBot, then try again!</span>
                        </motion.div>
                      )}

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input 
                          type="text" 
                          className="cyber-input" 
                          placeholder="e.g. 184758291" 
                          value={telegramChatId}
                          onChange={handleChatIdChange}
                          style={{ flex: 1, minWidth: '0', height: '38px', fontSize: '13px', fontFamily: 'monospace' }}
                        />
                        <button 
                          className="interactive-btn"
                          onClick={handleSendTest}
                          disabled={testStatus === 'sending'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 16px',
                            fontSize: '12.5px',
                            minHeight: 'auto',
                            width: 'auto',
                            flexShrink: 0,
                            background: testStatus === 'success' ? 'rgba(101, 216, 59, 0.15)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212,175,55,0.1)',
                            color: testStatus === 'success' ? '#65d83b' : testStatus === 'error' ? '#ef4444' : 'var(--gold)',
                            borderColor: testStatus === 'success' ? 'rgba(101,216,59,0.3)' : testStatus === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(212,175,55,0.3)',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          {testStatus === 'sending' ? (
                            'Sending...'
                          ) : testStatus === 'success' ? (
                            <><CheckCircle size={14} /> Success</>
                          ) : testStatus === 'error' ? (
                            <><AlertCircle size={14} /> Error</>
                          ) : (
                            <><Send size={12} /> Test Link</>
                          )}
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '10.5px', color: '#8c9f93', lineHeight: '1.5', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px' }}>
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>How to manually link:</strong>
                      1. Open Telegram & search for <b>@VoltIQAssistantBot</b>. Click Start.<br />
                      2. Open <b>@userinfobot</b> on Telegram to retrieve your numeric Chat ID.<br />
                      3. Enter your Chat ID above and click Test Link to verify.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
