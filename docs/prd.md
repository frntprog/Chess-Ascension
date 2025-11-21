# Product Requirements Document — Chess Ascension

## 1. Overview  
Chess Ascension is a session-based web chess game offering two modes:
1. **Classic Mode** — traditional chess vs Stockfish AI.  
2. **RPG Mode** — classic chess enriched with light RPG mechanics: scores, abilities, unlocks, skins, XP progression.

The system is fully client-side.  
All persistent user data is stored in **localStorage** (nickname-based local profile).  
All gameplay (chess.js, stockfish.js, scoring, abilities) runs client-side in session state (Zustand).  

**Note:** MVP uses localStorage for profile persistence. Architecture is modular to enable Firebase integration after MVP.

---

## 2. Objectives

### Primary Objectives  
- Deliver stable Classic Mode using chess.js, stockfish.js, and react-chessboard.  
- Implement session scoring and XP system.  
- Provide persistent user progression via localStorage:
  - XP, level, rank
  - skins, abilities
  - match statistics

### Secondary Objectives  
- RPG Mode with in-match abilities purchased using session score.  
- Unlockable cosmetics and abilities based on user XP level.  
- Difficulty selection dependent on user level.

---

## 3. User Roles  
**Player** — creates a local profile with nickname, plays matches, earns XP, unlocks skins & abilities. Profile data persists in localStorage.

---

## 4. User Flows

### 4.1 Classic Mode Flow  
1. User creates/loads local profile (nickname).  
2. User selects difficulty.  
3. Plays match vs Stockfish.  
4. Score is earned for captured pieces.  
5. XP is computed from score.  
6. Local profile is updated with XP, level, rank, stats (stored in localStorage).

### 4.2 RPG Mode Flow  
1. User selects RPG Mode.  
2. Score accumulates during match.  
3. User may spend score on in-match abilities:
   - **Double Move**
   - **Tactical Hint**
   - **Shield** (unlock-based)  
4. XP awarded at end of match.  
5. Profile updated with any level-up unlocks.

---

## 5. Features

### 5.1 Core Features (V1)
- Landing page  
- Local profile system (nickname-based):
  - Create profile: User enters nickname (no email/password)
  - Profile stored in localStorage
  - Profile data: nickname, xp, level, rank, unlockedSkins, selectedSkin, unlockedAbilities, gamesPlayed, bestScore, wins/losses  
- Classic Mode:
  - react-chessboard
  - chess.js rules
  - stockfish.js AI (browser Web Worker)  
- Score system (session-only, Zustand)  
- XP conversion: `XP = floor(score / 10)`

### 5.2 Extended Features (V2)
- RPG Mode + ability panel  
- In-match abilities (costs session score):
  - **Double Move** (~60 score)
  - **Tactical Hint** (~25 score)
  - **Shield** (~90–100 score, unlockable)  
- Optional passive: *Queen’s Revenge* (simple, not required)  
- Skin unlocks by level:
  - Level 1: Classic  
  - Level 3: Monochrome  
  - Level 5: Neon  
  - Level 7: Gold  
- Ranks:
  - Pawn → Knight → Bishop → Rook → Queen  
- Difficulty unlocks by user level

---

## 6. Scoring Rules  
- Pawn: +10  
- Knight/Bishop: +20  
- Rook: +40  
- Queen: +60  

Optional combo bonuses:
- 2 captures in 2 turns: +10  
- 3 captures in 3 turns: +20  

All scoring lives only in client-side session state.

---

## 7. Progression System (Persistent in localStorage)

### XP  
`XP = floor(score / 10)`  
Stored in localStorage per user profile.

### Level  
Level increases based on accumulated XP.  
Levels unlock cosmetics, abilities, difficulty tiers.

### Rank  
Based on level ranges:
- Level 1–2 → Pawn  
- Level 3–4 → Knight  
- Level 5–6 → Bishop  
- Level 7–8 → Rook  
- Level 9–10 → Queen

### Skins  
Stored as:
unlockedSkins: string[]
selectedSkin: string

### Abilities  
Stored as:
unlockedAbilities: string[]
Abilities unlock at certain levels (e.g., Shield at Level 5).

### Stats  
- bestScore  
- gamesPlayed  
- wins/losses  

---

## 8. Data Model (localStorage)

**Storage Key:** `chessAscensionProfile`

**Profile Object:**
{
nickname: string,

xp: number,
level: number,
rank: string,

unlockedSkins: string[],
selectedSkin: string,

unlockedAbilities: string[],

gamesPlayed: number,
bestScore: number,
wins: number,
losses: number
}

**Note:** Stored as JSON string in localStorage. Single profile per browser/device.

---

## 9. Technical Stack

### Frontend  
- React + Vite  
- TypeScript  
- Zustand (session state)  
- TailwindCSS  
- react-chessboard  
- chess.js  
- stockfish.js (Web Worker)

### Backend  
- **localStorage** for profile persistence  
- **Firebase Hosting** for deployment  
- No custom backend required  
- No Firebase Auth/Firestore for MVP (modular architecture enables Firebase integration post-MVP)

---

## 10. Non-Goals  
- No multiplayer  
- No backend server (NestJS removed)  
- No persistent game states or match history  
- No campaigns or deep RPG systems

---

## 11. MVP Success Criteria  
- User can create/load local profile with nickname  
- User profile loads and updates from localStorage  
- Classic Mode works end-to-end  
- Score + XP conversion works  
- Level & rank update correctly  
- App is clean, stable, responsive  

## 12. MVP Scope Note

**Scope Adjustment:** MVP uses localStorage instead of Firebase Authentication + Firestore to reduce development time and remove backend dependency risks. This allows reliable delivery of core gameplay loop, AI opponent, scoring, XP preview, and main user flow within hackathon timeline.

**No functional loss for MVP user journey:**
- Registration becomes lightweight "Create Profile" step (nickname only)
- All progression (XP/level/stats) still works, stored client-side
- Faster development, fewer moving parts

**Future:** Architecture remains modular, enabling easy Firebase integration after MVP if needed.  

