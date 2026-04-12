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
let nightstandImg,
  tvstandImg,
  couchImg,
  fridgeImg,
  kitchentableImg,
  shoerackImg,
  bookshelfImg;

//stage 2
let groceryImg, prescriptionImg, buscardImg;
let benchImg, phoneImg, carImg, background2Img;
let firehydrantImg,
  bushImg,
  newspaperImg,
  shoppingcartImg,
  transhcanImg,
  storeImg;

//stage 3
let computerImg, printerImg, sofaImg, coffeeImg, background3Img;
let communicateImg, flagImg, worknotesImg;
let WatercoolerImg, officedeskImg, recyclebinImg, cabinetImg, booksImg, npcImg;
// ===================== AUDIO (Web Audio API) =====================
let audioCtx = null;
let audioReady = false;
let ambientOsc = null;
let ambientGain = null;
let pressureOsc = null;
let pressureGain = null;
let ringNode = null; // white noise buffer source (replaces 4200 Hz sine)
let ringFilter = null;
let ringGain = null;
let zoneAudioNodes = [];

// Title screen ambient soundscape nodes
let titleDroneOsc = null;
let titleDroneGain = null;
let titleTinnitusNode = null; // white noise buffer source (replaces sine oscillator)
let titleTinnitusFilter = null;
let titleTinnitusGain = null;
let titlePulseOsc = null;
let titlePulseGain = null;
let titlePulseLfo = null;
let titlePulseLfoGain = null;
let titleActive = false;
let titleAmbientMode = "title";

const TITLE_AMBIENT_LEVELS = {
  title: { drone: 0.025, tinnitus: 0.008, pulse: 0.012, lfo: 0.008 },
  play: { drone: 0.032, tinnitus: 0.012, pulse: 0.018, lfo: 0.011 },
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

// --- White noise utility: creates a looping buffer of random samples ---
function createWhiteNoiseSource() {
  let bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
  let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  let data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

// --- Title screen ambient: layered soundscape conveying subtle TBI strain ---
// Layer 1: Low drone — persistent pressure / headache sensation
// Layer 2: Filtered white noise — soft tinnitus-like hiss (replaces high-pitch sine)
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
    ambientGain.gain.linearRampToValueAtTime(
      ambientGain.gain.value * duckTo,
      now + 0.03,
    );
    ambientGain.gain.linearRampToValueAtTime(
      map(overload, 0, overloadMax, 0.015, 0.08),
      releaseAt,
    );
  }

  if (pressureGain) {
    pressureGain.gain.cancelScheduledValues(now);
    pressureGain.gain.setValueAtTime(pressureGain.gain.value, now);
    pressureGain.gain.linearRampToValueAtTime(
      pressureGain.gain.value * duckTo,
      now + 0.03,
    );
    let pressVol =
      overload > 30 ? map(overload, 30, overloadMax, 0.0, 0.05) : 0;
    pressureGain.gain.linearRampToValueAtTime(pressVol, releaseAt);
  }
  if (ringGain) {
    ringGain.gain.cancelScheduledValues(now);
    ringGain.gain.setValueAtTime(ringGain.gain.value, now);
    ringGain.gain.linearRampToValueAtTime(
      ringGain.gain.value * duckTo,
      now + 0.03,
    );
    let rVol = overload > 65 ? map(overload, 65, overloadMax, 0.0, 0.025) : 0;
    ringGain.gain.linearRampToValueAtTime(rVol, releaseAt);
  }

  let levels =
    TITLE_AMBIENT_LEVELS[titleAmbientMode] || TITLE_AMBIENT_LEVELS.title;
  if (titleDroneGain) {
    titleDroneGain.gain.cancelScheduledValues(now);
    titleDroneGain.gain.setValueAtTime(titleDroneGain.gain.value, now);
    titleDroneGain.gain.linearRampToValueAtTime(
      levels.drone * duckTo,
      now + 0.03,
    );
    titleDroneGain.gain.linearRampToValueAtTime(levels.drone, releaseAt);
  }
  if (titleTinnitusGain) {
    titleTinnitusGain.gain.cancelScheduledValues(now);
    titleTinnitusGain.gain.setValueAtTime(titleTinnitusGain.gain.value, now);
    titleTinnitusGain.gain.linearRampToValueAtTime(
      levels.tinnitus * duckTo,
      now + 0.03,
    );
    titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus, releaseAt);
  }
  if (titlePulseGain) {
    titlePulseGain.gain.cancelScheduledValues(now);
    titlePulseGain.gain.setValueAtTime(titlePulseGain.gain.value, now);
    titlePulseGain.gain.linearRampToValueAtTime(
      levels.pulse * duckTo,
      now + 0.03,
    );
    titlePulseGain.gain.linearRampToValueAtTime(levels.pulse, releaseAt);
  }
  if (titlePulseLfoGain) {
    titlePulseLfoGain.gain.cancelScheduledValues(now);
    titlePulseLfoGain.gain.setValueAtTime(titlePulseLfoGain.gain.value, now);
    titlePulseLfoGain.gain.linearRampToValueAtTime(
      levels.lfo * duckTo,
      now + 0.03,
    );
    titlePulseLfoGain.gain.linearRampToValueAtTime(levels.lfo, releaseAt);
  }
}

