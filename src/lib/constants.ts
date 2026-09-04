export const CLINICAL_DISCLAIMER_TEXT =
  "This app is an educational recovery-support tool. It does not diagnose, treat, or replace professional medical care. Follow your clinician's instructions. If you develop concerning or emergency symptoms, seek appropriate medical attention.";

export const PACING_DEFAULTS = {
  ACTIVITY_MINUTES: 15,
  BREAK_MINUTES: 5,
  MIN_ACTIVITY_MINUTES: 5,
  MAX_ACTIVITY_MINUTES: 60,
  MIN_BREAK_MINUTES: 2,
  MAX_BREAK_MINUTES: 30,
};

export const PACING_CLINICAL_NOTE =
  "Example pacing settings — adjust according to your clinician's guidance.";

export const RECOVERY_STAGES = [
  {
    stage: 1 as const,
    name: "Stage 1: Symptom-Limited Rest",
    shortDesc: "Initial rest; light daily activities that do not provoke symptoms.",
    guidance: "Avoid all demanding cognitive tasks, high-glare screens, and intense lighting. Micro-activities only.",
    recommendedActivityMins: 10,
    recommendedBreakMins: 5,
  },
  {
    stage: 2 as const,
    name: "Stage 2: Light Cognitive Activity",
    shortDesc: "Short reading, quiet audio, gentle conversation.",
    guidance: "Engage in 15-minute intervals. Step away immediately if headache or brain fog increases.",
    recommendedActivityMins: 15,
    recommendedBreakMins: 5,
  },
  {
    stage: 3 as const,
    name: "Stage 3: Moderate Activity & Part-Time Work/School",
    shortDesc: "Paced cognitive tasks with scheduled dark sanctuary breaks.",
    guidance: "Structured 20-25 minute work blocks. Take mandatory 5-minute sensory breaks between sessions.",
    recommendedActivityMins: 20,
    recommendedBreakMins: 5,
  },
  {
    stage: 4 as const,
    name: "Stage 4: Graduated Full-Day Cognitive Activity",
    shortDesc: "Near-normal cognitive workload with protective pacing.",
    guidance: "Extended 30-40 minute sessions. Continue daily pacing checks to prevent cumulative fatigue.",
    recommendedActivityMins: 30,
    recommendedBreakMins: 5,
  },
  {
    stage: 5 as const,
    name: "Stage 5: Full Normal Activity",
    shortDesc: "Unrestricted daily cognitive and physical activities.",
    guidance: "Full return to school/work under clinician sign-off.",
    recommendedActivityMins: 45,
    recommendedBreakMins: 5,
  },
];

export const RED_FLAG_SYMPTOMS = [
  {
    id: "severe_worsening_headache",
    name: "Worsening severe headache",
    description: "A headache that escalates rapidly and does not ease.",
  },
  {
    id: "repeated_vomiting",
    name: "Repeated vomiting or severe nausea",
    description: "Vomiting multiple times or inability to keep liquids down.",
  },
  {
    id: "seizure",
    name: "Seizures or convulsions",
    description: "Sudden uncontrolled shaking or loss of consciousness.",
  },
  {
    id: "unusual_confusion",
    name: "Unusual confusion, restlessness, or agitation",
    description: "Difficulty recognizing people, times, or places.",
  },
  {
    id: "difficulty_waking",
    name: "Severe difficulty waking or staying awake",
    description: "Cannot be awakened or excessive drowsiness.",
  },
  {
    id: "slurred_speech",
    name: "Slurred speech or difficulty talking",
    description: "Problems producing words clearly or sudden language changes.",
  },
  {
    id: "weakness_numbness",
    name: "Weakness, numbness, or decreased coordination",
    description: "Loss of strength or feeling in arms, legs, or face.",
  },
  {
    id: "unequal_pupils",
    name: "Unequal pupils or vision loss",
    description: "One pupil visibly larger than the other or double vision.",
  },
  {
    id: "fluid_ears_nose",
    name: "Clear fluid or blood from nose or ears",
    description: "Discharge following a recent head impact.",
  },
];

export const RED_FLAG_KEYWORDS = [
  "vomit",
  "vomiting",
  "threw up",
  "seizure",
  "convulsion",
  "can't wake",
  "cannot wake",
  "passed out",
  "slurred",
  "slurring",
  "numbness",
  "weakness in arm",
  "weakness in leg",
  "pupils unequal",
  "unequal pupils",
  "worst headache of my life",
  "thunderclap",
  "double vision",
  "fluid from ear",
  "fluid from nose",
];

export const BREATHING_BOX_STEPS = [
  { phase: "Inhale", duration: 4, prompt: "Gently inhale through your nose..." },
  { phase: "Hold", duration: 4, prompt: "Softly hold your breath..." },
  { phase: "Exhale", duration: 4, prompt: "Slowly exhale through your mouth..." },
  { phase: "Hold", duration: 4, prompt: "Rest quietly before the next breath..." },
];
