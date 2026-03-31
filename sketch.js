/*
 * "Fragmented" – A TBI Awareness Game
 * Group 10B, GBDA 302: Global Digital Project 2 (Winter 2026)
 * University of Waterloo
 *
 * A p5.js game that lets non-disabled players feel some of the cognitive
 * and emotional strain associated with Traumatic Brain Injury (TBI) during
 * everyday tasks.  Players progress through three stages representing a
 * typical day — morning routine at home, running errands outside and at
 * the store, and getting through work before making it home — while
 * managing memory loss, sensory overload, fatigue, distractions, and
 * emotional frustration.
 *
 * Core Mechanics (each tied to a lived-experience goal):
 *  1. Memory Fade – Objective text fades; press M to recall briefly.
 *     Represents short-term memory challenges after TBI [1][2].
 *  2. Sensory Overload – Meter rises over time, faster in stimulus zones.
 *     Calm Zones recover.  Reflects sensory processing difficulties [3].
 *  3. Cognitive Fatigue – Movement speed decreases with overload [2].
 *  4. Intrusive Distractions – Visual noise appears as overload grows,
 *     representing impaired stimulus filtering [3].
 *  5. Attention Drift – Slight loss of movement precision under high
 *     cognitive load, representing reduced motor/cognitive control [2].
 *  6. Emotional Frustration – On-screen thought messages voice the inner
 *     emotional struggle of doing simple tasks under strain [3].
 *  7. Fading Awareness – Distant stars become harder to see at high
 *     overload, representing fading spatial/task memory [2].
 *
 * Accessibility:
 *  - Low Sensory Mode (press L) reduces visual effects [4].
 *  - Improved colour contrast and visual hierarchy [4].
 *
 * References (ACM):
 *  [1] CDC. 2024. Get the Facts About TBI.
 *      https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/
 *  [2] Johansson, Berglund & Ronnback. 2009. Mental fatigue and impaired
 *      information processing after mild and moderate TBI. Brain Injury.
 *  [3] Lew et al. 2006. Persistent problems after TBI. JRRD.
 *  [4] Game Accessibility Guidelines. 2012. gameaccessibilityguidelines.com
 *  [5] Bogost. 2007. Persuasive Games. MIT Press.
 */

// ===================== CONSTANTS =====================
const CANVAS_W = 1000;
const CANVAS_H = 650;
const HUD_TOP = 65;
const HUD_BOTTOM = 38;
const PLAY_TOP = HUD_TOP;
const PLAY_BOTTOM = CANVAS_H - HUD_BOTTOM;
const OVERLOAD_RATE_MULT = 1.15;
const START_PRIMARY_BTN_W = 336;
const START_PRIMARY_BTN_H = 58;
const START_SECONDARY_BTN_W = 200;
const START_SECONDARY_BTN_H = 45;
const START_BUTTON_GAP = 25;
const TRANSITION_CARD_W = 460;
const TRANSITION_CARD_H = 280;
const TRANSITION_BUTTON_W = 288;
const TRANSITION_BUTTON_H = 50;
const TRANSITION_STACK_GAP = 32;

// ===================== COLOUR PALETTE =====================
const COL_BG = [22, 22, 35];
const COL_BG_LOW = [42, 42, 55];
const COL_WALL = [80, 75, 105];
const COL_WALL_HI = [100, 95, 130];
const COL_WALL_SH = [12, 12, 22];
const COL_PLAYER = [230, 115, 70];
const COL_PLAYER_HEAD = [240, 210, 180];
const COL_STAR = [255, 210, 50];
const COL_STAR_GLOW = [255, 220, 80];
const COL_STIMULUS = [220, 60, 50];
const COL_CALM = [50, 185, 120];
const COL_HUD_TEXT = [200, 200, 220];
const COL_TRANSITION_BG = [15, 20, 40];
const COL_TRANSITION_CARD = [20, 24, 52];
const COL_TRANSITION_TITLE = [255, 210, 75];
const COL_TRANSITION_TEXT = [235, 235, 245];
const COL_TRANSITION_SUB = [170, 175, 195];
const COL_TRANSITION_WARN = [205, 135, 125];
const COL_TRANSITION_BUTTON = [36, 38, 62];
const COL_TRANSITION_LINE = [120, 130, 160];

// ===================== GAME STATES =====================
const STATE_START = "start";
const STATE_PLAY = "play";
const STATE_STAGE_TRANSITION = "stage_transition";
const STATE_WIN = "win";
const STATE_LOSE = "lose";
let gameState = STATE_START;

// ===================== IMAGE =====================
//stage 1
let bedImg, tvImg, workbagImg, floorImg, keyImg, medicineImg; 
let woodImg, redWallImg, officeWallImg;
let nightstandImg, tvstandImg, couchImg, kitchenImg, kitchentableImg, shoerackImg, bookshelfImg;

//stage 2
let groceryImg, prescriptionImg, buscardImg;
let benchImg, phoneImg, carImg, background2Img;
let firehydrantImg, bushImg, newspaperImg, shoppingcartImg, transhcanImg, storeImg;

//stage 3
let computerImg, printerImg, sofaImg, coffeeImg, background3Img;
let communicateImg, flagImg, worknotesImg;

// ===================== AUDIO (Web Audio API) =====================
let audioCtx = null;
let audioReady = false;
let ambientOsc = null;
let ambientGain = null;

// Title screen ambient soundscape nodes
let titleDroneOsc = null;
let titleDroneGain = null;
let titleTinnitusOsc = null;
let titleTinnitusGain = null;
let titlePulseOsc = null;
let titlePulseGain = null;
let titlePulseLfo = null;
let titlePulseLfoGain = null;
let titleActive = false;
let titleAmbientMode = "title";

const TITLE_AMBIENT_LEVELS = {
  title: { drone: 0.025, tinnitus: 0.008, pulse: 0.012, lfo: 0.008 },
  play: { drone: 0.009, tinnitus: 0.0025, pulse: 0.0045, lfo: 0.003 },
};

function initAudio() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioReady = !!audioCtx;
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {}
}

// --- Title screen ambient: layered soundscape conveying subtle TBI strain ---
// Layer 1: Low drone — persistent pressure / headache sensation
// Layer 2: Faint high-frequency tone — tinnitus-like ringing
// Layer 3: Slow-pulsing mid tone — uneasy rhythmic throb
function setTitleAmbientMix(mode, fadeTime) {
  if (!audioCtx || !titleActive) return;
  titleAmbientMode = mode;
  let levels = TITLE_AMBIENT_LEVELS[mode] || TITLE_AMBIENT_LEVELS.title;
  let now = audioCtx.currentTime;
  let fade = fadeTime || 1.0;

  if (titleDroneGain) {
    titleDroneGain.gain.cancelScheduledValues(now);
    titleDroneGain.gain.setValueAtTime(titleDroneGain.gain.value, now);
    titleDroneGain.gain.linearRampToValueAtTime(levels.drone, now + fade);
  }
  if (titleTinnitusGain) {
    titleTinnitusGain.gain.cancelScheduledValues(now);
    titleTinnitusGain.gain.setValueAtTime(titleTinnitusGain.gain.value, now);
    titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus, now + fade);
  }
  if (titlePulseGain) {
    titlePulseGain.gain.cancelScheduledValues(now);
    titlePulseGain.gain.setValueAtTime(titlePulseGain.gain.value, now);
    titlePulseGain.gain.linearRampToValueAtTime(levels.pulse, now + fade);
  }
  if (titlePulseLfoGain) {
    titlePulseLfoGain.gain.cancelScheduledValues(now);
    titlePulseLfoGain.gain.setValueAtTime(titlePulseLfoGain.gain.value, now);
    titlePulseLfoGain.gain.linearRampToValueAtTime(levels.lfo, now + fade);
  }
}

function duckBackgroundAudio(amount, dur) {
  if (!audioCtx) return;
  let now = audioCtx.currentTime;
  let duckTo = constrain(amount, 0, 1);
  let releaseAt = now + (dur || 0.2);

  if (ambientGain) {
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
    ambientGain.gain.linearRampToValueAtTime(ambientGain.gain.value * duckTo, now + 0.03);
    ambientGain.gain.linearRampToValueAtTime(map(overload, 0, overloadMax, 0.003, 0.028), releaseAt);
  }

  let levels = TITLE_AMBIENT_LEVELS[titleAmbientMode] || TITLE_AMBIENT_LEVELS.title;
  if (titleDroneGain) {
    titleDroneGain.gain.cancelScheduledValues(now);
    titleDroneGain.gain.setValueAtTime(titleDroneGain.gain.value, now);
    titleDroneGain.gain.linearRampToValueAtTime(levels.drone * duckTo, now + 0.03);
    titleDroneGain.gain.linearRampToValueAtTime(levels.drone, releaseAt);
  }
  if (titleTinnitusGain) {
    titleTinnitusGain.gain.cancelScheduledValues(now);
    titleTinnitusGain.gain.setValueAtTime(titleTinnitusGain.gain.value, now);
    titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus * duckTo, now + 0.03);
    titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus, releaseAt);
  }
  if (titlePulseGain) {
    titlePulseGain.gain.cancelScheduledValues(now);
    titlePulseGain.gain.setValueAtTime(titlePulseGain.gain.value, now);
    titlePulseGain.gain.linearRampToValueAtTime(levels.pulse * duckTo, now + 0.03);
    titlePulseGain.gain.linearRampToValueAtTime(levels.pulse, releaseAt);
  }
  if (titlePulseLfoGain) {
    titlePulseLfoGain.gain.cancelScheduledValues(now);
    titlePulseLfoGain.gain.setValueAtTime(titlePulseLfoGain.gain.value, now);
    titlePulseLfoGain.gain.linearRampToValueAtTime(levels.lfo * duckTo, now + 0.03);
    titlePulseLfoGain.gain.linearRampToValueAtTime(levels.lfo, releaseAt);
  }
}

function startTitleAmbient(mode) {
  if (!audioCtx || titleActive) return;
  titleActive = true;
  titleAmbientMode = mode || "title";

  let now = audioCtx.currentTime;
  let fadeIn = 2.5; // gentle fade-in over 2.5 seconds
  let levels = TITLE_AMBIENT_LEVELS[titleAmbientMode] || TITLE_AMBIENT_LEVELS.title;

  // Layer 1: Low drone (55 Hz sine, very quiet)
  titleDroneOsc = audioCtx.createOscillator();
  titleDroneGain = audioCtx.createGain();
  titleDroneOsc.type = "sine";
  titleDroneOsc.frequency.value = 55;
  titleDroneGain.gain.setValueAtTime(0, now);
  titleDroneGain.gain.linearRampToValueAtTime(levels.drone, now + fadeIn);
  titleDroneOsc.connect(titleDroneGain);
  titleDroneGain.connect(audioCtx.destination);
  titleDroneOsc.start(now);

  // Layer 2: Tinnitus-like ringing (3800 Hz sine, barely audible)
  titleTinnitusOsc = audioCtx.createOscillator();
  titleTinnitusGain = audioCtx.createGain();
  titleTinnitusOsc.type = "sine";
  titleTinnitusOsc.frequency.value = 3800;
  titleTinnitusGain.gain.setValueAtTime(0, now);
  titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus, now + fadeIn);
  titleTinnitusOsc.connect(titleTinnitusGain);
  titleTinnitusGain.connect(audioCtx.destination);
  titleTinnitusOsc.start(now);

  // Layer 3: Slow pulsing mid-tone (110 Hz triangle, amplitude-modulated)
  titlePulseOsc = audioCtx.createOscillator();
  titlePulseGain = audioCtx.createGain();
  titlePulseOsc.type = "triangle";
  titlePulseOsc.frequency.value = 110;
  titlePulseGain.gain.setValueAtTime(0, now);
  titlePulseGain.gain.linearRampToValueAtTime(levels.pulse, now + fadeIn);
  titlePulseOsc.connect(titlePulseGain);

  // LFO to modulate the pulse volume slowly (0.3 Hz — one throb every ~3 seconds)
  titlePulseLfo = audioCtx.createOscillator();
  titlePulseLfoGain = audioCtx.createGain();
  titlePulseLfo.type = "sine";
  titlePulseLfo.frequency.value = 0.3;
  titlePulseLfoGain.gain.value = levels.lfo;
  titlePulseLfo.connect(titlePulseLfoGain);
  titlePulseLfoGain.connect(titlePulseGain.gain);
  titlePulseLfo.start(now);

  titlePulseGain.connect(audioCtx.destination);
  titlePulseOsc.start(now);
}

