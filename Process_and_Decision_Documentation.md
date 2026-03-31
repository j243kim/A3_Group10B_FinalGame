# Process and Decision Documentation

**Group:** 10B
**Assignment:** A2 — Mid-Term Game
**Disability Topic:** Traumatic Brain Injury (TBI)
**Date:** March 3, 2026

---

## 1. Role-Based Contributions

*[Update this section with all group members and their roles as defined in your GenAI Group Charter.]*

| Member | Primary Role | Shadow Role | Key Contributions |
|--------|-------------|-------------|-------------------|
| Jimin Kim | Project Setup / Core Game Loop | [Shadow role] | Set up project structure, initialized GitHub repository, implemented core game state machine (start/play/win/lose) |
| Catarina Jin | Misc. | Player Styling | Added visual styles to the player and supported minor UI improvements |
| Kaiyang Sun (Kevin) | Environment Design & TBI Mechanics | Code Organization | Redesigned calm zones into an active player-triggered ability (Calm Ability using J key), implemented image-based environment elements (car, house, sky), and integrated assets into the gameplay scene |
| Annora Jo | Map UI Improvement | Research | Designed zoomed-in map and mini-map system and supported research for UI and accessibility decisions |
---

## 2. Key Design Decisions

### 2.1 Project Structure
The project was organized following the assignment's required folder structure:
- `index.html` — Main HTML file loading p5.js and the game sketch
- `sketch.js` — Primary JavaScript file with game logic
- `style.css` — Stylesheet for page styling
- `jsconfig.json` — VS Code configuration
- `libraries/` — Contains p5.min.js (v1.9.0) loaded locally
- `assets/images/`, `assets/sounds/`, `assets/fonts/` — Asset directories

### 2.2 Core Game Loop Architecture
The game uses a state machine pattern with four states: `STATE_START`, `STATE_PLAY`, `STATE_WIN`, and `STATE_LOSE`. The `draw()` function uses a `switch` statement to render the appropriate screen based on the current state. This was chosen for clarity and ease of extending with additional states later.

### 2.3 Technology Choices
- **Framework:** p5.js (v1.9.0) — required by the course
- **Canvas size:** 800 x 600 pixels
- **Hosting:** GitHub Pages, deployed from the `main` branch

### 2.4 TBI Mechanic Design (Calm Ability)

Originally, calm zones functioned as passive areas that automatically reduced overload when the player entered them. This was redesigned into an active ability system to better reflect player agency and decision-making. Players now collect energy from calm zones and must press a key (J) to activate the calming effect. This change introduces timing, resource management, and intentional action, making the mechanic more engaging and aligned with gameplay design principles.

### 2.5 Environment Representation

To make the experience more grounded and relatable, abstract barriers were replaced or supplemented visual elements such as houses, vehicles, and environmental backgrounds. These assets help contextualize sources of sensory overload and better connect gameplay to real-life situations related to TBI.

*[Add further design decisions as the game develops — e.g., mechanic choices, visual direction, how TBI is represented.]*

---

## 3. GenAI Use Documentation

### 3.1 Task: Project Structure Setup and Core Game Loop

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Opus 4.6) via VS Code extension |
| **Date** | March 3, 2026 |
| **Task Description** | Setting up the project folder structure, creating all required files (index.html, sketch.js, style.css, jsconfig.json, README.md), downloading the p5.js library, and implementing the core game state machine with start, play, win, and lose screens. |
| **How GenAI Was Used** | Claude Code was prompted with the assignment requirements (A2 PDF) and asked to scaffold the project. It created the directory structure, downloaded p5.min.js, wrote the boilerplate HTML/CSS/JS files, and built a game loop with four states and stub functions for game logic. |
| **What Was Modified After Generation** | The p5.js script source path in index.html was cleared (set to empty string) for manual configuration. |

### 3.2 Task: Git Repository Setup Assistance

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Opus 4.6) via VS Code extension |
| **Date** | March 3, 2026 |
| **Task Description** | Troubleshooting git push errors when pushing to GitHub. |
| **How GenAI Was Used** | Claude Code identified that the local branch was named "master" while the push target was "main", and recommended renaming the branch with `git branch -M main` before pushing. |
| **What Was Modified After Generation** | No modifications — commands were run as suggested. |

