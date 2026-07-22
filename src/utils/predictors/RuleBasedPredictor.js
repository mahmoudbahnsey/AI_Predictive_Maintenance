import { BasePredictor, PredictionSource } from './PredictorInterface';
import { ruleBasedPredictFault, analyzeTelemetryRows } from '../faultAnalyzer';

/**
 * RuleBasedPredictor
 * 
 * Wrapper around the current Rule-Based Fault Analyzer.
 * This is the DEMO / FALLBACK predictor.
 * 
 * It must never be presented to the user as a "Real LightGBM" or "Trained Model".
 */
export class RuleBasedPredictor extends BasePredictor {
  constructor() {
    super();
    this.modelVersion = "rule-based-v1";
    this.modelType = "RuleBasedJS";
    this.isRealModel = false;
  }

  predict(rows) {
    if (!rows || rows.length === 0) {
      throw new Error("No telemetry rows provided");
    }

    // Use the existing analysis pipeline (which internally calls ruleBasedPredictFault)
    const analysis = analyzeTelemetryRows(rows, { sourceName: "RuleBasedPredictor" });

    const prediction = analysis.topFault || "F0";
    const confidence = Math.min(97, Math.max(50, analysis.averageConfidence || 75));

    return {
      prediction,
      confidence,
      probabilities: null, // Rule-based does not produce calibrated probabilities
      topFeatures: null,
      modelVersion: this.modelVersion,
      modelType: this.modelType,
      predictionSource: PredictionSource.RULE_BASED_JS,
      isRealModel: this.isRealModel,
      artifactChecksum: null,
      reason: analysis.alerts?.[0]?.message || null
    };
  }

  getModelInfo() {
    return {
      modelVersion: this.modelVersion,
      modelType: this.modelType,
      predictionSource: PredictionSource.RULE_BASED_JS,
      isRealModel: this.isRealModel,
      artifactChecksum: null,
      status: "FALLBACK"
    };
  }
}