function stopTitleAmbient() {
  if (!titleActive) return;
  titleActive = false;

  let now = audioCtx ? audioCtx.currentTime : 0;
  let fadeOut = 0.6;

  // Fade out each layer, then stop
  if (titleDroneGain && titleDroneOsc) {
    try {
      titleDroneGain.gain.setValueAtTime(titleDroneGain.gain.value, now);
      titleDroneGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      titleDroneOsc.stop(now + fadeOut + 0.05);
    } catch (e) {}
    titleDroneOsc = null;
    titleDroneGain = null;
  }
  if (titleTinnitusGain && titleTinnitusOsc) {
    try {
      titleTinnitusGain.gain.setValueAtTime(titleTinnitusGain.gain.value, now);
      titleTinnitusGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      titleTinnitusOsc.stop(now + fadeOut + 0.05);
    } catch (e) {}
    titleTinnitusOsc = null;
    titleTinnitusGain = null;
  }
  if (titlePulseGain && titlePulseOsc) {
    try {
      titlePulseGain.gain.setValueAtTime(titlePulseGain.gain.value, now);
      titlePulseGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      titlePulseOsc.stop(now + fadeOut + 0.05);
    } catch (e) {}
    titlePulseOsc = null;
    titlePulseGain = null;
  }
  if (titlePulseLfo) {
    try {
      titlePulseLfo.stop(now + fadeOut + 0.05);
    } catch (e) {}
    titlePulseLfo = null;
    titlePulseLfoGain = null;
  }
}

function playTone(freq, dur, type, vol) {
  if (!audioCtx) return;
  duckBackgroundAudio(0.55, (dur || 0.12) + 0.12);
  let osc = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + dur + 0.05);
}

function playCollectSound() {
  playTone(523.25, 0.12, "sine", 0.15);
  setTimeout(() => playTone(659.25, 0.12, "sine", 0.12), 80);
  setTimeout(() => playTone(783.99, 0.18, "sine", 0.1), 160);
}
function playRecallSound() {
  playTone(440, 0.1, "triangle", 0.08);
  setTimeout(() => playTone(554.37, 0.15, "triangle", 0.06), 100);
}
function playRespawnSound() {
  playTone(330, 0.15, "sine", 0.08);
  setTimeout(() => playTone(392, 0.15, "sine", 0.08), 150);
}
function playCheckpointSound() {
  playTone(392, 0.12, "sine", 0.1);
  setTimeout(() => playTone(523.25, 0.18, "sine", 0.1), 120);
}
function playWinSound() {
  [523, 659, 784, 1047].forEach(function (f, i) {
    setTimeout(() => playTone(f, 0.25, "sine", 0.12), i * 180);
  });
}
function playLoseSound() {
  [300, 250, 200].forEach(function (f, i) {
    setTimeout(() => playTone(f, 0.3, "sawtooth", 0.05), i * 280);
  });
}
function playStageCompleteSound() {
  playTone(523, 0.15, "sine", 0.12);
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 120);
  setTimeout(() => playTone(784, 0.2, "sine", 0.1), 240);
}

function startAmbient() {
  if (!audioCtx || ambientOsc) return;
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();
  ambientOsc.type = "sine";
  ambientOsc.frequency.value = 65;
  ambientGain.gain.value = 0.003;
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();
}
function stopAmbient() {
  if (ambientOsc) {
    try {
      ambientOsc.stop();
    } catch (e) {}
    ambientOsc = null;
    ambientGain = null;
  }
}
function updateAmbient() {
  if (!ambientGain || !ambientOsc) return;
  ambientGain.gain.value = map(overload, 0, overloadMax, 0.003, 0.028);
  ambientOsc.frequency.value = map(overload, 0, overloadMax, 60, 190);
}

// ===================== PLAYER =====================
let playerX, playerY;
const playerSize = 18;
const baseSpeed = 3;

// ===================== LEVEL DATA (loaded per stage) =====================
let walls = [];
let stimulusZones = [];
let calmZones = [];
let decorations = [];
let stars = [];

// ===================== STAGE SYSTEM =====================
let stages = [];
let currentStage = 0;
let currentStageData = null;
let totalRespawnsUsed = 0;
let stageIntroTimer = 0;

// ===================== MECHANICS =====================
let objective = "";
let showObjective = true;
let memoryTimer = 999999;
let memoryActive = false;
let overload = 0;
const overloadMax = 100;
let checkpoints = [];
let checkpointIndex = 0;
let checkpointToastTimer = 0;
let respawnsLeft = 2;
let lowSensoryMode = false;
let showHowToPlay = false;
let howToPlayButtonBounds = null;
let howToPlayCloseBounds = null;
let howToPlayOverlayBounds = null;
let calmAbilityCharges = 0;
let calmAbilityMax = 2;
let calmAbilityTimer = 0;
let calmAbilityCooldown = 0;

// ===================== EMOTIONAL FRUSTRATION =====================
const emotionalMessages = [
  "Where was I going?",
  "I can't remember what I needed...",
  "Everything is so loud.",
  "I just need to focus...",
  "This should be simple.",
  "Why is this so hard?",
  "I need a break...",
  "My head won't stop pounding.",
  "I used to do this easily.",
  "One thing at a time...",
];
let emotionMsg = "";
let emotionTimer = 0;
let emotionCooldown = 0;

// ===================== DISTRACTIONS =====================
let distractions = [];
let distractCooldown = 0;

// ===================== PARTICLES =====================
let particles = [];

// ===================== SOUND FLAGS =====================
let endSoundPlayed = false;
let overloadWarnCooldown = 0;
let calmSoundCooldown = 0;

// ===================== HELPERS =====================
function starsCollected() {
  if (!currentStageData) return 0;
  return currentStageData.starsNeeded - stars.length;
}

function currentStageName() {
  if (!currentStageData) return "";
  return currentStageData.name;
}

function getStageEntryOverload(stageIndex, carriedOverload) {
  let s = stages[stageIndex];
  if (!s) return 0;
  if (carriedOverload === undefined || carriedOverload === null) {
    return s.startOverload;
  }
  return constrain(
    max(s.startOverload, carriedOverload * s.carryOverFactor),
    0,
    overloadMax * 0.9,
  );
}

function remainingTaskText() {
  if (stars.length === 0) return "All task markers complete";
  if (memoryActive && !showObjective) {
    return stars.length + " task marker(s) remain";
  }
  return stars.map((st) => st.label).join("  •  ");
}

function hitsWall(px, py) {
  let r = playerSize / 2;
  for (let i = 0; i < walls.length; i++) {
    let w = walls[i];
    let closestX = constrain(px, w.x, w.x + w.w);
    let closestY = constrain(py, w.y, w.y + w.h);
    let dx = px - closestX;
    let dy = py - closestY;
    if (dx * dx + dy * dy < r * r) return true;
  }
  // Solid decorations also block the player
  for (let i = 0; i < decorations.length; i++) {
    let d = decorations[i];
    // Decorations block by default unless they are explicitly floor-only.
    if (d.passThrough === true || d.solid === false) continue;
    let closestX = constrain(px, d.x, d.x + d.w);
    let closestY = constrain(py, d.y, d.y + d.h);
    let dx = px - closestX;
    let dy = py - closestY;
    if (dx * dx + dy * dy < r * r) return true;
  }
  return false;
}

function inRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

function drawStarShape(cx, cy, r1, r2, npoints) {
  let angle = TWO_PI / npoints;
  let half = angle / 2.0;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    vertex(cx + cos(a) * r2, cy + sin(a) * r2);
    vertex(cx + cos(a + half) * r1, cy + sin(a + half) * r1);
  }
  endShape(CLOSE);
}

function drawPanel(x, y, w, h, r) {
  noStroke();
  fill(16, 18, 38, 210);
  rectMode(CORNER);
  rect(x, y, w, h, r || 6);
}

function getStageOneTaskImage(label) {
  if (label === "Medication") return medicineImg;
  if (label === "Keys") return keyImg;
  if (label === "Work Bag") return workbagImg;
  return null;
}

function getStageTwoTaskImage(label) {
  if (label === "Groceries") return groceryImg;
  if (label === "Prescription") return prescriptionImg;
  if (label === "Bus Card") return buscardImg;
  return null;
}

function getStageThreeTaskImage(label) {
  if (label === "Work Notes") return worknotesImg;
  if (label === "Communicate") return communicateImg;
  if (label === "Make It Home") return flagImg;
  return null;
}


function drawStageThreeScene() {
  imageMode(CORNER);

  // Stage 3 background
  if (background3Img) {
    if (lowSensoryMode) {
      tint(255, 170);
    } else {
      tint(255, 255);
    }
    image(background3Img, 0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);
    noTint();
  }

  // Calm zone 1 = sofa
  if (sofaImg) {
    image(sofaImg, 420, 120, 110, 70);
  }

  // Calm zone 2 = coffee
  if (coffeeImg) {
    image(coffeeImg, 540, 380, 70, 70);
  }

  // Red zone 1 = computer
  if (computerImg) {
    image(computerImg, 180, 330, 110, 75);
  }

  // Red zone 2 = printer
  if (printerImg) {
    image(printerImg, 760, 300, 80, 65);
  }
}

function drawStageTwoScene() {
  imageMode(CORNER);

  // Stage 2 background
  if (background2Img) {
    if (lowSensoryMode) {
      tint(255, 170);
    } else {
      tint(255, 255);
    }
    image(background2Img, 0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);
    noTint();
  }

  // Calm zone = bench
  if (benchImg) {
    image(benchImg, 240, 480, 110, 60);
  }

  // Red zone 1 = phone
  if (phoneImg) {
    image(phoneImg, 30, 265, 90, 65);
  }

  // Red zone 2 = car
  if (carImg) {
    image(carImg, 200, 110, 95, 60);
  }
}

function drawStageOneScene() {
  imageMode(CORNER);

  // Floor background for the whole playable area
  if (floorImg) {
    if (lowSensoryMode) {
      tint(255, 170);
    } else {
      tint(255, 255);
    }
    image(floorImg, 0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);
    noTint();
  }

  // Bed image = calm source
 if (bedImg) {
  image(bedImg, 45, 190, 110, 70);
}

  // TV image = stimulus source
  if (tvImg) {
    image(tvImg, 348, 292, 112, 70);
  }
}

