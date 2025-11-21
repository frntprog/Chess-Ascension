# Architecture — Chess Ascension

## 1. System Overview
Chess Ascension is a fully client-side web application deployed on Firebase Hosting.
All gameplay logic runs inside the browser (React + React Router + chess.js + Stockfish Web Worker).
Persistent player progression (XP, level, rank, skins, abilities, stats) is stored in **localStorage** (MVP simplification).
Session data (score, abilities, buffs, move state) is kept exclusively in frontend state (Zustand).

**MVP Note:** Firebase Authentication and Firestore are replaced with localStorage for faster MVP delivery. The modular architecture is preserved to allow seamless Firebase integration later without refactoring.

No custom backend is used. No server-side evaluation or game simulation is required.

---

## 2. High-Level Architecture (Text Overview)

Client (React App)
│
├── Routing Layer (React Router)
│
├── UI Layer (React + Tailwind)
│
├── Game Engine Layer
│     ├── chess.js (rules + move validation)
│     ├── react-chessboard (visual board)
│     └── stockfish.wasm Worker (AI)
│
├── Session State Layer (Zustand)
│     ├── boardState
│     ├── sessionScore
│     ├── sessionAbilities
│     ├── rpgFlags (doubleMoveActive, shieldActive, etc.)
│     ├── difficulty
│     └── sessionLifecycle (match start/end)
│
├── Profile State Layer (Zustand + localStorage syncing)
│     ├── nickname (user identifier)
│     ├── xp
│     ├── level
│     ├── rank
│     ├── unlockedSkins
│     ├── selectedSkin
│     ├── unlockedAbilities
│     ├── bestScore
│     └── stats (gamesPlayed, wins/losses)
│
└── Persistence Layer (localStorage)
      └── Profile storage (key: "chess-ascension-profile")

---

## 3. Component Responsibilities

### Routing Layer (React Router)
- Client-side routing for all pages (Landing, Onboarding, Profile, PlayClassic, PlayRPG).
- Route definitions in `routes.ts`.
- Handles navigation (route protection optional for MVP).

### UI Layer
- Rendering chessboard, buttons, ability panel, profile UI.
- Applying selected skin via Tailwind CSS theme variables.
- Zero game logic; delegates everything downward.

### Game Engine Layer
- chess.js controls legal moves, game state, checkmate logic.
- react-chessboard renders board and pieces.
- stockfish.wasm Worker computes best move asynchronously.
- No direct persistence interactions.

### Session Layer (Zustand)
Responsible for:
- Current board state (FEN)
- Score logic
- Ability activation + costs
- Ability flags (doubleMove, hintMode, shield, etc.)
- NPC turn logic (Stockfish call)
- Session reset when match ends

This layer **never** writes to persistence directly.

### Profile Layer (Zustand + localStorage)
Responsible for:
- User nickname (local identifier)
- XP, level, rank
- Unlocked skins
- Unlocked abilities
- Persistent stats

This layer:
- Reads from localStorage on app load
- Writes updates after match end
- Exposes a clean API for UI and session layer
- **Architecture Note:** Designed with abstraction layer to allow Firebase integration later without refactoring

---

## 4. Data Flow Summary

### Match Start
1. User selects mode + difficulty.
2. Session store initializes:
   - score = 0
   - abilities reset
   - rpgFlags reset
   - board loaded from initial FEN

### During Match
- User moves → chess.js validates → UI updates.
- AI move → via Stockfish Worker → updated FEN.
- Score increments based on captured pieces.
- User may activate abilities (score cost deducted).

### Match End
- Session store calculates XP = floor(score / 10).
- Profile store updates localStorage:
  - xp (accumulated)
  - level (recomputed from accumulated XP)
  - rank (from level mapping)
  - bestScore (if improved)
  - stats (gamesPlayed, results)
- Session store resets to default.

---

## 5. Ability System Architecture

Abilities are **client-side actions** that modify session state but never modify chess.js rules directly.

### Ability Types:

#### 1. Double Move
- Session flag: `doubleMoveActive = true`
- Allows two legal moves back-to-back.
- No chess.js modification required.

#### 2. Tactical Hint
- Session action: call Stockfish Worker for best move.
- Returns a move but does not enforce it.
- UI highlights recommended cells.

#### 3. Shield
- Session flag: `shieldedPieceSquare = "e4"` (example)
- On AI move:
  - If AI attempts capture of shielded square → ignore capture.
