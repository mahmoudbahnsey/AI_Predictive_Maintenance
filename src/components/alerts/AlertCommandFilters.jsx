import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

function CustomSelect({ options, defaultValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={ref} style={{ minWidth: '160px' }}>
      <button className={`custom-select-button ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} style={{ background: 'rgba(8,8,8,0.9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected}
        </div>
      </button>
      {isOpen && (
        <div className="custom-select-menu">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`custom-select-item ${selected === opt ? 'selected' : ''}`}
              onClick={() => { setSelected(opt); setIsOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AlertCommandFilters() {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '16px', 
      background: 'rgba(8, 8, 8, 0.95)', 
      border: '1px solid rgba(255, 255, 255, 0.05)', 
      borderRadius: '4px', 
      padding: '16px',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '32px'
    }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#a8b5ae" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search Alert ID..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px 8px 32px', borderRadius: '4px', color: '#fff', fontSize: '12px', outline: 'none', width: '200px' }} />
        </div>
        <CustomSelect options={['All Statuses', 'UNACKNOWLEDGED', 'ACKNOWLEDGED', 'ESCALATED', 'MUTED']} defaultValue="UNACKNOWLEDGED" />
        <CustomSelect options={['All Severities', 'Critical', 'Warning', 'Info']} defaultValue="All Severities" />
        <CustomSelect options={['All SLA States', 'Breached', 'At Risk', 'Normal']} defaultValue="All SLA States" />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', minHeight: 'auto' }}>
          Clear Filters
        </button>
        <button className="interactive-btn" style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', minHeight: 'auto', border: '1px solid rgba(212,175,55,0.3)' }}>
          Export Active Alerts
        </button>
      </div>
    </div>
  );
}