// ===================== STAGE DEFINITIONS =====================
function createStages() {
  stages = [
    // ========== STAGE 1: HOME ==========
    // Layout: Open apartment feel. Left = bedroom/quiet area, center = living room,
    // right-top = kitchen, right-bottom = hallway to front door.
    // Spacious, calm, easy to read. Few obstacles, gentle navigation.
    {
      name: "Home",
      subtitle: "Morning Routine",
      stageNum: 1,
      playerStart: { x: 80, y: 520 },
      objective: "Get ready for the day",
      starsNeeded: 3,
      introText: "Even simple routines take effort.",
      stars: [
        { x: 160, y: 160, size: 13, label: "Medication" },
        { x: 680, y: 150, size: 13, label: "Keys" },
        { x: 890, y: 500, size: 13, label: "Work Bag" },
      ],
      walls: [
        // Bedroom left wall (vertical, partial)
        { x: 290, y: PLAY_TOP, w: 12, h: 170 },
        // Bedroom doorway gap, then continues
        { x: 290, y: 290, w: 12, h: PLAY_BOTTOM - 290 },
        // Kitchen top wall (horizontal)
        { x: 500, y: 210, w: 240, h: 12 },
        // Kitchen right divider (vertical)
        { x: 728, y: 210, w: 12, h: 150 },
        // Hallway horizontal wall
        { x: 580, y: 400, w: 280, h: 12 },
        // Front door alcove right wall
        { x: 848, y: 440, w: 12, h: 120 },
      ],
      stimulusZones: [
  // TV noise only
  { x: 348, y: 292, w: 112, h: 70 },
],
     calmZones: [
    // Bed = calm source
    { x: 50, y: 200, w: 90, h: 50 },
    ],
      decorations: [
        // Nightstand
        { x: 170, y: 210, w: 36, h: 30, col: [100, 88, 72], solid: true },
        // TV stand in living room
        { x: 362, y: 348, w: 84, h: 28, col: [70, 70, 92], solid: true },
        // Couch (solid)
        { x: 380, y: 460, w: 110, h: 44, col: [82, 74, 100], solid: true },
        // Kitchen counter (solid)
        { x: 520, y: 100, w: 120, h: 32, col: [160, 155, 170], solid: true },
        // Kitchen table
        { x: 560, y: 280, w: 80, h: 50, col: [115, 98, 78], solid: true },
        // Shoe rack near front door (solid)
        { x: 870, y: 460, w: 50, h: 30, col: [105, 85, 68], solid: true },
        // Bookshelf against bedroom wall
        { x: 30, y: 310, w: 28, h: 80, col: [95, 80, 65], solid: true },
      ],

      checkpoints: [
        { x: 80, y: 520, label: "Bedroom", starsReq: 0 },
        { x: 450, y: 280, label: "Living Room", starsReq: 1 },
        { x: 780, y: 480, label: "Front Door", starsReq: 2 },
      ],
      overloadBase: 0.018,
      stimulusBonus: 0.08,
      memoryFadeAfter: 1,
      memoryTimer: 130,
      memoryRefresh: 45,
      memoryRecall: 100,
      distractionsOn: false,
      emotionsOn: false,
      driftOn: false,
      fadingAwarenessOn: false,
      calmRecovery: 1.5,
      respawns: 2,
      startOverload: 0,
      carryOverFactor: 0.0,
      respawnOverload: 28,
      distractionThreshold: 100,
      emotionThreshold: 100,
      driftThreshold: 100,
      bgTint: [45, 35, 28, 10],
      // hint: "Move slowly. Even a familiar routine can take real effort.",
      hintMemory:
        "Press M to steady the thought for a moment.",
  
    },

    // ========== STAGE 2: OUTSIDE / STORE ==========
    // Layout: Left third = sidewalk/bus stop with outdoor noise. Center = store
    // entrance transition. Right two-thirds = store aisles (three columns) with
    // noise zones, one calm bench area outside. More visual pressure.
    {
      name: "Outside / Store",
      subtitle: "Running Errands",
      stageNum: 2,
      playerStart: { x: 80, y: 510 },
      objective: "Run your errands",
      starsNeeded: 3,
      introText: "Noise and memory pull focus apart.",
      stars: [
        { x: 150, y: 140, size: 13, label: "Bus Card" },
        { x: 620, y: 260, size: 13, label: "Groceries" },
        { x: 920, y: 510, size: 13, label: "Prescription" },
      ],
      walls: [
        // Sidewalk-to-store divider (vertical, with gap at y~380-440)
        { x: 360, y: PLAY_TOP, w: 14, h: 200 },
        { x: 360, y: 320, w: 14, h: 100 },
        { x: 360, y: 490, w: 14, h: PLAY_BOTTOM - 490 },
        // Sidewalk cross-walls (create winding path)
        { x: 80, y: 200, w: 180, h: 12 },
        { x: 60, y: 360, w: 160, h: 12 },
        // Store interior — aisle shelves
        { x: 510, y: 120, w: 14, h: 260 },
        { x: 670, y: PLAY_TOP + 20, w: 14, h: 200 },
        { x: 670, y: 340, w: 14, h: 80 },
        { x: 820, y: 140, w: 14, h: 280 },
        // Store back wall connector
        { x: 510, y: 470, w: 180, h: 12 },
        // Checkout counter area
        { x: 820, y: 470, w: 140, h: 12 },
      ],
      stimulusZones: [
  { x: 30, y: 265, w: 90, h: 65 },   // phone
  { x: 200, y: 110, w: 95, h: 60 },  // car
],
     calmZones: [
  { x: 240, y: 480, w: 110, h: 60 },
],
      decorations: [
        // Fire hydrant (solid, sidewalk obstacle)
        { x: 130, y: 112, w: 18, h: 30, col: [165, 60, 55], solid: true },
        // Hedge / bush row (solid, sidewalk)
        { x: 30, y: 420, w: 80, h: 30, col: [50, 100, 55], solid: true },
        // Newspaper box (solid)
        { x: 275, y: 300, w: 28, h: 24, col: [120, 110, 85], solid: true },
        // Bench seat placed just below the calm zone
        { x: 244, y: 544, w: 60, h: 18, col: [100, 85, 65], solid: true },
        // Store shelf end-cap left
        { x: 430, y: 140, w: 40, h: 50, col: [110, 108, 120], solid: true },
        // Store display island
        { x: 560, y: 390, w: 50, h: 40, col: [125, 118, 130], solid: true },
        // Store shelf end-cap right
        { x: 745, y: 250, w: 42, h: 50, col: [110, 108, 120], solid: true },
        // Shopping cart (solid, blocking)
        { x: 460, y: 300, w: 30, h: 24, col: [140, 140, 148], solid: true },
        // Pharmacy counter
        { x: 875, y: 400, w: 80, h: 24, col: [100, 95, 115], solid: true },
        // Trash can outside
        { x: 320, y: 150, w: 22, h: 26, col: [75, 80, 75], solid: true },
      ],
      checkpoints: [
        { x: 80, y: 510, label: "Sidewalk", starsReq: 0 },
        { x: 420, y: 440, label: "Store Entrance", starsReq: 1 },
        { x: 740, y: 430, label: "Back Aisle", starsReq: 2 },
      ],
      overloadBase: 0.055,
      stimulusBonus: 0.18,
      memoryFadeAfter: 0,
      memoryTimer: 65,
      memoryRefresh: 35,
      memoryRecall: 45,
      distractionsOn: true,
      emotionsOn: true,
      driftOn: false,
      fadingAwarenessOn: true,
      calmRecovery: 1.0,
      respawns: 2,
      startOverload: 18,
      carryOverFactor: 0.38,
      respawnOverload: 42,
      distractionThreshold: 40,
      emotionThreshold: 62,
      driftThreshold: 100,
      bgTint: [30, 45, 38, 10],
      // hint: "Noise stacks up quickly here. Route around it when you can.",
      hintMemory: "The plan is harder to hold onto now. Press M to recall it.",
      transitionReflection: "The noise is still ringing in your head.",
    },

    // ========== STAGE 3: WORKPLACE / WAY HOME ==========
    // Layout: Left = office cubicle maze (dense). Center = break room (calm).
    // Right-top = transit corridor (narrow, noisy). Right-bottom = final stretch
    // home. Most obstacles, tightest paths, most noise zones.
    {
      name: "Workplace / Way Home",
      subtitle: "End of the Day",
      stageNum: 3,
      playerStart: { x: 80, y: 350 },
      objective: "Finish work and get home",
      starsNeeded: 3,
      introText: "Fatigue makes every step harder.",
    stars: [
  { x: 220, y: 180, size: 13, label: "Work Notes" },
  { x: 520, y: 250, size: 13, label: "Communicate" },
  { x: 900, y: 520, size: 13, label: "Make It Home" },
],
      walls: [
        // Office outer walls
        { x: 150, y: 110, w: 12, h: 200 },
        { x: 150, y: 110, w: 200, h: 12 },
        // Office inner partition
        { x: 240, y: 230, w: 140, h: 12 },
        { x: 240, y: 230, w: 12, h: 180 },
        // Office to break room divider
        { x: 420, y: PLAY_TOP, w: 12, h: 200 },
        { x: 420, y: 300, w: 12, h: 120 },
        // Break room south wall
        { x: 340, y: 420, w: 200, h: 12 },
        // Break room to transit divider
        { x: 530, y: 260, w: 12, h: 170 },
        // Transit corridor walls
        { x: 620, y: PLAY_TOP, w: 14, h: 170 },
        { x: 620, y: 310, w: 14, h: PLAY_BOTTOM - 310 },
        // Transit upper horizontal
        { x: 634, y: 190, w: 160, h: 12 },
        // Way home corridor right wall
        { x: 800, y: 260, w: 12, h: 190 },
        // Way home lower wall
        { x: 700, y: 500, w: 110, h: 12 },
        // Final stretch barrier
        { x: 900, y: 230, w: 12, h: 200 },
      ],
     stimulusZones: [
  { x: 180, y: 330, w: 110, h: 75 }, // computer
  { x: 760, y: 300, w: 80, h: 65 },  // printer
],
      calmZones: [
  { x: 420, y: 120, w: 110, h: 70 }, // sofa
  { x: 540, y: 380, w: 70, h: 70 },  // coffee
],
      decorations: [
        // Office desk 1 (solid)
        { x: 40, y: 130, w: 70, h: 30, col: [95, 88, 78], solid: true },
        // Office desk 2 (solid)
        { x: 170, y: 320, w: 50, h: 30, col: [95, 88, 78], solid: true },
        // Filing cabinet (solid)
        { x: 350, y: 130, w: 30, h: 40, col: [80, 80, 95], solid: true },
        // Printer (solid, near noise zone)
        { x: 58, y: 260, w: 40, h: 28, col: [110, 105, 115], solid: true },
        // Break room sofa (solid)
        { x: 460, y: 320, w: 60, h: 35, col: [68, 108, 78], solid: true },
        // Break room plant (solid, kept clear of the calm zone)
        { x: 434, y: 110, w: 24, h: 28, col: [55, 110, 65], solid: true },
        // Water cooler (solid)
        { x: 540, y: 380, w: 22, h: 26, col: [85, 110, 130], solid: true },
        // Transit bench (solid)
        { x: 650, y: 440, w: 70, h: 22, col: [100, 90, 75], solid: true },
        // Vending machine (solid, tall)
        { x: 460, y: 200, w: 36, h: 46, col: [90, 85, 110], solid: true },
        // Trash bin transit
        { x: 760, y: 320, w: 22, h: 24, col: [75, 78, 75], solid: true },
        // Home stretch mailbox
        { x: 915, y: 350, w: 24, h: 28, col: [95, 75, 65], solid: true },
        // Office rug (solid obstacle)
        { x: 160, y: 350, w: 65, h: 40, col: [48, 42, 55], solid: true },
        // Transit floor marking (decorative)
        { x: 650, y: 250, w: 80, h: 6, col: [60, 58, 72], passThrough: true },
      ],
      checkpoints: [
        { x: 80, y: 350, label: "Office", starsReq: 0 },
        { x: 500, y: 176, label: "Break Room", starsReq: 1 },
        { x: 700, y: 370, label: "Transit Exit", starsReq: 2 },
      ],
      overloadBase: 0.1,
      stimulusBonus: 0.22,
      memoryFadeAfter: 0,
      memoryTimer: 40,
      memoryRefresh: 22,
      memoryRecall: 25,
      distractionsOn: true,
      emotionsOn: true,
      driftOn: true,
      fadingAwarenessOn: true,
      calmRecovery: 0.7,
      respawns: 2,
      startOverload: 32,
      carryOverFactor: 0.55,
      respawnOverload: 50,
      distractionThreshold: 34,
      emotionThreshold: 48,
      driftThreshold: 55,
      bgTint: [28, 32, 52, 12],
      // hint: "Fatigue is sticking now. Use the break room before pushing into the last stretch.",
      hintMemory:
        "Hold onto one step at a time. Press M when the objective slips away.",
      transitionReflection: "",
    },
  ];
}
function preload() {
  // Stage 1 assets
  bedImg = loadImage("assets/images/bed.jpg");
  tvImg = loadImage("assets/images/tv.png");
  medicineImg = loadImage("assets/images/medicine.png");
  keyImg = loadImage("assets/images/key.png");
  workbagImg = loadImage("assets/images/workbag.png");
  floorImg = loadImage("assets/images/floor.jpg");
  woodImg = loadImage("assets/images/wood.jpg");

  nightstandImg = loadImage("assets/images/nightstand.png");
tvstandImg = loadImage("assets/images/tvstand.png");
couchImg = loadImage("assets/images/couch.png");
kitchenImg = loadImage("assets/images/kitchen.png");
kitchentableImg = loadImage("assets/images/kitchentable.png");
shoerackImg = loadImage("assets/images/shoerack.png");
bookshelfImg = loadImage("assets/images/bookshelf.png");

  // Stage 2 assets
  groceryImg = loadImage("assets/images/grocery.png");
  prescriptionImg = loadImage("assets/images/prescription.png");
  buscardImg = loadImage("assets/images/buscard.jpg");
  background2Img = loadImage("assets/images/background2.png");
  benchImg = loadImage("assets/images/parkbench.png");
  phoneImg = loadImage("assets/images/phone.png");
  carImg = loadImage("assets/images/car.png");
  woodImg = loadImage("assets/images/wood.jpg");
redWallImg = loadImage("assets/images/redwall.jpg");

firehydrantImg = loadImage("assets/images/firehydrant.png");
bushImg = loadImage("assets/images/bush.png");
newspaperImg = loadImage("assets/images/newspaper.png");
shoppingcartImg = loadImage("assets/images/shoppingcart.png");
transhcanImg = loadImage("assets/images/transhcan.png");
storeImg = loadImage("assets/images/store.png");

  // Stage 3 assets
  computerImg = loadImage("assets/images/computer.jpg");
  printerImg = loadImage("assets/images/printer.png");
  sofaImg = loadImage("assets/images/sofa.jpg");
  coffeeImg = loadImage("assets/images/coffee.png");
  background3Img = loadImage("assets/images/background3.jpg");
  communicateImg = loadImage("assets/images/communicate.png");
  flagImg = loadImage("assets/images/flag.png");
  worknotesImg = loadImage("assets/images/worknotes.png");
  officeWallImg = loadImage("assets/images/officewall.jpg");
}



// ===================== p5.js SETUP =====================
function setup() {
  let canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("game-container");
  textAlign(CENTER, CENTER);
  createStages();
  initAudio();
  startTitleAmbient("title");
}

// ===================== DRAW LOOP =====================
function draw() {
  cursor(ARROW);

  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (gameState === STATE_PLAY) {
    drawPlayScreen();
  } else if (gameState === STATE_STAGE_TRANSITION) {
    drawStageTransitionScreen();
  } else if (gameState === STATE_WIN) {
    drawWinScreen();
  } else if (gameState === STATE_LOSE) {
    drawLoseScreen();
  }
}

// ===================== GAME INIT =====================
function initGame() {
  currentStage = 0;
  totalRespawnsUsed = 0;
  endSoundPlayed = false;
  showHowToPlay = false;
  loadStage(0, 0);
}

