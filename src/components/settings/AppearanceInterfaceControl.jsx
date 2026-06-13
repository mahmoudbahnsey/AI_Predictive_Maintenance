import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SettingsDropdown from './SettingsDropdown';

const themeOptions = [
  { value: 'standard', label: 'VoltIQ Standard', color: '#f5b914' },
  { value: 'cyber-green', label: 'Cyber Green', color: '#4ade80' },
  { value: 'deep-blue', label: 'Deep Blue', color: '#38bdf8' },
  { value: 'red-alert', label: 'Red Alert', color: '#f87171' },
  { value: 'cozy-lavender', label: 'Cozy Lavender', color: '#c084fc' },
  { value: 'solarized-sepia', label: 'Solarized Sepia', color: '#fb923c' },
  { value: 'rose-velvet', label: 'Rose Velvet', color: '#f472b6' },
  { value: 'minimal-dark', label: 'Minimal Dark', color: '#a8b5ae' },
  { value: 'high-contrast', label: 'High Contrast', color: '#a3e635' },
  { value: 'custom', label: 'Custom Color', color: '#00ffff' },
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact (Data Heavy)' },
];

export default function AppearanceInterfaceControl({ onChange }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('voltiq-theme') || 'standard');
  const [customColor, setCustomColor] = useState(() => localStorage.getItem('voltiq-custom-color') || '#00ffff');
  const [density, setDensity] = useState('comfortable');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && e.detail.theme) {
        if (e.detail.theme !== theme) {
          setTheme(e.detail.theme);
        }
        if (e.detail.theme === 'custom' && e.detail.color && e.detail.color !== customColor) {
          setCustomColor(e.detail.color);
        }
      }
    };
    window.addEventListener('voltiq-theme-change', handleThemeChange);
    return () => window.removeEventListener('voltiq-theme-change', handleThemeChange);
  }, [theme, customColor]);

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

  const handleThemeSelect = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('voltiq-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);

    if (newTheme === 'custom') {
      applyCustomColor(customColor);
      window.dispatchEvent(new CustomEvent('voltiq-theme-change', { detail: { theme: 'custom', color: customColor } }));
    } else {
      clearCustomThemeStyles();
      window.dispatchEvent(new CustomEvent('voltiq-theme-change', { detail: { theme: newTheme } }));
    }
    if (onChange) onChange();
  };

  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    localStorage.setItem('voltiq-custom-color', newColor);
    
    // Automatically switch to custom theme if editing color
    setTheme('custom');
    localStorage.setItem('voltiq-theme', 'custom');
    document.body.setAttribute('data-theme', 'custom');
    applyCustomColor(newColor);
    
    window.dispatchEvent(new CustomEvent('voltiq-theme-change', { detail: { theme: 'custom', color: newColor } }));
    if (onChange) onChange();
  };

  return (
    <motion.div className="cfg-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <h2 className="cfg-title">Appearance & Theme</h2>
      <p style={{ color: '#a3b3aa', fontSize: '13px', marginTop: '-16px', marginBottom: '24px', lineHeight: '1.6' }}>
        Adjust visual theme colors, interface density options, and motion behaviors for your local terminal dashboard.
      </p>
      
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '24px' }} />

      <div className="cfg-field" style={{ marginBottom: '32px' }}>
        <label className="cfg-label" style={{ fontSize: '12px', marginBottom: '16px', display: 'block' }}>Control Room Theme</label>
        <div className="cfg-theme-selector-grid">
          {themeOptions.map((opt) => {
            const isActive = theme === opt.value;
            const isCustom = opt.value === 'custom';
            const displayColor = isCustom ? customColor : opt.color;
            
            return (
              <div
                key={opt.value}
                className={`cfg-theme-card ${isActive ? 'active' : ''}`}
                onClick={() => handleThemeSelect(opt.value)}
                style={
                  isActive
                    ? {
                        borderColor: displayColor,
                        background: `${displayColor}0a`,
                        boxShadow: `0 0 16px ${displayColor}22`,
                      }
                    : {}
                }
              >
                <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                  <span
                    className="cfg-theme-dot"
                    style={{
                      backgroundColor: displayColor,
                      boxShadow: isActive ? `0 0 12px ${displayColor}` : 'none',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      display: 'block',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                  {isCustom && (
                    <input
                      type="color"
                      value={customColor}
                      onChange={handleCustomColorChange}
                      onClick={(e) => e.stopPropagation()} // Prevent card double click trigger
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                      }}
                      title="Choose custom color"
                    />
                  )}
                </div>
                <span className="cfg-theme-name" style={{ color: isActive ? '#fff' : '' }}>
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '24px' }} />

      <div className="cfg-grid-2">
        <div className="cfg-field">
          <label className="cfg-label">Density</label>
          <SettingsDropdown 
            options={densityOptions} 
            value={density} 
            onChange={(val) => {
              setDensity(val);
              onChange();
            }} 
          />
        </div>
        <div className="cfg-field">
          <label className="cfg-label">Reduced Motion</label>
          <div style={{ marginTop: '8px' }}>
            <div 
              className={`cfg-toggle ${reducedMotion ? 'active' : ''}`} 
              onClick={() => {
                setReducedMotion(!reducedMotion);
                onChange();
              }}
            >
              <div className="cfg-toggle-thumb" />
            </div>
            <span style={{ fontSize: '11px', color: '#6a7b73', display: 'block', marginTop: '6px' }}>
              Minimize animations and visual transition durations.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