function startTitleAmbient(mode) {
  if (!audioCtx || titleActive) return;
  titleActive = true;
  titleAmbientMode = mode || "title";

  let now = audioCtx.currentTime;
  let fadeIn = 2.5; // gentle fade-in over 2.5 seconds
  let levels =
    TITLE_AMBIENT_LEVELS[titleAmbientMode] || TITLE_AMBIENT_LEVELS.title;

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

  // Layer 2: Filtered white noise — soft hiss (replaces 3800 Hz sine)
  titleTinnitusNode = createWhiteNoiseSource();
  titleTinnitusFilter = audioCtx.createBiquadFilter();
  titleTinnitusFilter.type = "bandpass";
  titleTinnitusFilter.frequency.value = 800;
  titleTinnitusFilter.Q.value = 0.5;
  titleTinnitusGain = audioCtx.createGain();
  titleTinnitusGain.gain.setValueAtTime(0, now);
  titleTinnitusGain.gain.linearRampToValueAtTime(levels.tinnitus, now + fadeIn);
  titleTinnitusNode.connect(titleTinnitusFilter);
  titleTinnitusFilter.connect(titleTinnitusGain);
  titleTinnitusGain.connect(audioCtx.destination);
  titleTinnitusNode.start(now);

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
  if (titleTinnitusGain && titleTinnitusNode) {
    try {
      titleTinnitusGain.gain.setValueAtTime(titleTinnitusGain.gain.value, now);
      titleTinnitusGain.gain.linearRampToValueAtTime(0, now + fadeOut);
      titleTinnitusNode.stop(now + fadeOut + 0.05);
    } catch (e) {}
    titleTinnitusNode = null;
    titleTinnitusFilter = null;
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
  ambientGain.gain.value = 0.015;
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();

  pressureOsc = audioCtx.createOscillator();
  pressureGain = audioCtx.createGain();
  pressureOsc.type = "sawtooth";
  pressureOsc.frequency.value = 110;
  pressureGain.gain.value = 0;
  pressureOsc.connect(pressureGain);
  pressureGain.connect(audioCtx.destination);
  pressureOsc.start();

  ringNode = createWhiteNoiseSource();
  ringFilter = audioCtx.createBiquadFilter();
  ringFilter.type = "bandpass";
  ringFilter.frequency.value = 1000;
  ringFilter.Q.value = 0.5;
  ringGain = audioCtx.createGain();
  ringGain.gain.value = 0;
  ringNode.connect(ringFilter);
  ringFilter.connect(ringGain);
  ringGain.connect(audioCtx.destination);
  ringNode.start();
}
function stopAmbient() {
  if (ambientOsc) {
    try {
      ambientOsc.stop();
    } catch (e) {}
    ambientOsc = null;
    ambientGain = null;
  }
  if (pressureOsc) {
    try {
      pressureOsc.stop();
    } catch (e) {}
    pressureOsc = null;
    pressureGain = null;
  }
  if (ringNode) {
    try {
      ringNode.stop();
    } catch (e) {}
    ringNode = null;
    ringFilter = null;
    ringGain = null;
  }
}
function updateAmbient() {
  if (!ambientGain || !ambientOsc) return;
  let now = audioCtx.currentTime;

  let baseVol = map(overload, 0, overloadMax, 0.015, 0.08);
  let baseFreq = map(overload, 0, overloadMax, 60, 160);
  ambientGain.gain.setTargetAtTime(baseVol, now, 0.1);
  ambientOsc.frequency.setTargetAtTime(baseFreq, now, 0.1);

  if (pressureGain && pressureOsc) {
    let pressVol =
      overload > 30 ? map(overload, 30, overloadMax, 0.0, 0.05) : 0;
    pressureGain.gain.setTargetAtTime(pressVol, now, 0.1);
    let throb =
      sin(frameCount * map(overload, 0, overloadMax, 0.02, 0.15)) *
      map(overload, 0, overloadMax, 2, 20);
    pressureOsc.frequency.setTargetAtTime(110 + throb, now, 0.1);
  }

  if (ringGain && ringNode) {
    let rVol = overload > 65 ? map(overload, 65, overloadMax, 0.0, 0.025) : 0;
    ringGain.gain.setTargetAtTime(rVol, now, 0.1);
  }
}

function initZoneSounds() {
  if (!audioCtx) return;
  stopZoneSounds();

  let now = audioCtx.currentTime;
  for (let sz of stimulusZones) {
    let gain = audioCtx.createGain();
    gain.gain.value = 0;
    gain.connect(audioCtx.destination);

    let nodesToStop = [];
    let lbl = (sz.label || "").toLowerCase();

    if (lbl.includes("tv")) {
      let osc = audioCtx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 60;
      osc.connect(gain);
      osc.start(now);
      nodesToStop.push(osc);
    } else if (lbl.includes("phone")) {
      let osc1 = audioCtx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 600;
      let osc2 = audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 640;
      let lfo = audioCtx.createOscillator();
      lfo.type = "square";
      lfo.frequency.value = 0.5;
      let lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 1;
      lfo.connect(lfoGain);
      let ringGain = audioCtx.createGain();
      ringGain.gain.value = 0;
      lfoGain.connect(ringGain.gain);
      osc1.connect(ringGain);
      osc2.connect(ringGain);
      ringGain.connect(gain);
      osc1.start(now);
      osc2.start(now);
      lfo.start(now);
      nodesToStop.push(osc1, osc2, lfo);
    } else if (lbl.includes("car")) {
      let osc = audioCtx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 40;
      let lfo = audioCtx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 15;
      let lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      osc.start(now);
      lfo.start(now);
      nodesToStop.push(osc, lfo);
    } else if (lbl.includes("screen") || lbl.includes("glare")) {
      let noise = createWhiteNoiseSource();
      let filt = audioCtx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = 1200;
      filt.Q.value = 0.5;
      noise.connect(filt);
      filt.connect(gain);
      noise.start(now);
      nodesToStop.push(noise);
    } else if (lbl.includes("printer")) {
      let osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.value = 120;
      let lfo = audioCtx.createOscillator();
      lfo.type = "square";
      lfo.frequency.value = 8;
      let lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      osc.start(now);
      lfo.start(now);
      nodesToStop.push(osc, lfo);
    } else {
      let osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 220;
      osc.connect(gain);
      osc.start(now);
      nodesToStop.push(osc);
    }

    zoneAudioNodes.push({
      gain: gain,
      sz: sz,
      nodes: nodesToStop,
    });
  }
}

function stopZoneSounds() {
  for (let zn of zoneAudioNodes) {
    if (zn.nodes) {
      for (let n of zn.nodes) {
        try {
          n.stop();
        } catch (e) {}
      }
    }
    if (zn.gain) {
      try {
        zn.gain.disconnect();
      } catch (e) {}
    }
  }
  zoneAudioNodes = [];
}

function updateZoneSounds() {
  if (!audioCtx || zoneAudioNodes.length === 0) return;
  let now = audioCtx.currentTime;
  for (let zn of zoneAudioNodes) {
    let sz = zn.sz;
    let cx = sz.x + sz.w / 2;
    let cy = sz.y + sz.h / 2;
    let d = dist(playerX, playerY, cx, cy);

    let maxDist = 300;
    let vol = 0;
    if (d < maxDist) {
      let nDist = d / maxDist;
      vol = Math.pow(1 - nDist, 2) * 0.15;
    }
    zn.gain.gain.setTargetAtTime(vol, now, 0.1);
  }
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

// ===================== DISTORTION =====================
let distortionTimer = 0;

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

// ===================== MINI MAP =====================
const mapW = 160;
const mapH = 100;
const mapPad = 10;
const mapBorder = 6;
let miniMapExpanded = false;
let mapBounds = { x: 0, y: 0, w: mapW, h: mapH };

// ===================== CAMERA =====================
const CAMERA_ZOOM = 2.6;

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
    image(
      sofaImg,
      currentStageData.calmZones[0].x,
      currentStageData.calmZones[0].y,
      currentStageData.calmZones[0].w,
      currentStageData.calmZones[0].h,
    );
  }

  // Calm zone 2 = coffee
  if (coffeeImg) {
    image(
      coffeeImg,
      currentStageData.calmZones[1].x,
      currentStageData.calmZones[1].y,
      currentStageData.calmZones[1].w,
      currentStageData.calmZones[1].h,
    );
  }

  // Red zone 1 = computer
  if (computerImg) {
    image(
      computerImg,
      currentStageData.stimulusZones[0].x,
      currentStageData.stimulusZones[0].y,
      currentStageData.stimulusZones[0].w,
      currentStageData.stimulusZones[0].h,
    );
  }

  // Red zone 2 = printer
  if (printerImg) {
    image(
      printerImg,
      currentStageData.stimulusZones[1].x,
      currentStageData.stimulusZones[1].y,
      currentStageData.stimulusZones[1].w,
      currentStageData.stimulusZones[1].h,
    );
  }

  // NPC for Communicate (red zone)
  if (npcImg) {
    imageMode(CENTER);
    image(npcImg, 520, 250, 32, 32);
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
    image(benchImg, 215, 445, 175, 95);
  }

  // Red zone 1 = phone
  if (phoneImg) {
    let phoneZone = currentStageData.stimulusZones[0];
    if (phoneZone) {
      image(phoneImg, phoneZone.x, phoneZone.y, phoneZone.w, phoneZone.h);
    } else {
      image(phoneImg, 20, 250, 117, 84);
    }
  }

  // Red zone 2 = car
  if (carImg) {
    let carZone = currentStageData.stimulusZones[1];
    if (carZone) {
      image(carImg, carZone.x, carZone.y, carZone.w, carZone.h);
    } else {
      image(carImg, 185, 95, 123, 78);
    }
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
    image(bedImg, 20, 165, 160, 110);
  }

  // TV image = stimulus source
  if (tvImg) {
    let tvZone = currentStageData.stimulusZones[0];
    if (tvZone) {
      image(tvImg, tvZone.x, tvZone.y, tvZone.w, tvZone.h);
    } else {
      image(tvImg, 338, 280, 145, 91);
    }
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
        // TV noise — grows and pulses to simulate flickering sensory pressure
        {
          x: 338,
          y: 280,
          w: 145,
          h: 91,
          label: "TV noise",
          moveType: "pulse",
          amplitude: 18,
          speed: 0.025,
          baseX: 338,
          baseY: 280,
          baseW: 145,
          baseH: 91,
        },
      ],
      calmZones: [
        // Bed = calm source
        { x: 20, y: 165, w: 160, h: 110, img: () => bedImg },
      ],
      decorations: [
        // Nightstand
        { x: 170, y: 210, w: 36, h: 30, col: [100, 88, 72], solid: true },
        // TV stand in living room
        { x: 362, y: 348, w: 84, h: 28, col: [70, 70, 92], solid: true },
        // Couch (solid)
        { x: 380, y: 460, w: 110, h: 44, col: [82, 74, 100], solid: true },
        // fridge (solid)
        { x: 560, y: 95, w: 42, h: 72, col: [160, 155, 170], solid: true },
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
      overloadBase: 0.038,
      stimulusBonus: 0.14,
      memoryFadeAfter: 1,
      memoryTimer: 130,
      memoryRefresh: 45,
      memoryRecall: 100,
      distractionsOn: true,
      emotionsOn: true,
      driftOn: false,
      fadingAwarenessOn: false,
      calmRecovery: 1.5,
      respawns: 2,
      startOverload: 0,
      carryOverFactor: 0.0,
      respawnOverload: 28,
      distractionThreshold: 55,
      emotionThreshold: 50,
      driftThreshold: 100,
      bgTint: [45, 35, 28, 10],
      // hint: "Move slowly. Even a familiar routine can take real effort.",
      hintMemory: "Press M to steady the thought for a moment.",
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
        {
          x: 20,
          y: 250,
          w: 117,
          h: 84,
          label: "phone ringing",
          moveType: "horizontal",
          amplitude: 25,
          speed: 0.03,
          baseX: 20,
          baseY: 250,
          baseW: 117,
          baseH: 84,
        },
        {
          x: 185,
          y: 95,
          w: 123,
          h: 78,
          label: "car noise",
          moveType: "horizontal",
          amplitude: 35,
          speed: 0.018,
          baseX: 185,
          baseY: 95,
          baseW: 123,
          baseH: 78,
        },
      ],
      calmZones: [{ x: 215, y: 445, w: 175, h: 95, img: () => benchImg }],
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
      overloadBase: 0.09,
      stimulusBonus: 0.28,
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
      distractionThreshold: 28,
      emotionThreshold: 38,
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
        {
          x: 40,
          y: 430,
          w: 110,
          h: 75,
          label: "screen glare",
          moveType: "vertical",
          amplitude: 15,
          speed: 0.02,
          baseX: 40,
          baseY: 430,
          baseW: 110,
          baseH: 75,
        }, // computer
        {
          x: 690,
          y: 300,
          w: 80,
          h: 65,
          label: "printer noise",
          moveType: "horizontal",
          amplitude: 20,
          speed: 0.025,
          baseX: 690,
          baseY: 300,
          baseW: 80,
          baseH: 65,
        }, // printer
      ],
      calmZones: [
        {
          x: 405,
          y: 105,
          w: 143,
          h: 91,
          img: () => sofaImg,
          label: "Sofa",
          labelLayout: {
            area: { position: "below", offset: 12, anchorInsetBottom: 24 },
            name: { position: "below", offset: 34, anchorInsetBottom: 24 },
            status: { position: "above", offset: 8, anchorInsetTop: 15 },
          },
        }, // sofa
        {
          x: 450,
          y: 480,
          w: 50,
          h: 50,
          img: () => coffeeImg,
          label: "Coffee",
          labelLayout: {
            area: { position: "below", offset: 12 },
            name: { position: "below", offset: 36 },
          },
        }, // coffee
      ],
      decorations: [
        // Office desk 1 (solid)
        { x: 40, y: 130, w: 70, h: 30, col: [95, 88, 78], solid: true },

        // Office desk 2 (solid)
        { x: 170, y: 320, w: 50, h: 30, col: [95, 88, 78], solid: true },

        // Filing cabinet (solid)
        { x: 350, y: 130, w: 30, h: 40, col: [80, 80, 95], solid: true },

        // NPC bottom left (blocking)
        { x: 110, y: 520, w: 30, h: 30, col: [0, 0, 0], solid: true },

        // NPC top right (blocking)
        { x: 850, y: 150, w: 30, h: 30, col: [0, 0, 0], solid: true },

        // Books left
        { x: 120, y: 240, w: 30, h: 24, col: [0, 0, 0], solid: true },

        // Books right
        { x: 820, y: 120, w: 30, h: 24, col: [0, 0, 0], solid: true },

        // Printer (solid, near noise zone)
        { x: 58, y: 260, w: 40, h: 28, col: [110, 105, 115], solid: true },

        // Water cooler (solid)
        { x: 560, y: 430, w: 22, h: 26, col: [85, 110, 130], solid: true },
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
  fridgeImg = loadImage("assets/images/fridge.png");
  kitchentableImg = loadImage("assets/images/kitchentable.png");
  shoerackImg = loadImage("assets/images/shoerack.png");
  bookshelfImg = loadImage("assets/images/bookshelf.png");

  // Stage 2 assets
  groceryImg = loadImage("assets/images/grocery.png");
  prescriptionImg = loadImage("assets/images/prescriptions.png");
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
  computerImg = loadImage("assets/images/computer.png");
  printerImg = loadImage("assets/images/printer.png");
  sofaImg = loadImage("assets/images/sofa.png");
  coffeeImg = loadImage("assets/images/coffee.png");
  background3Img = loadImage("assets/images/background3.jpg");
  communicateImg = loadImage("assets/images/communicate.png");
  flagImg = loadImage("assets/images/flag.png");
  worknotesImg = loadImage("assets/images/worknotes.png");
  officeWallImg = loadImage("assets/images/officewall.jpg");

  WatercoolerImg = loadImage("assets/images/Watercooler.png");
  officedeskImg = loadImage("assets/images/officedesk.png");
  recyclebinImg = loadImage("assets/images/recyclebin.png");
  cabinetImg = loadImage("assets/images/cabinet.png");
  npcImg = loadImage("assets/images/npc.png");
  booksImg = loadImage("assets/images/books.png");
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

  let panelFlutter =
    206 + sin(frameCount * 0.05) * 10 + sin(frameCount * 0.12 + 1.8) * 4;
  fill(18, 20, 42, panelFlutter);
  rectMode(CORNER);
  rect(panelX, panelY, panelW, panelH, 20);

  if (!lowSensoryMode) {
    let crackGlow = 14 + sin(frameCount * 0.09) * 8;
    stroke(110, 135, 190, crackGlow);
    strokeWeight(1);

    line(panelX + 90, panelY + 24, panelX + 140, panelY + 78);
    line(panelX + 140, panelY + 78, panelX + 210, panelY + 118);

    line(
      panelX + panelW - 120,
      panelY + 42,
      panelX + panelW - 170,
      panelY + 96,
    );
    line(
      panelX + panelW - 170,
      panelY + 96,
      panelX + panelW - 230,
      panelY + 128,
    );

    line(
      panelX + 70,
      panelY + panelH - 70,
      panelX + 130,
      panelY + panelH - 120,
    );
    line(
      panelX + 130,
      panelY + panelH - 120,
      panelX + 210,
      panelY + panelH - 155,
    );

    line(panelX + 140, panelY + 78, panelX + 125, panelY + 104);
    line(
      panelX + panelW - 170,
      panelY + 96,
      panelX + panelW - 150,
      panelY + 124,
    );
    line(
      panelX + 130,
      panelY + panelH - 120,
      panelX + 108,
      panelY + panelH - 145,
    );

    noStroke();
  }

  if (!lowSensoryMode) {
    let panelFlash = max(0, sin(frameCount * 0.21) - 0.9) * 60;
    fill(255, 255, 255, panelFlash);
    rect(panelX, panelY, panelW, panelH, 18);
  }

  if (!lowSensoryMode) {
    fill(255, 210, 75, 16);
    rect(panelX + 58, panelY, panelW - 116, 2, 1);
    fill(78, 104, 152, 12);
    rect(heroX, heroY, heroW, heroH, 16);
  }

  textAlign(CENTER, CENTER);
  textSize(54);
  textStyle(BOLD);

  if (!lowSensoryMode) {
    let glitchX = sin(frameCount * 0.18) * 2.2;
    let glitchY = cos(frameCount * 0.14) * 1.1;

    fill(255, 80, 80, 42);
    text("Fragmented", heroCX - 3 + glitchX, titleY - 1);

    fill(120, 180, 255, 38);
    text("Fragmented", heroCX + 3 - glitchX, titleY + 1);

    fill(255, 210, 75);
    text("Fragmented", heroCX + glitchX * 0.4, titleY + glitchY * 0.3);
  } else {
    fill(255, 210, 75);
    text("Fragmented", heroCX, titleY);
  }

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

  // =========================
  // 1) Global background flutter
  // =========================
  let bgFlutter = 12 + sin(t * 0.045) * 6 + sin(t * 0.11 + 1.4) * 3;
  fill(22, 24, 42, bgFlutter);
  rect(0, 0, CANVAS_W, CANVAS_H);

  // very light irregular flicker pulses
  if (sin(t * 0.23) > 0.92) {
    fill(90, 100, 150, 8);
    rect(0, 0, CANVAS_W, CANVAS_H);
  }
  if (sin(t * 0.31 + 2.1) > 0.95) {
    fill(255, 210, 75, 5);
    rect(0, 0, CANVAS_W, CANVAS_H);
  }

  // =========================
  // 2) Faint head silhouette
  // =========================
  push();
  translate(cx, cy - 20);
  noFill();

  let headBreath = sin(t * 0.012) * 3;
  let headAlpha = 12 + sin(t * 0.04) * 5;
  stroke(60, 65, 95, headAlpha);
  strokeWeight(1.5);
  ellipse(0, 0, 320 + headBreath, 390 + headBreath);

  stroke(70, 75, 110, 8 + sin(t * 0.028 + 0.8) * 3);
  strokeWeight(1);
  ellipse(0, -30, 220 + headBreath * 0.6, 240 + headBreath * 0.6);
  pop();

  // =========================
  // 3) Neural pathway lines with stronger instability
  // =========================
  // --- Layer 2: Fragment shards / broken neural mesh ---
  let shardSeeds = [
    { x: 220, y: 170, sides: 5, r: 34 },
    { x: 760, y: 180, sides: 4, r: 42 },
    { x: 180, y: 420, sides: 6, r: 30 },
    { x: 820, y: 420, sides: 5, r: 36 },
    { x: 500, y: 120, sides: 4, r: 28 },
    { x: 340, y: 520, sides: 5, r: 24 },
    { x: 650, y: 520, sides: 6, r: 26 },
    { x: 120, y: 300, sides: 4, r: 22 },
    { x: 890, y: 290, sides: 5, r: 24 },
  ];

  for (let i = 0; i < shardSeeds.length; i++) {
    let s = shardSeeds[i];
    let crackAlpha = map(sin(t * 0.02 + i * 1.7), -1, 1, 6, 24);

    if (sin(t * 0.18 + i * 2.9) > 0.82) {
      crackAlpha *= 0.25;
    }

    push();
    translate(s.x, s.y);
    rotate(sin(t * 0.006 + i) * 0.18);

    stroke(95, 110, 165, crackAlpha);
    strokeWeight(1.1);
    fill(50, 60, 95, crackAlpha * 0.12);

    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / s.sides) {
      let rr = s.r + sin(t * 0.01 + a * 3 + i) * 6;
      let vx = cos(a) * rr;
      let vy = sin(a) * rr;
      vertex(vx, vy);
    }
    endShape(CLOSE);

    for (let k = 0; k < s.sides; k++) {
      let ang = (TWO_PI / s.sides) * k;
      let ex = cos(ang) * (s.r * 0.85);
      let ey = sin(ang) * (s.r * 0.85);
      line(0, 0, ex, ey);
    }

    for (let k = 0; k < 3; k++) {
      let a1 = i * 0.9 + k * 1.7;
      let len = s.r + 14 + k * 10;
      let x1 = cos(a1) * 8;
      let y1 = sin(a1) * 8;
      let x2 = cos(a1) * len;
      let y2 = sin(a1) * len;
      if (sin(t * 0.04 + i * 3 + k) > -0.2) {
        line(x1, y1, x2, y2);
      }
    }

    pop();
  }

  let links = [
    [0, 4],
    [4, 1],
    [0, 2],
    [1, 3],
    [2, 5],
    [3, 6],
    [5, 6],
    [7, 0],
    [1, 8],
  ];

  strokeWeight(1);
  for (let i = 0; i < links.length; i++) {
    let a = shardSeeds[links[i][0]];
    let b = shardSeeds[links[i][1]];
    let linkAlpha = map(sin(t * 0.016 + i * 2.4), -1, 1, 3, 18);
    stroke(80, 95, 145, linkAlpha);

    let mx = (a.x + b.x) / 2 + sin(t * 0.01 + i) * 18;
    let my = (a.y + b.y) / 2 + cos(t * 0.012 + i) * 12;

    if (sin(t * 0.09 + i * 1.8) > 0.15) {
      line(a.x, a.y, mx, my);
    }
    if (sin(t * 0.09 + i * 1.8 + 0.8) > 0.28) {
      line(mx, my, b.x, b.y);
    }
  }

  noStroke();

  // =========================
  // 4) Small static clusters
  // =========================
  let staticClusters = [
    { x: 118, y: 128, w: 52, h: 28 },
    { x: 820, y: 148, w: 58, h: 30 },
    { x: 145, y: 485, w: 64, h: 30 },
    { x: 760, y: 500, w: 70, h: 34 },
    { x: 415, y: 555, w: 58, h: 24 },
    { x: 612, y: 108, w: 56, h: 24 },
    { x: 88, y: 298, w: 50, h: 26 },
    { x: 874, y: 288, w: 52, h: 24 },
  ];

  for (let i = 0; i < staticClusters.length; i++) {
    let c = staticClusters[i];
    let clusterAlpha = 8 + sin(t * 0.06 + i * 1.9) * 5;

    for (let j = 0; j < 16; j++) {
      let px = c.x + ((j * 13 + i * 7) % c.w);
      let py = c.y + ((j * 9 + i * 11) % c.h);
      let sz = 1 + ((j + i) % 2);

      if (sin(t * 0.14 + i * 2.4 + j * 0.7) > -0.15) {
        fill(170, 180, 215, clusterAlpha);
      } else {
        fill(255, 210, 75, clusterAlpha * 0.45);
      }
      rect(px, py, sz, sz);
    }
  }

  // =========================
  // 5) Drifting thought fragments
  // =========================
  let fragments = [
    { x: 120, y: 150, w: 40, h: 4 },
    { x: 870, y: 170, w: 35, h: 4 },
    { x: 180, y: 480, w: 45, h: 4 },
    { x: 760, y: 510, w: 38, h: 4 },
    { x: 400, y: 560, w: 32, h: 4 },
    { x: 620, y: 110, w: 48, h: 4 },
    { x: 90, y: 300, w: 42, h: 4 },
    { x: 900, y: 290, w: 36, h: 4 },
  ];

  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    let driftX = sin(t * 0.01 + i * 1.7) * 6;
    let driftY = cos(t * 0.013 + i * 1.2) * 4;
    let a = 8 + sin(t * 0.02 + i * 2.5) * 5;

    fill(170, 180, 215, a);
    rect(f.x + driftX, f.y + driftY, f.w, f.h, 3);

    // ghost double-vision copy
    fill(255, 210, 75, a * 0.18);
    rect(f.x + driftX + 4, f.y + driftY + 1, f.w * 0.85, f.h, 3);
  }

  // =========================
  // 6) Pressure halo around center
  // =========================
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

  fill(closeHovered ? 255 : 210, closeHovered ? 220 : 210, 75);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(
    "×",
    howToPlayCloseBounds.x + howToPlayCloseBounds.w / 2,
    howToPlayCloseBounds.y + howToPlayCloseBounds.h / 2,
  );

  fill(255, 210, 75);
  textSize(24);
  text("How to Play", cx, panelY + 46);

  textStyle(NORMAL);
  textSize(11.5);
  fill(180, 184, 200);
  text(
    "Complete the day while managing overload and fatigue.",
    cx,
    panelY + 76,
  );

  drawHowToPlayRow(panelX + 54, panelY + 120, "WASD", "Move");
  drawHowToPlayRow(panelX + 54, panelY + 164, "M", "Open / close map");
  drawHowToPlayRow(panelX + 54, panelY + 208, "K", "Use calm ability");
  drawHowToPlayRow(panelX + 54, panelY + 252, "R", "Return to title");

  fill(255, 210, 75);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Gameplay Guidance", panelX + 62, panelY + 348);

  fill(214, 218, 230);
  textStyle(NORMAL);
  textSize(12);
  text("Green zones help reduce overload.", panelX + 62, panelY + 374);
  text("Red noise zones increase overload.", panelX + 62, panelY + 398);
  text(
    "Use calm ability and safe routing to finish each stage.",
    panelX + 62,
    panelY + 422,
  );

  textAlign(LEFT, TOP);
  fill(144, 150, 168);
  textSize(10.5);
  text("Press H or ESC to close", panelX + 20, panelY + 20);

  rectMode(CORNER);
  textStyle(NORMAL);
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

