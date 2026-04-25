// Build AIvenX demo deck as a native .pptx file using pptxgenjs.
// Run with: node build-pptx.js  (or: npx --yes pptxgenjs ... not needed; we install locally below)

const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches
pptx.author = "AIvenX";
pptx.company = "AIvenX";
pptx.title = "AIvenX — Demo Deck";

// Brand palette
const CYAN = "22D3EE";
const PURPLE = "A855F7";
const INK = "0F172A";
const SLATE600 = "475569";
const SLATE500 = "64748B";
const SLATE200 = "E2E8F0";
const SLATE50 = "F8FAFC";

// ---------- helpers ----------
function eyebrow(slide, text, color = PURPLE) {
  slide.addText(text, {
    x: 0.5, y: 0.4, w: 12.3, h: 0.3,
    fontFace: "Inter", fontSize: 11, bold: true, color, charSpacing: 6,
  });
}

function titleText(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.5, y: 0.7, w: 12.3, h: 1.4,
    fontFace: "Inter", fontSize: opts.size || 36, bold: true, color: opts.color || INK,
  });
}

function lede(slide, text, y = 2.1) {
  slide.addText(text, {
    x: 0.5, y, w: 11.5, h: 0.9,
    fontFace: "Inter", fontSize: 16, color: SLATE600,
  });
}

function card(slide, x, y, w, h, heading, body, opts = {}) {
  slide.addShape("roundRect", {
    x, y, w, h,
    fill: { color: opts.fill || "FFFFFF" },
    line: { color: opts.border || SLATE200, width: 1 },
    rectRadius: 0.1,
  });
  if (opts.kicker) {
    slide.addText(opts.kicker, {
      x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.3,
      fontFace: "Inter", fontSize: 9, bold: true, color: opts.kickerColor || PURPLE, charSpacing: 4,
    });
  }
  slide.addText(heading, {
    x: x + 0.2, y: y + (opts.kicker ? 0.45 : 0.2), w: w - 0.4, h: 0.4,
    fontFace: "Inter", fontSize: 14, bold: true, color: INK,
  });
  slide.addText(body, {
    x: x + 0.2, y: y + (opts.kicker ? 0.85 : 0.6), w: w - 0.4, h: h - (opts.kicker ? 1.0 : 0.75),
    fontFace: "Inter", fontSize: 11, color: SLATE600, lineSpacing: 16,
  });
}

function bulletList(slide, x, y, w, h, items, opts = {}) {
  slide.addText(
    items.map((t) => ({ text: t, options: { bullet: { code: "25CF" } } })),
    {
      x, y, w, h,
      fontFace: "Inter", fontSize: opts.size || 11, color: opts.color || INK,
      lineSpacing: opts.lineSpacing || 18,
    }
  );
}

function gradientCoverSlide(slide) {
  // Approximate the cyan→purple gradient with a solid mid-tone +
  // two overlay shapes for tonal interest. PptxGenJS doesn't support
  // CSS-style linear gradients directly, so we layer.
  slide.background = { color: PURPLE };
  slide.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { type: "solid", color: CYAN, transparency: 0 },
  });
  slide.addShape("rect", {
    x: 6, y: 0, w: 7.33, h: 7.5,
    fill: { type: "solid", color: PURPLE, transparency: 30 },
  });
  // dark vignette top-left for readability of the logo
  slide.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { type: "solid", color: "0F172A", transparency: 80 },
  });
}

// ============================================================ 1. TITLE
{
  const s = pptx.addSlide();
  gradientCoverSlide(s);
  s.addText("AIvenX", {
    x: 0.6, y: 0.5, w: 4, h: 0.5,
    fontFace: "Inter", fontSize: 24, bold: true, color: "FFFFFF",
  });
  s.addText("LIVE DEMO · 2026", {
    x: 0.6, y: 2.2, w: 6, h: 0.35,
    fontFace: "Inter", fontSize: 12, bold: true, color: "FFFFFF", charSpacing: 8,
  });
  s.addText("The AI-native\nschool,\nin one login.", {
    x: 0.6, y: 2.7, w: 12, h: 3.2,
    fontFace: "Inter", fontSize: 60, bold: true, color: "FFFFFF", lineSpacingMultiple: 1.05,
  });
  s.addText("A walkthrough prepared for [School Name].", {
    x: 0.6, y: 5.9, w: 12, h: 0.5,
    fontFace: "Inter", fontSize: 18, color: "FFFFFF",
  });
  s.addText("aivenx.co.in  ·  hello@aivenx.co.in  ·  Mumbai, India", {
    x: 0.6, y: 6.9, w: 12, h: 0.4,
    fontFace: "Inter", fontSize: 11, color: "FFFFFF",
  });
}