function loadStage(index, carriedOverload) {
  currentStage = index;
  let s = stages[index];
  currentStageData = s;

  // Player position
  playerX = s.playerStart.x;
  playerY = s.playerStart.y;

  // Objective
  objective = s.objective;
  showObjective = true;

  // Memory
  memoryActive = s.memoryFadeAfter === 0;
  memoryTimer = memoryActive ? s.memoryTimer : 999999;

  // Overload carries some fatigue forward into later stages.
  overload = getStageEntryOverload(index, carriedOverload);

  // Load level data (deep copy stars so we can splice)
  walls = s.walls;
  stimulusZones = s.stimulusZones;
  calmZones = s.calmZones;
  decorations = s.decorations;
  stars = [];
  for (let st of s.stars) {
    stars.push({ x: st.x, y: st.y, size: st.size, label: st.label });
  }

  // Checkpoints
  checkpoints = s.checkpoints;
  checkpointIndex = 0;
  checkpointToastTimer = 0;

  // Lives
  respawnsLeft = s.respawns;

  // Effects reset
  particles = [];
  distractions = [];
  distractCooldown = 0;
  emotionMsg = "";
  emotionTimer = 0;
  emotionCooldown = 0;
  overloadWarnCooldown = 0;
  calmSoundCooldown = 0;
  stageIntroTimer = 150;
  calmAbilityCharges = calmAbilityMax;
  calmAbilityTimer = 0;
  calmAbilityCooldown = 0;
}

// ===================== DRAW LOOP =====================
function draw() {
  cursor(ARROW);
  switch (gameState) {
    case STATE_START:
      drawStartScreen();
      break;
    case STATE_PLAY:
      drawPlayScreen();
      break;
    case STATE_STAGE_TRANSITION:
      drawStageTransitionScreen();
      break;
    case STATE_WIN:
      drawWinScreen();
      break;
    case STATE_LOSE:
      drawLoseScreen();
      break;
  }
}

// ===================== START SCREEN =====================
function drawStartScreen() {
  background(COL_BG[0], COL_BG[1], COL_BG[2]);


  // Start title ambient soundscape if audio is ready and not already playing
  if (audioReady && !titleActive) {
    stopAmbient(); 

  }

  drawStartBackdrop();

  let panelX = 222;
  let panelY = 90;
  let panelW = 556;
  let panelH = 396;
  let panelCX = panelX + panelW / 2;
  let panelCY = panelY + panelH / 2;
  let heroX = panelX + 46;
  let heroY = panelY + 50;
  let heroW = panelW - 92;
  let heroH = 130;
  let heroCX = heroX + heroW / 2;
  let heroCY = heroY + heroH / 2;
  let titleY = heroCY - 8;
  let subtitleY = heroCY + 38;
  let primaryButtonY = panelCY + 40;
  let secondaryButtonY =
    primaryButtonY +
    START_PRIMARY_BTN_H / 2 +
    START_BUTTON_GAP +
    START_SECONDARY_BTN_H / 2;
  let hoverHowToPlay = false;
  let hoverClose = false;
  howToPlayButtonBounds = null;
  howToPlayCloseBounds = null;
  howToPlayOverlayBounds = null;

  noStroke();
  if (!lowSensoryMode) {
    fill(40, 38, 65, 30);
    rectMode(CORNER);
    rect(panelX - 10, panelY - 10, panelW + 20, panelH + 20, 24);
  }

  fill(18, 20, 42, 206);
  rectMode(CORNER);
  rect(panelX, panelY, panelW, panelH, 20);

  if (!lowSensoryMode) {
    fill(255, 210, 75, 16);
    rect(panelX + 58, panelY, panelW - 116, 2, 1);
    fill(78, 104, 152, 12);
    rect(heroX, heroY, heroW, heroH, 16);
  }

  textAlign(CENTER, CENTER);
  fill(255, 210, 75);
  textSize(54);
  textStyle(BOLD);
  text("Fragmented", heroCX, titleY);

  textStyle(NORMAL);
  textSize(13);
  fill(214, 216, 228);
  text("Experience daily life under cognitive strain", heroCX, subtitleY);

  // stroke(255, 255, 255, 15);
  // strokeWeight(1);
  // line(panelX + 92, dividerY, panelX + panelW - 92, dividerY);
  // noStroke();

  drawStartPrimaryButton(panelCX, primaryButtonY);
  drawStartHowToPlayButton(panelCX, secondaryButtonY);

  if (showHowToPlay) {
    drawHowToPlayOverlay();
  }

  hoverHowToPlay =
    !showHowToPlay &&
    howToPlayButtonBounds &&
    inRect(
      mouseX,
      mouseY,
      howToPlayButtonBounds.x,
      howToPlayButtonBounds.y,
      howToPlayButtonBounds.w,
      howToPlayButtonBounds.h,
    );
  hoverClose =
    showHowToPlay &&
    howToPlayCloseBounds &&
    inRect(
      mouseX,
      mouseY,
      howToPlayCloseBounds.x,
      howToPlayCloseBounds.y,
      howToPlayCloseBounds.w,
      howToPlayCloseBounds.h,
    );

  if (hoverClose || hoverHowToPlay) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  rectMode(CORNER);
  textStyle(NORMAL);
}

function drawStartBackdrop() {
  noStroke();

  // Edge vignette
  for (let i = 0; i < 100; i++) {
    let a = map(i, 0, 100, 28, 0);
    fill(8, 8, 18, a);
    rectMode(CORNER);
    rect(0, i, CANVAS_W, 1);
    rect(0, CANVAS_H - i, CANVAS_W, 1);
  }

  if (lowSensoryMode) return;

  let cx = CANVAS_W / 2;
  let cy = CANVAS_H / 2;
  let t = frameCount;

  // --- Layer 1: Faint head silhouette outline (centered behind panel) ---
  // A simple abstract oval representing the head, with a subtle inner shape
  // for the brain region — grounding the TBI theme visually.
  push();
  translate(cx, cy - 20);
  noFill();
  // Outer head outline — faint, slightly breathing
  let headBreath = sin(t * 0.012) * 3;
  stroke(60, 65, 95, 18 + sin(t * 0.02) * 4);
  strokeWeight(1.5);
  ellipse(0, 0, 320 + headBreath, 390 + headBreath);
  // Inner brain region — smaller oval, even fainter
  stroke(70, 75, 110, 12);
  strokeWeight(1);
  ellipse(0, -30, 220 + headBreath * 0.6, 240 + headBreath * 0.6);
  pop();

  // --- Layer 2: Neural pathway lines ---
  // Branching lines that flicker, break, and reconnect — representing
  // damaged neural connections and the effort to maintain cognitive pathways.
  let neuralSeeds = [
    { sx: 280, sy: 180, ang: 0.4 },
    { sx: 720, sy: 180, ang: 2.7 },
    { sx: 200, sy: 420, ang: 0.9 },
    { sx: 800, sy: 420, ang: 2.2 },
    { sx: 500, sy: 130, ang: 1.5 },
    { sx: 370, sy: 500, ang: 0.2 },
    { sx: 630, sy: 500, ang: 2.9 },
    { sx: 150, sy: 300, ang: 0.6 },
    { sx: 850, sy: 300, ang: 2.5 },
  ];
  for (let n = 0; n < neuralSeeds.length; n++) {
    let seed = neuralSeeds[n];
    let px = seed.sx;
    let py = seed.sy;
    let ang = seed.ang + sin(t * 0.005 + n * 1.3) * 0.3;
    let segLen = 18;
    let segments = 6 + (n % 3);
    // Each pathway flickers in and out on its own cycle
    let flickerPhase = sin(t * 0.018 + n * 2.1);
    let pathAlpha = map(flickerPhase, -1, 1, 4, 22);

    stroke(90, 100, 150, pathAlpha);
    strokeWeight(1);
    for (let s = 0; s < segments; s++) {
      let nx = px + cos(ang) * segLen;
      let ny = py + sin(ang) * segLen;
      // Broken connections — skip drawing some segments to show damage
      let broken = sin(t * 0.025 + n * 3.7 + s * 1.9) > 0.4;
      if (!broken) {
        line(px, py, nx, ny);
      }
      // Small synapse node at each joint
      if (s < segments - 1) {
        noStroke();
        fill(100, 120, 170, broken ? 5 : pathAlpha * 0.8);
        ellipse(nx, ny, 3, 3);
        stroke(90, 100, 150, pathAlpha);
        strokeWeight(1);
      }
      px = nx;
      py = ny;
      // Branch direction drifts
      ang += sin(t * 0.008 + s * 0.9 + n) * 0.5;
    }
  }
  noStroke();

  // --- Layer 3: Drifting thought fragments ---
  // Small text-like shapes that float and fade, representing scattered
  // thoughts, memory fragments, and the difficulty holding onto ideas.
  let fragments = [
    { x: 120, y: 150, w: 40, h: 4 },
    { x: 870, y: 170, w: 35, h: 4 },
    { x: 180, y: 480, w: 45, h: 4 },
    { x: 760, y: 510, w: 38, h: 4 },
    { x: 400, y: 560, w: 32, h: 4 },
    { x: 620, y: 100, w: 36, h: 4 },
    { x: 90,  y: 340, w: 28, h: 4 },
    { x: 910, y: 360, w: 34, h: 4 },
    { x: 310, y: 80,  w: 42, h: 4 },
    { x: 700, y: 580, w: 30, h: 4 },
  ];
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    // Each fragment drifts slowly and fades in/out
    let drift = sin(t * 0.01 + i * 1.7) * 15;
    let driftY = cos(t * 0.008 + i * 2.3) * 8;
    let fadeAlpha = map(sin(t * 0.015 + i * 2.9), -1, 1, 3, 18);
    fill(160, 165, 200, fadeAlpha);
    rectMode(CORNER);
    rect(f.x + drift, f.y + driftY, f.w, f.h, 2);
    // Some fragments have a second shorter "word" next to them
    if (i % 3 === 0) {
      rect(f.x + drift + f.w + 6, f.y + driftY, f.w * 0.5, f.h, 2);
    }
  }

  // --- Layer 4: Fading awareness particles ---
  // Tiny dots that pulse gently, representing moments of clarity
  // flickering in and out — the struggle to stay present.
  for (let i = 0; i < 50; i++) {
    let px = (i * 173 + 47) % CANVAS_W;
    let py = (i * 113 + 31) % CANVAS_H;
    let pulse = sin(t * 0.03 + i * 0.8);
    let a = map(pulse, -1, 1, 0, 10);
    let sz = map(pulse, -1, 1, 1, 2.5);
    fill(140, 150, 200, a);
    ellipse(px, py, sz, sz);
  }

  // --- Layer 5: Subtle pressure halo around center ---
  // A soft warm glow behind the title area, representing the persistent
  // low-grade discomfort — always there, hard to ignore.
  fill(255, 200, 80, 8 + sin(t * 0.015) * 3);
  ellipse(cx, cy - 50, 350, 200);
  fill(80, 60, 120, 6 + sin(t * 0.02 + 1) * 2);
  ellipse(cx, cy + 80, 400, 180);

  rectMode(CORNER);
}

function drawStartPrimaryButton(cx, cy) {
  let glow = lowSensoryMode ? 0 : sin(frameCount * 0.055) * 8;
  let outerW = START_PRIMARY_BTN_W + 28 + glow;
  let outerH = START_PRIMARY_BTN_H + 12 + glow * 0.22;
  let tagW = 78;
  let tagH = 32;

  rectMode(CENTER);
  noStroke();

  fill(255, 210, 75, lowSensoryMode ? 14 : 22);
  rect(cx, cy, outerW, outerH, 20);

  fill(28, 31, 52, 235);
  rect(cx, cy, START_PRIMARY_BTN_W, START_PRIMARY_BTN_H, 16);

  noFill();
  stroke(255, 210, 75, lowSensoryMode ? 95 : 70 + glow * 3);
  strokeWeight(1.8);
  rect(cx, cy, START_PRIMARY_BTN_W, START_PRIMARY_BTN_H, 16);

  fill(255, 255, 255, lowSensoryMode ? 255 : 225 + glow * 2);
  textSize(20);
  text("Press ENTER to Start", cx, cy);

  rectMode(CORNER);
  textStyle(NORMAL);
}

function drawStartHowToPlayButton(cx, cy) {
  howToPlayButtonBounds = {
    x: cx - START_SECONDARY_BTN_W / 2,
    y: cy - START_SECONDARY_BTN_H / 2,
    w: START_SECONDARY_BTN_W,
    h: START_SECONDARY_BTN_H,
  };
  let hovered =
    !showHowToPlay &&
    inRect(
      mouseX,
      mouseY,
      howToPlayButtonBounds.x,
      howToPlayButtonBounds.y,
      howToPlayButtonBounds.w,
      howToPlayButtonBounds.h,
    );

  rectMode(CENTER);
  fill(24, 28, 48, hovered ? 238 : 220);
  noStroke();
  rect(cx, cy, START_SECONDARY_BTN_W, START_SECONDARY_BTN_H, 16);

  noFill();
  stroke(140, 148, 175, hovered ? 110 : 70);
  strokeWeight(1.2);
  rect(cx, cy, START_SECONDARY_BTN_W, START_SECONDARY_BTN_H, 16);

  noStroke();
  fill(212, 216, 228, hovered ? 255 : 225);
  textAlign(CENTER, CENTER);
  textSize(17);
  textStyle(BOLD);
  text("How to Play", cx, cy + 1);

  rectMode(CORNER);
  textStyle(NORMAL);
}

