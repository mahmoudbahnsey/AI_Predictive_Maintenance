/**
 * VoltIQ Prediction Interface (Contract)
 * 
 * This file defines the common interface that both the Rule-Based fallback
 * and the future RealModelPredictor must implement.
 * 
 * See: AI_Predictive_Maintenance/contracts/prediction_contract.json
 */

export const PredictionSource = {
  RULE_BASED_JS: "Rule-Based JS Ensemble (Demo/Fallback)",
  REAL_LIGHTGBM: "Real LightGBM Server Model",
  SIMULATION: "Demo/Simulation"
};

/**
 * @typedef {Object} PredictionResult
 * @property {string} prediction - e.g. "F7"
 * @property {number} confidence - 0-100
 * @property {Object} [probabilities]
 * @property {Array} [topFeatures]
 * @property {string} modelVersion
 * @property {string} modelType - "RuleBasedJS" | "LightGBM" | ...
 * @property {string} predictionSource - one of PredictionSource
 * @property {boolean} isRealModel
 * @property {string|null} [artifactChecksum]
 * @property {string|null} [reason]
 */

/**
 * @typedef {Object} TelemetryRow
 * Raw or partially engineered telemetry row.
 */

/**
 * Common interface for all predictors.
 */
export class BasePredictor {
  /**
   * @param {TelemetryRow[]} rows
   * @returns {PredictionResult}
   */
  predict(rows) {
    throw new Error("predict() must be implemented");
  }

  getModelInfo() {
    throw new Error("getModelInfo() must be implemented");
  }
}