function applyPlayerCamera() {
  let zoom = CAMERA_ZOOM;

  // Center the player on screen
  let tx = width / 2 - playerX * zoom;
  let ty = height / 2 - playerY * zoom;

  // Clamp camera so we do not show empty space outside the level
  let minTx = width - CANVAS_W * zoom;
  let maxTx = 0;
  let minTy = height - CANVAS_H * zoom;
  let maxTy = 0;

  tx = constrain(tx, minTx, maxTx);
  ty = constrain(ty, minTy, maxTy);

  translate(tx, ty);
  scale(zoom);
}

// ===================== PLAY SCREEN =====================
function drawPlayScreen() {
  background(40, 40, 80);

  // --- UPDATE GAME LOGIC HERE ---
  updateGame();

  // Spatial distortion trigger (Level 3 only)
  if (currentStage === 2 && overload >= 60 && !lowSensoryMode) {
    distortionTimer = 999; // 계속 유지
  } else {
    distortionTimer = max(0, distortionTimer - 1);
  }

  // --- WORLD / CAMERA ---
  push();

  if (overload > 65 && !lowSensoryMode) {
    let shake = map(overload, 65, 100, 0, 3);
    translate(random(-shake, shake), random(-shake, shake));
  }

  applyPlayerCamera();

  // ===== Spatial Distortion Effect =====
  if (currentStage === 2 && distortionTimer > 0) {
    let intensity = map(overload, 60, 100, 0, 8);

    let waveX = sin(frameCount * 0.05) * intensity;
    let waveY = cos(frameCount * 0.04) * intensity;

    translate(waveX, waveY);

    // subtle zoom breathing
    let zoomPulse = 1 + sin(frameCount * 0.03) * 0.02;
    scale(zoomPulse);
  }

  drawStage();

  pop();

  // Keep emotional message and HUD in screen space
  drawEmotionMessage();
  drawHUD();
  drawStageIntroBanner();

  drawMinimap();
  drawExpandedMap();
}