function drawHowToPlayOverlay() {
  let panelX = 220;
  let panelY = 104;
  let panelW = 560;
  let panelH = 440;
  let cx = panelX + panelW / 2;

  howToPlayOverlayBounds = { x: panelX, y: panelY, w: panelW, h: panelH };
  howToPlayCloseBounds = {
    x: panelX + panelW - 54,
    y: panelY + 18,
    w: 32,
    h: 32,
  };

  fill(8, 10, 18, lowSensoryMode ? 175 : 205);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, CANVAS_W, CANVAS_H);

  if (!lowSensoryMode) {
    fill(40, 38, 65, 38);
    rect(panelX - 8, panelY - 8, panelW + 16, panelH + 16, 20);
  }

  fill(16, 18, 38, 242);
  rect(panelX, panelY, panelW, panelH, 16);
  fill(255, 210, 75, 18);
  rect(panelX + 34, panelY, panelW - 68, 1.5, 1);

  let closeHovered = inRect(
    mouseX,
    mouseY,
    howToPlayCloseBounds.x,
    howToPlayCloseBounds.y,
    howToPlayCloseBounds.w,
    howToPlayCloseBounds.h,
  );

  fill(closeHovered ? 48 : 32, 36, 58, 255);
  rect(
    howToPlayCloseBounds.x,
    howToPlayCloseBounds.y,
    howToPlayCloseBounds.w,
    howToPlayCloseBounds.h,
    9,
  );
  noFill();
  stroke(255, 210, 75, closeHovered ? 130 : 70);
  strokeWeight(1.2);
  rect(
    howToPlayCloseBounds.x,
    howToPlayCloseBounds.y,
    howToPlayCloseBounds.w,
    howToPlayCloseBounds.h,
    9,
  );
  noStroke();
  fill(255, 210, 75);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(
    "X",
    howToPlayCloseBounds.x + howToPlayCloseBounds.w / 2,
    howToPlayCloseBounds.y + howToPlayCloseBounds.h / 2 + 1,
  );

  fill(255, 210, 75);
  textSize(24);
  text("How to Play", cx, panelY + 46);
  textStyle(NORMAL);
  textSize(11.5);
  fill(180, 184, 200);
  text(
    "Complete the day while managing overload, fatigue, and fading memory.",
    cx,
    panelY + 76,
  );

  drawHowToPlayRow(panelX + 54, panelY + 120, "Arrow Keys", "Move");
  drawHowToPlayRow(panelX + 54, panelY + 164, "M", "Recall objective");
  drawHowToPlayRow(panelX + 54, panelY + 208, "L", "Toggle Low Sensory Mode");
  drawHowToPlayRow(panelX + 54, panelY + 252, "R", "Return to title");

  fill(255, 210, 75);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Gameplay Guidance", panelX + 62, panelY + 300);

  fill(214, 218, 230);
  textStyle(NORMAL);
  textSize(12);
  text("Green zones help reduce overload.", panelX + 62, panelY + 326);
  text("Red noise zones increase overload.", panelX + 62, panelY + 350);
  text(
    "Manage memory, fatigue, and overload while completing the day.",
    panelX + 62,
    panelY + 373,
  );

  textAlign(CENTER, CENTER);
  fill(144, 150, 168);
  textSize(10.5);
  text("Press H or ESC to close", cx, panelY + panelH - 26);

  rectMode(CORNER);
}

function drawHowToPlayRow(x, y, keyLabel, label) {
  fill(24, 28, 48, 230);
  rectMode(CORNER);
  rect(x, y - 16, 452, 34, 10);

  fill(255, 210, 75, 22);
  rect(x + 10, y - 10, 90, 22, 8);

  textAlign(CENTER, CENTER);
  fill(255, 210, 75);
  textSize(11.5);
  textStyle(BOLD);
  text(keyLabel, x + 55, y + 1);

  textAlign(LEFT, CENTER);
  fill(220, 222, 232);
  textStyle(NORMAL);
  textSize(11.5);
  text(label, x + 126, y + 1);
}

// ===================== PLAY SCREEN =====================
function drawPlayScreen() {
  if (lowSensoryMode) {
    background(COL_BG_LOW[0], COL_BG_LOW[1], COL_BG_LOW[2]);
  } else {
    background(COL_BG[0], COL_BG[1], COL_BG[2]);
  }

  updateGame();

  // Background / environment images

  push();
  if (overload > 65 && !lowSensoryMode) {
    let shake = map(overload, 65, 100, 0, 4);
    translate(random(-shake, shake), random(-shake, shake));
  }
  drawStage();
  pop();

  if (overload > 45 && !lowSensoryMode) {
    drawVignette();
  }

  drawHUD();
  drawStageIntroBanner();

  if (lowSensoryMode) {
    fill(120, 220, 180, 180);
    noStroke();
    rectMode(CORNER);
    rect(CANVAS_W - 135, PLAY_TOP + 4, 127, 20, 4);
    fill(30, 50, 40);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("LOW SENSORY MODE", CANVAS_W - 71, PLAY_TOP + 14);
  }
}

// ===================== STAGE TRANSITION SCREEN =====================
function drawStageTransitionScreen() {
  background(
    COL_TRANSITION_BG[0],
    COL_TRANSITION_BG[1],
    COL_TRANSITION_BG[2],
  );

  if (!endSoundPlayed) {
    playStageCompleteSound();
    stopAmbient();
    setTitleAmbientMix("play", 0.8);
    endSoundPlayed = true;
  }

  let cx = CANVAS_W / 2;
  let cy = CANVAS_H / 2;
  let nextStage = stages[currentStage + 1];
  let carryOverload = getStageEntryOverload(currentStage + 1, overload);
  let progressText =
    "Stage " + currentStageData.stageNum + " of " + stages.length;
  let rowCount = 6;
  let firstRowY = cy - ((rowCount - 1) * TRANSITION_STACK_GAP) / 2 - 23;
  let rowIndex = 0;
  let progressY = firstRowY + TRANSITION_STACK_GAP * rowIndex++;
  let titleY = firstRowY + TRANSITION_STACK_GAP * rowIndex++ + 3;
  let lineY = firstRowY + TRANSITION_STACK_GAP * rowIndex++ - 4;
  let nameY = firstRowY + TRANSITION_STACK_GAP * rowIndex++ - 8;
  let infoY = firstRowY + TRANSITION_STACK_GAP * rowIndex++ - 3;
  let buttonY = firstRowY + TRANSITION_STACK_GAP * rowIndex++ + 15;

  noStroke();
  if (!lowSensoryMode) {
    fill(8, 10, 26, 42);
    rectMode(CENTER);
    rect(cx, cy + 8, TRANSITION_CARD_W + 16, TRANSITION_CARD_H + 16, 24);
  }

  fill(COL_TRANSITION_CARD[0], COL_TRANSITION_CARD[1], COL_TRANSITION_CARD[2], 236);
  rectMode(CENTER);
  rect(cx, cy, TRANSITION_CARD_W, TRANSITION_CARD_H, 20);

  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(10.5);
  fill(COL_TRANSITION_SUB[0], COL_TRANSITION_SUB[1], COL_TRANSITION_SUB[2], 185);
  text(progressText, cx, progressY);

  fill(COL_TRANSITION_TITLE[0], COL_TRANSITION_TITLE[1], COL_TRANSITION_TITLE[2]);
  textSize(31);
  textStyle(BOLD);
  text("Stage " + currentStageData.stageNum + " Complete", cx, titleY);

  if (!lowSensoryMode) {
    fill(
      COL_TRANSITION_TITLE[0],
      COL_TRANSITION_TITLE[1],
      COL_TRANSITION_TITLE[2],
      18,
    );
    rect(cx, lineY, 265, 2, 1);
  }

  textStyle(NORMAL);
  textSize(18);
  fill(COL_TRANSITION_TEXT[0], COL_TRANSITION_TEXT[1], COL_TRANSITION_TEXT[2]);
  text(currentStageData.name, cx, nameY);

  drawTransitionInfoLine(cx, infoY, nextStage.name, carryOverload);

  if (!lowSensoryMode) {
    fill(COL_TRANSITION_TITLE[0], COL_TRANSITION_TITLE[1], COL_TRANSITION_TITLE[2], 14);
    rect(cx, buttonY, TRANSITION_BUTTON_W + 18, TRANSITION_BUTTON_H + 10, 18);
  }
  fill(COL_TRANSITION_BUTTON[0], COL_TRANSITION_BUTTON[1], COL_TRANSITION_BUTTON[2], 245);
  rect(cx, buttonY, TRANSITION_BUTTON_W, TRANSITION_BUTTON_H, 16);
  noFill();
  stroke(COL_TRANSITION_LINE[0], COL_TRANSITION_LINE[1], COL_TRANSITION_LINE[2], 95);
  strokeWeight(1.2);
  rect(cx, buttonY, TRANSITION_BUTTON_W, TRANSITION_BUTTON_H, 16);
  noStroke();

  fill(COL_TRANSITION_TEXT[0], COL_TRANSITION_TEXT[1], COL_TRANSITION_TEXT[2]);
  textSize(17);
  textStyle(BOLD);
  text("Press ENTER to Continue", cx, buttonY);
  textStyle(NORMAL);

  if (lowSensoryMode) {
    fill(COL_TRANSITION_SUB[0], COL_TRANSITION_SUB[1], COL_TRANSITION_SUB[2], 150);
    textSize(10);
    text("Low Sensory Mode [ON]", cx, buttonY + 38);
  }

  rectMode(CORNER);
}

function drawTransitionInfoLine(cx, y, nextStageName, carryOverload) {
  let leftText = "Next: " + nextStageName + "  ·  ";
  let rightText = "Overload " + floor(carryOverload) + "/" + overloadMax;

  textStyle(NORMAL);
  textSize(12.5);
  textAlign(LEFT, CENTER);

  let leftW = textWidth(leftText);
  let rightW = textWidth(rightText);
  let startX = cx - (leftW + rightW) / 2;

  fill(COL_TRANSITION_SUB[0], COL_TRANSITION_SUB[1], COL_TRANSITION_SUB[2]);
  text(leftText, startX, y);

  fill(COL_TRANSITION_WARN[0], COL_TRANSITION_WARN[1], COL_TRANSITION_WARN[2]);
  text(rightText, startX + leftW, y);

  textAlign(CENTER, CENTER);
}

// ===================== WIN SCREEN =====================
function drawWinScreen() {
  background(COL_BG[0], COL_BG[1], COL_BG[2]);

  if (!endSoundPlayed) {
    playWinSound();
    stopAmbient();
    setTitleAmbientMix("play", 0.8);
    endSoundPlayed = true;
  }

  let cx = CANVAS_W / 2;
  let cy = CANVAS_H / 2;
  let t = frameCount;

  // --- Background: gentle rising particles (moments of warmth) ---
  if (!lowSensoryMode) {
    noStroke();
    for (let i = 0; i < 30; i++) {
      let px = (i * 137 + 50) % CANVAS_W;
      let py = CANVAS_H - ((t * 0.3 + i * 47) % (CANVAS_H + 40));
      let a = map(py, CANVAS_H, 0, 20, 4);
      let sz = map(py, CANVAS_H, 0, 3, 1.5);
    }
   
  }

  // --- Centered panel ---
  let panelW = 500;
  let panelH = 360;
  let panelX = cx - panelW / 2;
  let panelY = cy - panelH / 2;

  noStroke(); rectMode(CORNER);
  // Panel shadow
  if (!lowSensoryMode) {
    fill(10, 20, 12, 60);
    rect(panelX + 4, panelY + 4, panelW, panelH, 18);
  }
  // Panel body
  fill(18, 32, 22, 225);
  rect(panelX, panelY, panelW, panelH, 18);
  // Top accent line
  if (!lowSensoryMode) {
    fill(255, 215, 90, 25);
    rect(panelX + 80, panelY, panelW - 160, 2, 1);
  }

  // --- Content (vertically centered within panel) ---
  let contentTop = cy - 110;

  // Title
  fill(255, 215, 90);
  textSize(38);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Day Complete", cx, contentTop);

  // Subtitle
  textStyle(NORMAL);
  textSize(15);
  fill(200, 215, 205);
  text("You made it through all three stages.", cx, contentTop + 48);

  // Overwhelmed count
  textSize(12);
  fill(160, 195, 170);
  if (totalRespawnsUsed === 0) {
    text("Not overwhelmed once — but notice how hard it still felt.", cx, contentTop + 82);
  } else {
    text("Overwhelmed " + totalRespawnsUsed + " time(s) along the way.", cx, contentTop + 82);
  }

  // Divider
  noStroke();
  fill(255, 255, 255, 15);
  rectMode(CENTER);
  rect(cx, contentTop + 112, 300, 1);
  rectMode(CORNER);

  // Core message — short, impactful
  textSize(13);
  fill(180, 210, 185);
  textStyle(ITALIC);
  text("For many TBI survivors, this effort is part of every single day.", cx, contentTop + 142);
  textStyle(NORMAL);
  textSize(12);
  fill(160, 180, 168);
  text("It doesn't mean they can't do things. It means everything costs more.", cx, contentTop + 166);

  // Continue prompt
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Press ENTER to Play Again", cx, contentTop + 218);
  textStyle(NORMAL);
}

