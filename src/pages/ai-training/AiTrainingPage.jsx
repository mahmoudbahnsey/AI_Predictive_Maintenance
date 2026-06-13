import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, UploadCloud, FileText, Play, CheckCircle, Cpu, ShieldCheck, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { db } from '../../config/firebase';
import Sidebar from '../../components/Sidebar';
import CommandHeader from '../../components/CommandHeader';
import '../../styles/ai-training.css';
import { mockModels } from '../../data/mockAiTrainingData';

import AiModelFoundryHero from '../../components/ai-training/AiModelFoundryHero';
import ConfusionMatrixMisclassificationLab from '../../components/ai-training/ConfusionMatrixMisclassificationLab';
import AiTrainingHistoryTable from '../../components/ai-training/AiTrainingHistoryTable';

function CustomSelect({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ padding: '12px', fontSize: '13px', background: '#0c110e', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown size={14} className={`custom-select-caret ${isOpen ? 'open' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ zIndex: 1200 }}
          >
            {options.map(opt => (
              <div 
                key={opt.value} 
                className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{ padding: '10px 12px', fontSize: '13.5px' }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AiTrainingPage() {
  const [models, setModels] = useState([]);
  const [file, setFile] = useState(null);
  const [lastTrainedModelId, setLastTrainedModelId] = useState(null);

  // Sync models with Firebase Realtime Database
  useEffect(() => {
    const modelsRef = ref(db, 'aiModels');
    const unsubscribe = onValue(modelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let list = [];
        if (Array.isArray(data)) {
          list = data.filter(Boolean);
        } else {
          list = Object.keys(data).map(key => ({
            ...data[key],
            id: key
          }));
        }

        // Ensure records and driftRisk are populated with real values if missing in DB
        const sanitizedList = list.map(m => ({
          ...m,
          records: m.records || (m.version === 'v4.2.0-stable' ? '12.4M' : m.version === 'v4.1.5-archived' ? '10.1M' : '4.2M'),
          driftRisk: m.driftRisk || 'Low'
        }));

        sanitizedList.sort((a, b) => new Date(b.started) - new Date(a.started));
        setModels(sanitizedList);
      } else {
        const bootstrapData = {};
        mockModels.forEach(m => {
          bootstrapData[m.id] = {
            ...m,
            records: m.records || (m.version === 'v4.2.0-stable' ? '12.4M' : m.version === 'v4.1.5-archived' ? '10.1M' : '4.2M'),
            driftRisk: m.driftRisk || 'Low'
          };
        });
        set(modelsRef, bootstrapData);
      }
    });
    return () => unsubscribe();
  }, []);
  const [fileData, setFileData] = useState({ name: '', rows: 0, cols: 0, headers: [], preview: [] });
  const [targetGoal, setTargetGoal] = useState('Inverter Faults');
  const [trainingSpeed, setTrainingSpeed] = useState('fast'); // fast, deep
  
  // Training states
  const [step, setStep] = useState('idle'); // idle, loaded, training, complete
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('System ready. Upload a dataset to begin.');
  const [logsList, setLogsList] = useState([]);
  const [valAccuracy, setValAccuracy] = useState('98.7%');
  const [f1Score, setF1Score] = useState('0.97');

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logsList]);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process and Parse CSV File
  const parseCSV = (textFile, fileName) => {
    try {
      const lines = textFile.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length === 0) return;

      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      const previewRows = lines.slice(1, 4).map(line => line.split(',').map(v => v.replace(/"/g, '')));

      setFileData({
        name: fileName,
        rows: lines.length - 1,
        cols: headers.length,
        headers: headers,
        preview: previewRows
      });
      setFile(true);
      setStep('loaded');
      setCurrentLog(`Dataset "${fileName}" loaded. Ready to configure and train.`);
      setLogsList([{ time: new Date().toLocaleTimeString(), text: `Loaded dataset: ${fileName} (${lines.length - 1} rows)` }]);
    } catch (err) {
      console.error("Error parsing CSV:", err);
      // Fallback
      setFileData({
        name: fileName,
        rows: 4200,
        cols: 6,
        headers: ["Timestamp", "Voltage", "Current", "Temp", "Efficiency", "FaultCode"],
        preview: [
          ["2026-06-13 07:00", "230.1", "12.4", "45.2", "98.1", "0"],
          ["2026-06-13 07:05", "230.4", "12.5", "45.5", "98.2", "0"]
        ]
      });
      setFile(true);
      setStep('loaded');
      setCurrentLog(`Dataset "${fileName}" loaded with fallback mapping. Ready to configure and train.`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        parseCSV(event.target.result, droppedFile.name);
      };
      reader.readAsText(droppedFile);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        parseCSV(event.target.result, selectedFile.name);
      };
      reader.readAsText(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Run Training Simulation
  const startTraining = () => {
    setStep('training');
    setProgress(0);
    setLogsList([
      { time: new Date().toLocaleTimeString(), text: "Initializing training workspace..." },
      { time: new Date().toLocaleTimeString(), text: `Target column configured: ${targetGoal}` },
      { time: new Date().toLocaleTimeString(), text: `Mode: ${trainingSpeed === 'deep' ? 'Deep Intelligence' : 'Quick Train'}` }
    ]);

    const steps = [
      { p: 10, text: "Opening CSV dataset and checking schema..." },
      { p: 25, text: "Filtering out noisy temperature records..." },
      { p: 45, text: "Auto-mapping telemetry features (Voltage, Temperature)..." },
      { p: 65, text: "Fitting Random Forest ensemble classifier models..." },
      { p: 80, text: "Validating predictions on unseen test split..." },
      { p: 95, text: "Running early stopping validation check..." },
      { p: 100, text: "Model training complete! Evaluating accuracy..." }
    ];

    let currentStepIdx = 0;
    const intervalTime = trainingSpeed === 'fast' ? 80 : 180; // duration ~8s or ~18s

    const timer = setInterval(() => {
      setProgress(prev => {
        const nextVal = prev + 1;

        if (currentStepIdx < steps.length && nextVal >= steps[currentStepIdx].p) {
          const s = steps[currentStepIdx];
          setCurrentLog(s.text);
          setLogsList(l => [...l, { time: new Date().toLocaleTimeString(), text: s.text }]);
          currentStepIdx++;
        }

        if (nextVal >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Dynamic accuracy calculation based on model options (realistic for Univ project)
            let baseAcc = 90.5; // Baseline
            if (targetGoal === 'Inverter Faults') baseAcc = 91.2;
            else if (targetGoal === 'Panel Degradation') baseAcc = 87.8;
            else if (targetGoal === 'Grid Anomalies') baseAcc = 89.4;
            else if (targetGoal === 'Thermal Overheats') baseAcc = 90.8;

            // Effect of training depth
            const depthBonus = trainingSpeed === 'deep' ? (2.1 + Math.random() * 1.4) : (Math.random() * 1.1 - 0.5);

            // Effect of dataset size
            let dataBonus = 0;
            if (fileData.rows > 0) {
              if (fileData.rows < 1000) dataBonus = -5.4; // Not enough training samples
              else if (fileData.rows > 10000) dataBonus = 1.8;
              else dataBonus = 0.5;
            }

            const accNum = parseFloat((baseAcc + depthBonus + dataBonus).toFixed(1));
            const accVal = `${accNum}%`;
            
            // F1-score is mathematically related to accuracy + a bit of variance
            const f1Val = (accNum / 100 - (0.02 + Math.random() * 0.02)).toFixed(2);
            
            setValAccuracy(accVal);
            setF1Score(f1Val);
            setStep('complete');
            setCurrentLog(`Training finished successfully with validation accuracy: ${accVal}`);
            setLogsList(l => [...l, { time: new Date().toLocaleTimeString(), text: `Training finished. Accuracy: ${accVal}, F1: ${f1Val}` }]);

            // Automatically save to database as CANDIDATE when training completes
            const modelId = `TRN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
            
            // Format records dynamically based on CSV row count (in K for university project scale)
            const getFormattedRecords = (rows) => {
              if (!rows) return '8.5K';
              if (rows >= 1000000) return `${(rows / 1000000).toFixed(1)}M`;
              if (rows >= 1000) return `${(rows / 1000).toFixed(1)}K`;
              return rows.toString();
            };

            // Version number starting at v1.1.x for candidates
            const candidateModel = {
              id: modelId,
              version: `v1.1.${Math.floor(Math.random() * 9)}-candidate`,
              dataset: fileData.name || 'custom_upload.csv',
              status: 'CANDIDATE',
              accuracy: accVal,
              f1: f1Val,
              falseAlarm: `${(1.2 + Math.random() * 1.5).toFixed(1)}%`,
              dataQuality: `${(92.0 + Math.random() * 5).toFixed(1)}%`,
              records: getFormattedRecords(fileData.rows),
              driftRisk: 'Low',
              started: new Date().toISOString().replace('T', ' ').slice(0, 16),
              completed: new Date().toISOString().replace('T', ' ').slice(0, 16),
              trainedBy: 'Student Team',
              approval: 'PENDING',
              deployment: 'BLOCKED'
            };
            set(ref(db, `aiModels/${modelId}`), candidateModel);
            setLastTrainedModelId(modelId);
          }, 600);
          return 100;
        }

        return nextVal;
      });
    }, intervalTime);
  };

  // Complete Training and Deploy
  const handleDeploy = () => {
    if (lastTrainedModelId) {
      const currentCandidate = models.find(m => m.id === lastTrainedModelId);
      const stableVersion = currentCandidate ? currentCandidate.version.replace('-candidate', '-stable') : 'v4.3.0-stable';
      
      // Update all other models that are currently DEPLOYED/LIVE to ARCHIVED/ROLLED BACK
      models.forEach(m => {
        if (m.id !== lastTrainedModelId && (m.status === 'DEPLOYED' || m.deployment === 'LIVE')) {
          update(ref(db, `aiModels/${m.id}`), {
            status: 'ARCHIVED',
            deployment: 'ROLLED BACK'
          });
        }
      });

      const updates = {
        status: 'DEPLOYED',
        approval: 'APPROVED',
        deployment: 'LIVE',
        version: stableVersion
      };

      update(ref(db, `aiModels/${lastTrainedModelId}`), updates);
    }

    // Reset Form
    setFile(null);
    setFileData({ name: '', rows: 0, cols: 0, headers: [], preview: [] });
    setStep('idle');
    setProgress(0);
    setLastTrainedModelId(null);
    setCurrentLog('New model deployed live! System ready for next run.');
    setLogsList([{ time: new Date().toLocaleTimeString(), text: 'Successfully deployed live model!' }]);
  };

  // Delete a model run from history
  const handleDeleteModel = (id) => {
    remove(ref(db, `aiModels/${id}`));
  };

  const strokeDashoffset = 439.6 - (progress / 100) * 439.6;

  return (
    <div className="dashboard voltiq-shell">
      <Sidebar active="ai-training" />
      <div className="dashboard-main">
        <CommandHeader activePage="ai-training" />
        
        <main className="ai-page-wrapper">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-16px' }}>
            <div className="admin-badge">
              <ShieldAlert size={14} /> Admin AI Control Layer
            </div>
          </div>

          <AiModelFoundryHero models={models} />

          <div className="ai-grid-2">
            
            {/* Left Column: Data Ingestion & Target */}
            <div className="ai-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                <UploadCloud size={20} color="var(--gold)" />
                <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  1. Dataset Ingestion
                </h3>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept=".csv"
                style={{ display: 'none' }}
              />

              {!file ? (
                <div 
                  className={`csv-dropzone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <div className="csv-dropzone-icon">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Drag and drop your CSV file here
                    </strong>
                    <span style={{ color: 'var(--voltiq-text-muted)', fontSize: '11px' }}>
                      or click to select file
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'rgba(245, 185, 20, 0.05)', border: '1px solid rgba(245, 185, 20, 0.3)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText color="var(--gold)" size={20} />
                      <div>
                        <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>{fileData.name}</strong>
                        <span style={{ color: 'var(--voltiq-text-muted)', fontSize: '11px' }}>
                          Parsed {fileData.rows.toLocaleString()} rows and {fileData.cols} columns
                        </span>
                      </div>
                    </div>
                    {step !== 'training' && (
                      <button 
                        onClick={() => {
                          setFile(null);
                          setStep('idle');
                          setCurrentLog('System ready. Upload a dataset to begin.');
                          setLogsList([]);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Change File
                      </button>
                    )}
                  </div>

                  {/* CSV Preview Table */}
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--voltiq-text-muted)', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                      Data Preview (First 3 Rows)
                    </span>
                    <div className="preview-table-container">
                      <table className="preview-table">
                        <thead>
                          <tr>
                            {fileData.headers.slice(0, 6).map((h, i) => <th key={i}>{h}</th>)}
                            {fileData.headers.length > 6 && <th>...</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {fileData.preview.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.slice(0, 6).map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                              {row.length > 6 && <td>...</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Training Configuration */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--voltiq-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px', fontWeight: 'bold' }}>
                        Prediction Target Goal
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'Inverter Faults', label: 'Inverter Faults' },
                          { value: 'Panel Degradation', label: 'Panel Degradation' },
                          { value: 'Grid Anomalies', label: 'Grid Anomalies' },
                          { value: 'Thermal Overheats', label: 'Thermal Overheats' }
                        ]}
                        value={targetGoal}
                        onChange={(val) => setTargetGoal(val)}
                        disabled={step === 'training'}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--voltiq-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px', fontWeight: 'bold' }}>
                        Training Depth
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['fast', 'deep'].map(mode => (
                          <label key={mode} style={{ 
                            flex: 1,
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            background: trainingSpeed === mode ? 'rgba(245, 185, 20, 0.05)' : 'transparent',
                            border: trainingSpeed === mode ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                            padding: '10px 12px', 
                            borderRadius: '4px', 
                            cursor: step === 'training' ? 'not-allowed' : 'pointer' 
                          }}>
                            <input 
                              type="radio" 
                              name="trainSpeed" 
                              checked={trainingSpeed === mode} 
                              onChange={() => trainingSpeed !== 'training' && setTrainingSpeed(mode)}
                              disabled={step === 'training'}
                              style={{ accentColor: 'var(--gold)' }} 
                            />
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                              {mode === 'fast' ? 'Standard (Quick)' : 'Deep Intelligence'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Training Cockpit */}
            <div className="ai-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                <Cpu size={20} className={step === 'training' ? 'spin' : ''} color={step === 'training' ? 'var(--gold)' : '#a8b5ae'} />
                <h3 style={{ fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  2. Training & Monitor
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                
                {/* Circular Loader Gauge */}
                <div className="circular-loader-wrapper" style={{ margin: '8px 0' }}>
                  <svg className="circular-loader-svg">
                    <circle className="circular-loader-bg" cx="90" cy="90" r="70" />
                    <circle 
                      className="circular-loader-progress" 
                      cx="90" cy="90" r="70" 
                      style={{ strokeDashoffset }}
                    />
                  </svg>
                  <div className="circular-loader-text">
                    {progress}%
                    <span style={{ fontSize: '9px' }}>
                      {step === 'training' ? 'TRAINING' : step === 'complete' ? 'FINISHED' : 'STANDBY'}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <strong style={{ fontSize: '13px', color: '#fff', display: 'block', minHeight: '18px' }}>{currentLog}</strong>
                </div>

                {/* Terminal Event Console */}
                <div style={{ width: '100%', height: '120px', background: '#050505', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '12px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '11px', textAlign: 'left' }}>
                  {logsList.length === 0 ? (
                    <div style={{ color: '#5a6b63' }}>Awaiting dataset upload...</div>
                  ) : (
                    logsList.map((log, index) => (
                      <div key={index} style={{ marginBottom: '4px', color: '#a8b5ae' }}>
                        <span style={{ color: 'var(--gold)', marginRight: '6px' }}>[{log.time}]</span>
                        <span>{log.text}</span>
                      </div>
                    ))
                  )}
                  <div ref={terminalEndRef} />
                </div>

                {/* Training Actions Trigger */}
                <div style={{ width: '100%', marginTop: '8px' }}>
                  {step === 'idle' && (
                    <button
                      className="interactive-btn"
                      disabled={true}
                      style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--voltiq-text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      Upload Data to Train
                    </button>
                  )}

                  {step === 'loaded' && (
                    <button
                      className="interactive-btn"
                      onClick={startTraining}
                      style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: '#000', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      <Play size={16} fill="#000" /> Start AI Training Run
                    </button>
                  )}

                  {step === 'training' && (
                    <button
                      className="interactive-btn"
                      disabled={true}
                      style={{ width: '100%', padding: '14px', background: 'rgba(245, 185, 20, 0.15)', color: 'var(--gold)', border: '1px solid rgba(245,185,20,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'wait' }}
                    >
                      <span className="spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%' }} /> Training Model...
                    </button>
                  )}

                  {step === 'complete' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ display: 'block', fontSize: '9px', color: 'var(--voltiq-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Accuracy</span>
                          <strong style={{ fontSize: '20px', color: 'var(--voltiq-green)', fontFamily: 'monospace' }}>{valAccuracy}</strong>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ display: 'block', fontSize: '9px', color: 'var(--voltiq-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>F1 Score</span>
                          <strong style={{ fontSize: '20px', color: '#fff', fontFamily: 'monospace' }}>{f1Score}</strong>
                        </div>
                      </div>

                      <button
                        className="interactive-btn"
                        onClick={handleDeploy}
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          background: 'var(--gold)', 
                          color: '#000', 
                          fontWeight: 'bold', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '8px',
                          boxShadow: '0 4px 20px rgba(245, 185, 20, 0.3)'
                        }}
                      >
                        🚀 Deploy Trained Model Live
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Section: Historical Runs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <ConfusionMatrixMisclassificationLab />
            <AiTrainingHistoryTable models={models} onDeleteModel={handleDeleteModel} />
          </div>

        </main>
      </div>
    </div>
  );
}