### 3.3 Task: Redesigning Calm Zone into Player Ability

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | ChatGPT (GPT-5.3) |
| **Date** | March 28 2026 |
| **Task Description** | Converting the calm zone mechanic from a passive area-based recovery system into an active player-triggered ability. |
| **How GenAI Was Used** | The model was prompted to suggest how to redesign an existing mechanic so that players actively control recovery instead of receiving automatic effects. It provided guidance on using a key-triggered system, implementing cooldowns, and displaying ability charges in the HUD. |
| **What Was Modified After Generation** | The implementation was simplified to match beginner-level JavaScript knowledge. Complex mechanics were reduced to basic timers and key input logic, and integrated into the existing game loop structure. |

### 3.4 Task: Finding Game Asset Resources

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | ChatGPT (GPT-5.3) |
| **Date** | March 28 2026 |
| **Task Description** | Identifying reliable sources for free and usable game assets to support environment design. |
| **How GenAI Was Used** | The model suggested platforms such as itch.io and OpenGameArt, and provided guidance on selecting appropriate assets (e.g., cars, houses, sky backgrounds) that match the game’s visual style. |
| **What Was Modified After Generation** | Asset selection was adjusted manually to ensure visual consistency and appropriate file naming. File structure and integration into the p5.js project were implemented manually. |
### 3.5 Task: Debugging Blank Screen and Fixing Swapped Code Blocks in drawStage()

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Sonnet 4.6) via VS Code extension |
| **Date** | March 31, 2026 |
| **Task Description** | Diagnosing why the game displayed only a navy background when launched via Live Server, then fixing two logic bugs inside `drawStage()` in `sketch.js`. |
| **How GenAI Was Used** | Claude Code identified that the navy background was the CSS `body` background color, meaning the p5.js canvas never rendered due to a JavaScript error. After inspecting the console screenshot (Chrome reported `SyntaxError: Unexpected token '}'` at line 2378), Claude performed brace/paren/bracket balance analysis and determined the browser was showing a stale cached version. It then identified two swapped `if (currentStage === 2)` blocks inside `drawStage()`: the task-image drawing code had been placed in the `for (let sz of stimulusZones)` loop (referencing undefined variable `s`), and the stimulus-zone rendering code had been placed in the `for (let s of stars)` loop (referencing undefined variable `sz`). Claude swapped them back to their correct loops. |
| **What Was Modified After Generation** | No further modifications — the fixes were applied directly as suggested. A hard browser reload (Cmd+Shift+R) was recommended to clear the cached version of `sketch.js`. |

### 3.6 Task: Fixing Calm Zone Rendering Condition

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Sonnet 4.6) via VS Code extension |
| **Date** | March 31, 2026 |
| **Task Description** | Calm zones were not rendering in any stage even after the earlier bug fixes. |
| **How GenAI Was Used** | Claude Code read the `drawStage()` rendering code and found the condition guarding the calm zone draw loop: `if (currentStage !== 0 && currentStage !== 1 && currentStage !== 2)`. Since the game only has stages 0, 1, and 2, this condition was never true — calm zones were never drawn. Claude removed the impossible condition so calm zones render in all stages. |
| **What Was Modified After Generation** | No further modifications. |

### 3.7 Task: Replacing Green Calm Zone Box with Images and Glow Effect

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Sonnet 4.6) via VS Code extension |
| **Date** | March 31, 2026 |
| **Task Description** | Replacing the abstract green rectangle calm zone indicator with the existing in-game images (bed, bench, sofa, coffee) and adding a soft pulsing glow effect around each object instead of a box. |
| **How GenAI Was Used** | Claude Code read the calm zone definitions in `createStages()`, the scene drawing functions (`drawStageOneScene`, `drawStageTwoScene`, `drawStageThreeScene`), and `drawCalmZone()`. It added an `img` reference to each calm zone definition, removed the duplicate image drawing that was causing overlap, and refactored `drawCalmZone` to remove the green box. It then split rendering into two passes: a pre-scene `drawCalmZoneGlow()` function that draws layered semi-transparent rectangles behind the object for a bloom glow effect, and a post-scene text pass that shows "Recovering..." when the player is inside the zone. |
| **What Was Modified After Generation** | No further modifications. |

### 3.8 Task: Fixing Calm Zone Recovery Mechanic

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Sonnet 4.6) via VS Code extension |
| **Date** | March 31, 2026 |
| **Task Description** | Players standing in a calm zone could not recover overload even though "Recovering..." text appeared. |
| **How GenAI Was Used** | Claude Code traced the calm zone gameplay logic and identified that the zone only refilled `calmAbilityCharges` (for the J key), but since charges were already at maximum (2/2) on entry, the condition `calmAbilityCharges < calmAbilityMax` was always false and nothing happened. Overload was never reduced directly. Claude added `overload -= 0.5` per frame while the player is inside a calm zone, so standing in the zone actively lowers overload while also still refilling J charges when depleted. |
| **What Was Modified After Generation** | No further modifications. |