- No modification to chess.js internal logic.

All abilities follow KISS: simple flags, conditions, local operations.

---

## 6. localStorage Structure

**Storage Key:** `chess-ascension-profile`

**Data Structure:**
```typescript
{
  nickname: string,           // User-chosen identifier
  xp: number,                 // Accumulated XP
  level: number,              // Current level (calculated from XP)
  rank: string,              // Current rank (Pawn, Knight, etc.)
  unlockedSkins: string[],   // Array of unlocked skin names
  selectedSkin: string,      // Currently active skin
  unlockedAbilities: string[], // Array of unlocked ability names
  bestScore: number,          // Highest score achieved
  gamesPlayed: number,        // Total matches played
  wins: number,               // Total wins
  losses: number             // Total losses
}
```

**Initial Profile (on first play):**
```typescript
{
  nickname: "",               // Set during onboarding
  xp: 0,
  level: 1,
  rank: "Pawn",
  unlockedSkins: ["Classic"],
  selectedSkin: "Classic",
  unlockedAbilities: [],
  bestScore: 0,
  gamesPlayed: 0,
  wins: 0,
  losses: 0
}
```

**Migration Path:** The data structure matches Firestore schema, allowing seamless migration to Firebase later.

---

## 7. Onboarding Flow (MVP)

**First-Time User:**
1. User visits landing page
2. User clicks "Start Playing"
3. Onboarding page prompts for nickname (optional, defaults to "Player")
4. Profile created in localStorage with initial values
5. User proceeds to mode selection

**Returning User:**
1. App loads profile from localStorage on mount
2. If profile exists, user proceeds directly to mode selection
3. If no profile, redirect to onboarding

**No authentication required for MVP** - profile is device-local.


---

## 8. File & Folder Structure (Client-Only Monorepo)

/src
/app
main.tsx
routes.ts # React Router route definitions
/components
Board/
ChessBoard.tsx
AbilityPanel.tsx
ScoreDisplay.tsx
UI/
Button.tsx
Card.tsx
/core
chess/
engine.ts # chess.js wrapper
stockfishWorker.ts
stockfishLoader.ts
abilities/
abilities.ts # definitions + costs
useAbilities.ts # Zustand slice
/stores
sessionStore.ts # score, FEN, abilities, rpg flags
profileStore.ts # xp, level, rank, skins, localStorage sync
/services
localStorageApi.ts # load/save profile (abstraction for future Firebase migration)
/utils
calculateXP.ts
calculateLevel.ts
rankMapping.ts
/pages
Landing.tsx
Onboarding.tsx # nickname input (replaces Login for MVP)
Profile.tsx
PlayClassic.tsx
PlayRPG.tsx
/themes
skins.css # color themes
tailwind.config.js

/public
worker/stockfish.wasm
worker/stockfish.js

firebase.json # Firebase Hosting config (deployment only)


---

## 9. Principles

- **KISS:**  
  - All logic client-side.  
  - Chess engine untouched.  
  - Abilities = simple state flags.  
  - No custom backend.

- **DRY:**  
  - Reusable ability definitions.  
  - Zustand split into clean slices.  
  - Single localStorage read/write per match.
  - Abstraction layer for persistence (allows Firebase migration without refactoring).

---

## 10. Risks & Mitigations

- **Stockfish performance** → use WASM worker (already planned).  
- **localStorage write spam** → only write after match end.  
- **Ability abuse** → abilities limited by score cost & flags.  
- **Race conditions in multi-step actions** → unified session reducer.
- **localStorage data loss** → browser clear data will reset profile (acceptable for MVP, Firebase migration addresses this).
- **Multi-device sync** → not supported in MVP (localStorage is device-local, Firebase migration enables sync).

---

## 11. Summary

A minimal, stable, client-only architecture using:
- React + React Router for UI/routing
- Zustand for state management
- chess.js + Stockfish WASM for gameplay
- localStorage for progression persistence (MVP simplification)
- Tailwind for skins/theme
- Firebase Hosting for deployment
- No backend, no heavy infrastructure

**MVP Simplifications:**
- localStorage replaces Firebase Auth + Firestore for faster delivery
- Onboarding flow (nickname input) replaces authentication
- Profile is device-local (no multi-device sync)
- Architecture remains modular to allow Firebase integration later

This architecture aligns fully with KISS/DRY and hackathon constraints while preserving upgrade path to Firebase.