// ===================== LOSE SCREEN =====================
function drawLoseScreen() {
  background(COL_BG[0], COL_BG[1], COL_BG[2]);

  if (!endSoundPlayed) {
    playLoseSound();
    stopAmbient();
    setTitleAmbientMix("play", 0.8);
    endSoundPlayed = true;
  }

  let cx = CANVAS_W / 2;
  let cy = CANVAS_H / 2;
  let t = frameCount;

  // --- Background: slow falling particles (weight, heaviness) ---
  if (!lowSensoryMode) {
    noStroke();
    for (let i = 0; i < 20; i++) {
      let px = (i * 151 + 30) % CANVAS_W;
      let py = (t * 0.15 + i * 53) % (CANVAS_H + 20);
      let a = map(py, 0, CANVAS_H, 4, 16);
      fill(200, 120, 120, a);
      ellipse(px, py, 2, 2);
    }
    // Dull pressure glow behind panel
    fill(70, 30, 30, 18);
    ellipse(cx, cy, 500, 380);
  }

  // --- Centered panel ---
  let panelW = 500;
  let panelH = 330;
  let panelX = cx - panelW / 2;
  let panelY = cy - panelH / 2;

  noStroke(); rectMode(CORNER);
  // Panel shadow
  if (!lowSensoryMode) {
    fill(15, 8, 8, 60);
    rect(panelX + 4, panelY + 4, panelW, panelH, 18);
  }
  // Panel body
  fill(30, 18, 20, 225);
  rect(panelX, panelY, panelW, panelH, 18);
  // Top accent line (muted red)
  if (!lowSensoryMode) {
    fill(220, 100, 100, 22);
    rect(panelX + 80, panelY, panelW - 160, 2, 1);
  }

  // --- Content (vertically centered within panel) ---
  let contentTop = cy - 100;

  // Title
  fill(255, 130, 130);
  textSize(38);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Overwhelmed", cx, contentTop);

  // Subtitle
  textStyle(NORMAL);
  textSize(15);
  fill(210, 195, 200);
  text("The sensory input became too much to keep going.", cx, contentTop + 46);

  // Divider
  noStroke();
  fill(255, 255, 255, 12);
  rectMode(CENTER);
  rect(cx, contentTop + 80, 300, 1);
  rectMode(CORNER);

  // Core message — compassionate, brief
  textSize(13);
  fill(200, 170, 175);
  textStyle(ITALIC);
  text("Needing to stop is not failure — it's your brain protecting itself.", cx, contentTop + 110);
  textStyle(NORMAL);
  textSize(12);
  fill(180, 155, 160);
  text("The struggle you felt is real. So is the resilience it takes to try again.", cx, contentTop + 136);

  // Continue prompt
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Press ENTER to Try Again", cx, contentTop + 195);
  textStyle(NORMAL);
}

// ===================== GAME UPDATE =====================
function updateGame() {
  let s = currentStageData;

  // --- PLAYER MOVEMENT (cognitive fatigue) [2] ---
  let speed = baseSpeed * map(overload, 0, overloadMax, 1.0, 0.5);

  let newX = playerX;
  let newY = playerY;
  if (keyIsDown(LEFT_ARROW)) newX -= speed;
  if (keyIsDown(RIGHT_ARROW)) newX += speed;
  if (keyIsDown(UP_ARROW)) newY -= speed;
  if (keyIsDown(DOWN_ARROW)) newY += speed;

  // Attention drift [2]
  if (s.driftOn && overload > s.driftThreshold) {
    let drift = map(overload, s.driftThreshold, 100, 0.2, 1.0);
    newX += random(-drift, drift);
    newY += random(-drift, drift);
  }

  newX = constrain(newX, playerSize / 2 + 4, CANVAS_W - playerSize / 2 - 4);
  newY = constrain(
    newY,
    PLAY_TOP + playerSize / 2,
    PLAY_BOTTOM - playerSize / 2,
  );

  if (!hitsWall(newX, playerY)) playerX = newX;
  if (!hitsWall(playerX, newY)) playerY = newY;

  // --- MEMORY FADE ACTIVATION [1][2] ---
  if (!memoryActive && starsCollected() >= s.memoryFadeAfter) {
    memoryActive = true;
    showObjective = true;
    memoryTimer = s.memoryTimer;
  }

  if (memoryActive) {
    memoryTimer -= 1;
    if (memoryTimer <= 0) showObjective = false;
  } else {

    showObjective = true;
  }

  // --- SENSORY OVERLOAD [3] ---
  let overloadRate = s.overloadBase;

  for (let sz of stimulusZones) {
    if (inRect(playerX, playerY, sz.x, sz.y, sz.w, sz.h)) {
      overloadRate += s.stimulusBonus;
    }
  }

  overload += overloadRate * OVERLOAD_RATE_MULT;

  // Calm Zone recovery [3]
 // Calm Zone now recharges Calm Ability instead of directly healing overload
  for (let cz of calmZones) {
    if (inRect(playerX, playerY, cz.x, cz.y, cz.w, cz.h)) {
      if (calmAbilityCharges < calmAbilityMax && calmSoundCooldown <= 0) {
        calmAbilityCharges = calmAbilityMax;
        playTone(262, 0.6, "sine", 0.03);
        calmSoundCooldown = 90;
      }
    }
  }
  calmSoundCooldown--;

  // Calm Ability effect
  if (calmAbilityTimer > 0) {
    overload -= 0.9;
    calmAbilityTimer--;
  }

  if (calmAbilityCooldown > 0) {
    calmAbilityCooldown--;
  }

  overload = constrain(overload, 0, overloadMax);

  // Overload audio warning
  if (overload > 75 && overloadWarnCooldown <= 0) {
    playTone(180, 0.2, "sawtooth", 0.03);
    overloadWarnCooldown = 50;
  }
  overloadWarnCooldown--;

  updateAmbient();

  // --- CHECKPOINT AUTO-ADVANCE ---
  for (let i = checkpoints.length - 1; i > checkpointIndex; i--) {
    if (starsCollected() >= checkpoints[i].starsReq) {
      setCheckpoint(i);
      break;
    }
  }

  // --- EMOTIONAL FRUSTRATION [3] ---
  if (s.emotionsOn && overload > s.emotionThreshold && emotionCooldown <= 0) {
    emotionMsg = emotionalMessages[floor(random(emotionalMessages.length))];
    emotionTimer = 150;
    emotionCooldown = 300;
  }
  if (emotionTimer > 0) emotionTimer--;
  if (emotionCooldown > 0) emotionCooldown--;

  // --- INTRUSIVE DISTRACTIONS [3] ---
  updateDistractions();

  // --- COLLECT STARS ---
  for (let i = stars.length - 1; i >= 0; i--) {
    let st = stars[i];
    let d = dist(playerX, playerY, st.x, st.y);
    if (d < playerSize / 2 + st.size / 2 + 5) {
      stars.splice(i, 1);
      playCollectSound();
      addParticles(st.x, st.y, [255, 220, 100]);
      if (memoryActive) {
        showObjective = true;
        memoryTimer = max(memoryTimer, currentStageData.memoryRefresh || 30);
      }
    }
  }

  updateParticles();
  if (checkpointToastTimer > 0) checkpointToastTimer--;
  if (stageIntroTimer > 0) stageIntroTimer--;

  updateStageProgression();
}

// ===================== DISTRACTIONS =====================
function updateDistractions() {
  if (lowSensoryMode) return;
  let s = currentStageData;
  if (
    s.distractionsOn &&
    overload > s.distractionThreshold &&
    distractCooldown <= 0
  ) {
    distractions.push({
      x: random(50, CANVAS_W - 50),
      y: random(PLAY_TOP + 30, PLAY_BOTTOM - 30),
      w: random(15, 50),
      h: random(12, 35),
      life: floor(random(8, 18)),
      maxLife: floor(random(8, 18)),
    });
    distractCooldown = floor(
      map(overload, s.distractionThreshold, 100, 70, 15),
    );
  }
  if (distractCooldown > 0) distractCooldown--;
  for (let i = distractions.length - 1; i >= 0; i--) {
    distractions[i].life--;
    if (distractions[i].life <= 0) distractions.splice(i, 1);
  }
}

function drawDistractions() {
  if (lowSensoryMode) return;
  noStroke();
  for (let d of distractions) {
    let alpha = map(d.life, 0, d.maxLife, 0, 28);
    fill(255, 255, 255, alpha);
    rectMode(CORNER);
    rect(d.x, d.y, d.w, d.h, 2);
  }
}

// ===================== STAGE PROGRESSION =====================
function updateStageProgression() {
  if (stars.length === 0) {
    if (currentStage >= stages.length - 1) {
      endSoundPlayed = false;
      gameState = STATE_WIN;
    } else {
      endSoundPlayed = false;
      gameState = STATE_STAGE_TRANSITION;
    }
    return;
  }

  if (overload >= overloadMax) {
    if (respawnsLeft > 0) {
      respawnsLeft--;
      totalRespawnsUsed++;
      respawnAtCheckpoint();
      overload = currentStageData.respawnOverload;
      showObjective = true;
      memoryTimer = max(currentStageData.memoryRecall, 70);
      playRespawnSound();
    } else {
      endSoundPlayed = false;
      gameState = STATE_LOSE;
    }
  }
}

function respawnAtCheckpoint() {
  let cp = checkpoints[checkpointIndex];
  playerX = cp.x;
  playerY = cp.y;
}

function setCheckpoint(idx) {
  if (idx <= checkpointIndex) return;
  checkpointIndex = idx;
  checkpointToastTimer = 140;
  playCheckpointSound();
}

function advanceStage() {
  let nextIndex = currentStage + 1;
  loadStage(nextIndex, overload);
  endSoundPlayed = false;
  gameState = STATE_PLAY;
  setTitleAmbientMix("play", 0.8);
  startAmbient();
}

// ===================== PARTICLES =====================
function addParticles(x, y, col) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-2.5, 2.5),
      vy: random(-2.5, 2.5),
      life: 35,
      maxLife: 35,
      col: col,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let alpha = map(p.life, 0, p.maxLife, 0, 220);
    fill(p.col[0], p.col[1], p.col[2], alpha);
    let sz = map(p.life, 0, p.maxLife, 1, 5);
    ellipse(p.x, p.y, sz, sz);
  }
}