---

### Conversation Log

**User (Jimin):**
> Please read this document [A2 assignment PDF]. My role is to set up the project structure and core game loop (start/play/win/lose). The assigned disability for our group is Traumatic Brain Injury. Please set up the appropriate files into this directory.

**Claude Code:**
> Created the full project structure including: `index.html`, `sketch.js` (with 4-state game loop), `style.css`, `jsconfig.json`, `README.md`, `assets/` subdirectories (images, sounds, fonts), and `libraries/p5.min.js`.

**User (Kevin):**
> How can I redesign calm zones so they are not passive areas but something the player actively controls?

**ChatGPT:**
> Suggested converting the mechanic into a key-triggered ability system with limited charges and cooldown, allowing players to decide when to activate recovery.

**User (Kevin):**
> Where can I find free game assets for cars, houses, and environment visuals?

**ChatGPT:**
> Recommended platforms such as itch.io and OpenGameArt, and explained how to download, organize, and integrate assets into a p5.js project.

**User (Jimin):**
> Right now, when I run the project with Live Server through index.html, it just opens without anything in it — just the navy colored background and it takes a bit of time to fetch the program. What is the problem?

**Claude Code:**
> Identified that the navy color is the CSS `body` background (`#1a1a2e`), not the canvas — meaning the p5.js canvas never rendered due to a JavaScript error. After reviewing a browser console screenshot showing `SyntaxError: Unexpected token '}'` at `sketch.js:2378`, Claude performed syntax analysis and concluded the browser was serving a stale cached version. Claude then found two swapped `if (currentStage === 2)` code blocks inside `drawStage()`: task-image drawing code was incorrectly placed inside the `stimulusZones` loop (using undefined variable `s`), and stimulus-zone rendering code was incorrectly placed inside the `stars` loop (using undefined variable `sz`). Both blocks were fixed and a hard reload (Cmd+Shift+R) was recommended.

**User (Jimin):**
> Right now the calm zones in each stage don't work. What would be the problem?

**Claude Code:**
> Found that `drawStage()` wrapped the calm zone draw loop in an impossible condition: `if (currentStage !== 0 && currentStage !== 1 && currentStage !== 2)`. Since all stages are 0, 1, or 2, this block was unreachable. Removed the condition entirely so calm zones render in every stage.

**User (Jimin):**
> I wanted to replace the green calm zone with the images that I already have in the code.

**Claude Code:**
> Added `img` references to each calm zone definition in `createStages()` (`bedImg` for stage 1, `benchImg` for stage 2, `sofaImg` and `coffeeImg` for stage 3), then updated `drawCalmZone()` to skip drawing the green rectangle when an image is assigned, since the scene drawing functions already render those images.

**User (Jimin):**
> Can you even remove the box with Calm label? I just want to replace the calm zone with just the image without any label.

**Claude Code:**
> Simplified `drawCalmZone()` to render nothing when a calm zone has an image — no box, no label, no border.

**User (Jimin):**
> The calm zone image got overlapped.

**Claude Code:**
> Identified the cause: images were being drawn twice — once by the scene function (e.g., `drawStageOneScene`) and once by `drawCalmZone`. Fixed by making `drawCalmZone` skip image rendering entirely when `cz.img` is set, since the scene functions already handle it.

**User (Jimin):**
> I can't recover even when I'm in the calm zone.

**Claude Code:**
> Traced the issue to the calm zone logic only refilling `calmAbilityCharges` (J key), but since charges were already at maximum on entry, the condition `calmAbilityCharges < calmAbilityMax` was always false. Added `overload -= 0.5` per frame while the player is inside a calm zone so overload actively decreases on contact.

**User (Jimin):**
> Is it possible to make a glowing effect around the calm zone object instead of the box in the object to indicate it's the calm zone?

**Claude Code:**
> Refactored into two rendering passes: added `drawCalmZoneGlow()` called before the scene draws its images, which renders three expanding semi-transparent green rectangles (bloom layers) behind the object. The post-scene `drawCalmZone()` pass now only displays "Recovering..." text above the zone when the player is inside. This gives a soft pulsing glow radiating outward from the image with no box drawn over it.

---

*[Add additional GenAI usage entries for other tasks as the project develops. If no GenAI was used for a particular task, explicitly state so.]*