// ===================== STAGE TRANSITION SCREEN =====================
function drawStageTransitionScreen() {
  background(COL_TRANSITION_BG[0], COL_TRANSITION_BG[1], COL_TRANSITION_BG[2]);

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

  fill(
    COL_TRANSITION_CARD[0],
    COL_TRANSITION_CARD[1],
    COL_TRANSITION_CARD[2],
    236,
  );
  rectMode(CENTER);
  rect(cx, cy, TRANSITION_CARD_W, TRANSITION_CARD_H, 20);

  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(10.5);
  fill(
    COL_TRANSITION_SUB[0],
    COL_TRANSITION_SUB[1],
    COL_TRANSITION_SUB[2],
    185,
  );
  text(progressText, cx, progressY);

  fill(
    COL_TRANSITION_TITLE[0],
    COL_TRANSITION_TITLE[1],
    COL_TRANSITION_TITLE[2],
  );
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
    fill(
      COL_TRANSITION_TITLE[0],
      COL_TRANSITION_TITLE[1],
      COL_TRANSITION_TITLE[2],
      14,
    );
    rect(cx, buttonY, TRANSITION_BUTTON_W + 18, TRANSITION_BUTTON_H + 10, 18);
  }
  fill(
    COL_TRANSITION_BUTTON[0],
    COL_TRANSITION_BUTTON[1],
    COL_TRANSITION_BUTTON[2],
    245,
  );
  rect(cx, buttonY, TRANSITION_BUTTON_W, TRANSITION_BUTTON_H, 16);
  noFill();
  stroke(
    COL_TRANSITION_LINE[0],
    COL_TRANSITION_LINE[1],
    COL_TRANSITION_LINE[2],
    95,
  );
  strokeWeight(1.2);
  rect(cx, buttonY, TRANSITION_BUTTON_W, TRANSITION_BUTTON_H, 16);
  noStroke();

  fill(COL_TRANSITION_TEXT[0], COL_TRANSITION_TEXT[1], COL_TRANSITION_TEXT[2]);
  textSize(17);
  textStyle(BOLD);
  text("Press ENTER to Continue", cx, buttonY);
  textStyle(NORMAL);

  if (lowSensoryMode) {
    fill(
      COL_TRANSITION_SUB[0],
      COL_TRANSITION_SUB[1],
      COL_TRANSITION_SUB[2],
      150,
    );
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

  noStroke();
  rectMode(CORNER);
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
    text(
      "Not overwhelmed once — but notice how hard it still felt.",
      cx,
      contentTop + 82,
    );
  } else {
    text(
      "Overwhelmed " + totalRespawnsUsed + " time(s) along the way.",
      cx,
      contentTop + 82,
    );
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
  text(
    "For many TBI survivors, this effort is part of every single day.",
    cx,
    contentTop + 142,
  );
  textStyle(NORMAL);
  textSize(12);
  fill(160, 180, 168);
  text(
    "It doesn't mean they can't do things. It means everything costs more.",
    cx,
    contentTop + 166,
  );

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

  noStroke();
  rectMode(CORNER);
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
  text(
    "Needing to stop is not failure — it's your brain protecting itself.",
    cx,
    contentTop + 110,
  );
  textStyle(NORMAL);
  textSize(12);
  fill(180, 155, 160);
  text(
    "The struggle you felt is real. So is the resilience it takes to try again.",
    cx,
    contentTop + 136,
  );

  // Continue prompt
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Press ENTER to Try Again", cx, contentTop + 195);
  textStyle(NORMAL);
}