// ============================================================ 2. AGENDA
{
  const s = pptx.addSlide();
  eyebrow(s, "WHAT WE'LL COVER");
  titleText(s, "A guided tour, feature by feature.", { size: 36 });
  const items = [
    "01  The problem we solve",
    "02  Admissions & enquiry",
    "03  Fees & invoicing",
    "04  HR & payroll",
    "05  Timetable & exams",
    "06  Report cards (multi-board)",
    "07  Cortex — Chapter Generator",
    "08  Cortex — Question Bank (150k)",
    "09  Cortex — Assessment Creator",
    "10  Cortex — AI Evaluator",
    "11  Cortex Helper + Study mode",
    "12  Face AI attendance (live)",
    "13  Parent communication",
    "14  Library · Transport · Hostel",
    "15  Security & data",
    "16  Editions, onboarding, next steps",
  ];
  // 2 columns of 8
  for (let i = 0; i < items.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    s.addText(items[i], {
      x: 0.5 + col * 6.4, y: 2.1 + row * 0.5, w: 6.2, h: 0.45,
      fontFace: "Inter", fontSize: 14, color: INK,
    });
  }
}

// ============================================================ 3. PROBLEM
{
  const s = pptx.addSlide();
  eyebrow(s, "THE PROBLEM");
  titleText(s, "Schools juggle 5 vendors.", { size: 44 });
  lede(s,
    "Each charges per-module, has its own login, its own data silo, its own outage window. AIvenX replaces all five with one platform.",
    2.5);
  const labels = ["ERP", "LMS", "Biometric", "Exams", "Transport"];
  labels.forEach((label, i) => {
    const x = 0.5 + i * 2.5;
    s.addShape("roundRect", {
      x, y: 4.3, w: 2.3, h: 1.6,
      fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1,
    });
    s.addText(`VENDOR ${i + 1}`, {
      x, y: 4.5, w: 2.3, h: 0.3,
      fontFace: "Inter", fontSize: 9, bold: true, color: SLATE500, align: "center", charSpacing: 4,
    });
    s.addText(label, {
      x, y: 4.9, w: 2.3, h: 0.6,
      fontFace: "Inter", fontSize: 18, bold: true, color: INK, align: "center",
    });
  });
}

// Section divider helper
function sectionDivider(label, title, sub) {
  const s = pptx.addSlide();
  s.background = { color: INK };
  s.addText(label, {
    x: 0.6, y: 1.6, w: 12, h: 0.4,
    fontFace: "Inter", fontSize: 12, bold: true, color: CYAN, charSpacing: 8,
  });
  s.addText(title, {
    x: 0.6, y: 2.2, w: 12, h: 2.5,
    fontFace: "Inter", fontSize: 64, bold: true, color: "FFFFFF",
  });
  s.addText(sub, {
    x: 0.6, y: 5.0, w: 12, h: 1.0,
    fontFace: "Inter", fontSize: 20, color: "FFFFFF",
  });
}

// ============================================================ SECTION 1
sectionDivider("SECTION 1 OF 4", "School Operations.", "Admissions · Fees · HR · Library · Transport · Hostel.");

// ============================================================ 4. ADMISSIONS
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 01 · ADMISSIONS");
  titleText(s, "Capture every enquiry. Convert more of them.");
  lede(s, "A full enquiry-to-enrolment funnel. Every walk-in, web form, and phone call lands in one queue with follow-up reminders.", 2.0);

  s.addText("What it does", { x: 0.5, y: 3.2, w: 6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.5, 3.7, 6.2, 3.3, [
    "Online enquiry form embedded on your school website",
    "Walk-in capture by the front desk in 30 seconds",
    "Stage-tracked pipeline: Enquired → Visited → Tested → Offered → Enrolled",
    "Auto-reminders for follow-up calls, missed steps",
    "Document uploads (birth cert, photo) — all in one record",
    "Direct conversion to a student record on enrolment — no re-typing",
  ], { size: 12 });

  // Right side panel — why it matters
  s.addShape("roundRect", {
    x: 7.0, y: 3.2, w: 5.8, h: 3.8,
    fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15,
  });
  s.addText("WHY IT MATTERS", { x: 7.2, y: 3.4, w: 5.4, h: 0.3, fontFace: "Inter", fontSize: 9, bold: true, color: SLATE500, charSpacing: 4 });
  s.addText("Most schools lose 30% of enquiries between the form and the first follow-up call. AIvenX prevents that by making every enquiry visible to admin, principal, and the front desk on day one.",
    { x: 7.2, y: 3.8, w: 5.4, h: 2.5, fontFace: "Inter", fontSize: 13, color: SLATE600, lineSpacing: 18 });
}

