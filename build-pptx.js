// =============================================================================
// AIvenX Demo Deck — pptxgenjs builder
//
// Mirrors the 30-slide HTML deck at /demo.html. Run with:
//   node build-pptx.js
// Output: AIvenX-Demo-Deck.pptx (in this folder)
//
// Design notes:
//   - 16:9 widescreen layout (13.33 × 7.5 in)
//   - Dark brand surface for cover + section dividers + final close
//   - White content surface for body slides (saves ink on print)
//   - Inter / Space Grotesk look-alike via Inter weights
//   - aivenx-mark.png inset in every body-slide footer (when present)
//   - Single helper file — every slide is one IIFE block so re-ordering
//     is a copy/paste with no cross-slide bookkeeping
// =============================================================================

const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 inches
pptx.author = "AIvenX";
pptx.company = "AIvenX";
pptx.title = "AIvenX — Demo Deck";
pptx.subject = "AI-native school OS";

// === Brand palette (hex without #) ===
const CYAN     = "22D3EE";
const PURPLE   = "A855F7";
const PINK     = "EC4899";
const EMERALD  = "10B981";
const AMBER    = "F59E0B";
const ROSE     = "F43F5E";
const INK      = "0B0F1F";
const MID      = "0F172A";
const SLATE700 = "334155";
const SLATE600 = "475569";
const SLATE500 = "64748B";
const SLATE400 = "94A3B8";
const SLATE300 = "CBD5E1";
const SLATE200 = "E2E8F0";
const SLATE100 = "F1F5F9";
const SLATE50  = "F8FAFC";
const WHITE    = "FFFFFF";

const MARK = path.join(__dirname, "assets", "aivenx-mark.png");
const MARK_OK = fs.existsSync(MARK);

// =============================================================================
// HELPERS
// =============================================================================

function darkBg(s) {
  s.background = { color: INK };
  // Soft dual-tone glow approximation (no real gradients in pptx)
  s.addShape("ellipse", {
    x: -2, y: -2, w: 8, h: 8,
    fill: { color: CYAN, transparency: 88 }, line: { type: "none" },
  });
  s.addShape("ellipse", {
    x: 8, y: 3, w: 9, h: 8,
    fill: { color: PURPLE, transparency: 86 }, line: { type: "none" },
  });
}

function lightBg(s) { s.background = { color: WHITE }; }

function brandCorner(s, dark = false) {
  if (MARK_OK) {
    s.addImage({ path: MARK, x: 0.45, y: 0.32, w: 0.45, h: 0.45 });
  }
  s.addText("AIvenX", {
    x: 1.0, y: 0.32, w: 2, h: 0.45,
    fontFace: "Calibri", fontSize: 16, bold: true, color: dark ? WHITE : INK,
  });
}

function tag(s, label, dark = false) {
  // Section + slide indicator tag in top-left
  s.addText(`●  ${label}`, {
    x: 0.45, y: 0.85, w: 6, h: 0.32,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: dark ? CYAN : PURPLE, charSpacing: 6,
  });
}

