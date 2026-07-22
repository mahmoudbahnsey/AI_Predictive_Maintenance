import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SettingsDropdown({ options, value, onChange, placeholder = "Select an option...", searchable = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && searchable) {
      // Focus search after open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else if (!next) {
      setSearchTerm('');
    }
  };

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="command-theme-wrapper" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        className={`cfg-input ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderColor: isOpen ? 'var(--gold)' : '',
          boxShadow: isOpen ? '0 0 0 1px var(--gold), 0 0 15px rgba(212, 175, 55, 0.2)' : '',
          padding: '12px 16px',
          height: 'auto',
          minHeight: '44px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedOption?.color && (
            <span 
              className="theme-dot" 
              style={{ 
                backgroundColor: selectedOption.color,
                boxShadow: `0 0 12px ${selectedOption.color}`,
                width: '10px',
                height: '10px',
                borderRadius: '50%'
              }} 
            />
          )}
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
            transition: 'transform 0.2s',
            color: isOpen ? 'var(--gold)' : '#a8b5ae'
          }} 
        />
      </button>

      {isOpen && (
        <div 
          className="command-user-dropdown" 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0,
            right: 0,
            marginTop: '8px', 
            zIndex: 400,
            border: '1px solid #1c231f',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            background: 'rgba(2, 9, 7, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Search box for large lists / searchable dropdowns */}
          {searchable && (
            <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search time zones (e.g. -8, +1, Pacific)..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setSearchTerm('');
                  }
                }}
              />
            </div>
          )}

          <div style={{ padding: '4px 0', maxHeight: '260px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 && (
              <div style={{ padding: '12px 14px', color: '#6a7b73', fontSize: '12px' }}>
                No matches for "{searchTerm}"
              </div>
            )}
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="cmd-dropdown-item"
                onClick={() => handleSelect(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  background: value === opt.value ? 'rgba(255,255,255,0.03)' : 'transparent',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = value === opt.value ? 'rgba(255,255,255,0.03)' : 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {opt.color && (
                    <span 
                      className="theme-dot" 
                      style={{ 
                        backgroundColor: opt.color,
                        boxShadow: `0 0 8px ${opt.color}`,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%'
                      }} 
                    />
                  )}
                  <span style={{ 
                    color: value === opt.value ? 'var(--gold)' : '#E8F0EA',
                    fontWeight: value === opt.value ? 700 : 500,
                    fontSize: '13px'
                  }}>{opt.label}</span>
                </div>
                {value === opt.value && <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