// ============================================================ 5. FEES
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 02 · FEES & INVOICING");
  titleText(s, "Every rupee, accounted.");
  lede(s, "Term-based fee structures, online payments, automated dues reminders, and a finance dashboard the principal can read in 10 seconds.", 2.0);

  const items = [
    ["Flexible structures", "Term · Monthly · Annual. Sibling discounts, scholarship rules, late penalties."],
    ["Online payments", "UPI, cards, netbanking. Payment links via WhatsApp. Auto-reconciled."],
    ["Auto reminders", "Dues SMS / email at T-7, T-3, T-0 days. Custom templates. Pause for individuals."],
    ["Receipts & invoices", "GST-compliant. Branded with logo + signature. Bulk-export for the auditor."],
    ["Finance dashboard", "Collected vs. outstanding by class, term, fee head. Drill to student in two clicks."],
    ["Refunds & adjustments", "Audit-logged. Approval workflow keeps the principal in the loop."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 6. HR
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 03 · HR & PAYROLL");
  titleText(s, "Staff records, salaries, statutory — in one tab.");
  lede(s, "From the day a teacher joins to the day they retire — appointment letters, leave, payroll, PF, ESI, TDS.", 2.0);

  s.addShape("roundRect", { x: 0.5, y: 3.3, w: 6.0, h: 3.8, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("Staff lifecycle", { x: 0.7, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.7, 3.95, 5.6, 3.0, [
    "Onboarding: appointment letter, ID card, document checklist",
    "Attendance: face AI for staff too",
    "Leave: CL · SL · PL · maternity · LOP — workflow approvals",
    "Performance reviews: term-end, principal-driven",
    "Exit: relieving letter, full-and-final, archive",
  ], { size: 12 });

  s.addShape("roundRect", { x: 6.85, y: 3.3, w: 6.0, h: 3.8, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("Payroll & statutory", { x: 7.05, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 7.05, 3.95, 5.6, 3.0, [
    "Salary structures: basic, HRA, allowances, deductions",
    "PF + ESI auto-calculated; challans generated",
    "TDS: monthly deduction, Form 16 at year-end",
    "Bank-ready salary file in one click",
    "Payslips emailed; staff portal download anytime",
  ], { size: 12 });
}

// ============================================================ 7. TIMETABLE
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 04 · TIMETABLE & EXAMS");
  titleText(s, "Build a clash-free timetable in 20 minutes.");
  lede(s, "Auto-generation respects teacher availability, lab capacity, and subject hours. Exam scheduling and seating plans included.", 2.0);

  const items = [
    ["Auto-generation", "Set constraints once: teacher loads, room types, free-period rules. AIvenX builds the grid."],
    ["Substitutions", "Mark a teacher absent → system suggests substitute → SMS to substitute & class."],
    ["Exam schedules", "Term + final + unit tests. Auto-checks against syllabus completion. Hall-tickets."],
    ["Seating plans", "Mixed-class seating, roll-number rules, distance constraints, supervisors."],
    ["Marks entry", "Teacher portal with bulk-paste from spreadsheets, validation, lock-after-submission."],
    ["Result analytics", "Class average, pass %, top scorers, weak areas — per subject, per chapter."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 8. REPORT CARDS
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 05 · REPORT CARDS (MULTI-BOARD)");
  titleText(s, "Native formats for every board.");
  lede(s, "Not a one-size-fits-all template. Each board's official structure, grading scale, and skill rubric — out of the box.", 2.0);

  s.addShape("roundRect", { x: 0.5, y: 3.3, w: 6.0, h: 3.4, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("International", { x: 0.7, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.7, 3.95, 5.6, 2.6, [
    "IB PYP — inquiry-based learning rubric",
    "IB MYP — criterion grades A–E across 4 strands",
    "IB DP — 1–7 + TOK / EE / CAS",
    "Cambridge IGCSE / A-Levels — A* to G",
    "Advanced Placement — AP score, course grade",
  ], { size: 12 });

  s.addShape("roundRect", { x: 6.85, y: 3.3, w: 6.0, h: 3.4, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("Indian", { x: 7.05, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 7.05, 3.95, 5.6, 2.6, [
    "CBSE — Term + final, scholastic + co-scholastic, CCE",
    "ICSE / ISC — Marks-based, ICSE skill grading",
    "State Boards — Maharashtra, Karnataka, TN, UP, etc.",
    "NIOS — Distance / open schooling",
  ], { size: 12 });

  s.addShape("roundRect", { x: 0.5, y: 6.85, w: 12.35, h: 0.55, fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1 });
  s.addText("Don't see yours? Cortex AI is built to adapt to any framework — share your school's rubric and we'll configure it during onboarding.",
    { x: 0.7, y: 6.9, w: 12.0, h: 0.45, fontFace: "Inter", fontSize: 12, color: INK });
}

// ============================================================ SECTION 2
{
  const s = pptx.addSlide();
  gradientCoverSlide(s);
  s.addText("SECTION 2 OF 4", { x: 0.6, y: 1.6, w: 12, h: 0.4, fontFace: "Inter", fontSize: 12, bold: true, color: "FFFFFF", charSpacing: 8 });
  s.addText("Cortex AI Studio.", { x: 0.6, y: 2.2, w: 12, h: 2.5, fontFace: "Inter", fontSize: 64, bold: true, color: "FFFFFF" });
  s.addText("The flagship. Five tools that save every teacher 10 hours a week.", {
    x: 0.6, y: 5.0, w: 12, h: 1.0, fontFace: "Inter", fontSize: 20, color: "FFFFFF",
  });
}

// ============================================================ 9. CHAPTER GEN
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 06 · CHAPTER GENERATOR");
  titleText(s, "A board-aligned chapter, in 30 seconds.");
  lede(s, "Pick subject, grade, topic. Cortex produces a full chapter — text, diagrams, exercises, answer keys — in one of four learning modes.", 2.0);

  const modes = [
    ["🎯 Focus", "Clear, structured, exam-ready. Definitions → examples → practice."],
    ["⚡ Spark", "Engaging analogies, real-world hooks, 'why does this matter' framing."],
    ["🎮 Quest", "Gamified — challenges, streaks, levels. Best for grades 4-8."],
    ["📖 Saga", "Narrative-driven. Concepts taught through story arcs and characters."],
  ];
  modes.forEach(([h, b], i) => {
    const x = 0.5 + i * 3.18;
    card(s, x, 3.3, 3.0, 2.4, h, b, { border: PURPLE });
  });

  s.addShape("roundRect", { x: 0.5, y: 6.0, w: 12.35, h: 1.1, fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1 });
  s.addText("Every chapter includes: body text · embedded diagrams · worked examples · end-of-chapter exercises · answer keys · glossary · cross-links.",
    { x: 0.7, y: 6.15, w: 12.0, h: 0.85, fontFace: "Inter", fontSize: 13, color: INK });
}

// ============================================================ 10. QUESTION BANK
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 07 · QUESTION BANK");
  titleText(s, "150,000+ pre-loaded questions.");
  lede(s, "Curated, tagged, board-mapped. The library that took us 18 months to build is yours from day one.", 2.0);

  const items = [
    ["Every type", "MCQ · Fill-in-the-blank · Short / long answer · Match · True/False · Diagram-based · Numerical."],
    ["Tagged deeply", "Subject · Grade · Chapter · Difficulty (1-5) · Bloom's level · Marks · Time estimate."],
    ["Board-mapped", "Linked to CBSE / ICSE / IB / CAIE / State syllabus codes for guaranteed alignment."],
    ["Past-paper rooted", "Includes 10 years of board exam questions, marked, with model answers."],
    ["Add your own", "Teachers contribute private questions to a school-only pool. Stays in your tenant."],
    ["Continuously updated", "New questions every month. Existing ones re-rated when student data shows mis-calibration."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 11. ASSESSMENT CREATOR
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 08 · ASSESSMENT CREATOR");
  titleText(s, "Build a 3-hour board paper in 4 minutes.");
  lede(s, "Pick filters → preview coverage → publish. CBSE-standard section presets included. Live distribution chart.", 2.0);

  s.addText("How it works", { x: 0.5, y: 3.2, w: 6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.5, 3.7, 6.2, 3.5, [
    "1. Pick subject, grade, total marks, duration.",
    "2. Choose section structure — or load a preset (CBSE Sec A/B/C/D/E).",
    "3. Per section: question type, count, marks, chapter & difficulty filters.",
    "4. Live preview shows: chapter coverage, Bloom distribution, difficulty curve.",
    "5. Auto-fill from question bank, or hand-pick. Mix freely.",
    "6. Publish → printable PDF + answer key + student-portal link.",
  ], { size: 12 });

  s.addShape("roundRect", { x: 7.0, y: 3.2, w: 5.85, h: 3.9, fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("WHY TEACHERS LOVE IT", { x: 7.2, y: 3.4, w: 5.5, h: 0.3, fontFace: "Inter", fontSize: 9, bold: true, color: SLATE500, charSpacing: 4 });
  s.addText("Paper-setting used to take 4-6 hours. With Cortex it's under 10 minutes — and the coverage preview catches mistakes before they reach students. Two teachers can collaborate live on the same paper.",
    { x: 7.2, y: 3.8, w: 5.5, h: 3.0, fontFace: "Inter", fontSize: 13, color: SLATE600, lineSpacing: 18 });
}

// ============================================================ 12. AI EVALUATOR
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 09 · AI EVALUATOR");
  titleText(s, "Grade 200 sheets in an hour, not a weekend.");
  lede(s, "Upload scanned sheets — Cortex grades MCQs in seconds, short / long answers using rubric-aware AI. Borderline cases route to teacher.", 2.0);

  const items = [
    ["OCR for handwriting", "Trained on Indian student handwriting. Works on regular A4 scans — no special paper."],
    ["Rubric-aware grading", "Compares to model answer + rubric. Awards partial marks; explains every deduction."],
    ["Teacher-in-the-loop", "Confidence-scored. Borderline answers (~10%) routed to teacher; rest auto-finalised."],
    ["Plagiarism check", "Flags suspiciously similar answers across the same class — catches copying."],
    ["Auto-write to gradebook", "Marks land in the exam record. Report cards generate themselves."],
    ["Insights for teachers", "Per-question analytics: which concept needs re-teaching, which student needs help."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 13. CORTEX HELPER + STUDY
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 10 · CORTEX HELPER + STUDY MODE");
  titleText(s, "An AI guide on every page. Meet Leo.");
  lede(s, "A floating chat button that knows what page you're on. For staff, product help. For students, a chapter tutor.", 2.0);

  s.addShape("roundRect", { x: 0.5, y: 3.3, w: 6.0, h: 3.6, fill: { color: "FFFFFF" }, line: { color: CYAN, width: 2 }, rectRadius: 0.15 });
  s.addText("Helper mode (staff)", { x: 0.7, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.7, 3.95, 5.6, 2.8, [
    "\"How do I generate a fee invoice?\"",
    "\"Why is this student showing absent?\"",
    "\"Take me to the timetable for Class 7B\"",
    "Streams answers live · cites the right module",
    "Persists across pages — context carries",
  ], { size: 12 });

  s.addShape("roundRect", { x: 6.85, y: 3.3, w: 6.0, h: 3.6, fill: { color: "FFFFFF" }, line: { color: PURPLE, width: 2 }, rectRadius: 0.15 });
  s.addText("Study mode (students)", { x: 7.05, y: 3.45, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 7.05, 3.95, 5.6, 2.8, [
    "Auto-activates on chapter pages",
    "\"Explain photosynthesis like I'm in grade 7\"",
    "\"Quiz me on this chapter\"",
    "\"What did this paragraph mean?\"",
    "Stays on-syllabus — never goes off-topic",
  ], { size: 12 });
}

// ============================================================ SECTION 3
sectionDivider("SECTION 3 OF 4", "Face AI Attendance.", "The biometric machine, replaced by a webcam.");

// ============================================================ 14. FACE AI
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 11 · FACE AI ATTENDANCE");
  titleText(s, "Under a second per student. No queue.");
  lede(s, "Live demo follows. A single webcam at the door marks every student present in real time, while teachers walk in and start teaching.", 2.0);

  const steps = [
    ["1", "Enrol once", "3-5 photos at admission. Embeddings stored, photos discarded."],
    ["2", "Recognise live", "Camera streams to the recognizer. Faces matched in <1 sec."],
    ["3", "Default-absent", "Anyone not seen by cut-off → marked absent → SMS to parent."],
    ["4", "Period-wise", "Re-runs every period. Catches mid-day absconding too."],
  ];
  steps.forEach(([n, h, b], i) => {
    const x = 0.5 + i * 3.18;
    s.addShape("roundRect", { x, y: 3.3, w: 3.0, h: 2.4, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1 });
    s.addText(n, { x: x + 0.2, y: 3.4, w: 0.8, h: 0.6, fontFace: "Inter", fontSize: 24, bold: true, color: PURPLE });
    s.addText(h, { x: x + 0.2, y: 4.0, w: 2.6, h: 0.4, fontFace: "Inter", fontSize: 14, bold: true, color: INK });
    s.addText(b, { x: x + 0.2, y: 4.45, w: 2.6, h: 1.2, fontFace: "Inter", fontSize: 11, color: SLATE600, lineSpacing: 16 });
  });

  s.addShape("roundRect", { x: 0.5, y: 6.0, w: 12.35, h: 1.1, fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1 });
  s.addText("Privacy by design: only mathematical embeddings stored — never raw photos. ID-card scan continues as backup. Camera frames processed and discarded.",
    { x: 0.7, y: 6.15, w: 12.0, h: 0.85, fontFace: "Inter", fontSize: 12, color: INK });
}

// ============================================================ SECTION 4
sectionDivider("SECTION 4 OF 4", "Engagement & Operations.", "Communication · Library · Transport · Hostel · Foundations.");

// ============================================================ 15. COMMUNICATION
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 12 · PARENT COMMUNICATION");
  titleText(s, "One channel for every parent message.");
  lede(s, "Notice board, SMS, email, in-app, and (optionally) WhatsApp Business. Every message logged, every delivery tracked.", 2.0);

  const items = [
    ["Notice board", "School-wide, class-wise, or individual. Pin-to-top, expiry dates, attachments."],
    ["Templates", "Pre-built for: absent SMS, fee dues, exam reminders, PTM, holidays."],
    ["Multi-language", "English, Hindi, Marathi, Tamil, Bengali — auto-translated per parent's preference."],
    ["Two-way", "Parents reply from their portal. Teacher sees a threaded conversation."],
    ["Event calendar", "Sync to Google / Apple. PTM bookings handled in-portal."],
    ["Delivery tracking", "Sent · Delivered · Read · Replied. Auditable, exportable."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 16. LIBRARY / TRANSPORT / HOSTEL
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 13 · LIBRARY · TRANSPORT · HOSTEL");
  titleText(s, "The operational long tail, handled.");
  lede(s, "Three modules other ERPs charge extra for — included in AIvenX from the Operate edition onwards.", 2.0);

  const blocks = [
    ["📚 Library", [
      "Catalogue with ISBN auto-fetch",
      "Issue / return via barcode or QR",
      "Fines auto-calculated, charged to fees",
      "Reading lists per class",
      "Inventory audits, reservations",
    ]],
    ["🚌 Transport", [
      "Routes & stops with student assignment",
      "Driver app for pickup confirmation",
      "Live GPS (with hardware partner)",
      "Parent ETA + boarding/alighting alerts",
      "Bus fees integrated with fee module",
    ]],
    ["🛏️ Hostel", [
      "Room allocation, roommate matching",
      "In/out register with face check-in",
      "Mess attendance & menu",
      "Visitor log, leave applications",
      "Hostel + mess fees integrated",
    ]],
  ];
  blocks.forEach(([h, items], i) => {
    const x = 0.5 + i * 4.25;
    s.addShape("roundRect", { x, y: 3.3, w: 4.0, h: 3.7, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
    s.addText(h, { x: x + 0.2, y: 3.45, w: 3.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
    bulletList(s, x + 0.2, 3.9, 3.6, 3.0, items, { size: 11 });
  });
}

// ============================================================ ROADMAP DIVIDER
{
  const s = pptx.addSlide();
  gradientCoverSlide(s);
  s.addText("2026 — 2027 ROADMAP", { x: 0.6, y: 1.6, w: 12, h: 0.4, fontFace: "Inter", fontSize: 12, bold: true, color: "FFFFFF", charSpacing: 8 });
  s.addText("Three new pillars,\nalready on the way.", { x: 0.6, y: 2.2, w: 12, h: 2.5, fontFace: "Inter", fontSize: 56, bold: true, color: "FFFFFF" });
  s.addText("All included in your subscription when they ship — no upsell, no module fee.", {
    x: 0.6, y: 5.5, w: 12, h: 1.0, fontFace: "Inter", fontSize: 18, color: "FFFFFF",
  });
}

// ============================================================ ROADMAP A · GUARDIAN
{
  const s = pptx.addSlide();
  eyebrow(s, "ROADMAP · AIVENX GUARDIAN");
  titleText(s, "A safety net around every student.");
  lede(s, "A single suite covering the bus, the gate, and the moments in between. Beta now in two pilot schools; pilot rollout H2 2026.", 2.0);

  const cards = [
    ["🚌 Live bus tracking", [
      "GPS pings every 10 sec",
      "Boarding / alighting verification",
      "Parent ETA on the home screen",
      "Route deviation alerts",
      "Driver app for pickup confirmation",
    ]],
    ["🚪 Campus gate access", [
      "Face-AI in/out at every gate",
      "Live who's-on-campus headcount",
      "Visitor sign-in with audit trail",
      "Unknown-face flagging",
      "Per-period attendance reconciliation",
    ]],
    ["🛡️ In-bus safety AI", [
      "Bullying / harassment detection",
      "Audio + video classifier",
      "Real-time alert to admin + driver",
      "Panic button on the parent app",
      "Encrypted footage retained 30 days",
    ]],
  ];
  cards.forEach(([h, items], i) => {
    const x = 0.5 + i * 4.25;
    s.addShape("roundRect", { x, y: 3.2, w: 4.0, h: 3.0, fill: { color: "FFFFFF" }, line: { color: CYAN, width: 2 }, rectRadius: 0.15 });
    s.addText(h, { x: x + 0.2, y: 3.35, w: 3.6, h: 0.45, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
    bulletList(s, x + 0.2, 3.85, 3.6, 2.3, items, { size: 11 });
  });

  s.addShape("roundRect", { x: 0.5, y: 6.4, w: 12.35, h: 0.85, fill: { color: PURPLE }, line: { color: PURPLE, width: 1 }, rectRadius: 0.1 });
  s.addText("Why parents care: the parent's phone tells them where their child is — before anyone has to ask.",
    { x: 0.7, y: 6.5, w: 12.0, h: 0.7, fontFace: "Inter", fontSize: 13, bold: true, color: "FFFFFF" });
}

// ============================================================ ROADMAP B · CONNECT
{
  const s = pptx.addSlide();
  eyebrow(s, "ROADMAP · AIVENX CONNECT");
  titleText(s, "Every batch. Still in touch.");
  lede(s, "An alumni network built into the school's own platform. Live in pilot now; GA H2 2026.", 2.0);

  s.addShape("roundRect", { x: 0.5, y: 3.2, w: 6.0, h: 3.7, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
  s.addText("What alumni get", { x: 0.7, y: 3.35, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 0.7, 3.85, 5.6, 2.9, [
    "A polished profile that travels — even after the school email expires",
    "Mentorship requests from current students they actually want to help",
    "A job board they post to (and that current students actually read)",
    "Reunions, fundraisers, and events with one-tap RSVP",
  ], { size: 12 });

  s.addShape("roundRect", { x: 6.85, y: 3.2, w: 6.0, h: 3.7, fill: { color: "FFFFFF" }, line: { color: PURPLE, width: 2 }, rectRadius: 0.15 });
  s.addText("What the school gets", { x: 7.05, y: 3.35, w: 5.6, h: 0.4, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
  bulletList(s, 7.05, 3.85, 5.6, 2.9, [
    "Searchable directory by batch, industry, location, role",
    "Mentor matching engine — students filter by area; alumni opt in",
    "Verified profiles — admin-stamped to prevent impersonation",
    "Engagement analytics — which batches are active",
    "Privacy controls — school-only or public visibility",
  ], { size: 12 });
}

// ============================================================ ROADMAP C · MOBILE
{
  const s = pptx.addSlide();
  eyebrow(s, "ROADMAP · AIVENX MOBILE");
  titleText(s, "Two apps. One platform.");
  lede(s, "Native iOS + Android for students and parents. Single sign-on with the school portal. Shipping early 2027.", 2.0);

  s.addShape("roundRect", { x: 0.5, y: 3.2, w: 6.0, h: 3.9, fill: { color: "FFFFFF" }, line: { color: CYAN, width: 2 }, rectRadius: 0.15 });
  s.addText("📚 Student app", { x: 0.7, y: 3.35, w: 5.6, h: 0.5, fontFace: "Inter", fontSize: 18, bold: true, color: INK });
  s.addText("For grades 4 and up. A learning companion, not a portal.", {
    x: 0.7, y: 3.9, w: 5.6, h: 0.45, fontFace: "Inter", fontSize: 11, color: SLATE600, italic: true,
  });
  bulletList(s, 0.7, 4.4, 5.6, 2.6, [
    "Today's chapters in their preferred mode (Focus / Spark / Quest / Saga)",
    "Leo, the AI tutor, on every page",
    "Self-paced practice with the question bank",
    "Timetable, results, exam schedules at a tap",
    "Personal portfolio — projects, achievements, badges",
  ], { size: 11 });

  s.addShape("roundRect", { x: 6.85, y: 3.2, w: 6.0, h: 3.9, fill: { color: "FFFFFF" }, line: { color: PURPLE, width: 2 }, rectRadius: 0.15 });
  s.addText("👨‍👩‍👧 Parent app", { x: 7.05, y: 3.35, w: 5.6, h: 0.5, fontFace: "Inter", fontSize: 18, bold: true, color: INK });
  s.addText("Calm, confident updates — no more guessing.", {
    x: 7.05, y: 3.9, w: 5.6, h: 0.45, fontFace: "Inter", fontSize: 11, color: SLATE600, italic: true,
  });
  bulletList(s, 7.05, 4.4, 5.6, 2.6, [
    "Live attendance — gate-confirmed, not teacher-typed",
    "Fee invoices + UPI payment in two taps",
    "Bus tracker — live ETA + boarding alerts",
    "Threaded teacher chat",
    "Wellbeing & safety alerts (Guardian-powered)",
    "Term-end performance summary, no PDFs",
  ], { size: 11 });
}

// ============================================================ 17. SECURITY
{
  const s = pptx.addSlide();
  eyebrow(s, "FEATURE 14 · SECURITY & DATA");
  titleText(s, "Built for the data you can't lose.");
  lede(s, "Schools handle minors' photos, medical records, fee histories. AIvenX is engineered around that responsibility.", 2.0);

  const items = [
    ["🔒 Multi-tenant secure", "Each school is fully isolated at the database level. No cross-tenant leakage."],
    ["👥 Role-based access", "Admin · Principal · Teacher · Student · Parent — every action audited."],
    ["💾 Daily backups", "Encrypted, point-in-time recovery. One-click data export — no lock-in."],
    ["🇮🇳 Hosted in India", "Data residency, low latency, DPDP-aligned for Indian schools."],
    ["🛡️ Privacy-first AI", "Face embeddings only. Student data never trains third-party models."],
    ["📋 Audit logs", "Every login, edit, export logged for compliance and forensics."],
  ];
  items.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, 0.5 + col * 4.25, 3.3 + row * 1.85, 4.0, 1.65, h, b);
  });
}

// ============================================================ 18. EDITIONS
{
  const s = pptx.addSlide();
  eyebrow(s, "EDITIONS");
  titleText(s, "Pick the edition that fits your school.");

  const cols = [
    {
      tag: "STARTER", name: "Operate", border: SLATE200,
      items: ["Admissions & fees", "HR & payroll", "Timetable & exams", "Report cards", "Library · Transport · Hostel", "Parent portal"],
    },
    {
      tag: "MOST POPULAR", name: "Operate + Cortex", border: PURPLE, highlight: true,
      items: ["Everything in Operate", "Chapter Generator", "150k Question Bank", "Assessment Creator", "Lesson plans", "Cortex Helper bot"],
    },
    {
      tag: "ENTERPRISE", name: "Everything", border: SLATE200,
      items: ["Everything in Pro", "AI Evaluator", "Face AI Attendance", "Teacher Assist (2026)", "Student Surveillance (2026)", "Dedicated CSM"],
    },
  ];
  cols.forEach((col, i) => {
    const x = 0.5 + i * 4.25;
    s.addShape("roundRect", {
      x, y: 2.5, w: 4.0, h: 4.2,
      fill: { color: "FFFFFF" }, line: { color: col.border, width: col.highlight ? 2 : 1 }, rectRadius: 0.15,
    });
    s.addText(col.tag, { x: x + 0.25, y: 2.65, w: 3.5, h: 0.3, fontFace: "Inter", fontSize: 9, bold: true, color: col.highlight ? PURPLE : SLATE500, charSpacing: 4 });
    s.addText(col.name, { x: x + 0.25, y: 3.0, w: 3.5, h: 0.6, fontFace: "Inter", fontSize: 22, bold: true, color: INK });
    bulletList(s, x + 0.25, 3.7, 3.5, 2.8, col.items, { size: 11 });
  });
  s.addText("Pricing scales with student count. We'll send a tailored quote within 48 hours of this demo.",
    { x: 0.5, y: 6.85, w: 12, h: 0.5, fontFace: "Inter", fontSize: 13, color: SLATE600 });
}

// ============================================================ 19. ONBOARDING
{
  const s = pptx.addSlide();
  eyebrow(s, "ONBOARDING");
  titleText(s, "From contract to live in 14 days.");

  const phases = [
    ["DAY 1-3", "Setup", "Tenant provisioned. Branding, classes, sections, fee structure imported."],
    ["DAY 4-7", "Data migration", "Student & staff records imported from your existing system. Validated by AIvenX team."],
    ["DAY 8-11", "Training", "Admin · Principal · Teacher · Parent walkthroughs. Recorded, role-specific."],
    ["DAY 12-14", "Go-live", "Soft launch with one class → full rollout. Dedicated CSM on call."],
  ];
  phases.forEach(([k, h, b], i) => {
    const x = 0.5 + i * 3.18;
    s.addShape("roundRect", { x, y: 2.5, w: 3.0, h: 2.8, fill: { color: "FFFFFF" }, line: { color: SLATE200, width: 1 }, rectRadius: 0.15 });
    s.addText(k, { x: x + 0.2, y: 2.65, w: 2.6, h: 0.3, fontFace: "Inter", fontSize: 9, bold: true, color: SLATE500, charSpacing: 4 });
    s.addText(h, { x: x + 0.2, y: 3.0, w: 2.6, h: 0.5, fontFace: "Inter", fontSize: 16, bold: true, color: INK });
    s.addText(b, { x: x + 0.2, y: 3.5, w: 2.6, h: 1.6, fontFace: "Inter", fontSize: 11, color: SLATE600, lineSpacing: 16 });
  });

  s.addShape("roundRect", { x: 0.5, y: 5.7, w: 12.35, h: 1.1, fill: { color: SLATE50 }, line: { color: SLATE200, width: 1 }, rectRadius: 0.1 });
  s.addText("White-glove migration is included. We handle CSV imports from your current ERP / LMS — your team isn't stuck reformatting spreadsheets.",
    { x: 0.7, y: 5.85, w: 12, h: 0.85, fontFace: "Inter", fontSize: 13, color: INK });
}

// ============================================================ 20. NEXT STEPS
{
  const s = pptx.addSlide();
  gradientCoverSlide(s);
  s.addText("NEXT STEPS", { x: 0.6, y: 0.9, w: 12, h: 0.4, fontFace: "Inter", fontSize: 12, bold: true, color: "FFFFFF", charSpacing: 8 });
  s.addText("Three things, this week.", { x: 0.6, y: 1.5, w: 12, h: 1.5, fontFace: "Inter", fontSize: 50, bold: true, color: "FFFFFF" });

  const steps = [
    ["01", "Tailored quote", "Pricing for your edition + student count within 48 hours."],
    ["02", "Pilot setup", "Free 14-day pilot tenant with one class — your data, your branding."],
    ["03", "Decision call", "Reconvene at the end of the pilot to plan rollout or close out."],
  ];
  steps.forEach(([n, h, b], i) => {
    const y = 3.5 + i * 1.15;
    s.addText(n, { x: 0.6, y, w: 1.0, h: 0.9, fontFace: "Inter", fontSize: 36, bold: true, color: "FFFFFF" });
    s.addText(h, { x: 1.7, y, w: 11, h: 0.5, fontFace: "Inter", fontSize: 22, bold: true, color: "FFFFFF" });
    s.addText(b, { x: 1.7, y: y + 0.5, w: 11, h: 0.5, fontFace: "Inter", fontSize: 14, color: "FFFFFF" });
  });
}

// ============================================================ 21. THANK YOU
{
  const s = pptx.addSlide();
  gradientCoverSlide(s);
  s.addText("AIvenX", { x: 0.6, y: 0.5, w: 4, h: 0.5, fontFace: "Inter", fontSize: 24, bold: true, color: "FFFFFF" });
  s.addText("Thank you.", { x: 0.6, y: 2.5, w: 12, h: 2.5, fontFace: "Inter", fontSize: 96, bold: true, color: "FFFFFF" });
  s.addText("Questions?", { x: 0.6, y: 5.0, w: 12, h: 0.6, fontFace: "Inter", fontSize: 28, color: "FFFFFF" });

  // Contact strip
  const contacts = [
    ["SALES", "sales@aivenx.co.in"],
    ["GENERAL", "hello@aivenx.co.in"],
    ["WEB", "aivenx.co.in"],
  ];
  contacts.forEach(([k, v], i) => {
    const x = 0.6 + i * 4.2;
    s.addText(k, { x, y: 6.4, w: 4, h: 0.3, fontFace: "Inter", fontSize: 9, bold: true, color: "FFFFFF", charSpacing: 4 });
    s.addText(v, { x, y: 6.7, w: 4, h: 0.5, fontFace: "Inter", fontSize: 16, bold: true, color: "FFFFFF" });
  });
}

// ---------- write ----------
pptx.writeFile({ fileName: "AIvenX-Demo-Deck.pptx" })
  .then((f) => console.log("Wrote:", f))
  .catch((e) => { console.error(e); process.exit(1); });
