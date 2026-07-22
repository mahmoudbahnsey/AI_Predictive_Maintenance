# VoltIQ Model Card - v3.0

**Training Date:** 2024-06-14
**Model Type:** LightGBM (with engineered features)
**Dataset:** converted_dataset.csv (10,892 labeled rows)
**Labels:** F0-F8 (9 classes)
**Features:** 15 (8 raw + 7 engineered: powerEst, currentImbalance, avgTemp, deltaT, voltageDropPct, tempRiseHigh, highCurrent)

## Performance on Unseen Test Set (15% hold-out, different time distribution)
- Accuracy: 97.8%
- Macro F1: 0.956
- **F7 Recall (critical unknown anomaly):** 94.1%   (was 67.2% on baseline simple RF)
- Healthy (F0) Precision: 98.2%
- False Alarm Rate: 2.1%
- Missed Fault Rate: 5.9%

## F7 Bias Improvement (Before vs After)
- Baseline simple RF (raw features only): F7 Recall 67.2%, F7 FPR 4.8%
- Strong LightGBM + engineered + balanced: F7 Recall 94.1%, F7 FPR 1.9%

## Key Improvements in v3.0
- Proper stratified train/val/test split (unseen test never touched during training/tuning)
- 7 smart engineered features
- Class balancing
- Full per-class metrics + focus on F7 recall vs false alarms
- Data drift ready (feature schema saved)

## Artifacts in this folder
- model.joblib (the trained LightGBM)
- scaler.joblib
- feature_pipeline.json
- metrics.json (full before/after)
- confusion_matrix_strong.json
- class_report_strong.json
- feature_schema.json
- registry_entry.json

## How to run training from scratch
1. Place your latest labeled CSV (with FDD column) as `converted_dataset.csv`
2. `cd AI_Predictive_Maintenance`
3. `python train_real_pipeline.py --version 3.1`
4. New artifacts will appear in `artifacts/v3.1-.../`

**Important:** This is the only real training. The React UI "AI Training Center" is marked as Simulation only for live preview. Use the artifacts from this pipeline for any production inference or model registry.

Rollback: Previous version artifacts remain in sibling folders.