// ===================== STIMULUS ZONE MOVEMENT =====================
// Moves stimulus zones in Stages 1 & 2 to create a sense of unpredictable
// sensory pressure — representing how real-world noise sources feel to
// someone with TBI: shifting, hard to avoid, always encroaching [3].
function updateStimulusZoneMovement() {
  for (let sz of stimulusZones) {
    if (!sz.moveType) continue;
    let t = frameCount;
    if (sz.moveType === "horizontal") {
      // Obstacle drifts left/right along its axis
      let offset = sin(t * sz.speed) * sz.amplitude;
      sz.x = sz.baseX + offset;
    } else if (sz.moveType === "vertical") {
      // Obstacle drifts up/down along its axis
      let offset = sin(t * sz.speed) * sz.amplitude;
      sz.y = sz.baseY + offset;
    } else if (sz.moveType === "pulse") {
      // Zone expands and contracts — TV flicker / noise radiating outward
      let expand = sin(t * sz.speed) * sz.amplitude;
      sz.x = sz.baseX - expand * 0.5;
      sz.y = sz.baseY - expand * 0.5;
      sz.w = sz.baseW + expand;
      sz.h = sz.baseH + expand;
    }
  }
}

// ===================== GAME UPDATE =====================
function updateGame() {
  let s = currentStageData;

  // Update moving stimulus zones (Stages 1 & 2) [3]
  updateStimulusZoneMovement();

  // --- PLAYER MOVEMENT (cognitive fatigue) [2] ---
  let speed = baseSpeed * map(overload, 0, overloadMax, 1.0, 0.5);

  let newX = playerX;
  let newY = playerY;

  let moveLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65); // A
  let moveRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68); // D
  let moveUp = keyIsDown(UP_ARROW) || keyIsDown(87); // W
  let moveDown = keyIsDown(DOWN_ARROW) || keyIsDown(83); // S

  if (moveLeft) newX -= speed;
  if (moveRight) newX += speed;
  if (moveUp) newY -= speed;
  if (moveDown) newY += speed;

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

  // Memory recall mechanic removed
  memoryActive = false;
  showObjective = true;

  // --- SENSORY OVERLOAD [3] ---
  let overloadRate = s.overloadBase;

  for (let sz of stimulusZones) {
    if (inRect(playerX, playerY, sz.x, sz.y, sz.w, sz.h)) {
      overloadRate += s.stimulusBonus;
    }
  }

  overload += overloadRate * OVERLOAD_RATE_MULT;

  // Calm Zone recovery: directly reduces overload and refills calm ability charges
  for (let cz of calmZones) {
    if (inRect(playerX, playerY, cz.x, cz.y, cz.w, cz.h)) {
      overload -= 0.5;
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
  updateZoneSounds();

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
      stopZoneSounds();
    } else {
      endSoundPlayed = false;
      gameState = STATE_STAGE_TRANSITION;
      stopZoneSounds();
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
      stopZoneSounds();
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
  initZoneSounds();
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
  // Draw calm zone glows before scene images so glow appears behind objects
  for (let cz of calmZones) {
    drawCalmZoneGlow(cz);
  }

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
    // All stages: subtle red tint over stimulus zone + descriptive label
    if (lowSensoryMode) {
      noFill();
      stroke(200, 100, 80, 80);
      strokeWeight(2);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
      noStroke();
    } else {
      let pulse = sin(frameCount * 0.05) * 8;
      fill(COL_STIMULUS[0], COL_STIMULUS[1], COL_STIMULUS[2], 2 + pulse * 0.2);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
    }

    // Draw descriptive label above the stimulus zone so players
    // understand what real-world sensory trigger this represents [3][5]
    let szLabel = sz.label || "noise";
    let labelY = sz.y - 18; // Adjusted for better spacing

    textSize(10);
    textStyle(BOLD);
    let tw = textWidth(szLabel);

    fill(0, 0, 0, 220);
    rectMode(CENTER);
    rect(sz.x + sz.w / 2, labelY, tw + 12, 18, 4);

    noFill();
    strokeWeight(1);
    stroke(255, 100, 100, 150);
    rect(sz.x + sz.w / 2, labelY, tw + 12, 18, 4);

    textAlign(CENTER, CENTER);
    noStroke();
    if (lowSensoryMode) {
      fill(255, 200, 200);
    } else {
      fill(255, 100, 100);
    }
    text(szLabel, sz.x + sz.w / 2, labelY);
    textStyle(NORMAL);
    rectMode(CORNER);
  }

  // Calm Zones [3]
  for (let cz of calmZones) {
    drawCalmZone(cz);

    if (currentStage === 2 && cz.label) {
      let namePos = getCalmZoneLabelPoint(cz, "name");
      drawZoneBadge(cz.label, namePos.x, namePos.y, {
        clampToPlayArea: true,
        fill: [10, 30, 20, 220],
        stroke: [150, 255, 180, 150],
        text: [150, 255, 180],
      });
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
        drawX = 162;
        drawY = 202;
        drawW = 48;
        drawH = 42;
      }
      // TV stand
      else if (d.x === 362 && d.y === 348) {
        decoImg = tvstandImg;
        drawX = 340;
        drawY = 325;
        drawW = 140;
        drawH = 64;
      }
      // Couch
      else if (d.x === 380 && d.y === 460) {
        decoImg = couchImg;
        drawX = 330;
        drawY = 415;
        drawW = 230;
        drawH = 120;
      }

      // Fridge
      else if (d.x === 560 && d.y === 95) {
        decoImg = fridgeImg;
        drawX = d.x - 10;
        drawY = d.y - 12;
        drawW = d.w + 32;
        drawH = d.h + 40;
      }
      // Kitchen table
      else if (d.x === 560 && d.y === 280) {
        decoImg = kitchentableImg;
        drawX = 540;
        drawY = 260;
        drawW = 120;
        drawH = 90;
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
    } else if (currentStage === 1) {
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
    } else if (currentStage === 2) {
      // Office desk 1
      if (d.x === 40 && d.y === 130) {
        decoImg = officedeskImg;
        drawX = 26;
        drawY = 118;
        drawW = 96;
        drawH = 52;
      }
      // Office desk 2
      else if (d.x === 170 && d.y === 320) {
        decoImg = officedeskImg;
        drawX = 156;
        drawY = 308;
        drawW = 88;
        drawH = 50;
      }
      // Filing cabinet
      else if (d.x === 350 && d.y === 130) {
        decoImg = cabinetImg;
        drawX = 346;
        drawY = 126;
        drawW = 30;
        drawH = 42;
      }
      // Printer (left side office)
      else if (d.x === 58 && d.y === 260) {
        decoImg = printerImg;
        drawX = 52;
        drawY = 254;
        drawW = 42;
        drawH = 30;
      }
      // Break room sofa — 先保留色块，不放图
      else if (d.x === 460 && d.y === 320) {
        fill(d.col[0], d.col[1], d.col[2]);
        rect(d.x, d.y, d.w, d.h, 3);
        continue;
      }
      // Break room plant — 先保留色块
      else if (d.x === 434 && d.y === 110) {
        fill(d.col[0], d.col[1], d.col[2]);
        rect(d.x, d.y, d.w, d.h, 3);
        continue;
      }
      // Water cooler
      else if (d.x === 560 && d.y === 430) {
        decoImg = WatercoolerImg;
        drawX = d.x - 6;
        drawY = d.y - 8;
        drawW = 34;
        drawH = 48;
      }
      // Transit bench — 先保留色块
      else if (d.x === 650 && d.y === 440) {
        fill(d.col[0], d.col[1], d.col[2]);
        rect(d.x, d.y, d.w, d.h, 3);
        continue;
      }
      // Vending machine -> 用 cabinet 先代替
      else if (d.x === 460 && d.y === 200) {
        decoImg = cabinetImg;
        drawX = 456;
        drawY = 196;
        drawW = 34;
        drawH = 50;
      }
      // Trash bin transit
      else if (d.x === 760 && d.y === 320) {
        decoImg = recyclebinImg;
        drawX = 758;
        drawY = 318;
        drawW = 24;
        drawH = 28;
      }
      // Home stretch mailbox -> 先用 cabinet 代替
      else if (d.x === 915 && d.y === 350) {
        decoImg = cabinetImg;
        drawX = 912;
        drawY = 346;
        drawW = 28;
        drawH = 36;
      }

      // NPC bottom left (blocking)
      else if (d.x === 110 && d.y === 520) {
        decoImg = npcImg;
        drawX = d.x - 2;
        drawY = d.y - 2;
        drawW = 32;
        drawH = 32;
      }

      // NPC top right (blocking)
      else if (d.x === 850 && d.y === 150) {
        decoImg = npcImg;
        drawX = d.x - 2;
        drawY = d.y - 2;
        drawW = 32;
        drawH = 32;
      }
      // books left
      else if (d.x === 120 && d.y === 240) {
        decoImg = booksImg;
        drawX = d.x - 2;
        drawY = d.y - 2;
        drawW = 34;
        drawH = 26;
      }
      // books right
      else if (d.x === 820 && d.y === 120) {
        decoImg = booksImg;
        drawX = d.x - 2;
        drawY = d.y - 2;
        drawW = 34;
        drawH = 26;
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
      let imgSize = 52; // Increased size
      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER); // Ensure image is centered on s.x, s.y
        image(taskImg, s.x, s.y, imgSize, imgSize);
        noTint();
      } else {
        fill(COL_STAR[0], COL_STAR[1], COL_STAR[2], starAlpha);
        ellipse(s.x, s.y, s.size * 1.8, s.size * 1.8); // Increased size
      }

      drawTaskLabel(s, starAlpha);
      continue;
    }
    // Stage 2 uses real images instead of stars
    if (currentStage === 1) {
      let taskImg = getStageTwoTaskImage(s.label);
      let imgSize = 54; // Increased size
      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER); // Ensure image is centered on s.x, s.y
        image(taskImg, s.x, s.y, imgSize, imgSize);
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
      let imgSize = 56; // Increased size
      if (taskImg) {
        if (!lowSensoryMode) {
          tint(255, starAlpha);
        } else {
          tint(255, 220);
        }
        imageMode(CENTER); // Ensure image is centered on s.x, s.y
        image(taskImg, s.x, s.y, imgSize, imgSize);
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
        40 * (starAlpha / 255),
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
  let labelY =
    task.y + (task.labelDy !== undefined ? task.labelDy : -task.size - 12);

  textSize(9.5);
  textStyle(BOLD);
  let tw = textWidth(task.label);

  fill(10, 15, 30, Math.min(200, labelAlpha));
  rectMode(CENTER);
  rect(labelX, labelY, tw + 10, 16, 4);

  textAlign(CENTER, CENTER);
  fill(255, 240, 200, labelAlpha);
  noStroke();
  text(task.label, labelX, labelY);
  textStyle(NORMAL);
  rectMode(CORNER);
}

function getCalmZoneLabelPoint(cz, kind) {
  let layout = (cz.labelLayout && cz.labelLayout[kind]) || {};
  let position = layout.position || (kind === "area" ? "center" : "above");

  if (kind === "name" && !layout.position) {
    position = "below";
  }

  let offset =
    layout.offset !== undefined
      ? layout.offset
      : kind === "status"
        ? 16
        : kind === "name"
          ? 14
          : position === "center"
            ? 0
            : 10;

  let x = cz.x + cz.w / 2 + (layout.xOffset || 0);
  let y = cz.y + cz.h / 2;
  let anchorTop = cz.y + (layout.anchorInsetTop || 0);
  let anchorBottom = cz.y + cz.h - (layout.anchorInsetBottom || 0);

  if (position === "above") {
    y = anchorTop - offset;
  } else if (position === "below") {
    y = anchorBottom + offset;
  } else {
    y += offset;
  }

  return { x, y };
}

function drawZoneBadge(label, x, y, style = {}) {
  let textSizeValue = style.textSize || 10;
  let height = style.height || 18;
  let paddingX = style.paddingX || 12;
  let radius = style.radius || 4;
  let playAreaPadding = style.playAreaPadding || 6;
  let fillCol = style.fill || [10, 30, 20, 220];
  let strokeCol = style.stroke || [150, 255, 180, 150];
  let textCol = style.text || [150, 255, 180];

  if (style.clampToPlayArea) {
    let minY = PLAY_TOP + height / 2 + playAreaPadding;
    let maxY = PLAY_BOTTOM - height / 2 - playAreaPadding;
    y = constrain(y, minY, maxY);
  }

  textSize(textSizeValue);
  textStyle(BOLD);
  let tw = textWidth(label);

  fill(...fillCol);
  rectMode(CENTER);
  rect(x, y, tw + paddingX, height, radius);

  if (strokeCol) {
    noFill();
    strokeWeight(1);
    stroke(...strokeCol);
    rect(x, y, tw + paddingX, height, radius);
  }

  noStroke();
  fill(...textCol);
  textAlign(CENTER, CENTER);
  text(label, x, y);
  textStyle(NORMAL);
  rectMode(CORNER);
}

function drawCalmZoneGlow(cz) {
  // Drawn before scene images so the glow appears behind the object
  let pulse = lowSensoryMode ? 0 : sin(frameCount * 0.07) * 10;
  rectMode(CORNER);
  noStroke();
  // Three expanding layers for a soft bloom effect
  fill(COL_CALM[0], COL_CALM[1], COL_CALM[2], 18);
  rect(
    cz.x - 18 - pulse,
    cz.y - 18 - pulse,
    cz.w + 36 + pulse * 2,
    cz.h + 36 + pulse * 2,
    18,
  );
  fill(COL_CALM[0], COL_CALM[1], COL_CALM[2], 30);
  rect(
    cz.x - 10 - pulse * 0.5,
    cz.y - 10 - pulse * 0.5,
    cz.w + 20 + pulse,
    cz.h + 20 + pulse,
    12,
  );
  fill(COL_CALM[0], COL_CALM[1], COL_CALM[2], 45);
  rect(cz.x - 4, cz.y - 4, cz.w + 8, cz.h + 8, 8);
}

function drawCalmZone(cz) {
  // Called after scene images — only shows feedback text
  rectMode(CORNER);
  noStroke();

  if (!cz.img) {
    // Fallback: original green rectangle with label for zones without an image
    fill(COL_CALM[0], COL_CALM[1], COL_CALM[2], 180);
    rect(cz.x, cz.y, cz.w, cz.h, 10);
  }

  let areaPos = getCalmZoneLabelPoint(cz, "area");
  drawZoneBadge("Calm Area", areaPos.x, areaPos.y, {
    clampToPlayArea: true,
    fill: [10, 30, 20, 220],
    stroke: [150, 255, 180, 150],
    text: [150, 255, 180],
  });

  if (inRect(playerX, playerY, cz.x, cz.y, cz.w, cz.h)) {
    let statusPos = getCalmZoneLabelPoint(cz, "status");
    drawZoneBadge("Recovering...", statusPos.x, statusPos.y, {
      clampToPlayArea: true,
      textSize: 9.5,
      height: 16,
      fill: [10, 30, 20, 220],
      stroke: [180, 255, 210, 150],
      text: [180, 255, 210],
    });
  }
}

function drawPlayer() {
  let px = playerX;
  let py = playerY;

  // movement / idle animation
  let isMoving =
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(RIGHT_ARROW) ||
    keyIsDown(UP_ARROW) ||
    keyIsDown(DOWN_ARROW) ||
    keyIsDown(65) ||
    keyIsDown(68) ||
    keyIsDown(87) ||
    keyIsDown(83);

  let walk = isMoving ? sin(frameCount * 0.22) : 0;
  let bob = isMoving
    ? sin(frameCount * 0.22) * 1.2
    : sin(frameCount * 0.06) * 0.35;

  let moveLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
  let moveRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
  let facing = moveLeft ? -1 : 1;
  if (moveRight) facing = 1;

  // shadow
  noStroke();
  fill(10, 10, 20, 70);
  ellipse(px, py + 12, 20 + abs(walk) * 2, 7);

  // subtle outer glow so the player stands out from the background
  if (!lowSensoryMode) {
    fill(COL_PLAYER[0], COL_PLAYER[1], COL_PLAYER[2], 38);
    ellipse(px, py + bob + 1, 24, 29);
  }

  // legs
  stroke(55, 50, 70);
  strokeWeight(2.2);
  line(px - 4, py + 8 + bob, px - 4 - walk * 1.8, py + 15);
  line(px + 4, py + 8 + bob, px + 4 + walk * 1.8, py + 15);

  // arms
  line(px - 7, py + 1 + bob, px - 10 + walk * 1.4, py + 8);
  line(px + 7, py + 1 + bob, px + 10 - walk * 1.4, py + 8);

  // torso
  noStroke();
  fill(205, 96, 58);
  ellipse(px, py + 2 + bob, 17, 21);

  // shirt highlight
  fill(240, 145, 95, 85);
  ellipse(px - 2, py - 1 + bob, 8, 11);

  // backpack/back outline for stronger silhouette
  fill(92, 78, 110, 210);
  ellipse(px - facing * 5.5, py + 1 + bob, 7.5, 13);

  // neck
  fill(210, 176, 150);
  rectMode(CENTER);
  rect(px, py - 5 + bob, 5, 5, 2);

  // head
  fill(COL_PLAYER_HEAD[0], COL_PLAYER_HEAD[1], COL_PLAYER_HEAD[2]);
  ellipse(px, py - 9 + bob, 16, 16);

  // hair
  fill(72, 56, 48);
  arc(px, py - 15 + bob, 13, 5, PI, TWO_PI);

  // face
  fill(52, 52, 70);
  ellipse(px - 2.5, py - 10 + bob, 2.2, 2.2);
  ellipse(px + 2.5, py - 10 + bob, 2.2, 2.2);

  // brows
  stroke(65, 58, 78);
  strokeWeight(1.2);
  line(px - 4.8, py - 13 + bob, px - 1.3, py - 13.6 + bob);
  line(px + 1.3, py - 13.6 + bob, px + 4.8, py - 13 + bob);

  // mouth / expression changes with overload
  noFill();
  stroke(52, 52, 70);

  if (overload < 30) {
    strokeWeight(1.4);
    arc(px, py - 5 + bob, 6, 4, 0, PI);
  } else if (overload < 55) {
    strokeWeight(1.4);
    line(px - 2.8, py - 5 + bob, px + 2.8, py - 5 + bob);
  } else if (overload < 80) {
    strokeWeight(1.5);
    arc(px, py - 4.2 + bob, 6, 4, PI, TWO_PI);
  } else {
    strokeWeight(1.4);
    rectMode(CENTER);
    noFill();
    rect(px, py - 4.5 + bob, 6.5, 3.2, 1);
  }

  // chest marker for visibility / direction
  noStroke();
  fill(255, 235, 190, 160);
  ellipse(px + facing * 2.5, py + 1 + bob, 3.2, 3.2);

  // overload feedback ring
  if (overload > 60 && !lowSensoryMode) {
    noFill();
    stroke(255, 210, 90, map(overload, 60, 100, 20, 70));
    strokeWeight(1.2);
    ellipse(
      px,
      py - 2 + bob,
      26 + sin(frameCount * 0.16) * 2,
      31 + sin(frameCount * 0.16) * 2,
    );
  }

  // calm ability active glow
  if (calmAbilityTimer > 0) {
    noFill();
    stroke(150, 255, 190, 90);
    strokeWeight(1.4);
    ellipse(px, py - 1 + bob, 30, 35);
  }

  rectMode(CORNER);
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
  fill(40, 25, 15, alpha * 1.5);
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
  drawPanel(0, 0, CANVAS_W, 80, 0);

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
  text("Calm (K): " + calmAbilityCharges, 20, 66);

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
  let barY = 30;
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
  stopZoneSounds();
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

  // Map toggle (M)
  if (gameState === STATE_PLAY && (key === "m" || key === "M")) {
    miniMapExpanded = !miniMapExpanded;
    return;
  }

  // How to play toggle (H on title screen)
  if (gameState === STATE_START && keyCode === 72) {
    showHowToPlay = !showHowToPlay;
    return;
  }

  // Exit how to play
  if (gameState === STATE_START && showHowToPlay && keyCode === ESCAPE) {
    showHowToPlay = false;
    return;
  }

  // Return to title (R)
  if ((key === "r" || key === "R") && gameState !== STATE_START) {
    returnToTitleScreen();
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
      initZoneSounds();
      return;
    } else if (gameState === STATE_STAGE_TRANSITION) {
      advanceStage();
      return;
    }
  }

  // Calm Ability (K)
  if (gameState === STATE_PLAY && (key === "k" || key === "K")) {
    if (calmAbilityCharges > 0 && calmAbilityCooldown <= 0) {
      calmAbilityCharges--;
      calmAbilityTimer = 90;
      calmAbilityCooldown = 120;
      distortionTimer = 0;
      playTone(330, 0.2, "triangle", 0.05);
    }
    return;
  }
}

