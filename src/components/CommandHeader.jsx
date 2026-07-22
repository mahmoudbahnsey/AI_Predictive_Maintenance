import {
  Activity,
  Bell,
  Bot,
  FileText,
  LogOut,
  Search,
  Settings,
  Zap,
  ChevronDown,
  User,
  Database,
  Menu,
  X,
  LayoutDashboard,
  Cpu,
  Users
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loadTelemetryAnalysis } from '../utils/faultAnalyzer';
import { mockAlerts as initialMockAlerts } from '../data/mockAlertsData';

const commandNav = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Activity },
  { id: 'systems', label: 'Systems', path: '/systems', icon: Settings },
  { id: 'alerts', label: 'Alerts', path: '/alerts', icon: Bell },
  { id: 'reports', label: 'Reports', path: '/reports', icon: FileText },
  { id: 'data', label: 'Data', path: '/data', icon: Database },
];

export default function CommandHeader({ activePage = 'dashboard' }) {
  const navigate = useNavigate();
  const { user, userProfile, logout, isAdmin } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('voltiq-theme') || 'standard';
  });
  const [headerCustomColor, setHeaderCustomColor] = useState(() => {
    return localStorage.getItem('voltiq-custom-color') || '#00ffff';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analysis, setAnalysis] = useState(() => loadTelemetryAnalysis());

  useEffect(() => {
    const refreshAnalysis = () => setAnalysis(loadTelemetryAnalysis());
    window.addEventListener('storage', refreshAnalysis);
    window.addEventListener('voltiq-analysis-updated', refreshAnalysis);
    return () => {
      window.removeEventListener('storage', refreshAnalysis);
      window.removeEventListener('voltiq-analysis-updated', refreshAnalysis);
    };
  }, []);

  const activeAlertsCount = (!analysis || !analysis.alerts || analysis.alerts.length === 0)
    ? initialMockAlerts.length
    : analysis.alerts.length;

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

  const themes = [
    { id: 'standard', name: 'VoltIQ Standard', color: '#f5b914' },
    { id: 'cyber-green', name: 'Cyber Green', color: '#4ade80' },
    { id: 'deep-blue', name: 'Deep Blue', color: '#38bdf8' },
    { id: 'red-alert', name: 'Red Alert', color: '#f87171' },
    { id: 'cozy-lavender', name: 'Cozy Lavender', color: '#c084fc' },
    { id: 'solarized-sepia', name: 'Solarized Sepia', color: '#fb923c' },
    { id: 'rose-velvet', name: 'Rose Velvet', color: '#f472b6' },
    { id: 'minimal-dark', name: 'Minimal Dark', color: '#a8b5ae' },
    { id: 'high-contrast', name: 'High Contrast', color: '#a3e635' },
    { id: 'custom', name: 'Custom Color', color: headerCustomColor },
  ];

  const applyCustomColor = (colorHex) => {
    const hex = colorHex.trim();
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;

    document.body.style.setProperty('--voltiq-gold', hex);
    document.body.style.setProperty('--gold', hex);
    document.body.style.setProperty('--voltiq-gold-soft', hex);
    document.body.style.setProperty('--voltiq-gold-muted', `rgba(${r}, ${g}, ${b}, 0.15)`);
    document.body.style.setProperty('--gold-soft', `rgba(${r}, ${g}, ${b}, 0.12)`);
    document.body.style.setProperty('--voltiq-shadow-gold', `0 0 28px rgba(${r}, ${g}, ${b}, 0.25)`);
    document.body.style.setProperty('--gold-glow', `0 0 28px rgba(${r}, ${g}, ${b}, 0.25)`);
    document.body.style.setProperty('--voltiq-border', `rgba(${r}, ${g}, ${b}, 0.2)`);
    document.body.style.setProperty('--border', `rgba(${r}, ${g}, ${b}, 0.2)`);
    document.body.style.setProperty('--voltiq-border-strong', `rgba(${r}, ${g}, ${b}, 0.4)`);
    document.body.style.setProperty('--border-strong', `rgba(${r}, ${g}, ${b}, 0.4)`);
  };

  const clearCustomThemeStyles = () => {
    document.body.style.removeProperty('--voltiq-gold');
    document.body.style.removeProperty('--gold');
    document.body.style.removeProperty('--voltiq-gold-soft');
    document.body.style.removeProperty('--voltiq-gold-muted');
    document.body.style.removeProperty('--gold-soft');
    document.body.style.removeProperty('--gold-glow');
    document.body.style.removeProperty('--voltiq-border');
    document.body.style.removeProperty('--border');
    document.body.style.removeProperty('--voltiq-border-strong');
    document.body.style.removeProperty('--border-strong');
    document.body.style.removeProperty('--voltiq-shadow-gold');
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('voltiq-theme', currentTheme);
    if (currentTheme === 'custom') {
      applyCustomColor(headerCustomColor);
      window.dispatchEvent(new CustomEvent('voltiq-theme-change', { detail: { theme: 'custom', color: headerCustomColor } }));
    } else {
      clearCustomThemeStyles();
      window.dispatchEvent(new CustomEvent('voltiq-theme-change', { detail: { theme: currentTheme } }));
    }
  }, [currentTheme, headerCustomColor]);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && e.detail.theme) {
        if (e.detail.theme !== currentTheme) {
          setCurrentTheme(e.detail.theme);
        }
        if (e.detail.theme === 'custom' && e.detail.color && e.detail.color !== headerCustomColor) {
          setHeaderCustomColor(e.detail.color);
        }
      }
    };
    window.addEventListener('voltiq-theme-change', handleThemeChange);
    return () => window.removeEventListener('voltiq-theme-change', handleThemeChange);
  }, [currentTheme, headerCustomColor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K listener for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          if (document.activeElement === searchInputRef.current) {
            searchInputRef.current.blur();
          } else {
            searchInputRef.current.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBotClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-voltiq-bot'));
  };

  const activeThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'VoltIQ User';
  const nameParts = displayName.trim().split(' ');
  const firstName = nameParts[0];
  const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
  const shortName = `${firstName} ${lastNameInitial}`.trim();

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
      setIsSigningOut(false);
    }
  };

  return (
    <header className="dashboard-header command-header">
      <NavLink to="/" className="au-brand" style={{ marginBottom: 0, marginRight: '16px', paddingLeft: '4px' }}>
        <Zap size={18} className="au-brand__icon" />
        <span className="au-brand__name" style={{ fontSize: '18px' }}>VoltIQ</span>
      </NavLink>

      <nav className="command-nav" aria-label="Primary command navigation">
        {commandNav.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`command-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        type="button" 
        className="command-tool command-icon mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <div className="au-brand">
              <Zap size={22} className="au-brand__icon" />
              <span className="au-brand__name">VoltIQ</span>
            </div>
            <button 
              className="close-mobile-menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mobile-menu-content">
            <div className="mobile-menu-section">
              <h3>Main Operations</h3>
              <button className={`mobile-menu-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button className={`mobile-menu-item ${activePage === 'systems' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/systems'); }}>
                <Zap size={18} /> Systems
              </button>
              <button className={`mobile-menu-item ${activePage === 'alerts' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/alerts'); }}>
                <Bell size={18} /> Alerts
              </button>
              <button className={`mobile-menu-item ${activePage === 'reports' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/reports'); }}>
                <FileText size={18} /> Reports
              </button>
              <button className={`mobile-menu-item ${activePage === 'data' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/data'); }}>
                <Database size={18} /> Data Intake
              </button>
            </div>
            
            <div className="mobile-menu-section">
              <h3>System</h3>
              {isAdmin && (
                <button className={`mobile-menu-item ${activePage === 'ai-training' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/ai-training'); }}>
                  <Cpu size={18} /> AI Training Center
                </button>
              )}
              <button className={`mobile-menu-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/settings'); }}>
                <Settings size={18} /> Settings
              </button>
              {isAdmin && (
                <button className={`mobile-menu-item ${activePage === 'users' ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/users'); }}>
                  <Users size={18} /> Users
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="command-tools">
        <div className="command-search-container">
          <Search size={16} className="command-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="command-search-input"
          />
          <span className="command-search-shortcut">Ctrl K</span>
        </div>

        {/* Theme Selector Dropdown */}
        <div className="command-theme-wrapper" ref={themeMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`command-tool command-theme ${isThemeMenuOpen ? 'active' : ''}`}
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 14px',
              minWidth: '162px',
              justifyContent: 'space-between',
              height: '44px',
              borderColor: isThemeMenuOpen ? 'var(--gold)' : '',
              background: isThemeMenuOpen ? 'rgba(212, 175, 55, 0.05)' : ''
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                className="theme-dot" 
                style={{ 
                  backgroundColor: activeThemeObj.color,
                  boxShadow: `0 0 12px ${activeThemeObj.color}`,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%'
                }} 
              />
              <strong style={{ fontSize: '13px', fontWeight: '800', color: '#f3f8f5' }}>{activeThemeObj.name}</strong>
            </div>
            <ChevronDown 
              size={14} 
              style={{ 
                transform: isThemeMenuOpen ? 'rotate(180deg)' : 'rotate(0)', 
                transition: 'transform 0.2s',
                color: isThemeMenuOpen ? 'var(--gold)' : 'var(--text-muted)'
              }} 
            />
          </button>

          {isThemeMenuOpen && (
            <div 
              className="command-user-dropdown" 
              style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '8px', 
                minWidth: '180px',
                zIndex: 400,
                border: '1px solid #1c231f',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                background: 'rgba(2, 9, 7, 0.98)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div style={{ padding: '6px 0' }}>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="cmd-dropdown-item"
                    onClick={() => {
                      setCurrentTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 14px',
                      background: currentTheme === t.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                      textAlign: 'left',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        className="theme-dot" 
                        style={{ 
                          backgroundColor: t.color,
                          boxShadow: `0 0 8px ${t.color}`,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%'
                        }} 
                      />
                      <span style={{ 
                        color: currentTheme === t.id ? 'var(--gold)' : '#E8F0EA',
                        fontWeight: currentTheme === t.id ? 700 : 500,
                        fontSize: '13px'
                      }}>{t.name}</span>
                    </div>
                    {currentTheme === t.id && <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="button" className="command-tool command-icon" aria-label="Watttson AI" onClick={handleBotClick}>
          <Bot size={24} />
        </button>

        <button type="button" className="command-tool command-icon command-bell" aria-label="Notifications" onClick={() => navigate('/alerts')}>
          <Bell size={23} />
          {activeAlertsCount > 0 && <span className="notice-count">{activeAlertsCount}</span>}
        </button>

        <div className="command-user-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
          <button 
            type="button" 
            className={`command-user ${isUserMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
            title="User Menu"
            style={{ 
              borderColor: isUserMenuOpen ? 'var(--gold)' : '',
              background: isUserMenuOpen ? 'rgba(212, 175, 55, 0.05)' : ''
            }}
          >
            <span className="command-avatar" style={{ 
              border: isUserMenuOpen ? '1px solid var(--gold)' : '',
              color: isUserMenuOpen ? 'var(--gold)' : ''
            }}>{initials || 'AM'}</span>
            <span>
              <strong>
                <span className="name-full">{displayName}</span>
                <span className="name-short">{shortName}</span>
              </strong>
              <small>{isAdmin ? 'Administrator' : 'Operator'}</small>
            </span>
            <ChevronDown 
              size={14} 
              style={{ 
                marginLeft: '6px', 
                color: isUserMenuOpen ? 'var(--gold)' : 'var(--text-muted)',
                transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease, color 0.3s ease'
              }} 
            />
          </button>

          {isUserMenuOpen && (
            <div className="command-user-dropdown">
              
              <div style={{ padding: '16px', borderBottom: '1px solid #1c231f', background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="command-avatar" style={{ width: '40px', height: '40px', fontSize: '14px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}>
                    {initials || 'AM'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: '#E8F0EA', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                    <div style={{ color: '#8A9990', fontSize: '12px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '8px 0' }}>
                <button className="cmd-dropdown-item" onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }}>
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="cmd-dropdown-item" onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }}>
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
              </div>
              
              <div style={{ height: '1px', backgroundColor: '#1c231f' }} />
              
              <div style={{ padding: '8px 0' }}>
                <button className="cmd-dropdown-item cmd-dropdown-item-danger" onClick={handleLogout} disabled={isSigningOut}>
                  <LogOut size={16} />
                  <span>{isSigningOut ? 'Signing out...' : 'Sign out securely'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