// ===================== STAGE RENDERING =====================
function drawStage() {
 if (currentStage === 0) {
  drawStageOneScene();
} else if (currentStage === 1) {
  drawStageTwoScene();
} else if (currentStage === 2) {
  drawStageThreeScene();
} else {
  if (!lowSensoryMode) {
    drawFloorTiles();
  } else {
    drawAreaLabels();
  }
}
  

  // Stimulus zones [3]
  noStroke();
  for (let sz of stimulusZones) {
    if (currentStage === 0) {
      // Stage 1 uses TV image instead of abstract red block
      if (lowSensoryMode) {
        noFill();
        stroke(200, 100, 80, 80);
        strokeWeight(2);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
        noStroke();
      } else {
        // very subtle red tint only, so the TV remains the main visual cue
        fill(COL_STIMULUS[0], COL_STIMULUS[1], COL_STIMULUS[2], 18);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
      }
      continue;
    }

    if (currentStage === 1) {
      // Stage 2 uses real objects (phone / car), so hide the large abstract red blocks
      if (lowSensoryMode) {
        noFill();
        stroke(200, 100, 80, 60);
        strokeWeight(2);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
        noStroke();
      } else {
        // very light tint only
        fill(COL_STIMULUS[0], COL_STIMULUS[1], COL_STIMULUS[2], 12);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
      }
      continue;
    }

    if (currentStage === 2) {
      // Stage 3 uses real objects (computer / printer), so hide large abstract red blocks
      if (lowSensoryMode) {
        noFill();
        stroke(200, 100, 80, 60);
        strokeWeight(2);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
        noStroke();
      } else {
        fill(COL_STIMULUS[0], COL_STIMULUS[1], COL_STIMULUS[2], 12);
        rectMode(CORNER);
        rect(sz.x, sz.y, sz.w, sz.h, 4);
      }
      continue;
    }

    if (lowSensoryMode) {
      noFill();
      stroke(200, 100, 80, 80);
      strokeWeight(2);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
      noStroke();
      fill(200, 100, 80, 80);
      textAlign(CENTER, CENTER);
      textSize(9);
      text("noise", sz.x + sz.w / 2, sz.y + sz.h / 2);
    } else {
      let pulse = sin(frameCount * 0.05) * 10;
      fill(COL_STIMULUS[0], COL_STIMULUS[1], COL_STIMULUS[2], 30 + pulse);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
      fill(COL_STIMULUS[0], 100, 80, 60);
      textAlign(CENTER, CENTER);
      textSize(9);
      text("noise", sz.x + sz.w / 2, sz.y + sz.h / 2);
    }
  }

// Calm Zones [3]
if (currentStage !== 0 && currentStage !== 1 && currentStage !== 2) {
  for (let cz of calmZones) {
    drawCalmZone(cz);
  }
}

 // Walls / barriers
rectMode(CORNER);
imageMode(CORNER);
noStroke();

for (let w of walls) {
  let wallTexture = null;
  let borderCol = [60, 60, 60];

  // Stage 1 = Home
  if (currentStage === 0) {
    wallTexture = woodImg;
    borderCol = [70, 45, 25];
  }
  // Stage 2 = Outside / Store
  else if (currentStage === 1) {
    wallTexture = redWallImg;
    borderCol = [110, 40, 30];
  }
  // Stage 3 = Office
  else if (currentStage === 2) {
    wallTexture = officeWallImg;
    borderCol = [70, 70, 85];
  }

  if (wallTexture) {
    // shadow
    tint(255, 90);
    image(wallTexture, w.x + 3, w.y + 3, w.w, w.h);

    // main wall
    tint(255, 255);
    image(wallTexture, w.x, w.y, w.w, w.h);

    // border
    noFill();
    stroke(borderCol[0], borderCol[1], borderCol[2]);
    strokeWeight(1);
    rect(w.x, w.y, w.w, w.h, 3);
    noStroke();
  } else {
    fill(COL_WALL_SH[0], COL_WALL_SH[1], COL_WALL_SH[2], 80);
    rect(w.x + 3, w.y + 3, w.w, w.h, 3);
    fill(COL_WALL[0], COL_WALL[1], COL_WALL[2]);
    rect(w.x, w.y, w.w, w.h, 3);
  }
}

noTint();
  
// Decorations
rectMode(CORNER);
imageMode(CORNER);
noStroke();

for (let d of decorations) {
  let decoImg = null;

  // default display size = original collision box
  let drawX = d.x;
  let drawY = d.y;
  let drawW = d.w;
  let drawH = d.h;

  // Stage 1 home furniture mapping
  if (currentStage === 0) {
    // Nightstand
    if (d.x === 170 && d.y === 210) {
      decoImg = nightstandImg;
      drawW = 32;
      drawH = 28;
    }
    // TV stand
    else if (d.x === 362 && d.y === 348) {
      decoImg = tvstandImg;
      drawX = 355;
      drawY = 336;
      drawW = 100;
      drawH = 46;
    }
   // Couch
else if (d.x === 380 && d.y === 460) {
  decoImg = couchImg;
  drawX = 350;
  drawY = 430;
  drawW = 180;
  drawH = 95;
}

 // Kitchen counter
else if (d.x === 520 && d.y === 100) {
  decoImg = kitchenImg;
  drawX = 500;
  drawY = 82;
  drawW = 180;
  drawH = 62;
}
    // Kitchen table
    else if (d.x === 560 && d.y === 280) {
      decoImg = kitchentableImg;
      drawX = 548;
      drawY = 268;
      drawW = 98;
      drawH = 74;
    }
  // Shoe rack
else if (d.x === 870 && d.y === 460) {
  decoImg = shoerackImg;
  drawX = 850;
  drawY = 445;
  drawW = 92;
  drawH = 60;
}
   // Bookshelf
else if (d.x === 30 && d.y === 310) {
  decoImg = bookshelfImg;
  drawX = 22;
  drawY = 300;
  drawW = 52;
  drawH = 108;
}
  }else if (currentStage === 1) {
  // Fire hydrant
  if (d.x === 130 && d.y === 112) {
    decoImg = firehydrantImg;
    drawX = 122;
    drawY = 104;
    drawW = 30;
    drawH = 42;
  }
  // Hedge / bush row
  else if (d.x === 30 && d.y === 420) {
    decoImg = bushImg;
    drawX = 20;
    drawY = 410;
    drawW = 100;
    drawH = 50;
  }
  // Newspaper box
  else if (d.x === 275 && d.y === 300) {
    decoImg = newspaperImg;
    drawX = 265;
    drawY = 292;
    drawW = 40;
    drawH = 36;
  }
  // Bench seat placed just below the calm zone
  else if (d.x === 244 && d.y === 544) {
    decoImg = benchImg;
    drawX = 228;
    drawY = 530;
    drawW = 92;
    drawH = 36;
  }
  // Store shelf end-cap left
  else if (d.x === 430 && d.y === 140) {
    decoImg = storeImg;
    drawX = 420;
    drawY = 130;
    drawW = 58;
    drawH = 70;
  }
  // Store display island
  else if (d.x === 560 && d.y === 390) {
    decoImg = storeImg;
    drawX = 548;
    drawY = 380;
    drawW = 74;
    drawH = 58;
  }
  // Store shelf end-cap right
  else if (d.x === 745 && d.y === 250) {
    decoImg = storeImg;
    drawX = 734;
    drawY = 240;
    drawW = 60;
    drawH = 70;
  }
  // Shopping cart
  else if (d.x === 460 && d.y === 300) {
    decoImg = shoppingcartImg;
    drawX = 450;
    drawY = 292;
    drawW = 42;
    drawH = 34;
  }
  // Pharmacy counter
  else if (d.x === 875 && d.y === 400) {
    decoImg = storeImg;
    drawX = 860;
    drawY = 392;
    drawW = 100;
    drawH = 42;
  }
  // Trash can outside
  else if (d.x === 320 && d.y === 150) {
    decoImg = transhcanImg;
    drawX = 312;
    drawY = 144;
    drawW = 32;
    drawH = 36;
  }
}

  if (decoImg) {
    image(decoImg, drawX, drawY, drawW, drawH);
  } else {
    fill(d.col[0], d.col[1], d.col[2]);
    rect(d.x, d.y, d.w, d.h, 3);
  }
}

  // Checkpoints
//  for (let i = 0; i < checkpoints.length; i++) {
  //  if (starsCollected() >= checkpoints[i].starsReq) {
    //  drawCheckpoint(checkpoints[i], i === checkpointIndex);
    //}
  //}

  // Task markers — with fading awareness [2]
  noStroke();
  for (let s of stars) {
    let starAlpha = 255;
    if (
      currentStageData.fadingAwarenessOn &&
      overload > 40 &&
      !lowSensoryMode
    ) {
      let d = dist(playerX, playerY, s.x, s.y);
      starAlpha = map(d, 80, 350, 255, 25);
      starAlpha = constrain(starAlpha, 25, 255);
    }

    // Stage 1 uses real images instead of stars
    if (currentStage === 0) {
      let taskImg = getStageOneTaskImage(s.label);

      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER);
        image(taskImg, s.x, s.y, 34, 34);
        noTint();
      } else {
        fill(COL_STAR[0], COL_STAR[1], COL_STAR[2], starAlpha);
        ellipse(s.x, s.y, s.size * 1.6, s.size * 1.6);
      }

      drawTaskLabel(s, starAlpha);
      continue;
    }

    // Stage 2 uses real images instead of stars
    if (currentStage === 1) {
      let taskImg = getStageTwoTaskImage(s.label);

      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER);
        image(taskImg, s.x, s.y, 36, 36);
        noTint();
      } else {
        fill(COL_STAR[0], COL_STAR[1], COL_STAR[2], starAlpha);
        ellipse(s.x, s.y, s.size * 1.6, s.size * 1.6);
      }

      drawTaskLabel(s, starAlpha);
      continue;
    }

    if (currentStage === 2) {
      let taskImg = getStageThreeTaskImage(s.label);
      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER);
        image(taskImg, s.x, s.y, 38, 38);
        noTint();
      } else {
        fill(COL_STAR[0], COL_STAR[1], COL_STAR[2], starAlpha);
        ellipse(s.x, s.y, s.size * 1.6, s.size * 1.6);
      }
      drawTaskLabel(s, starAlpha);
      continue;
    }

    // Other stages keep original stars
    if (lowSensoryMode) {
      fill(COL_STAR[0], COL_STAR[1], COL_STAR[2]);
      ellipse(s.x, s.y, s.size * 1.6, s.size * 1.6);
    } else {
      let glow = sin(frameCount * 0.06 + s.x) * 3;
      fill(
        COL_STAR_GLOW[0],
        COL_STAR_GLOW[1],
        COL_STAR_GLOW[2],
        40 * (starAlpha / 255)
      );
      ellipse(s.x, s.y, s.size * 2.5 + glow, s.size * 2.5 + glow);

      fill(COL_STAR[0], COL_STAR[1], COL_STAR[2], starAlpha);
      drawStarShape(s.x, s.y, s.size * 0.4, s.size, 5);
    }

    drawTaskLabel(s, starAlpha);
  }

  drawPlayer();
  drawCheckpointMarker();

  if (!lowSensoryMode) {
    drawParticles();
  }

  drawDistractions();

  // Overload haze [3]
  if (overload > 50 && !lowSensoryMode) {
    noStroke();
    fill(255, 255, 255, map(overload, 50, 100, 0, 50));
    rectMode(CORNER);
    rect(0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);
  }

  drawEmotionMessage();
}

function drawFloorTiles() {
  noStroke();
  rectMode(CORNER);
  let t = currentStageData.bgTint;
  fill(t[0], t[1], t[2], t[3]);
  rect(0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);

  // Per-stage floor grid style
  let stage = currentStageData.stageNum;
  if (stage === 1) {
    // Warm, wide tiles — homey feel
    stroke(60, 52, 48, 18);
    strokeWeight(1);
    let tileSize = 52;
    for (let x = 0; x < CANVAS_W; x += tileSize) {
      line(x, PLAY_TOP, x, PLAY_BOTTOM);
    }
    for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += tileSize) {
      line(0, y, CANVAS_W, y);
    }
  } else if (stage === 2) {
    // Tighter, cooler grid — commercial/outdoor
    stroke(48, 55, 62, 22);
    strokeWeight(1);
    let tileSize = 36;
    for (let x = 0; x < CANVAS_W; x += tileSize) {
      line(x, PLAY_TOP, x, PLAY_BOTTOM);
    }
    for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += tileSize) {
      line(0, y, CANVAS_W, y);
    }
  } else {
    // Dense, cool blue grid — institutional / fatiguing
    stroke(42, 44, 68, 25);
    strokeWeight(1);
    let tileSize = 30;
    for (let x = 0; x < CANVAS_W; x += tileSize) {
      line(x, PLAY_TOP, x, PLAY_BOTTOM);
    }
    for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += tileSize) {
      line(0, y, CANVAS_W, y);
    }
  }
  noStroke();

  // Subtle stage name watermark at bottom
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 12);
  textSize(11);
  text(currentStageData.subtitle, CANVAS_W / 2, PLAY_BOTTOM - 12);
  drawAreaLabels();
}

function drawAreaLabels() {
  if (!currentStageData.areaLabels) return;
  textAlign(CENTER, CENTER);
  for (let label of currentStageData.areaLabels) {
    fill(255, 255, 255, lowSensoryMode ? 45 : 20);
    textSize(10);
    text(label.text, label.x, label.y);
  }
}

function drawTaskLabel(task, alpha) {
  let d = dist(playerX, playerY, task.x, task.y);
  let visible = d < 130 || showObjective || !memoryActive;
  if (!visible) return;

  let labelAlpha = lowSensoryMode ? 210 : min(alpha, d < 130 ? 210 : 90);
  let labelX = task.x + (task.labelDx || 0);
  let labelY = task.y + (task.labelDy !== undefined ? task.labelDy : -task.size - 12);
  textAlign(CENTER, CENTER);
  fill(255, 240, 200, labelAlpha);
  noStroke();
  textSize(9.5);
  text(task.label, labelX, labelY);
}

function drawCalmZone(cz) {
  rectMode(CORNER);
  noStroke();
  let pulse = 0;
  if (currentStage >= 1 && !lowSensoryMode) {
    pulse = sin(frameCount * 0.07) * 4;
  }
  fill(COL_CALM[0], COL_CALM[1] + 20, COL_CALM[2], 20);
  rect(
    cz.x - 8 - pulse,
    cz.y - 8 - pulse,
    cz.w + 16 + pulse * 2,
    cz.h + 16 + pulse * 2,
    14,
  );
  fill(COL_CALM[0], COL_CALM[1], COL_CALM[2], 180);
  rect(cz.x, cz.y, cz.w, cz.h, 10);
  fill(COL_CALM[0] + 30, COL_CALM[1] + 20, COL_CALM[2] + 20, 60);
  rect(cz.x + 6, cz.y + 6, cz.w - 12, cz.h - 12, 6);
  noFill();
  stroke(180, 240, 200, 120);
  strokeWeight(2);
  rect(cz.x - 2, cz.y - 2, cz.w + 4, cz.h + 4, 12);
  noStroke();
  fill(220, 255, 230);
  textSize(10);
  textStyle(BOLD);
  text("Calm", cz.x + cz.w / 2, cz.y + cz.h / 2 - 1);
  textStyle(NORMAL);
  if (inRect(playerX, playerY, cz.x, cz.y, cz.w, cz.h)) {
    fill(180, 255, 210);
    textSize(9);
    text("Recovering...", cz.x + cz.w / 2, cz.y + cz.h / 2 + 10);
  }
}

