export interface Slide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  keyHighlights: { label: string; value: string }[];
  clinicalRationale: string;
  speakerNoteBengali: string;
  speakerNoteEnglish: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    category: "PROJECT INTRODUCTION",
    title: "CerebroCalm",
    subtitle: "A Privacy-First, Low-Cognitive-Load Recovery Companion for Concussion & Mild TBI",
    bulletPoints: [
      "Targeting 3 Hackathon Tracks: Best Tech for Concussion Recovery, Best Use of AI/ML, and Best Design.",
      "Strictly Non-Diagnostic: Designed to support clinician-guided recovery protocols, never replace clinical care.",
      "Governing Design Principle: 'Less screen. Less cognitive load. More clarity. More privacy.'",
      "Zero Cloud Dependency: 100% on-device Web Crypto AES-GCM 256-bit encryption in local IndexedDB."
    ],
    keyHighlights: [
      { label: "Target Audience", value: "Concussion & mTBI Patients" },
      { label: "Privacy Architecture", value: "100% Client-Side / Offline" },
      { label: "Design Theme", value: "Photophobia-Safe Warm Stone" }
    ],
    clinicalRationale:
      "Acute concussion patients experience profound neuro-metabolic energy crises where standard screens trigger ocular strain, nausea, and symptom spikes.",
    speakerNoteBengali:
      "আসসালামু আলাইকুম স্যার। আমাদের প্রজেক্টের নাম CerebroCalm। এটি কনকাশন এবং ব্রেন ইনজুরি রোগীদের জন্য একটি লো-কগনিটিভ রিকভারি কম্প্যানিয়ন। মূল ফিলোসফি হচ্ছে: স্ক্রিন টাইম কমিয়ে রিকভারি ত্বরান্বিত করা।",
    speakerNoteEnglish:
      "Respected Sir, CerebroCalm is a specialized privacy-first recovery companion designed for patients recovering from concussions and mild traumatic brain injuries."
  },
  {
    id: 2,
    category: "CLINICAL PROBLEM STATEMENT",
    title: "The Concussion Recovery Dilemma",
    subtitle: "Why Conventional Digital Health Apps Harm Brain Injury Patients",
    bulletPoints: [
      "Photophobia & Screen Intolerance: 70%+ of concussion patients suffer severe light sensitivity; bright screens trigger ocular migraine.",
      "Cognitive Energy Crisis: Neurological processing latency spikes during cognitive overload, requiring micro-pacing.",
      "The 'Push-and-Crash' Cycle: Patients feel slightly better, overwork screens/study, and experience severe multi-day symptom relapses.",
      "Privacy Risks in Health Tech: Sensitive neurological logs and mental health data are frequently tracked or leaked by third-party clouds."
    ],
    keyHighlights: [
      { label: "Photophobia Rate", value: "70-80% in Acute Phase" },
      { label: "Core Failure", value: "Apps demand excessive screen time" },
      { label: "Solution", value: "5-sec check-ins + Screenless audio" }
    ],
    clinicalRationale:
      "Recovery requires active rehabilitation without exceeding the symptom provocation threshold (Berlin/Amsterdam Consensus guidelines).",
    speakerNoteBengali:
      "স্যার, সাধারণ স্বাস্থ্য অ্যাপগুলোতে প্রচুর স্ক্রোলিং ও উজ্জ্বল আলো থাকে যা কনকাশন রোগীদের ব্রেন ফ্যাটিগ ও মাথাব্যথা বাড়িয়ে দেয়। আমরা এই সমস্যা সমাধানে ব্রেন-ফার্স্ট ডিজাইন তৈরি করেছি।",
    speakerNoteEnglish:
      "Most digital apps demand high visual engagement. For brain injuries, excessive screen time delays healing. CerebroCalm solves this by drastically cutting screen exposure."
  },
  {
    id: 3,
    category: "FEATURE 1: REGISTRATION & ONBOARDING",
    title: "Streamlined 2-Field Registration",
    subtitle: "Name + Email -> Instant On-Device Encryption -> Zero Cloud Tracking",
    bulletPoints: [
      "Frictionless Experience: Requires only Full Name and Email Address to reserve spot and begin recovery.",
      "Celebratory In-Place Success: The card transforms seamlessly into a welcome state without jarring page redirects.",
      "Local-First Security: Immediately initializes a Web Crypto AES-GCM 256-bit encryption key in the browser.",
      "1-Click Judge Demo Login: Specially designed for hackathon evaluators to instantly inspect pre-loaded clinical scenarios."
    ],
    keyHighlights: [
      { label: "Required Fields", value: "Only Full Name + Email" },
      { label: "Backend API", value: "POST /api/register (Zod validated)" },
      { label: "Storage", value: "Local Encrypted State / IndexedDB" }
    ],
    clinicalRationale:
      "Patients in cognitive fatigue cannot endure multi-page medical questionnaires. Rapid registration maximizes accessibility and clinical compliance.",
    speakerNoteBengali:
      "স্যার, আমরা রেজিস্ট্রেশন প্রসেস একদম সহজ করেছি: শুধুমাত্র নাম এবং ইমেইল। সাবমিট করার সাথে সাথে ব্রাউজারে ২৫৬-বিট এনক্রিপশন কি তৈরি হয় এবং ডাটা নিরাপদে সংরক্ষিত থাকে।",
    speakerNoteEnglish:
      "We engineered an ultra-simple 2-field registration to eliminate cognitive load. Data is encrypted locally on-device without external database tracking."
  },
  {
    id: 4,
    category: "FEATURE 2: HOME DASHBOARD",
    title: "Clinical Timeline & 3-Core Questions",
    subtitle: "Instantly Answers: How am I feeling? What should I do now? What is next?",
    bulletPoints: [
      "Clinical Timeline Tracking: Automatically computes 'Day X Post-Injury' from concussion onset.",
      "Zurich/Amsterdam Consensus Stages: Dynamically indicates Stage 1 to 5 (e.g. Stage 2: Light Cognitive Activity).",
      "Immediate Recovery Actions: Instant 1-tap buttons for Check-In, Start Pacing, Dark Sanctuary, and Trends.",
      "Secondary Clinical Grid: Direct access to Doctor's Clinical Report, Workplace Accommodation Letter, and Focus Test."
    ],
    keyHighlights: [
      { label: "Day Counter", value: "Deterministic UTC Calendar Math" },
      { label: "Consensus Model", value: "Amsterdam 2023 Concussion Protocol" },
      { label: "UI Architecture", value: "Warm Stone #1C1917 (Anti-Glare)" }
    ],
    clinicalRationale:
      "Brain injury patients suffer executive dysfunction. A clear, non-distracting dashboard prevents confusion and decision fatigue.",
    speakerNoteBengali:
      "স্যার, ড্যাশবোর্ডে প্রবেশের পরই রোগী দেখতে পান ইনজুরির পর আজ কততম দিন (Day X Post-Injury) এবং তিনি বর্তমানে কোন স্টেজে আছেন। এটি রোগীকে তার রিকভারি স্ট্যাটাস পরিষ্কারভাবে জানিয়ে দেয়।",
    speakerNoteEnglish:
      "The dashboard grounds the patient by answering three fundamental questions and showing their clinical recovery stage based on international consensus guidelines."
  },
  {
    id: 5,
    category: "FEATURE 3: 5-SECOND CHECK-IN",
    title: "Tactile Symptom Logger & Voice Input",
    subtitle: "Ultra-Fast Logging + Web Speech Synthesis for Eyes-Free Check-In",
    bulletPoints: [
      "5 Core Symptoms on 1-5 Tactile Scale: Headache, Brain Fog, Light Sensitivity, Sound Sensitivity, Dizziness.",
      "1-Tap Activity & Environment Tags: Screens, Reading, Sunlight/Glare, Loud Noise, Motion/Transit, Poor Sleep.",
      "Speech-to-Text & Screenless Read-Aloud: Integrated Web Speech API allows voice input and audio coaching with eyes closed.",
      "Pre/Post Pacing Comparison: Evaluates symptom shifts after cognitive exertion blocks."
    ],
    keyHighlights: [
      { label: "Interaction Time", value: "< 5 Seconds to Log" },
      { label: "Voice Mode", value: "Web Speech Synthesis (Rate: 0.88)" },
      { label: "Visual Ergonomics", value: "Large 48px Touch Targets" }
    ],
    clinicalRationale:
      "Traditional symptom diaries demand 5-10 minutes of intense screen time, exacerbating the very symptoms being measured.",
    speakerNoteBengali:
      "স্যার, সিম্পটম লগারে মাথাব্যথা, ব্রেন ফগ এবং আলো-শব্দ সংবেদনশীলতা মাত্র ৫ সেকেন্ডে ১ থেকে ৫ স্কেলে লগ করা যায়। এমনকি স্ক্রিন না দেখে ভয়েস রিড-আউটের মাধ্যমেও চেক-ইন করা সম্ভব।",
    speakerNoteEnglish:
      "Our tactile logger allows logging within 5 seconds. Patients with acute photophobia can even close their eyes and use our Web Speech voice read-aloud assistant."
  },
  {
    id: 6,
    category: "FEATURE 4: PACING ASSISTANT",
    title: "Cognitive Energy Management ('Packing')",
    subtitle: "Interrupting the 'Push-and-Crash' Cycle with Regulated Timers",
    bulletPoints: [
      "Adapted to Clinical Stage: 10m activity for Stage 1, 15m for Stage 2, 20m for Stage 3, and 30m for Stage 4.",
      "Automatic Rest Transition: Seamlessly transitions into a restorative break when the timer elapses.",
      "Harmonic Audio Chimes: Soft 432Hz sine tone signals interval changes without startling sensitive neural circuits.",
      "Symptom Spike Intervention: If symptoms increase by +2 points, pacing triggers an immediate mandatory rest advisory."
    ],
    keyHighlights: [
      { label: "Pacing Algorithm", value: "Stage-Adaptive Duration Matrix" },
      { label: "Audio Signal", value: "Gentle 432Hz Synthesized Sine" },
      { label: "Auto-Sanctuary", value: "Direct Hand-Off to Sensory Rest" }
    ],
    clinicalRationale:
      "Pacing is the gold-standard rehabilitative intervention in sports medicine and neurology to prevent neuro-cognitive relapse.",
    speakerNoteBengali:
      "স্যার, এই পেসিং অ্যাসিস্ট্যান্ট রোগীকে অতিরিক্ত পরিশ্রম থেকে বাঁচায়। রোগীর রিকভারি স্টেজ অনুযায়ী ১৫ বা ২০ মিনিটের কাজের পর অ্যাপটি স্বয়ংক্রিয়ভাবে রেস্ট নেওয়ার নির্দেশ দেয়।",
    speakerNoteEnglish:
      "Cognitive pacing prevents symptom flare-ups by enforcing structured activity and rest intervals calibrated directly to the patient's concussion stage."
  },
  {
    id: 7,
    category: "FEATURE 5: DARK SANCTUARY",
    title: "Screenless Sensory Reset & Brown Noise",
    subtitle: "Native Web Audio API Brownian Synthesis & Box Breathing",
    bulletPoints: [
      "100% Offline Audio Synthesis: Generates true continuous Brownian Noise (1/f² inverse spectral drop-off) via browser AudioContext.",
      "Zero Audio File Downloads: No MP3s or network bandwidth required; entirely generated mathematically in real time.",
      "Ocular Blackout Mode: Screen dims to soothing low-stimulus tones while the patient closes their eyes.",
      "4-4-4-4 Autonomic Box Breathing: Visual & auditory breathing guide helps downregulate hyper-sympathetic post-concussion arousal."
    ],
    keyHighlights: [
      { label: "Noise Profile", value: "Brownian Noise (1/f² Power Drop)" },
      { label: "Chime Pitch", value: "432 Hz Harmonic Pitch" },
      { label: "Vagus Nerve Activation", value: "4-4-4-4 Box Breathing Cycle" }
    ],
    clinicalRationale:
      "Deep Brownian noise masks abrasive environmental sound frequencies (hyperacusis), while box breathing restores autonomic nervous system balance.",
    speakerNoteBengali:
      "স্যার, ডার্ক স্যাঙ্কচুয়ারি ফিচারটি তীব্র ফটোফোবিয়া ও নয়েজ সেনসিটিভিটি রোগীদের জন্য। এটি কোনো অডিও ফাইল ডাউনলোড না করেই ব্রাউজারের ওয়েব অডিও এপিআই দিয়ে ব্রাউন নয়েজ তৈরি করে এবং ডিপ ব্রিদিং করায়।",
    speakerNoteEnglish:
      "Dark Sanctuary is our sensory-deprivation environment. It synthesizes real-time Brownian noise directly in the browser with zero audio files, providing immediate auditory relief."
  },
  {
    id: 8,
    category: "FEATURE 6: REACTION TEST",
    title: "Neuro-Cognitive Reaction Stability Check",
    subtitle: "15-Second Low-Glare Processing Latency & Consistency Assessment",
    bulletPoints: [
      "Photophobia-Safe Design: Soft sage & warm amber cues; zero bright white flashes or ocular distress.",
      "Randomized Anti-Anticipation Delays: 2,200ms to 4,800ms delays eliminate muscle memory and motor anticipation.",
      "Consistency Over Pure Speed: Calculates standard deviation (±ms) across 3 trials to evaluate neurological processing stability.",
      "Cognitive Fatigue Detection: High latency variance alerts the user that cognitive fatigue is setting in."
    ],
    keyHighlights: [
      { label: "Test Duration", value: "15 Seconds (3 Trials)" },
      { label: "Core Metric", value: "Latency (ms) & Variability (±ms)" },
      { label: "Visual Stimulus", value: "Low-Luminance Muted Sage" }
    ],
    clinicalRationale:
      "Reaction time variability is a clinically validated biomarker of subtle cognitive fatigue and traumatic brain injury recovery.",
    speakerNoteBengali:
      "স্যার, এটি ১৫ সেকেন্ডের একটি লো-গ্লেয়ার ফোকাস ও রিঅ্যাকশন টেস্ট। এটি শুধু স্পিড মাপে না, বরং ৩টি ট্রায়ালের মধ্যে কনসিস্টেন্সি (±ms ভ্যারিয়েশন) মেপে ব্রেন ফ্যাটিগ শনাক্ত করে।",
    speakerNoteEnglish:
      "Our reaction check measures neuro-cognitive consistency. Rather than just raw speed, it evaluates reaction latency variance—a key indicator of brain fatigue."
  },
  {
    id: 9,
    category: "FEATURE 7: RECOVERY TRENDS",
    title: "Smart Trigger & Activity Correlation Engine",
    subtitle: "Difference-of-Means Analytics Identifying What Spikes Symptoms",
    bulletPoints: [
      "Trigger Correlation Analysis: Compares average fatigue when specific triggers are active vs when absent.",
      "Actionable Clinical Insights: Identifies exact triggers (e.g. 'Extended Screens correlates with +1.8 higher fatigue spikes').",
      "7-Day Moving Trajectory: Visualizes daily symptom trend lines without complex cognitive visual clutter.",
      "Deterministic Mathematical Calculations: Runs 100% locally in the client browser with zero cloud AI API dependence."
    ],
    keyHighlights: [
      { label: "Analysis Engine", value: "Difference-of-Means Delta" },
      { label: "Trigger Factors", value: "Screens, Sunlight, Noise, Transit, Sleep" },
      { label: "Privacy Level", value: "100% On-Device Analysis" }
    ],
    clinicalRationale:
      "Empowering patients to recognize their specific symptom triggers enables proactive environmental adjustments and faster return to work.",
    speakerNoteBengali:
      "স্যার, এই ট্রেন্ডস ইঞ্জিনটি বিশ্লেষণ করে কোন ট্রিগারের কারণে রোগীর কষ্ট বাড়ে—যেমন স্ক্রিন টাইম, কড়া রোদ, নয়েজ নাকি কম ঘুম। এটি রোগীর জন্য পারসোনালাইজড প্যাটার্ন তুলে ধরে।",
    speakerNoteEnglish:
      "Our correlation engine mathematically links tagged triggers like screen glare or poor sleep to symptom spikes, giving patients concrete insights into their personal recovery triggers."
  },
  {
    id: 10,
    category: "FEATURE 8: CLINICAL REPORTS & LETTERS",
    title: "Doctor's Report & Accommodation Letters",
    subtitle: "One-Click Printable PDF Documents for Follow-Ups, Schools & Employers",
    bulletPoints: [
      "Doctor's Summary Report: Formats a complete 7-day symptom trajectory table, moving averages, and red-flag screening audit.",
      "Workplace & Academic Accommodation Letter: Formats an official notice for HR, universities, or schools requesting 50% screen reduction, rest breaks, etc.",
      "Adapted to Clinical Stage: Automatically tailors recommended accommodations to the patient's current recovery stage.",
      "Print-Optimized (@media print): Produces pristine physical printouts or clean PDF saves directly from the browser."
    ],
    keyHighlights: [
      { label: "Print Support", value: "Native @media print Styling" },
      { label: "Doctor Handoff", value: "Neurology/Sports Medicine Ready" },
      { label: "Academic Accommodations", value: "Return-to-Learn Protocol" }
    ],
    clinicalRationale:
      "Bridge the communication gap between patient daily home recovery and busy clinical neurologists, employers, and school accessibility offices.",
    speakerNoteBengali:
      "স্যার, এই ফিচারটি ১-ক্লিকে ডাক্তারের জন্য ৭ দিনের ক্লিনিক্যাল সামারি রিপোর্ট এবং স্কুল/অফিসের জন্য অফিসিয়াল অ্যাকোমোডেশন লেটার (পিডিএফ) তৈরি করে দেয়।",
    speakerNoteEnglish:
      "CerebroCalm generates print-ready clinical summaries for doctors and official accommodation letters for employers or schools based on consensus return-to-learn protocols."
  },
  {
    id: 11,
    category: "ARCHITECTURE & RESPONSIBLE AI",
    title: "System Architecture & Safety Guardrails",
    subtitle: "Deterministic Red Flags, Zero Cloud Storage & 46 Unit Tests",
    bulletPoints: [
      "Deterministic Safety Guardrails: Hardcoded red-flag screening (unequal pupils, repeated vomiting, seizure) supersedes all coaching instantly.",
      "ICE Quick-Dial: Direct-call buttons for Emergency 911 and treating neurologist on red-flag alerts.",
      "Zero Cloud Database: AES-GCM 256-bit Web Crypto API encryption with IndexedDB persistence and export/wipe functions.",
      "Production Verification: 11 test suites, 46 of 46 Vitest unit tests passed (100%), 0 ESLint warnings, 16 compiled routes."
    ],
    keyHighlights: [
      { label: "Unit Test Pass Rate", value: "46 / 46 Passed (100%)" },
      { label: "Encryption Standard", value: "Web Crypto AES-GCM 256-Bit" },
      { label: "Deterministic Safety", value: "Red-Flag Emergency Priority" }
    ],
    clinicalRationale:
      "Medical applications must never hallucinate safety. Hardcoded deterministic guardrails guarantee patient safety over generative AI predictions.",
    speakerNoteBengali:
      "স্যার, সুরক্ষার ক্ষেত্রে আমরা কোনো ঝুঁকি নেইনি। কোনো বিপজ্জনক লক্ষণ দেখা দিলে অ্যাপ সব স্বাভাবিক কাজ বন্ধ করে সাথে সাথে ৯১১ এবং ডাক্তারের নম্বরে কল করার বাটন দেখায়। আমাদের ৪৬টি টেস্টেই ১০০% পাস করেছে।",
    speakerNoteEnglish:
      "Patient safety is safeguarded through deterministic red-flag overrides that supersede all coaching. Our architecture is backed by 46 automated unit tests with 100% pass rate."
  },
  {
    id: 12,
    category: "FUTURE ROADMAP",
    title: "Future Improvements & Scalability",
    subtitle: "Wearable Sensor Integration, Clinician Portal & Multilingual Expansion",
    bulletPoints: [
      "Wearable Device Integration: Sync with Apple Watch, WHOOP, and Oura Ring for passive Heart Rate Variability (HRV) and sleep staging.",
      "Clinician Remote Sync Portal: End-to-end encrypted QR-code transfer allowing treating neurologists to import recovery logs during appointments.",
      "Expanded Neuro-Cognitive Assessments: Incorporating digital SCAT6 (Sport Concussion Assessment Tool) vestibular and memory modules.",
      "Multilingual Voice Guidance: Expanding Web Speech synthesis across Bengali, Spanish, French, and German."
    ],
    keyHighlights: [
      { label: "Next Phase", value: "Smartwatch HRV & Sleep Tracking" },
      { label: "Clinical Portal", value: "Zero-Knowledge QR Data Sync" },
      { label: "Standardization", value: "SCAT6 Protocol Integration" }
    ],
    clinicalRationale:
      "Continuous passive biometric monitoring offers objective physiological validation of autonomic nervous system recovery post-TBI.",
    speakerNoteBengali:
      "স্যার, ভবিষ্যতে আমরা স্মার্টওয়াচ এবং ওউরা রিং যুক্ত করে হার্ট রেট ভ্যারিয়েবিলিটি (HRV) মনিটর করব এবং ডাক্তারদের জন্য কিউআর কোড স্ক্যান করে ডাটা নেওয়ার সুবিধা যোগ করব।",
    speakerNoteEnglish:
      "Our roadmap includes integrating wearable biometric data like Heart Rate Variability, QR-based doctor data import, and expanding multilingual voice guidance."
  },
  {
    id: 13,
    category: "CONCLUDING GREETING & Q&A",
    title: "Thank You, Respected Sir",
    subtitle: "CerebroCalm: Less Screen. Less Cognitive Load. More Clarity. More Privacy.",
    bulletPoints: [
      "Summary: A fully functioning, privacy-first recovery companion solving real clinical problems for concussion recovery.",
      "Live Production Server: Active on http://localhost:3000 with 16 optimized routes.",
      "Ready for Demonstration: Registration, Tactile Check-In, Brown Noise Sanctuary, Reaction Test, Doctor's Report.",
      "We warmly welcome your valuable feedback, guidance, and questions!"
    ],
    keyHighlights: [
      { label: "Status", value: "Production Build Live" },
      { label: "Live URL", value: "http://localhost:3000" },
      { label: "Thank You", value: "Open for Q&A" }
    ],
    clinicalRationale:
      "Technology built responsibly with clinical integrity and genuine human empathy.",
    speakerNoteBengali:
      "ধন্যবাদ স্যার। আপনার মূল্যবান সময় ও নির্দেশনার জন্য আমরা অত্যন্ত কৃতজ্ঞ। এখন আমরা প্রজেক্টের লাইভ ডেমো প্রদর্শন করতে প্রস্তুত এবং আপনার যেকোনো প্রশ্নের উত্তর দিতে আগ্রহী।",
    speakerNoteEnglish:
      "Thank you, Respected Sir and faculty panel. We are now delighted to demonstrate the live working platform and welcome your questions and feedback."
  }
];