function slideNum(s, n, total = 30, dark = false) {
  s.addText(`${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: 11.6, y: 0.32, w: 1.5, h: 0.32,
    fontFace: "Calibri", fontSize: 10,
    color: dark ? SLATE400 : SLATE500, align: "right", charSpacing: 4,
  });
}

function pageFoot(s, n, dark = false) {
  s.addText("AIvenX · Demo deck", {
    x: 0.45, y: 7.05, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 9,
    color: dark ? SLATE400 : SLATE500,
  });
  s.addText(String(n).padStart(2, "0"), {
    x: 11.6, y: 7.05, w: 1.5, h: 0.3,
    fontFace: "Calibri", fontSize: 9,
    color: dark ? SLATE400 : SLATE500, align: "right",
  });
}

function chrome(s, label, n, dark = false) {
  brandCorner(s, dark);
  tag(s, label, dark);
  slideNum(s, n, 30, dark);
  pageFoot(s, n, dark);
}

function bigTitle(s, lines, opts = {}) {
  // Lines: array of {text, color?} segments shown with line breaks.
  // Renders as one runs-array text block for a single visual headline.
  const runs = [];
  lines.forEach((line, i) => {
    runs.push({
      text: line.text,
      options: {
        color: line.color || (opts.dark ? WHITE : INK),
        bold: true,
        fontFace: "Calibri",
        fontSize: opts.size || 40,
      },
    });
    if (i < lines.length - 1) runs.push({ text: "\n", options: {} });
  });
  s.addText(runs, {
    x: 0.5, y: opts.y || 1.5, w: 12.3, h: opts.h || 3.0,
    lineSpacingMultiple: 1.05,
  });
}

function eyebrowSmall(s, text, color, x = 0.5, y = 1.4) {
  s.addText(text, {
    x, y, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color, charSpacing: 6,
  });
}

function lede(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x || 0.5, y: opts.y || 4.7, w: opts.w || 11.5, h: opts.h || 1.2,
    fontFace: "Calibri", fontSize: opts.size || 16,
    color: opts.dark ? SLATE300 : SLATE600,
    lineSpacingMultiple: 1.35,
  });
}

function rectCard(s, x, y, w, h, opts = {}) {
  s.addShape("roundRect", {
    x, y, w, h,
    fill: { color: opts.fill || SLATE50, transparency: opts.transparency || 0 },
    line: { color: opts.border || SLATE200, width: 1 },
    rectRadius: 0.12,
  });
}

function darkCard(s, x, y, w, h) {
  s.addShape("roundRect", {
    x, y, w, h,
    fill: { color: WHITE, transparency: 92 },
    line: { color: WHITE, width: 0.5 },
    rectRadius: 0.12,
  });
}

function pill(s, x, y, w, text, opts = {}) {
  s.addShape("roundRect", {
    x, y, w, h: 0.32,
    fill: { color: opts.bg || SLATE100, transparency: opts.transparency || 0 },
    line: { type: "none" },
    rectRadius: 0.16,
  });
  s.addText(text, {
    x, y, w, h: 0.32,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: opts.color || SLATE600, align: "center", valign: "middle",
    charSpacing: 4,
  });
}

function sectionDivider({ chapter, title, gradient, sub, slideNo }) {
  const s = pptx.addSlide();
  darkBg(s);
  s.addText(`CHAPTER ${chapter}`, {
    x: 0.5, y: 2.3, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 14, bold: true,
    color: gradient || CYAN, align: "center", charSpacing: 8,
  });
  s.addText(title, {
    x: 0.5, y: 2.85, w: 12.3, h: 2.3,
    fontFace: "Calibri", fontSize: 72, bold: true,
    color: WHITE, align: "center",
  });
  if (sub) {
    s.addText(sub, {
      x: 1.5, y: 5.5, w: 10.3, h: 1.0,
      fontFace: "Calibri", fontSize: 18,
      color: SLATE300, align: "center",
    });
  }
  slideNum(s, slideNo, 30, true);
  pageFoot(s, slideNo, true);
}

// =============================================================================
// SLIDE 01 · COVER
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  // Brand
  if (MARK_OK) s.addImage({ path: MARK, x: 0.5, y: 0.4, w: 0.6, h: 0.6 });
  s.addText("AIvenX", {
    x: 1.2, y: 0.4, w: 4, h: 0.6,
    fontFace: "Calibri", fontSize: 22, bold: true, color: WHITE,
  });
  s.addText("DEMO DECK FOR SCHOOL LEADERSHIP", {
    x: 1.2, y: 0.95, w: 8, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: SLATE400, charSpacing: 8,
  });

  // Hero
  s.addText("Prepared for the leadership team of [Your school's name]", {
    x: 0.5, y: 2.2, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 12, bold: true, color: CYAN, align: "center",
  });
  s.addText("The AI-native\nschool OS.", {
    x: 0.5, y: 2.7, w: 12.3, h: 3.0,
    fontFace: "Calibri", fontSize: 80, bold: true, color: WHITE,
    align: "center", lineSpacingMultiple: 0.95,
  });
  s.addText(
    "A walkthrough of what we'll show you in the live 30-minute demo.\nRead it whenever you have 8 minutes. Then book the call.",
    {
      x: 0.5, y: 5.4, w: 12.3, h: 1.0,
      fontFace: "Calibri", fontSize: 18, color: SLATE300, align: "center",
      lineSpacingMultiple: 1.4,
    }
  );

  // Footer line
  s.addText("Demo deck v2  ·  April 2026  ·  Hyderabad, India  ·  aivenx.co.in", {
    x: 0.5, y: 7.0, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: SLATE400, align: "center",
  });
  slideNum(s, 1, 30, true);
}

// =============================================================================
// SLIDE 02 · THE PROMISE
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "WHY WE SENT THIS", 2, true);

  s.addText([
    { text: "In 30 minutes we'll show you how AIvenX ", options: { color: WHITE } },
    { text: "grades a real exam paper", options: { color: CYAN } },
    { text: ", ", options: { color: WHITE } },
    { text: "tells each student what to revisit", options: { color: PURPLE } },
    { text: ", and ", options: { color: WHITE } },
    { text: "runs the whole school", options: { color: PINK } },
    { text: " from one login.", options: { color: WHITE } },
  ], {
    x: 0.5, y: 1.6, w: 12.3, h: 2.6,
    fontFace: "Calibri", fontSize: 36, bold: true,
    lineSpacingMultiple: 1.15,
  });

  s.addText(
    "This deck is the long version. Everything in the live demo is shown here in still frames. If our story sounds aligned with where your school is heading, the live walkthrough will make it concrete on your data.",
    {
      x: 0.5, y: 4.4, w: 11.5, h: 1.5,
      fontFace: "Calibri", fontSize: 14, color: SLATE300, lineSpacingMultiple: 1.4,
    }
  );

  // KPI strip
  const kpis = [
    ["8 min",   "to read this deck"],
    ["30 min",  "live walkthrough on your data"],
    ["1 term",  "pilot · no setup fee · NDA-friendly"],
  ];
  kpis.forEach(([n, label], i) => {
    const x = 0.5 + i * 4.2;
    darkCard(s, x, 5.95, 4, 1.0);
    s.addText(n, {
      x: x + 0.3, y: 6.0, w: 3.4, h: 0.55,
      fontFace: "Calibri", fontSize: 28, bold: true, color: CYAN,
    });
    s.addText(label, {
      x: x + 0.3, y: 6.55, w: 3.4, h: 0.4,
      fontFace: "Calibri", fontSize: 11, color: SLATE300, charSpacing: 4,
    });
  });
}

// =============================================================================
// SLIDE 03 · INDEX
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "WHAT'S INSIDE", 3, true);

  bigTitle(s, [
    { text: "Five chapters." },
    { text: "Thirty pages.", color: CYAN },
  ], { y: 1.4, h: 2.3, dark: true });

  const chapters = [
    ["01", "Who we are",          "Pages 04–06", CYAN],
    ["02", "The issues",          "Pages 07–12", PURPLE],
    ["03", "What we offer",       "Pages 13–23", PINK],
    ["04", "How we solve",        "Pages 24–27", EMERALD],
    ["05", "Logistics + close",   "Pages 28–30", AMBER],
  ];
  chapters.forEach(([n, title, range, color], i) => {
    const x = 0.5 + i * 2.55;
    darkCard(s, x, 4.0, 2.45, 2.3);
    s.addText(`CHAPTER ${n}`, {
      x: x + 0.2, y: 4.2, w: 2.1, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color, charSpacing: 6,
    });
    s.addText(title, {
      x: x + 0.2, y: 4.55, w: 2.1, h: 1.0,
      fontFace: "Calibri", fontSize: 18, bold: true, color: WHITE,
    });
    s.addText(range, {
      x: x + 0.2, y: 5.85, w: 2.1, h: 0.3,
      fontFace: "Calibri", fontSize: 10, color: SLATE400,
    });
  });
}

// =============================================================================
// SLIDE 04 · CHAPTER 01 DIVIDER · WHO WE ARE
// =============================================================================
sectionDivider({ chapter: "01", title: "Who we are.", gradient: CYAN,
  sub: "A company obsessed with Indian classrooms — and what they deserve from software.",
  slideNo: 4 });

// =============================================================================
// SLIDE 05 · IDENTITY
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "01 · WHO WE ARE", 5);

  bigTitle(s, [
    { text: "A company" },
    { text: "obsessed with", color: PURPLE },
    { text: "Indian classrooms.", color: SLATE600 },
  ], { y: 1.45, size: 38, h: 2.6 });

  s.addText(
    "AIvenX is built by educators, technologists, and parents who lived the school-software pain firsthand. We aren't bolting AI onto a legacy ERP — we're building the school operating system the way we wished it existed when our own kids started Class 1.",
    {
      x: 0.5, y: 4.2, w: 7.3, h: 1.6,
      fontFace: "Calibri", fontSize: 14, color: SLATE700, lineSpacingMultiple: 1.4,
    }
  );
  s.addText(
    "Designed in Hyderabad, Telangana — engineered for every Indian board, shipped with NEP 2020 and DPDP Act compliance baked in.",
    {
      x: 0.5, y: 5.85, w: 7.3, h: 1.0,
      fontFace: "Calibri", fontSize: 12, color: SLATE600, lineSpacingMultiple: 1.4,
    }
  );

  // Identity card (right)
  rectCard(s, 8.2, 1.5, 4.6, 5.3, { fill: SLATE50 });
  s.addText("IDENTITY AT A GLANCE", {
    x: 8.4, y: 1.7, w: 4.2, h: 0.3,
    fontFace: "Calibri", fontSize: 9, bold: true, color: CYAN, charSpacing: 6,
  });
  const idRows = [
    ["Founded",        "2025"],
    ["Headquarters",   "Hyderabad, Telangana"],
    ["Built for",      "CBSE · ICSE · IB · State"],
    ["Compliance",     "NEP 2020 · DPDP Act 2023"],
    ["Data residency", "India only"],
    ["Stack",          "Cloud-native · Indian DCs"],
  ];
  idRows.forEach(([k, v], i) => {
    const y = 2.2 + i * 0.75;
    s.addText(k, {
      x: 8.4, y, w: 1.7, h: 0.4,
      fontFace: "Calibri", fontSize: 11, color: SLATE500,
    });
    s.addText(v, {
      x: 10.1, y, w: 2.7, h: 0.4,
      fontFace: "Calibri", fontSize: 11, bold: true, color: INK, align: "right",
    });
  });
}

// =============================================================================
// SLIDE 06 · FOUR PRINCIPLES
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "01 · WHO WE ARE", 6);

  bigTitle(s, [
    { text: "Four principles." },
    { text: "Every decision rolls up to one of these.", color: PURPLE },
  ], { y: 1.4, size: 32, h: 1.6 });
  s.addText("When we have to choose between two paths, these are the tie-breakers.", {
    x: 0.5, y: 3.1, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: SLATE600,
  });

  const ps = [
    ["01", "Teacher-first, not feature-first",
     "Every AI output is reviewed and approved by a teacher before a student sees it. The teacher gains hours; never gets replaced.", CYAN],
    ["02", "AI-native from day one",
     "Not a chatbot bolted on. Cortex sits in the spine — generates, grades, recommends, narrates.", PURPLE],
    ["03", "Privacy by architecture",
     "India data residency, DPDP-Act consent flows, audit-grade logging, opt-out per family.", EMERALD],
    ["04", "Built for India, not adapted",
     "CBSE rubrics, vernacular roadmap, joint-family pods, UPI rails, low-bandwidth mode.", AMBER],
  ];
  ps.forEach(([n, title, body, color], i) => {
    const x = 0.5 + i * 3.2;
    rectCard(s, x, 3.9, 3.05, 3.0);
    s.addText(`PRINCIPLE ${n}`, {
      x: x + 0.2, y: 4.05, w: 2.7, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color, charSpacing: 6,
    });
    s.addText(title, {
      x: x + 0.2, y: 4.4, w: 2.7, h: 1.0,
      fontFace: "Calibri", fontSize: 14, bold: true, color: INK,
    });
    s.addText(body, {
      x: x + 0.2, y: 5.45, w: 2.7, h: 1.4,
      fontFace: "Calibri", fontSize: 10, color: SLATE600, lineSpacingMultiple: 1.3,
    });
  });
}

// =============================================================================
// SLIDE 07 · CHAPTER 02 DIVIDER
// =============================================================================
sectionDivider({ chapter: "02", title: "The issues.", gradient: PURPLE,
  sub: "Six pains we see in every school we visit. You probably feel at least four of them.",
  slideNo: 7 });

// =============================================================================
// SLIDE 08 · DROWNING IN TOOLS
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "02 · THE ISSUES", 8);

  bigTitle(s, [
    { text: "Schools today are " },
    { text: "drowning in tools.", color: PURPLE },
    { text: "Teachers, in tabs.", color: SLATE600 },
  ], { y: 1.4, size: 34, h: 2.3 });

  // Left column — list
  s.addText("TODAY'S REALITY", {
    x: 0.5, y: 4.0, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: ROSE, charSpacing: 6,
  });
  const reality = [
    "× One ERP for fees",
    "× Another for content / LMS",
    "× Separate CCTV + bus tracker",
    "× WhatsApp groups for parent comm",
    "× Three Excel sheets for HR + payroll",
    "× One more for biometric attendance",
  ];
  reality.forEach((r, i) => {
    s.addText(r, {
      x: 0.5, y: 4.4 + i * 0.32, w: 6, h: 0.3,
      fontFace: "Calibri", fontSize: 13, color: SLATE700,
    });
  });
  s.addText("= 5–7 logins. Renewals every quarter.", {
    x: 0.5, y: 6.5, w: 6, h: 0.4,
    fontFace: "Calibri", fontSize: 13, bold: true, color: INK, italic: true,
  });

  // Right card
  rectCard(s, 7.0, 4.0, 5.8, 3.0, { fill: INK });
  s.addText("5–7", {
    x: 7.3, y: 4.1, w: 5.2, h: 1.4,
    fontFace: "Calibri", fontSize: 90, bold: true, color: CYAN,
  });
  s.addText("platforms a school logs into every day", {
    x: 7.3, y: 5.55, w: 5.2, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: SLATE100,
  });
  // Mini stats
  s.addShape("roundRect", { x: 7.3, y: 6.05, w: 2.5, h: 0.85,
    fill: { color: WHITE, transparency: 92 }, line: { type: "none" }, rectRadius: 0.08 });
  s.addText("4 hr", { x: 7.4, y: 6.10, w: 2.3, h: 0.4, fontFace: "Calibri", fontSize: 18, bold: true, color: CYAN });
  s.addText("teacher paperwork / day", { x: 7.4, y: 6.50, w: 2.3, h: 0.3, fontFace: "Calibri", fontSize: 9, color: SLATE100 });
  s.addShape("roundRect", { x: 9.95, y: 6.05, w: 2.55, h: 0.85,
    fill: { color: WHITE, transparency: 92 }, line: { type: "none" }, rectRadius: 0.08 });
  s.addText("37", { x: 10.05, y: 6.10, w: 2.4, h: 0.4, fontFace: "Calibri", fontSize: 18, bold: true, color: CYAN });
  s.addText("WhatsApp messages / day (avg)", { x: 10.05, y: 6.50, w: 2.4, h: 0.3, fontFace: "Calibri", fontSize: 9, color: SLATE100 });
}

// =============================================================================
// SLIDE 09 · TEACHER BURNOUT + PARENT FATIGUE
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "02 · THE ISSUES", 9);

  bigTitle(s, [
    { text: "Teachers " },
    { text: "burning out", color: AMBER },
    { text: ". Parents " },
    { text: "tuning out.", color: PURPLE },
  ], { y: 1.4, size: 34, h: 1.5 });

  // Two cards side by side
  const cards = [
    {
      x: 0.5, color: AMBER, eyebrow: "TEACHER BURNOUT",
      title: "4 hours of paperwork. 2 hours of teaching.",
      bullets: [
        "Lesson plans typed by hand every Sunday",
        "Worksheets scrambled the morning of",
        "40 answer scripts graded after school every week",
        "Manual marks-entry into the ERP",
      ],
    },
    {
      x: 6.85, color: PURPLE, eyebrow: "PARENT FATIGUE",
      title: "37 messages in the WhatsApp group.",
      bullets: [
        'Fee reminder · picnic permission · sports kit',
        'Buried under "Good morning ji" forwards',
        "No threading per child, no read-receipt",
        "The one that mattered? Missed.",
      ],
    },
  ];
  cards.forEach((c) => {
    rectCard(s, c.x, 3.4, 5.95, 3.5);
    s.addText(c.eyebrow, {
      x: c.x + 0.3, y: 3.6, w: 5.5, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: c.color, charSpacing: 6,
    });
    s.addText(c.title, {
      x: c.x + 0.3, y: 3.95, w: 5.5, h: 1.0,
      fontFace: "Calibri", fontSize: 18, bold: true, color: INK,
    });
    c.bullets.forEach((b, i) => {
      s.addText("· " + b, {
        x: c.x + 0.3, y: 5.0 + i * 0.4, w: 5.5, h: 0.4,
        fontFace: "Calibri", fontSize: 11, color: SLATE700,
      });
    });
  });
}

// =============================================================================
// SLIDE 10 · SAFETY + MARKS
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "02 · THE ISSUES", 10);

  bigTitle(s, [
    { text: "Safety, " },
    { text: "unseen", color: CYAN },
    { text: ". Performance, " },
    { text: "unread.", color: EMERALD },
  ], { y: 1.4, size: 34, h: 1.5 });

  const cards = [
    {
      x: 0.5, color: CYAN, eyebrow: "SAFETY BLIND SPOTS",
      title: "Did my child reach school?",
      bullets: [
        "Bus tracker on a separate vendor app",
        "Gate logbook in a Reception register",
        "Bullying never escalates beyond the class teacher's diary",
        "Visitor history? A handwritten ledger.",
      ],
    },
    {
      x: 6.85, color: EMERALD, eyebrow: "MARKS AREN'T INSIGHT",
      title: '"He scored 72%." Now what?',
      bullets: [
        "No view of where he's stuck",
        "No comparison to class median",
        "No prescribed practice",
        "Next term starts the same way",
      ],
    },
  ];
  cards.forEach((c) => {
    rectCard(s, c.x, 3.4, 5.95, 3.5);
    s.addText(c.eyebrow, {
      x: c.x + 0.3, y: 3.6, w: 5.5, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: c.color, charSpacing: 6,
    });
    s.addText(c.title, {
      x: c.x + 0.3, y: 3.95, w: 5.5, h: 1.0,
      fontFace: "Calibri", fontSize: 18, bold: true, color: INK,
    });
    c.bullets.forEach((b, i) => {
      s.addText("· " + b, {
        x: c.x + 0.3, y: 5.0 + i * 0.4, w: 5.5, h: 0.4,
        fontFace: "Calibri", fontSize: 11, color: SLATE700,
      });
    });
  });
}

// =============================================================================
// SLIDE 11 · AI AS A STICKER
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "02 · THE ISSUES", 11);

  // Big quotation-mark mark of irony for the "AI as a sticker" slide.
  // Replaces the previous emoji that PowerPoint couldn't render.
  s.addText("“    ”", {
    x: 0.5, y: 1.6, w: 12.3, h: 1.4,
    fontFace: "Calibri", fontSize: 120, align: "center", color: SLATE300, bold: true,
  });
  bigTitle(s, [
    { text: '"AI-powered" everything.' },
    { text: "AI-native nothing.", color: PINK },
  ], { y: 3.3, size: 44, h: 1.8 });

  s.addText(
    'A chatbot bolted on a sidebar. A "summarize" button in the settings menu. The actual product still does what it did in 2018 — only the marketing changed.',
    {
      x: 1.0, y: 5.3, w: 11.3, h: 1.0,
      fontFace: "Calibri", fontSize: 16, color: SLATE600, align: "center",
      lineSpacingMultiple: 1.4,
    }
  );
  s.addText("Indian schools deserve software that starts from AI, not retrofits it.", {
    x: 1.0, y: 6.4, w: 11.3, h: 0.5,
    fontFace: "Calibri", fontSize: 13, color: SLATE500, align: "center", italic: true,
  });
}

// =============================================================================
// SLIDE 12 · ALL SIX PAINS RECAP
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "02 · THE ISSUES", 12, true);

  bigTitle(s, [
    { text: "Six pains. " },
    { text: "All under one roof.", color: CYAN },
  ], { y: 1.4, size: 36, h: 1.4, dark: true });
  s.addText("Take a screenshot — you'll point at this slide six months from now.", {
    x: 0.5, y: 3.0, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, color: SLATE300,
  });

  const pains = [
    ["VENDOR SPRAWL",       "Six vendors. One school.",          ROSE],
    ["TEACHER BURNOUT",     "4 hr paperwork · 2 hr teaching.",   AMBER],
    ["PARENT FATIGUE",      "37 messages — only 1 mattered.",    PURPLE],
    ["SAFETY BLIND SPOTS",  "Did the child reach school?",        CYAN],
    ["MARKS AREN'T INSIGHT","'He scored 72%.' Now what?",         EMERALD],
    ["AI AS A STICKER",     "Marketing changed. Product didn't.", PINK],
  ];
  pains.forEach(([eb, body, color], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 3.6 + row * 1.6;
    darkCard(s, x, y, 4.0, 1.4);
    s.addText(eb, {
      x: x + 0.2, y: y + 0.15, w: 3.7, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color, charSpacing: 6,
    });
    s.addText(body, {
      x: x + 0.2, y: y + 0.5, w: 3.7, h: 0.85,
      fontFace: "Calibri", fontSize: 13, color: WHITE,
    });
  });

  s.addText("One platform — designed from scratch, AI-native, India-first — solves all six.", {
    x: 0.5, y: 6.95, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, color: SLATE300, italic: true,
  });
}

// =============================================================================
// SLIDE 13 · CHAPTER 03 DIVIDER
// =============================================================================
sectionDivider({ chapter: "03", title: "What we offer.", gradient: PINK,
  sub: "Five product surfaces. One spine. The right surface for every role in your school.",
  slideNo: 13 });

// =============================================================================
// SLIDE 14 · ONE SPINE — Six vendors gone
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · WHAT WE OFFER", 14);

  bigTitle(s, [
    { text: "One platform. " },
    { text: "Six vendors gone.", color: PURPLE },
  ], { y: 1.4, size: 36, h: 1.0 });

  // Old vendors row
  const olds = [
    ["School ERP",   "Vendor A"],
    ["LMS",          "Vendor B"],
    ["Q-bank",       "Vendor C"],
    ["CCTV",         "Vendor D"],
    ["Parent app",   "Vendor E"],
    ["Bus tracker",  "Vendor F"],
  ];
  olds.forEach(([label, name], i) => {
    const x = 0.5 + i * 2.13;
    s.addShape("roundRect", {
      x, y: 2.8, w: 1.95, h: 1.1,
      fill: { color: SLATE50 },
      line: { color: SLATE300, width: 1, dashType: "dash" },
      rectRadius: 0.1,
    });
    s.addText(label, { x, y: 3.0, w: 1.95, h: 0.4, fontFace: "Calibri", fontSize: 10, color: SLATE600, align: "center" });
    s.addText(name, { x, y: 3.45, w: 1.95, h: 0.4, fontFace: "Calibri", fontSize: 9, color: ROSE, align: "center", strike: "sngStrike" });
  });

  // Down arrow
  s.addShape("downArrow", {
    x: 6.2, y: 4.1, w: 0.8, h: 0.6,
    fill: { color: CYAN }, line: { type: "none" },
  });

  // AIvenX block
  s.addShape("roundRect", {
    x: 1.5, y: 4.95, w: 10.3, h: 2.0,
    fill: { color: INK }, line: { color: PURPLE, width: 2 }, rectRadius: 0.16,
  });
  if (MARK_OK) s.addImage({ path: MARK, x: 1.85, y: 5.1, w: 0.55, h: 0.55 });
  s.addText("AIvenX · all-in-one", {
    x: 2.5, y: 5.05, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9, bold: true, color: CYAN, charSpacing: 6,
  });
  s.addText("The AI-native school OS", {
    x: 2.5, y: 5.35, w: 8, h: 0.45,
    fontFace: "Calibri", fontSize: 16, bold: true, color: WHITE,
  });
  // Six chips
  const chips = ["ERP", "Cortex", "Guardian", "Connect", "Mobile", "Gallery"];
  chips.forEach((c, i) => {
    const x = 1.85 + i * 1.65;
    s.addShape("roundRect", {
      x, y: 5.95, w: 1.55, h: 0.45,
      fill: { color: WHITE, transparency: 90 }, line: { type: "none" }, rectRadius: 0.06,
    });
    s.addText(c, { x, y: 5.95, w: 1.55, h: 0.45, fontFace: "Calibri", fontSize: 10, color: WHITE, align: "center", valign: "middle" });
  });
  // Three counters
  ["1 login", "1 bill", "0 tab-juggling"].forEach((t, i) => {
    s.addText(t, {
      x: 1.85 + i * 3.5, y: 6.5, w: 3.3, h: 0.35,
      fontFace: "Calibri", fontSize: 11, bold: true, color: SLATE100, align: "center",
    });
  });
}

// =============================================================================
// SLIDE 15 · CORTEX OVERVIEW
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CORTEX · AI STUDIO", 15);

  eyebrowSmall(s, "CORTEX · AI STUDIO", CYAN, 0.5, 1.4);
  bigTitle(s, [
    { text: "Chapter to grade" },
    { text: "in 30 seconds.", color: CYAN },
  ], { y: 1.75, size: 38, h: 1.8 });
  lede(s,
    "The teacher's AI workspace. Generate CBSE/ICSE chapters in four persona modes. Assemble exams from a 150,000-question bank. Grade handwritten papers with rubric-aware AI. Plan period-wise lessons. Narrate chapters as audio playlists.",
    { y: 3.65, w: 11.5, h: 1.6, size: 14 });

  const five = [
    ["", "Generate", "Chapters · 4 modes"],
    ["", "Assemble", "Question papers"],
    ["", "Grade",    "Handwritten papers"],
    ["", "Plan",     "Period-wise lessons"],
    ["", "Narrate",  "Audio playlists"],
  ];
  five.forEach(([emoji, h, sub], i) => {
    const x = 0.5 + i * 2.55;
    rectCard(s, x, 5.3, 2.45, 1.55);
    s.addText(emoji, { x: x + 0.2, y: 5.4, w: 2.0, h: 0.5, fontFace: "Calibri", fontSize: 26 });
    s.addText(h, { x: x + 0.2, y: 5.95, w: 2.0, h: 0.4, fontFace: "Calibri", fontSize: 14, bold: true, color: INK });
    s.addText(sub, { x: x + 0.2, y: 6.35, w: 2.0, h: 0.4, fontFace: "Calibri", fontSize: 10, color: SLATE600 });
  });
}

// =============================================================================
// SLIDE 16 · 4 PERSONA MODES
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CORTEX · PERSONAS", 16);

  bigTitle(s, [
    { text: "Same chapter. " },
    { text: "Four ways to learn it.", color: PURPLE },
  ], { y: 1.4, size: 32, h: 1.6 });
  s.addText(
    "Cortex generates the same syllabus in four persona-shaped modes. Students take a quick psychometric quiz; we recommend the right mode for them — and they can switch any time.",
    {
      x: 0.5, y: 3.1, w: 12.3, h: 0.9,
      fontFace: "Calibri", fontSize: 13, color: SLATE600, lineSpacingMultiple: 1.4,
    }
  );

  const modes = [
    ["FOCUS", "Smart", "Clean, exam-aligned, structured. For students who want the syllabus distilled to its essentials.", CYAN],
    ["SPARK", "Fun",   "Playful, real-world, why-it-matters. Great for visual learners and curious minds.", PINK],
    ["QUEST", "Game",  "Goal-driven, gamified, level-up. XP, streaks, quick-checks per topic.", EMERALD],
    ["SAGA",  "Story", "Narrative, character-led. Concepts taught through story arcs.", PURPLE],
  ];
  modes.forEach(([tag, name, body, color], i) => {
    const x = 0.5 + i * 3.2;
    rectCard(s, x, 4.2, 3.05, 2.7, { border: color });
    s.addShape("roundRect", { x: x + 0.2, y: 4.4, w: 1.0, h: 0.32,
      fill: { color }, line: { type: "none" }, rectRadius: 0.16 });
    s.addText(tag, { x: x + 0.2, y: 4.4, w: 1.0, h: 0.32, fontFace: "Calibri", fontSize: 9, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 4 });
    s.addText(name, { x: x + 0.2, y: 4.85, w: 2.7, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: INK });
    s.addText(body, { x: x + 0.2, y: 5.45, w: 2.7, h: 1.4, fontFace: "Calibri", fontSize: 10, color: SLATE600, lineSpacingMultiple: 1.3 });
  });

  s.addText("Generation time: ~30 sec / chapter · Teacher reviews + approves before students see it · Boards: CBSE · ICSE · IB · State · Grades 1–12", {
    x: 0.5, y: 7.0, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: SLATE500, italic: true,
  });
}

// =============================================================================
// SLIDE 17 · AI EVALUATOR HERO
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "03 · CORTEX · AI EVALUATOR", 17, true);

  // Left half — copy
  bigTitle(s, [
    { text: "Upload the answer sheet." },
    { text: "Get the grade.", color: CYAN },
    { text: "Get the next steps.", color: SLATE300 },
  ], { y: 1.4, size: 30, h: 2.6, dark: true });

  s.addText(
    "Cortex reads handwritten papers, scores against a CBSE-grade rubric step-by-step, and tells you the exact topic each student needs to revisit.",
    {
      x: 0.5, y: 4.2, w: 5.8, h: 1.3,
      fontFace: "Calibri", fontSize: 13, color: SLATE300, lineSpacingMultiple: 1.4,
    }
  );

  // KPI strip (left)
  const kpis = [
    ["80%",  "FASTER EVAL"],
    ["5 min","PER PAPER"],
    ["Auto", "RECOS / STUDENT"],
  ];
  kpis.forEach(([n, l], i) => {
    const x = 0.5 + i * 2.0;
    darkCard(s, x, 5.6, 1.8, 1.3);
    s.addText(n, { x: x + 0.15, y: 5.7, w: 1.5, h: 0.6, fontFace: "Calibri", fontSize: 22, bold: true, color: CYAN });
    s.addText(l, { x: x + 0.15, y: 6.35, w: 1.5, h: 0.4, fontFace: "Calibri", fontSize: 9, color: SLATE300, charSpacing: 4 });
  });

  // Right half — answer-sheet mock
  s.addShape("roundRect", {
    x: 7.0, y: 1.5, w: 3.2, h: 5.4,
    fill: { color: "FFFEF7" }, line: { color: SLATE300, width: 1 }, rectRadius: 0.12,
  });
  s.addText("CBSE · CLASS X · MATHS    ROLL · 24-A-17", {
    x: 7.15, y: 1.65, w: 2.95, h: 0.3,
    fontFace: "Calibri", fontSize: 7, bold: true, color: SLATE500, charSpacing: 4,
  });
  s.addText("Q3 · Areas Related to Circles", {
    x: 7.15, y: 2.05, w: 2.95, h: 0.3,
    fontFace: "Calibri", fontSize: 8, bold: true, color: SLATE500, charSpacing: 4,
  });
  s.addText("Given r = 21 cm, θ = 120°\nArea of sector = (θ/360) × π r²\n= (120/360) × (22/7) × 21 × 21\n= (1/3) × (22/7) × 441\n= 462 cm²  ", {
    x: 7.2, y: 2.4, w: 2.9, h: 1.85,
    fontFace: "Comic Sans MS", fontSize: 14, color: INK, lineSpacingMultiple: 1.2,
  });
  s.addText("Q4", {
    x: 7.15, y: 4.4, w: 2.95, h: 0.3,
    fontFace: "Calibri", fontSize: 8, bold: true, color: SLATE500, charSpacing: 4,
  });
  s.addText("Area of segment = sector − triangle\nTriangle = ½ × AB × OM", {
    x: 7.2, y: 4.7, w: 2.9, h: 0.85,
    fontFace: "Comic Sans MS", fontSize: 14, color: INK,
  });
  s.addText("≈ 190 cm² (skipped derivation)", {
    x: 7.2, y: 5.55, w: 2.9, h: 0.4,
    fontFace: "Comic Sans MS", fontSize: 14, color: ROSE,
  });

  // Right rubric card
  rectCard(s, 10.4, 1.5, 2.5, 2.5, { fill: INK, border: PURPLE });
  s.addText("RUBRIC · LIVE", {
    x: 10.55, y: 1.6, w: 2.2, h: 0.3,
    fontFace: "Calibri", fontSize: 8, bold: true, color: CYAN, charSpacing: 4,
  });
  const rubric = [
    ["Formula recall",   "+1 "],
    ["Substitution",     "+1 "],
    ["Arithmetic",       "+1 "],
    ["Final + units",    "+1 "],
    ["Q4 derivation",    "½"],
  ];
  rubric.forEach(([k, v], i) => {
    s.addText(k, { x: 10.55, y: 1.95 + i * 0.32, w: 1.4, h: 0.3, fontFace: "Calibri", fontSize: 9, color: WHITE });
    s.addText(v, { x: 11.95, y: 1.95 + i * 0.32, w: 0.95, h: 0.3, fontFace: "Calibri", fontSize: 9, bold: true, color: i < 4 ? EMERALD : AMBER, align: "right" });
  });
  s.addText("5 / 6", { x: 10.55, y: 3.6, w: 1.0, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: CYAN });
  s.addText("83%  vs class median 71%", { x: 11.55, y: 3.65, w: 1.4, h: 0.3, fontFace: "Calibri", fontSize: 8, color: SLATE300, align: "right" });

  // Right recommendation card
  rectCard(s, 10.4, 4.15, 2.5, 2.75, { fill: INK, border: EMERALD });
  s.addText("RECOMMENDED NEXT", {
    x: 10.55, y: 4.25, w: 2.2, h: 0.3,
    fontFace: "Calibri", fontSize: 8, bold: true, color: EMERALD, charSpacing: 4,
  });
  const recos = [
    "Areas of segment · derivation",
    "3 worked examples · Saga",
    "5 PYQ practice · 2024",
    "Audio playlist · 7 min",
  ];
  recos.forEach((r, i) => {
    s.addText("· " + r, {
      x: 10.55, y: 4.65 + i * 0.4, w: 2.2, h: 0.4,
      fontFace: "Calibri", fontSize: 9, color: WHITE, lineSpacingMultiple: 1.2,
    });
  });
  s.addShape("roundRect", { x: 10.55, y: 6.35, w: 2.2, h: 0.4,
    fill: { color: CYAN }, line: { type: "none" }, rectRadius: 0.06 });
  s.addText("Send to student  →", {
    x: 10.55, y: 6.35, w: 2.2, h: 0.4,
    fontFace: "Calibri", fontSize: 10, bold: true, color: WHITE, align: "center", valign: "middle",
  });
}

// =============================================================================
// SLIDE 18 · 4-STEP PIPELINE
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CORTEX · EVALUATOR PIPELINE", 18);

  bigTitle(s, [
    { text: "Four steps. " },
    { text: "Zero teacher heartbreak.", color: PINK },
  ], { y: 1.4, size: 34, h: 1.4 });
  lede(s,
    "Built around an Indian board's actual marking scheme. Step-wise rubrics, partial credit, manual override at every stage — teacher in the loop, not on the sidelines.",
    { y: 2.95, size: 13, h: 1.2 });

  const steps = [
    ["1", "UPLOAD",    CYAN,    "Drop the exam PDF",      "Question paper or scanned answer sheets. Bulk-upload in one drag."],
    ["2", "CONFIRM",   PURPLE,  "Confirm the answer key", "AI extracts questions + suggested rubric. Teacher reviews and edits."],
    ["3", "GRADE",     EMERALD, "Auto-grade with rubrics","Step-wise marks. Partial credit. Reasoning shown to teacher."],
    ["4", "RECOMMEND", AMBER,   "Recommend, per student", "Weak-spot chapters + practice + audio playlist sent to each student's app."],
  ];
  steps.forEach(([n, eb, color, h, body], i) => {
    const x = 0.5 + i * 3.2;
    rectCard(s, x, 4.4, 3.05, 2.5);
    s.addText(n, {
      x: x + 0.2, y: 4.55, w: 2.7, h: 0.85,
      fontFace: "Calibri", fontSize: 60, bold: true, color: color, transparency: 70,
    });
    s.addText(eb, {
      x: x + 0.2, y: 5.0, w: 2.7, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color, charSpacing: 6,
    });
    s.addText(h, {
      x: x + 0.2, y: 5.35, w: 2.7, h: 0.55,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK,
    });
    s.addText(body, {
      x: x + 0.2, y: 5.95, w: 2.7, h: 1.0,
      fontFace: "Calibri", fontSize: 10, color: SLATE600, lineSpacingMultiple: 1.3,
    });
  });
}

// =============================================================================
// SLIDE 19 · QUESTION BANK + PAPER CREATOR
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CORTEX · Q-BANK & PAPERS", 19);

  bigTitle(s, [
    { text: "From " },
    { text: "150k questions", color: CYAN },
    { text: " to a printable paper — in five minutes." },
  ], { y: 1.4, size: 30, h: 2.0 });

  const cols = [
    {
      x: 0.5, color: CYAN, eyebrow: "QUESTION BANK",
      title: "Tagged. Searchable. Curriculum-aware.",
      bullets: [
        "150,000+ questions across CBSE Classes 6–10 (every core subject)",
        "Tagged by chapter · Bloom level · difficulty band · PYQ year",
        "Diagrams + alt-text where applicable",
        "Teachers can add their own and mix with AIvenX bank",
      ],
    },
    {
      x: 6.85, color: PURPLE, eyebrow: "PAPER CREATOR",
      title: "Filter-driven. CBSE-blueprint aligned.",
      bullets: [
        "Build by section: 5 MCQs · Chapter 5 · Advanced level",
        "Auto-fill from CBSE blueprint templates",
        "Generate four shuffled variants — one click",
        "Printable CBSE-format PDF (two-column, seat #)",
      ],
    },
  ];
  cols.forEach((c) => {
    rectCard(s, c.x, 3.7, 5.95, 3.3);
    s.addText(c.eyebrow, {
      x: c.x + 0.3, y: 3.85, w: 5.5, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: c.color, charSpacing: 6,
    });
    s.addText(c.title, {
      x: c.x + 0.3, y: 4.2, w: 5.5, h: 0.6,
      fontFace: "Calibri", fontSize: 16, bold: true, color: INK,
    });
    c.bullets.forEach((b, i) => {
      s.addText("· " + b, {
        x: c.x + 0.3, y: 4.95 + i * 0.45, w: 5.5, h: 0.45,
        fontFace: "Calibri", fontSize: 11, color: SLATE700, lineSpacingMultiple: 1.3,
      });
    });
  });
}

// =============================================================================
// SLIDE 20 · LESSON PLANNER + AUDIO PLAYLISTS
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CORTEX · PLAN & LISTEN", 20);

  bigTitle(s, [
    { text: "Lesson plans", color: AMBER },
    { text: " in 5 min. " },
    { text: "Audiobooks", color: PINK },
    { text: " in zero." },
  ], { y: 1.4, size: 32, h: 1.5 });

  const cols = [
    { x: 0.5, color: AMBER, eb: "LESSON PLANNER",
      title: "Period-wise. Activity-aware. Differentiated.",
      body: "Upload textbook PDF + chapter → Cortex generates a 7-period plan: learning objectives, activities, assessments, differentiation, cross-curricular links, and real-life application." },
    { x: 6.85, color: PINK, eb: "AUDIO NARRATION PLAYLISTS",
      title: "Spotify-style chapter listening.",
      body: "Every chapter gets a narration script + auto-generated audio. Students listen on their commute, while exercising, or to revise. Subject-wise shelves, autoplay queue, voice + speed picker." },
  ];
  cols.forEach((c) => {
    rectCard(s, c.x, 3.6, 5.95, 3.3);
    s.addText(c.eb, {
      x: c.x + 0.3, y: 3.8, w: 5.5, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: c.color, charSpacing: 6,
    });
    s.addText(c.title, {
      x: c.x + 0.3, y: 4.15, w: 5.5, h: 0.7,
      fontFace: "Calibri", fontSize: 16, bold: true, color: INK,
    });
    s.addText(c.body, {
      x: c.x + 0.3, y: 4.95, w: 5.5, h: 1.85,
      fontFace: "Calibri", fontSize: 12, color: SLATE600, lineSpacingMultiple: 1.4,
    });
  });
}

// =============================================================================
// SLIDE 21 · ERP — Run the school
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · ERP", 21);

  eyebrowSmall(s, "AIvenX · ERP", PURPLE, 0.5, 1.4);
  bigTitle(s, [
    { text: "Run the school." },
    { text: "Not a spreadsheet army.", color: PURPLE },
  ], { y: 1.75, size: 32, h: 1.5 });

  const blocks = [
    ["Student & Academics", "Master directory · enrollment · admissions · CSV import · grade-promotion · class section + timetable builder · multi-board curriculum"],
    ["Attendance",          "Manual + bulk + Face-AI live attendance (<100ms / frame, 0.65 confidence). Consent audit per student. Daily roll dashboard."],
    ["Fees & Payments",     "School + transport + hostel fees. Razorpay / UPI / cheque / cash. Multi-child invoices. Sibling discounts. GST receipts. EMI option."],
    ["Exams & Grading",     "Schedule builder · marks entry (single + bulk) · grading systems · result cards · PDF report cards · CBSE Holistic Progress Card."],
    ["HR & Payroll",        "Staff roster · contracts · leave workflow · monthly payroll run · payslip PDFs · qualifications + bank details."],
    ["Parent home",         "Today's safety strip (gate + bus) · attendance grid · homework · upcoming exams · performance vs class · UPI fees · teacher chat."],
  ];
  blocks.forEach(([title, body], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 3.4 + row * 1.85;
    rectCard(s, x, y, 4.0, 1.65);
    s.addText(title, {
      x: x + 0.2, y: y + 0.15, w: 3.7, h: 0.4,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK,
    });
    s.addText(body, {
      x: x + 0.2, y: y + 0.55, w: 3.7, h: 1.05,
      fontFace: "Calibri", fontSize: 9, color: SLATE600, lineSpacingMultiple: 1.3,
    });
  });
}

// =============================================================================
// SLIDE 22 · GUARDIAN — Safety
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · GUARDIAN", 22);

  eyebrowSmall(s, "GUARDIAN", EMERALD, 0.5, 1.4);
  bigTitle(s, [
    { text: "Eyes on every " },
    { text: "gate", color: EMERALD },
    { text: ", every " },
    { text: "bus", color: CYAN },
    { text: ", every " },
    { text: "child.", color: PINK },
  ], { y: 1.75, size: 30, h: 1.5 });

  const items = [
    ["", "Face-AI campus gate", "Real-time recognition. <100ms / frame. Auto IN/OUT events. Visitor sign-in flow. Parent gets notified when child enters or leaves."],
    ["", "Live bus tracking",   "GPS map. ETA, route status, current stop, driver name, occupancy. 'Bus arriving in 12 min' pings before pickup time."],
    ["", "In-bus aggression AI · BETA", "Audio + vision AI on monitored routes. Detects raised voices, isolation, exclusion. Alerts the bus monitor + school admin."],
    ["", "Visitor audit log",   "Sign-in: name · ID · purpose · host. 30-day retention. CSV/PDF export. Auto-flag on unknown faces or repeat visits."],
  ];
  items.forEach(([emoji, h, body], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 6.4;
    const y = 3.5 + row * 1.7;
    rectCard(s, x, y, 6.2, 1.5);
    s.addText(emoji, { x: x + 0.2, y: y + 0.2, w: 0.7, h: 0.7, fontFace: "Calibri", fontSize: 28 });
    s.addText(h, { x: x + 1.0, y: y + 0.2, w: 5.0, h: 0.4, fontFace: "Calibri", fontSize: 14, bold: true, color: INK });
    s.addText(body, { x: x + 1.0, y: y + 0.6, w: 5.0, h: 0.9, fontFace: "Calibri", fontSize: 10, color: SLATE600, lineSpacingMultiple: 1.3 });
  });

  s.addText("Every Guardian feature is independently toggleable per tenant. DPDP-Act consent flows for face-AI; schools that prefer can use RFID-card attendance instead.", {
    x: 0.5, y: 7.0, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: SLATE500, italic: true,
  });
}

// =============================================================================
// SLIDE 23 · CONNECT + MOBILE + GALLERY
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "03 · CONNECT · MOBILE · GALLERY", 23);

  bigTitle(s, [
    { text: "Beyond the schoolyard." },
  ], { y: 1.4, size: 36, h: 1.0 });
  s.addText("Three more surfaces that complete the AIvenX picture.", {
    x: 0.5, y: 2.55, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 14, color: SLATE600,
  });

  const items = [
    ["", "CONNECT", PINK,    "From graduation to first job.",     "Searchable alumni directory by batch + company. Mentorship matching. Reunion + job board (rolling out)."],
    ["", "MOBILE · Q4 2026", AMBER,    "Native apps. Three audiences.",  "Student, parent, teacher apps from one Expo codebase. India-data-residency push. SSO with web portal."],
    ["", "GALLERY", ROSE,    "School life, curated.",             "Sports day, annual day, trips. Audience-scoped publishing — only Super Admin / School Admin / Principal can publish."],
  ];
  items.forEach(([emoji, eb, color, h, body], i) => {
    const x = 0.5 + i * 4.2;
    rectCard(s, x, 3.4, 4.0, 3.5);
    s.addText(emoji, { x: x + 0.25, y: 3.55, w: 0.8, h: 0.8, fontFace: "Calibri", fontSize: 36 });
    s.addText(eb, {
      x: x + 0.25, y: 4.45, w: 3.5, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color, charSpacing: 6,
    });
    s.addText(h, {
      x: x + 0.25, y: 4.8, w: 3.5, h: 0.6,
      fontFace: "Calibri", fontSize: 16, bold: true, color: INK,
    });
    s.addText(body, {
      x: x + 0.25, y: 5.5, w: 3.5, h: 1.4,
      fontFace: "Calibri", fontSize: 10, color: SLATE600, lineSpacingMultiple: 1.3,
    });
  });
}

// =============================================================================
// SLIDE 24 · CHAPTER 04 DIVIDER
// =============================================================================
sectionDivider({ chapter: "04", title: "How we solve it.", gradient: EMERALD,
  sub: "The full AI capabilities map. Built for India. Numbers that justify the bill.",
  slideNo: 24 });

// =============================================================================
// SLIDE 25 · AI CAPABILITIES MATRIX
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "04 · AI CAPABILITIES", 25);

  bigTitle(s, [
    { text: "Real AI. " },
    { text: "Not a sticker.", color: CYAN },
  ], { y: 1.4, size: 32, h: 1.0 });
  s.addText(
    "Eleven shipped capabilities, two in beta, four on the roadmap. Each removes a specific hour of work.",
    { x: 0.5, y: 2.55, w: 12.3, h: 0.4, fontFace: "Calibri", fontSize: 13, color: SLATE600 });

  const caps = [
    ["", "Chapter generation",       "Shipped",  EMERALD],
    ["", "AI exam evaluator",         "Shipped",  EMERALD],
    ["", "AI lesson planner",         "Shipped",  EMERALD],
    ["", "Face-AI gate / attendance", "Shipped",  EMERALD],
    ["", "Persona quiz",              "Shipped",  EMERALD],
    ["", "Audio narration",           "Shipped",  EMERALD],
    ["", "Class engagement heatmap",  "Shipped",  EMERALD],
    ["", "AI question paper builder", "Shipped",  EMERALD],
    ["", "Leo · chapter tutor",       "Shipped",  EMERALD],
    ["", "Auto-grade homework",       "Shipped",  EMERALD],
    ["", "Per-student weak-spot",     "Shipped",  EMERALD],
    ["", "In-bus aggression AI",      "Beta",     AMBER],
    ["", "Multi-language translate",  "Roadmap",  CYAN],
    ["", "Wellbeing beacon",          "Roadmap",  CYAN],
    ["", "Class-writing feedback",    "Roadmap",  CYAN],
    ["", "Living HPC dashboard",      "Roadmap",  CYAN],
  ];
  caps.forEach(([emoji, name, status, color], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.5 + col * 3.2;
    const y = 3.2 + row * 0.95;
    rectCard(s, x, y, 3.05, 0.85);
    s.addText(emoji, { x: x + 0.15, y: y + 0.13, w: 0.5, h: 0.6, fontFace: "Calibri", fontSize: 18 });
    s.addText(name, { x: x + 0.65, y: y + 0.1, w: 1.6, h: 0.4, fontFace: "Calibri", fontSize: 10, bold: true, color: INK });
    s.addText(status.toUpperCase(), { x: x + 0.65, y: y + 0.45, w: 1.6, h: 0.3, fontFace: "Calibri", fontSize: 8, bold: true, color, charSpacing: 4 });
  });
}

// =============================================================================
// SLIDE 26 · BUILT FOR INDIA
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "04 · BUILT FOR INDIA", 26, true);

  bigTitle(s, [
    { text: "Not localized. " },
    { text: "Engineered for India.", color: CYAN },
  ], { y: 1.4, size: 32, h: 1.0, dark: true });
  s.addText("Designed in India, for Indian boards, fees, family structures, languages, and the legal frame.", {
    x: 0.5, y: 2.55, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: SLATE300,
  });

  const india = [
    ["", "DPDP Act 2023",        "Minor consent · India data residency · right-to-erasure · audit-grade logging."],
    ["", "NEP 2020 · HPC",       "360° Holistic Progress Card · academic + co-curricular + life skills."],
    ["", "RTE · RPwD",           "Section 12 quotas · inclusive-education plans · attendance compliance."],
    ["", "CBSE · ICSE · IB · State", "Multi-board curriculum scaffold · 10-yr PYQ archive · sample-paper aligned."],
    ["", "22 official languages", "Hindi · Tamil · Telugu · Bengali · Marathi · Gujarati · Kannada (rolling out)."],
    ["", "UPI-first fees",       "Multi-child invoices · sibling discounts · EMI · GST receipts."],
    ["", "Tier-2 / Tier-3 ready","Works on 3G · low-bandwidth modes · text fallback for poor connectivity."],
    ["", "Joint-family pods", "Mother · father · grandparent · driver — role-scoped permissions per parent."],
  ];
  india.forEach(([emoji, h, body], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.5 + col * 3.2;
    const y = 3.2 + row * 1.85;
    darkCard(s, x, y, 3.05, 1.65);
    s.addText(emoji, { x: x + 0.15, y: y + 0.15, w: 0.6, h: 0.5, fontFace: "Calibri", fontSize: 22 });
    s.addText(h, {
      x: x + 0.15, y: y + 0.62, w: 2.75, h: 0.35,
      fontFace: "Calibri", fontSize: 12, bold: true, color: WHITE,
    });
    s.addText(body, {
      x: x + 0.15, y: y + 1.0, w: 2.75, h: 0.65,
      fontFace: "Calibri", fontSize: 9, color: SLATE300, lineSpacingMultiple: 1.3,
    });
  });
}

// =============================================================================
// SLIDE 27 · ROI / NUMBERS
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "04 · NUMBERS", 27);

  bigTitle(s, [
    { text: "The numbers your bursar will ask for." },
  ], { y: 1.4, size: 32, h: 1.0 });
  s.addText("Conservative estimates from our pilot schools. Independent of size.", {
    x: 0.5, y: 2.55, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: SLATE600,
  });

  const big = [
    ["FASTER EVALUATION",    "80%",    "vs. hand-grading"],
    ["PER PAPER",            "5 min",  "40 papers in <1 hr"],
    ["HOURS BACK TO TEACHERS","6–8",    "per teacher / week"],
    ["VENDORS COLLAPSED",    "6 → 1",  "one login · one bill"],
  ];
  big.forEach(([eb, n, sub], i) => {
    const x = 0.5 + i * 3.2;
    rectCard(s, x, 3.3, 3.05, 1.7);
    s.addText(eb, {
      x: x + 0.2, y: 3.4, w: 2.7, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: CYAN, charSpacing: 6,
    });
    s.addText(n, {
      x: x + 0.2, y: 3.7, w: 2.7, h: 0.85,
      fontFace: "Calibri", fontSize: 36, bold: true, color: PURPLE,
    });
    s.addText(sub, {
      x: x + 0.2, y: 4.6, w: 2.7, h: 0.3,
      fontFace: "Calibri", fontSize: 10, color: SLATE600,
    });
  });

  const small = [
    ["QUESTION BANK",       "150k+", "tagged · searchable"],
    ["CHAPTER GENERATION",  "~30 sec","per chapter, 4 modes"],
    ["FACE-AI LATENCY",     "<100ms","per recognition frame"],
  ];
  small.forEach(([eb, n, sub], i) => {
    const x = 0.5 + i * 4.2;
    rectCard(s, x, 5.3, 4.0, 1.6, { fill: SLATE50 });
    s.addText(eb, {
      x: x + 0.2, y: 5.4, w: 3.7, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: PURPLE, charSpacing: 6,
    });
    s.addText(n, {
      x: x + 0.2, y: 5.7, w: 3.7, h: 0.7,
      fontFace: "Calibri", fontSize: 28, bold: true, color: INK,
    });
    s.addText(sub, {
      x: x + 0.2, y: 6.45, w: 3.7, h: 0.3,
      fontFace: "Calibri", fontSize: 10, color: SLATE600,
    });
  });
}

// =============================================================================
// SLIDE 28 · EDITIONS
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  chrome(s, "05 · EDITIONS", 28, true);

  bigTitle(s, [
    { text: "Three editions. " },
    { text: "Pick what fits.", color: CYAN },
  ], { y: 1.4, size: 32, h: 1.0, dark: true });
  s.addText("No setup fee. Pilot for one term, then commit. Pricing tailored on the call by board, headcount, and modules.", {
    x: 0.5, y: 2.55, w: 12.3, h: 0.4,
    fontFace: "Calibri", fontSize: 12, color: SLATE300,
  });

  const editions = [
    {
      x: 0.5, color: CYAN, name: "Starter",
      sub: "Schools running ERP for the first time",
      bullets: [
        "Students · academics · attendance",
        "Fees · HR · communication",
        "Exams · report cards",
        "Parent home + child detail",
        "Gallery · announcements",
      ],
      crosses: [],
      highlighted: false,
    },
    {
      x: 4.7, color: PURPLE, name: "Standard",
      sub: "Content + AI evaluator. Curriculum done for you.",
      bullets: [
        "Everything in Starter",
        "Pre-built chapter library · 4 personas",
        "Audio narration playlists",
        "150k question bank + paper creator",
        "AI evaluator · handwriting → grade",
        "Library · Transport · Hostel",
      ],
      crosses: ["Cortex Studio chapter generator"],
      highlighted: true,
    },
    {
      x: 8.9, color: PINK, name: "Enterprise",
      sub: "Generate your own content. Run safety-critical ops.",
      bullets: [
        "Everything in Standard",
        "Cortex Studio chapter generator",
        "AI lesson planner",
        "Guardian · Face-AI gate · Bus AI",
        "In-bus aggression detection",
        "Connect alumni network",
        "Mobile apps (Q4 2026 pilot)",
        "Dedicated success manager",
      ],
      crosses: [],
      highlighted: false,
    },
  ];
  editions.forEach((e) => {
    if (e.highlighted) {
      // gradient border halo
      s.addShape("roundRect", {
        x: e.x - 0.05, y: 2.95, w: 4.2, h: 4.05,
        fill: { color: PURPLE, transparency: 50 }, line: { type: "none" }, rectRadius: 0.16,
      });
    }
    s.addShape("roundRect", {
      x: e.x, y: 3.0, w: 4.1, h: 3.95,
      fill: { color: WHITE, transparency: 90 },
      line: { color: e.highlighted ? PURPLE : SLATE400, width: e.highlighted ? 2 : 1 },
      rectRadius: 0.14,
    });
    s.addText("EDITION", {
      x: e.x + 0.25, y: 3.15, w: 3.6, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true, color: e.color, charSpacing: 6,
    });
    if (e.highlighted) {
      s.addShape("roundRect", { x: e.x + 2.85, y: 3.15, w: 1.1, h: 0.3,
        fill: { color: e.color }, line: { type: "none" }, rectRadius: 0.15 });
      s.addText("MOST SCHOOLS", { x: e.x + 2.85, y: 3.15, w: 1.1, h: 0.3,
        fontFace: "Calibri", fontSize: 7, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 3 });
    }
    s.addText(e.name, {
      x: e.x + 0.25, y: 3.5, w: 3.6, h: 0.55,
      fontFace: "Calibri", fontSize: 22, bold: true, color: WHITE,
    });
    s.addText(e.sub, {
      x: e.x + 0.25, y: 4.05, w: 3.6, h: 0.5,
      fontFace: "Calibri", fontSize: 10, color: SLATE300, lineSpacingMultiple: 1.3,
    });
    e.bullets.forEach((b, i) => {
      s.addText("  " + b, {
        x: e.x + 0.25, y: 4.6 + i * 0.27, w: 3.65, h: 0.27,
        fontFace: "Calibri", fontSize: 9, color: SLATE100, lineSpacingMultiple: 1.2,
      });
    });
    e.crosses.forEach((c, i) => {
      const y = 4.6 + (e.bullets.length + i) * 0.27;
      s.addText("×  " + c, {
        x: e.x + 0.25, y, w: 3.65, h: 0.27,
        fontFace: "Calibri", fontSize: 9, color: SLATE500, italic: true,
      });
    });
  });
}

// =============================================================================
// SLIDE 29 · LIVE-DEMO AGENDA
// =============================================================================
{
  const s = pptx.addSlide();
  lightBg(s);
  chrome(s, "05 · THE LIVE DEMO", 29);

  bigTitle(s, [
    { text: "What you'll see in the live " },
    { text: "30-minute walkthrough.", color: CYAN },
  ], { y: 1.4, size: 28, h: 1.4 });
  s.addText(
    "Send us a recent answer sheet (anonymized). We'll grade it live, generate the recommendations, and walk your principal through the parent home — on your data.",
    { x: 0.5, y: 3.0, w: 12.3, h: 0.7, fontFace: "Calibri", fontSize: 12, color: SLATE600, lineSpacingMultiple: 1.4 });

  const agenda = [
    ["01", "Cortex generates a chapter for your grade-10 maths class",            "~30 sec · 4 personas side-by-side · diagrams + audio narration auto-attached.", "5 min"],
    ["02", "We assemble a 30-mark practice paper from the question bank",          "CBSE blueprint · filter-driven · printable PDF · four shuffled variants.",        "3 min"],
    ["03", "HERO: AI Evaluator grades a real handwritten paper",                   "Drop the PDF · extract questions + rubric · auto-grade · per-student weak-spots.","8 min"],
    ["04", "Parent home walk-through",                                              "Today's safety strip · bus tracker · attendance grid · weak-spots vs class · UPI fee.","5 min"],
    ["05", "Guardian gate + bus tour",                                              "Live Face-AI scan · GPS map · in-bus AI alert demo · visitor audit log export.",   "5 min"],
    ["06", "Q&A + onboarding plan for your school",                                 "Edition fit · pricing on the call · 1-term pilot terms · migration plan.",        "4 min"],
  ];
  agenda.forEach(([n, h, body, dur], i) => {
    const y = 3.85 + i * 0.5;
    rectCard(s, 0.5, y, 12.3, 0.45, { fill: SLATE50 });
    s.addText(n, {
      x: 0.6, y, w: 0.6, h: 0.45,
      fontFace: "Calibri", fontSize: 18, bold: true, color: PURPLE, valign: "middle",
    });
    s.addText(h, {
      x: 1.3, y, w: 6.5, h: 0.45,
      fontFace: "Calibri", fontSize: 12, bold: true, color: INK, valign: "middle",
    });
    s.addText(body, {
      x: 7.85, y, w: 4.0, h: 0.45,
      fontFace: "Calibri", fontSize: 9, color: SLATE600, valign: "middle",
    });
    s.addText(dur, {
      x: 11.95, y, w: 0.85, h: 0.45,
      fontFace: "Calibri", fontSize: 11, bold: true, color: CYAN, align: "right", valign: "middle",
    });
  });
}

// =============================================================================
// SLIDE 30 · CONTACT
// =============================================================================
{
  const s = pptx.addSlide();
  darkBg(s);
  if (MARK_OK) s.addImage({ path: MARK, x: 0.5, y: 0.4, w: 0.5, h: 0.5 });
  s.addText("AIvenX", {
    x: 1.1, y: 0.4, w: 4, h: 0.5,
    fontFace: "Calibri", fontSize: 18, bold: true, color: WHITE,
  });
  slideNum(s, 30, 30, true);

  s.addText("See it grade\nyour school's last paper.", {
    x: 0.5, y: 1.7, w: 12.3, h: 2.6,
    fontFace: "Calibri", fontSize: 60, bold: true, color: WHITE,
    align: "center", lineSpacingMultiple: 1.05,
  });
  s.addText(
    "Reply to our email, or reach us directly. We block 30 minutes for your principal + leadership team and walk through everything in this deck — live, on your data.",
    {
      x: 1.5, y: 4.4, w: 10.3, h: 1.0,
      fontFace: "Calibri", fontSize: 16, color: SLATE300, align: "center", lineSpacingMultiple: 1.4,
    }
  );

  // Contact grid
  const contacts = [
    ["EMAIL",       "hello@aivenx.co.in"],
    ["HEADQUARTERS","Hyderabad, Telangana"],
    ["WEB",         "aivenx.co.in"],
    ["DEMO TERMS",  "30-min · NDA-friendly · 1-term pilot · No setup fees"],
  ];
  contacts.forEach(([eb, value], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 1.5 + col * 5.0;
    const y = 5.7 + row * 0.7;
    darkCard(s, x, y, 4.7, 0.6);
    s.addText(eb, {
      x: x + 0.2, y: y + 0.1, w: 1.5, h: 0.4,
      fontFace: "Calibri", fontSize: 9, bold: true, color: CYAN, charSpacing: 6, valign: "middle",
    });
    s.addText(value, {
      x: x + 1.7, y: y + 0.1, w: 2.9, h: 0.4,
      fontFace: "Calibri", fontSize: 12, bold: true, color: WHITE, valign: "middle",
    });
  });

  s.addText("© 2026 AIvenX Technologies Pvt. Ltd. · Made in India · Demo deck v2 · April 2026", {
    x: 0.5, y: 7.05, w: 12.3, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: SLATE400, align: "center",
  });
}

// =============================================================================
// WRITE
// =============================================================================
pptx.writeFile({ fileName: "AIvenX-Demo-Deck.pptx" })
  .then((name) => {
    console.log(" Wrote", name);
  })
  .catch((err) => {
    console.error("× Error:", err);
    process.exit(1);
  });
