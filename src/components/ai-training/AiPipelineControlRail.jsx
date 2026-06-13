import { motion } from 'framer-motion';

export default function AiPipelineControlRail({ currentStage = 9 }) {
  const stages = [
    { label: "Data Linked" },
    { label: "Validated" },
    { label: "Features Mapped" },
    { label: "Classes Balanced" },
    { label: "Configured" },
    { label: "Training" },
    { label: "Validating" },
    { label: "Performance Review" },
    { label: "Deployment Gate" },
    { label: "Production" }
  ];

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="pipeline-rail">
        <div className="pipeline-line" />
        <div className="pipeline-progress" style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }} />
        
        {stages.map((stage, idx) => {
          let nodeClass = "node-dot";
          if (idx < currentStage) nodeClass += " completed";
          else if (idx === currentStage) nodeClass += " active";

          return (
            <div key={idx} className="pipeline-node">
              <div className={nodeClass} />
              <span className={`node-label ${idx === currentStage ? 'active' : ''}`}>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