function drawPlayer() {
  let px = playerX;
  let py = playerY;
  noStroke();
  fill(12, 12, 25, 60);
  ellipse(px + 2, py + 10, 16, 6);
  fill(COL_PLAYER[0], COL_PLAYER[1], COL_PLAYER[2]);
  ellipse(px, py + 2, 18, 22);
  fill(COL_PLAYER_HEAD[0], COL_PLAYER_HEAD[1], COL_PLAYER_HEAD[2]);
  ellipse(px, py - 9, 16, 16);
  fill(50, 50, 70);
  ellipse(px - 2.5, py - 10, 2.5, 2.5);
  ellipse(px + 2.5, py - 10, 2.5, 2.5);

  stroke(50, 50, 70);
  strokeWeight(1.5);
  noFill();
  if (overload < 30) {
    line(px - 3, py - 5, px + 3, py - 5);
  } else if (overload < 55) {
    noStroke();
    fill(50, 50, 70);
    ellipse(px, py - 4.5, 3.2, 3.2);
    stroke(50, 50, 70);
    strokeWeight(1.2);
    line(px - 5.2, py - 14.2, px - 1.8, py - 15.2);
    line(px + 1.8, py - 15.2, px + 5.2, py - 14.2);
  } else if (overload < 80) {
    stroke(50, 50, 70);
    strokeWeight(1.6);
    arc(px, py - 3.8, 6, 4, PI, TWO_PI);
    strokeWeight(1.4);
    line(px - 5.5, py - 12.8, px - 1.5, py - 14.2);
    line(px + 1.5, py - 14.2, px + 5.5, py - 12.8);
  } else {
    stroke(50, 50, 70);
    strokeWeight(1.4);
    let mouthUp = 2;
    rectMode(CENTER);
    rect(px, py - 2.0 - mouthUp, 7.5, 3.2, 1);
    line(px - 2.5, py - 3.4 - mouthUp, px - 2.5, py - 0.6 - mouthUp);
    line(px, py - 3.4 - mouthUp, px, py - 0.6 - mouthUp);
    line(px + 2.5, py - 3.4 - mouthUp, px + 2.5, py - 0.6 - mouthUp);
    strokeWeight(1.6);
    line(px - 5.5, py - 12.8, px - 1.5, py - 14.2);
    line(px + 1.5, py - 14.2, px + 5.5, py - 12.8);
    rectMode(CORNER);
  }
  noStroke();
}

function drawCheckpointMarker() {
  let cp = checkpoints[checkpointIndex];
  fill(255, 255, 255, 22);
  noStroke();
  ellipse(cp.x, cp.y, 28, 28);
  fill(255, 255, 255, 45);
  textSize(8);
  text("CP", cp.x, cp.y);
}

function drawVignette() {
  let intensity = map(overload, 45, 100, 0, 200);
  noStroke();
  let depth = 70;
  for (let i = 0; i < depth; i++) {
    let a = map(i, 0, depth, intensity, 0);
    fill(15, 15, 30, a);
    rectMode(CORNER);
    rect(0, PLAY_TOP + i, CANVAS_W, 1);
  }
  for (let i = 0; i < depth; i++) {
    let a = map(i, 0, depth, intensity, 0);
    fill(15, 15, 30, a);
    rect(0, PLAY_BOTTOM - i, CANVAS_W, 1);
  }
  for (let i = 0; i < depth; i++) {
    let a = map(i, 0, depth, intensity, 0);
    fill(15, 15, 30, a);
    rect(i, PLAY_TOP, 1, PLAY_BOTTOM - PLAY_TOP);
  }
  for (let i = 0; i < depth; i++) {
    let a = map(i, 0, depth, intensity, 0);
    fill(15, 15, 30, a);
    rect(CANVAS_W - i, PLAY_TOP, 1, PLAY_BOTTOM - PLAY_TOP);
  }
}

function drawEmotionMessage() {
  if (emotionTimer <= 0 || emotionMsg === "") return;
  let alpha = 180;
  if (emotionTimer > 130) alpha = map(emotionTimer, 150, 130, 0, 180);
  if (emotionTimer < 30) alpha = map(emotionTimer, 30, 0, 180, 0);

  let msgY = PLAY_TOP + 55;
  fill(255, 255, 255, alpha * 0.7);
  noStroke();
  rectMode(CENTER);
  let tw = textWidth(emotionMsg) + 95;
  rect(CANVAS_W / 2, msgY, tw, 28, 8);
  rectMode(CORNER);
  fill(255, 220, 200, alpha * 1.5);
  textSize(13);
  textStyle(ITALIC);
  text(emotionMsg, CANVAS_W / 2, msgY);
  textStyle(NORMAL);
}

function drawStageIntroBanner() {
  if (stageIntroTimer <= 0) return;

  let alpha =
    stageIntroTimer > 110
      ? map(stageIntroTimer, 150, 110, 0, 230)
      : map(stageIntroTimer, 110, 0, 230, 0);
  let bannerX = CANVAS_W / 2;
  let bannerY = PLAY_TOP + 82;
  let titleText =
    "Stage " +
    (currentStage + 1) +
    " of " +
    stages.length +
    " — " +
    currentStageName();

  textStyle(BOLD);
  textSize(17);
  let titleW = textWidth(titleText);
  textStyle(NORMAL);
  textSize(11.5);
  let introW = textWidth(currentStageData.introText);
  let bannerW = max(390, titleW + 76, introW + 76);
  let bannerH = 84;
  let titleY = bannerY - 12;
  let introY = bannerY + 12;

  rectMode(CENTER);
  noStroke();
  fill(18, 22, 42, alpha * 0.82);
  rect(bannerX, bannerY, bannerW, bannerH, 12);

  fill(255, 214, 90, alpha);
  textSize(17);
  textStyle(BOLD);
  text(titleText, bannerX, titleY);

  fill(215, 220, 232, alpha);
  textSize(11.5);
  textStyle(NORMAL);
  text(currentStageData.introText, bannerX, introY);

  rectMode(CORNER);
}

// ===================== HUD =====================
function drawHUD() {
  drawPanel(0, 0, CANVAS_W, HUD_TOP, 0);

  let s = currentStageData;
  textAlign(LEFT, CENTER);

  // Stage name
  fill(255, 210, 75);
  textSize(12);
  textStyle(BOLD);
  text(currentStageName(), 20, 16);

  // Stage progress
  fill(COL_HUD_TEXT[0], COL_HUD_TEXT[1], COL_HUD_TEXT[2], 170);
  textSize(10);
  textStyle(NORMAL);
  text("Stage " + s.stageNum + " of " + stages.length, 20, 33);

  // Respawns
  fill(COL_HUD_TEXT[0], COL_HUD_TEXT[1], COL_HUD_TEXT[2]);
  textSize(10.5);
  text("Resets left: " + (respawnsLeft + 1), 20, 50);

  // Calm Ability 
  textSize(10.5);
  fill(180, 200, 255);
  text("Calm (J): " + calmAbilityCharges, 20, 66);

  // Center HUD (objective)
  textAlign(CENTER, CENTER);
  let hudTextX = CANVAS_W / 2;
  let hudTextY = HUD_TOP / 2 + 1;

  // Objective (Memory Fade)
  if (showObjective) {
    fill(255);
    textSize(16);
    textStyle(BOLD);
    text(
      objective + "  (" + starsCollected() + "/" + s.starsNeeded + " tasks)",
      hudTextX,
      hudTextY,
    );
    textStyle(NORMAL);
  }

  // Hint text
  textSize(10.5);
  fill(180, 180, 200, 80);
  if (memoryActive && !showObjective) {
    text(s.hintMemory, hudTextX, hudTextY);
  }

  drawOverloadBar();
  drawCheckpointToast();
}
function drawOverloadBar() {
  let barX = CANVAS_W - 200;
  let barY = 10;
  let barW = 160;
  let barH = 14;

  textAlign(LEFT, CENTER);
  fill(COL_HUD_TEXT[0], COL_HUD_TEXT[1], COL_HUD_TEXT[2]);
  textSize(11);
  text("Overload", barX, barY + barH + 14);

  rectMode(CORNER);
  noStroke();
  fill(60, 55, 80);
  rect(barX, barY, barW, barH, 5);

  let w = map(overload, 0, overloadMax, 0, barW - 4);
  let r = map(overload, 0, overloadMax, 80, 255);
  let g = map(overload, 0, overloadMax, 190, 50);
  if (w > 0) {
    let fillX = barX + 2;
    let fillY = barY + 2;
    let fillH = barH - 4;
    let fillRadius = min(3, w / 2, fillH / 2);
    fill(r, g, 60);
    rect(fillX, fillY, w, fillH, fillRadius);
  }

  noFill();
  stroke(120, 115, 140);
  strokeWeight(1);
  rect(barX, barY, barW, barH, 5);
  noStroke();

  if (overload > 75) {
    fill(255, 160, 160);
    textSize(10);
    text("Overstimulated!", barX, barY + barH + 28);
  } else if (calmZones.length > 0 && overload > 30) {
    fill(COL_CALM[0] + 60, COL_CALM[1] + 40, COL_CALM[2] + 40);
    textSize(10);
    text("Find a Calm Zone", barX, barY + barH + 28);
  }

  textAlign(CENTER, CENTER);
}

function drawCheckpointToast() {
  if (checkpointToastTimer > 0) {
    let cp = checkpoints[checkpointIndex];
    let alpha = map(checkpointToastTimer, 140, 0, 230, 0);
    fill(20, 55, 40, alpha * 0.7);
    rectMode(CENTER);
    rect(CANVAS_W / 2, PLAY_BOTTOM - 30, 240, 30, 8);
    fill(180, 255, 210, alpha);
    textSize(13);
    text("Checkpoint: " + cp.label, CANVAS_W / 2, PLAY_BOTTOM - 30);
    rectMode(CORNER);
  }
}

function returnToTitleScreen() {
  stopAmbient();
  if (!titleActive) {
    startTitleAmbient("title");
  } else {
    setTitleAmbientMix("title", 1.2);
  }
  gameState = STATE_START;
  endSoundPlayed = false;
  showHowToPlay = false;
  overload = 0;
  showObjective = true;
  memoryActive = false;
  memoryTimer = 999999;
  emotionMsg = "";
  emotionTimer = 0;
  emotionCooldown = 0;
  particles = [];
  distractions = [];
  distractCooldown = 0;
  checkpointToastTimer = 0;
  stageIntroTimer = 0;
}

// ===================== INPUT =====================
function keyPressed() {
  initAudio();

  // How to play toggle
  if (gameState === STATE_START && keyCode === 72) {
    showHowToPlay = !showHowToPlay;
    return;
  }

  // Exit how to play
  if (gameState === STATE_START && showHowToPlay && keyCode === ESCAPE) {
    showHowToPlay = false;
    return;
  }

  // Return to title
  if (keyCode === 82 && gameState !== STATE_START) {
    returnToTitleScreen();
    return;
  }

  // Low sensory mode (L)
  if (keyCode === 76) {
    lowSensoryMode = !lowSensoryMode;

    if (gameState === STATE_START)
      return;
  }

  // Block input when how-to-play is open
  if (gameState === STATE_START && showHowToPlay) {
    return;
  }

  // Enter key (start / next stage)
  if (keyCode === ENTER) {
    if (
      gameState === STATE_START ||
      gameState === STATE_WIN ||
      gameState === STATE_LOSE
    ) {
      stopAmbient();
      initGame();
      gameState = STATE_PLAY;
      if (!titleActive) {
        startTitleAmbient("play");
      } else {
        setTitleAmbientMix("play", 1.2);
      }
      startAmbient();
    } else if (gameState === STATE_STAGE_TRANSITION) {
      advanceStage();
    }
  }

  // Memory recall (M)
  if (gameState === STATE_PLAY && keyCode === 77 && memoryActive) {
    showObjective = true;
    memoryTimer = currentStageData.memoryRecall;
    playRecallSound();
  }

  // Calm Ability (J)
  if (gameState === STATE_PLAY && (key === "j" || key === "J")) {
    if (calmAbilityCharges > 0 && calmAbilityCooldown <= 0) {
      calmAbilityCharges--;
      calmAbilityTimer = 90;
      calmAbilityCooldown = 120;
      playTone(330, 0.2, "triangle", 0.05);
    }
  }
}

function mousePressed() {
  initAudio();

  if (gameState !== STATE_START) return;

  if (showHowToPlay) {
    if (
      howToPlayCloseBounds &&
      inRect(
        mouseX,
        mouseY,
        howToPlayCloseBounds.x,
        howToPlayCloseBounds.y,
        howToPlayCloseBounds.w,
        howToPlayCloseBounds.h,
      )
    ) {
      showHowToPlay = false;
      return;
    }

    if (
      howToPlayOverlayBounds &&
      !inRect(
        mouseX,
        mouseY,
        howToPlayOverlayBounds.x,
        howToPlayOverlayBounds.y,
        howToPlayOverlayBounds.w,
        howToPlayOverlayBounds.h,
      )
    ) {
      showHowToPlay = false;
    }
    return;
  }

  if (
    howToPlayButtonBounds &&
    inRect(
      mouseX,
      mouseY,
      howToPlayButtonBounds.x,
      howToPlayButtonBounds.y,
      howToPlayButtonBounds.w,
      howToPlayButtonBounds.h,
    )
  ) {
    showHowToPlay = true;
  }
}
