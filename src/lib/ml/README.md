# CerebroCalm: Machine Learning & Responsible AI Strategy

## 1. Why a Custom Deep-Learning Model is Not Used for MVP
In clinical recovery applications—particularly for neurological conditions such as concussion and mild Traumatic Brain Injury (TBI)—prematurely deploying opaque deep neural networks introduces severe safety risks, hallucinations, and unverified prognostic claims.

For the MVP, CerebroCalm adopts an **explainable, deterministic heuristic model** based on windowed feature normalization:
- **Zero Black Box Decisions**: Every output clearly explains *which* factors (e.g., consecutive fatigue escalation, recent slope) triggered the recommendation.
- **Strictly Educational & Non-Diagnostic**: The model predicts *cognitive load pressure* to assist pacing, never clinical disease trajectories or medical outcomes.
- **Privacy-Preserving & On-Device**: Computations execute 100% in the user's browser with zero health telemetry uploaded to external servers.

---

## 2. Architecture of the Lightweight Heuristic Model
- **Input Features**:
  1. `recentFatigueAvg`: Rolling average of cognitive fatigue over the last 5 entries.
  2. `recentHeadacheAvg`: Rolling average of headache severity over the last 5 entries.
  3. `symptomSlope`: Linear regression slope of total symptom burden across recent sessions.
  4. `fatigueVelocity`: First derivative / step-change in mental fatigue between consecutive checks.
  5. `entryCount`: Sample size used to calibrate heuristic confidence.
- **Cold Start Handling**: If fewer than 3 entries exist, the model transparently reports: `"Not enough personal data yet."`

---

## 3. Future Model Pipeline Requirements
If an on-device machine learning model (such as an on-device logistic regression or small random forest via WebAssembly/TensorFlow.js) is developed in future iterations, the following governance standards are mandatory:

### A. Dataset Requirements
- **Strictly De-Identified & Consented**: Training data must never be scraped from unconsented patient sessions. Only IRB-approved, consented research datasets or validated synthetic benchmarks may be utilized.
- **Balanced Representation**: Datasets must represent diverse demographics, age groups, and recovery timelines to prevent algorithmic bias.

### B. Validation & Calibration
- **Brier Score Calibration**: Predicted probabilities must undergo Platt scaling or isotonic regression to reflect true observational probabilities.
- **Cross-Validation**: Rigorous stratified k-fold cross-validation on isolated patient cohorts to ensure generalizability across different clinical recovery trajectories.

### C. Bias & Subgroup Testing
- Continuous testing across user cohorts (e.g., age, baseline sensory sensitivity, activity profile) to ensure the model does not disproportionately underestimate fatigue in specific groups.

### D. Privacy & Federated Learning
- Any collaborative model improvement must use **Differential Privacy** and **Federated Learning**, ensuring raw personal symptom logs never leave the user's device.

### E. Clinical Validation Mandate
- Under no circumstances will any model in CerebroCalm be described or marketed as "clinically validated" unless independent, peer-reviewed clinical trials have rigorously established its diagnostic or therapeutic efficacy according to medical device regulatory frameworks (e.g., FDA SaMD / CE MDR).
