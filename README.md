# Fragmented – A TBI Awareness Game

## Group Number

Group 10B — GBDA 302: Global Digital Project 2 (Winter 2026)

## Group Members

| Name                | WatID         | Student Number |
| ------------------- | ------------- | -------------- |
| Jimin Kim           | j243kim       | 21062367       |
| Catarina Jin        | c59jin        | 21077832       |
| Kaiyang Sun (Kevin) | ky3sun        | 2102654        |
| Annora Jo           | a3jo          | 21065832       |

## Description

Fragmented is a p5.js game that fosters empathy and understanding around Traumatic Brain Injury (TBI). Players progress through three stages representing a typical day — morning routine at home, running errands outside, and getting through work — while managing cognitive and sensory challenges that mirror the lived experience of TBI.

The game includes the following core mechanics:

1. **Memory Fade** – The on-screen objective text gradually fades over time, requiring players to press M to briefly recall it. This represents the short-term memory difficulties commonly experienced after TBI [1][2].
2. **Sensory Overload** – An overload meter rises continuously, accelerating when the player is near stimulus zones (TV, phone, car, screen glare, printer). Calm zones reduce overload on contact. The mechanic reflects sensory processing difficulties documented in TBI research [3].
3. **Cognitive Fatigue** – Player movement speed decreases as overload increases, simulating the physical and mental fatigue associated with sustained cognitive effort after TBI [2].
4. **Intrusive Distractions** – Semi-random visual noise elements appear on screen as overload grows, representing impaired stimulus filtering [3].
5. **Attention Drift** – At high overload, slight random offsets are added to player movement input, representing reduced motor and cognitive control [2].
6. **Emotional Frustration** – On-screen thought messages appear during gameplay, voicing the inner emotional struggle of performing simple tasks under strain [3].
7. **Fading Awareness** – Distant collectible stars become harder to see at high overload, representing fading spatial and task memory [2].

The game uses procedurally generated audio through the Web Audio API — layered ambient soundscapes, proximity-based obstacle sounds, and bandpass-filtered white noise — to create an evolving sense of sensory pressure without relying on pre-recorded audio files. A Low Sensory Mode (press L) is available for accessibility [4].

The design philosophy follows Bogost's concept of procedural rhetoric [5]: the game communicates the TBI experience through its interactive systems rather than through narrative exposition alone.

---

## Setup and Interaction Instructions

1. Open the game via the GitHub Pages link, or open `index.html` in Google Chrome.
2. Press **ENTER** to start the game.
3. Use **WASD or arrow keys** to move the player.
4. Press **M** to briefly recall the objective when it fades.
5. Press **J** to activate the Calm Ability (if charges are available).
6. Press **L** to toggle Low Sensory Mode.
7. Press **R** to return to the title screen.
8. Press **N** to toggle the map.

---

## Iteration Notes

### Post-Playtest

During the in-class playtesting session (Week 11), peers played the near-final prototype and provided informal feedback. Key observations included: the high-pitched background tones were too harsh and distracting, the visual effects could be mistaken for a low-vision simulation rather than a TBI experience, and Stage 3 felt repetitive because it reused the same mechanics as Stage 2. The following three concrete changes were identified and made before the final submission:

1. **Audio redesign — rebalanced background sound and replaced high-pitch tones with white noise**
   - Removed the on-screen instruction "L = Low Sensory Mode."
   - Rebalanced the background audio so it is less distracting.
   - Removed the current high-pitched sound.
   - Replaced it with a softer white noise / ambient sound, and adjusted the frequency so it feels less harsh.

2. **Visual and camera improvements — revised presentation so the game is not mistaken for a low-vision simulation**
   - Revised the visual presentation so it is less likely to be mistaken for a low-vision game.
   - Instead of relying on that effect, made the camera track and zoom in on the character.

3. **Stage 3 mechanic and controls — added a new Level 3 mechanic and developer navigation keys**
   - Added a new mechanic for Level 3 instead of reusing the moving obstacle and overload timer from Level 2.
   - If a new Level 3 mechanic is added, removed the K key function.
   - Added default level navigation buttons for easier testing:
     - L = return to the previous level
     - P = skip to the next level

---

## Assets

All image assets listed below are sourced from third-party platforms under their respective free-use licenses. No audio files are used; all audio is procedurally generated via the Web Audio API.

1. Car image — "Red Car Top Down" [6]. Used as the Stage 2 car obstacle.
2. House/environment tileset — "A House" [7]. Used for Stage 1 home environment elements.
3. Sky background — "Sky" [8]. Used as the outdoor background in Stage 2.

All other image assets (furniture, office items, NPC, collectibles, UI elements) were sourced from free asset packs on [itch.io](https://itch.io) and [OpenGameArt](https://opengameart.org).

---

## References

### In-Code Citations (TBI Research)

[1] CDC. 2024. *Get the Facts About TBI.* Centers for Disease Control and Prevention. Retrieved from https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/

[2] Johansson, B., Berglund, P., and Ronnback, L. 2009. Mental fatigue and impaired information processing after mild and moderate traumatic brain injury. *Brain Injury* 23, 13-14, 1027–1040.

[3] Lew, H. L., Poole, J. H., Guillory, S. B., Salerno, R. M., Leskin, G., and Sigford, B. 2006. Persistent problems after traumatic brain injury: The need for long-term follow-up and coordinated care. *Journal of Rehabilitation Research and Development* 43, 2, vii–x.

[4] Game Accessibility Guidelines. 2012. *A reference for inclusive game design.* Retrieved from http://gameaccessibilityguidelines.com

[5] Bogost, I. 2007. *Persuasive Games: The Expressive Power of Videogames.* MIT Press, Cambridge, MA.

### Asset Sources

[6] OpenGameArt. n.d. *Red Car Top Down.* Retrieved from https://opengameart.org/content/red-car-top-down

[7] Azez2. n.d. *A House.* itch.io. Retrieved from https://azez2.itch.io/a-house

[8] Gamer247. n.d. *Sky.* itch.io. Retrieved from https://gamer247.itch.io/sky