function mousePressed() {
  initAudio();

  if (gameState === STATE_PLAY) {
    if (miniMapExpanded) {
      miniMapExpanded = false;
      return;
    }
    return;
  }

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

// ===================== PLAYER VISION - FOG SYSTEM =====================
function initVisionGraphics() {
  visionGraphics = createGraphics(CANVAS_W, CANVAS_H);
  visionGraphics.noStroke();
}

function getCurrentVisionRadius() {
  if (lowSensoryMode) return visionRadiusBase;
  return map(overload, 0, overloadMax, visionRadiusBase, visionRadiusMin);
}

// ===================== MINI MAP =====================
function drawMinimap() {
  if (gameState !== STATE_PLAY) return;

  let mapX = CANVAS_W - 200;
  let mapY = HUD_TOP + mapPad + 15;

  mapBounds = { x: mapX, y: mapY, w: mapW, h: mapH };

  noStroke();
  fill(8, 10, 25, 210);
  rectMode(CORNER);
  rect(mapX, mapY, mapW, mapH, mapBorder);

  noFill();
  stroke(80, 90, 130, 180);
  strokeWeight(1);
  rect(mapX, mapY, mapW, mapH, mapBorder);
  noStroke();

  function wx(x) {
    return mapX + x * (mapW / CANVAS_W);
  }

  function wy(y) {
    return mapY + y * (mapH / CANVAS_H);
  }

  function ws(s) {
    return max(1, s * (mapW / CANVAS_W));
  }

  for (let cz of calmZones) {
    fill(50, 185, 120, 120);
    rect(wx(cz.x), wy(cz.y), ws(cz.w), max(1, cz.h * (mapH / CANVAS_H)));
  }

  for (let w of walls) {
    fill(90, 85, 115, 200);
    rect(wx(w.x), wy(w.y), max(1, ws(w.w)), max(1, w.h * (mapH / CANVAS_H)));
  }

  for (let s of stars) {
    fill(255, 210, 50);
    ellipse(wx(s.x), wy(s.y), 4, 4);
  }

  let pulse = lowSensoryMode ? 0 : sin(frameCount * 0.12) * 1.5;
  fill(230, 115, 70, 80);
  ellipse(wx(playerX), wy(playerY), 10 + pulse, 10 + pulse);
  fill(255, 160, 80);
  ellipse(wx(playerX), wy(playerY), 5 + pulse * 0.5, 5 + pulse * 0.5);

  textAlign(LEFT, TOP);
  fill(160, 165, 200, 160);
  textSize(8);
  noStroke();
  text("MAP", mapX + 5, mapY + 3);

  textAlign(RIGHT, TOP);
  textSize(8);
  text("Press M to Expand", mapX + mapW - 5, mapY + 3);

  textAlign(CENTER, CENTER);
}

function drawExpandedMap() {
  if (!miniMapExpanded) return;

  noStroke();
  fill(0, 0, 0, 175);
  rectMode(CORNER);
  rect(0, 0, CANVAS_W, CANVAS_H);

  let mW = CANVAS_W * 0.72;
  let mH = CANVAS_H * 0.72;
  let mX = (CANVAS_W - mW) / 2;
  let mY = (CANVAS_H - mH) / 2;

  fill(8, 10, 28, 245);
  rect(mX, mY, mW, mH, 10);

  noFill();
  stroke(90, 100, 150, 200);
  strokeWeight(1.5);
  rect(mX, mY, mW, mH, 10);
  noStroke();

  function ex(x) {
    return mX + x * (mW / CANVAS_W);
  }
  function ey(y) {
    return mY + y * (mH / CANVAS_H);
  }
  function es(s) {
    return max(1, s * (mW / CANVAS_W));
  }
  function esH(h) {
    return max(1, h * (mH / CANVAS_H));
  }

  fill(20, 22, 42, 180);
  rect(ex(0), ey(HUD_TOP), mW, mH - ey(HUD_TOP) + mY);

  for (let cz of calmZones) {
    fill(50, 185, 120, 130);
    rect(ex(cz.x), ey(cz.y), es(cz.w), esH(cz.h), 2);
    // Label
    fill(120, 255, 180, 180);
    textSize(8);
    textAlign(CENTER, CENTER);
    text("calm", ex(cz.x) + es(cz.w) / 2, ey(cz.y) + esH(cz.h) / 2);
  }

  for (let sz of stimulusZones) {
    fill(220, 60, 50, 100);
    rect(ex(sz.x), ey(sz.y), es(sz.w), esH(sz.h), 2);
  }

  for (let w of walls) {
    fill(100, 95, 130, 220);
    rect(ex(w.x), ey(w.y), es(w.w), esH(w.h), 2);
  }

  for (let i = 0; i < checkpoints.length; i++) {
    let cp = checkpoints[i];
    let isActive = i === checkpointIndex;
    fill(
      isActive ? 180 : 100,
      isActive ? 220 : 140,
      isActive ? 255 : 180,
      isActive ? 200 : 90,
    );
    ellipse(ex(cp.x), ey(cp.y), isActive ? 8 : 5, isActive ? 8 : 5);
    if (isActive) {
      fill(200, 230, 255, 200);
      textSize(7);
      textAlign(CENTER, CENTER);
      text("CP", ex(cp.x), ey(cp.y) - 7);
    }
  }

  for (let s of stars) {
    fill(255, 210, 50, 220);
    ellipse(ex(s.x), ey(s.y), 9, 9);
    fill(255, 240, 150, 200);
    textSize(8);
    textAlign(CENTER, CENTER);
    text(s.label || "★", ex(s.x), ey(s.y) - 9);
  }

  let pulse = sin(frameCount * 0.14) * 2;
  fill(230, 115, 70, 90);
  ellipse(ex(playerX), ey(playerY), 18 + pulse, 18 + pulse);
  fill(255, 160, 80);
  ellipse(ex(playerX), ey(playerY), 9, 9);
  fill(255, 220, 180);
  ellipse(ex(playerX), ey(playerY), 4, 4);

  textAlign(CENTER, TOP);
  fill(255, 210, 75);
  textSize(13);
  textStyle(BOLD);
  text("MAP  —  " + currentStageName(), CANVAS_W / 2, mY + 10);
  textStyle(NORMAL);

  // ---- LEGEND ----
  let legY = mY + mH - 18;
  let legX = mX + 14;
  textSize(8);
  textAlign(LEFT, CENTER);

  fill(230, 115, 70);
  ellipse(legX + 4, legY, 7, 7);
  fill(200, 200, 220);
  text("You", legX + 10, legY);

  fill(255, 210, 50);
  ellipse(legX + 46, legY, 7, 7);
  fill(200, 200, 220);
  text("Task", legX + 52, legY);

  fill(50, 185, 120, 160);
  rect(legX + 82, legY - 4, 8, 8, 2);
  fill(200, 200, 220);
  text("Calm", legX + 94, legY);

  fill(220, 60, 50, 140);
  rect(legX + 126, legY - 4, 8, 8, 2);
  fill(200, 200, 220);
  text("Stimulus", legX + 138, legY);

  textAlign(RIGHT, TOP);
  fill(140, 145, 180, 180);
  textSize(12);
  text("Press M to close", mX + mW - 10, mY + 10);

  textAlign(CENTER, CENTER);
  noStroke();
}
