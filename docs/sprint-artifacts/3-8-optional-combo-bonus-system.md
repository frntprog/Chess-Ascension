# Story 3.8: Optional Combo Bonus System

Status: drafted

## Story

As a user,
I want bonus points for consecutive captures,
so that I'm rewarded for aggressive play.

## Acceptance Criteria

**AC1: Combo Bonus Calculation**
Given a user captures pieces in consecutive turns
When capture streaks occur
Then combo bonuses are awarded:
- 2 captures in 2 turns: +10 bonus
- 3 captures in 3 turns: +20 bonus
- Combo bonus is added to session score
- Combo indicator shown (visual feedback: "Combo! +10" badge)

**AC2: Combo Tracking System**
And combo tracking:
- Tracks last 3 turns for capture detection
- Resets if user goes 1 turn without capture
- Combo bonus is optional (can be disabled via feature flag)

**AC3: Combo Display**
And combo display:
- Shows combo streak (e.g., "2x Combo")
- Visual feedback when combo triggers (badge or animation)

[Source: docs/epics.md#Story-3.8-Optional-Combo-Bonus-System]

## Tasks / Subtasks

- [ ] **Task 1: Create Combo Tracking System in Session Store** (AC: 2)
  - [ ] Open `/src/stores/sessionStore.ts`
  - [ ] Add `captureHistory: Array<{ turn: number; piece: string; timestamp: number }>` field to session store state
  - [ ] Add action: `addCaptureToHistory(piece: string): void` - Add capture to history with turn number
  - [ ] Add action: `resetCaptureHistory(): void` - Clear capture history
  - [ ] Add action: `checkComboStreak(): number` - Returns combo streak count (2 or 3)
  - [ ] Add action: `calculateComboBonus(): number` - Returns bonus points based on streak (2 captures: +10, 3 captures: +20)
  - [ ] Add feature flag: `comboBonusesEnabled: boolean` (default: true) - Allow disabling combo bonuses

- [ ] **Task 2: Integrate Combo Detection in ChessBoard Component** (AC: 1, 2)
  - [ ] Open `/src/components/Board/ChessBoard.tsx`
  - [ ] Import combo tracking actions from session store: `addCaptureToHistory`, `checkComboStreak`, `calculateComboBonus`, `incrementSessionScore`
  - [ ] After user makes valid move and capture is detected:
    - Call `addCaptureToHistory(capturedPiece)` to record capture
    - Call `checkComboStreak()` to check if combo exists (returns 2 or 3)
    - If combo exists: Call `calculateComboBonus()` to get bonus points
    - If bonus > 0: Call `incrementSessionScore(bonus)` to add bonus to score
    - Store combo info for display: `currentCombo: { streak: number, bonus: number }`
  - [ ] Reset combo tracking: If user makes move without capture, reset capture history (call `resetCaptureHistory()`)
  - [ ] Track turn numbers: Increment turn counter for each user move

- [ ] **Task 3: Create Combo Display Component** (AC: 3)
  - [ ] Create `/src/components/Board/ComboDisplay.tsx` file
  - [ ] Import session store: `useSessionStore` to read combo state
  - [ ] Display combo streak: "2x Combo" or "3x Combo" badge
  - [ ] Display combo bonus: "+10" or "+20" badge when combo triggers
  - [ ] Visual feedback: Animate combo badge when combo triggers (scale up, fade in)
  - [ ] Hide combo display when no active combo
  - [ ] Use shadcn/ui Badge component for styling
  - [ ] Style with accent color (#f59e0b) for combo badges

- [ ] **Task 4: Integrate Combo Display in Game Board Page** (AC: 3)
  - [ ] Open `/src/pages/Play.tsx`
  - [ ] Import `ComboDisplay` component: `import ComboDisplay from '@/components/Board/ComboDisplay'`
  - [ ] Add ComboDisplay component to layout:
    - Position: Near score display or above board
    - Layout: Centered or aligned with score display
  - [ ] Ensure combo display updates in real-time (reactive to session store changes)

- [ ] **Task 5: Reset Combo Tracking on Match Start** (AC: 2)
  - [ ] Identify match start trigger (when user selects mode/difficulty and starts match)
  - [ ] Call `resetCaptureHistory()` action when match starts
  - [ ] Verify combo tracking resets to empty at start of each new match
  - [ ] Ensure combo tracking persists during match (not reset during match)

- [ ] **Task 6: Add Combo Reset Logic** (AC: 2)
  - [ ] In ChessBoard component, after user makes move:
    - Check if move resulted in capture
    - If no capture: Call `resetCaptureHistory()` to reset combo streak
    - If capture: Add to history and check for combo
  - [ ] Ensure combo resets correctly when user goes 1 turn without capture

- [ ] **Task 7: Add Feature Flag Support** (AC: 2)
  - [ ] Add `comboBonusesEnabled` flag to session store (default: true)
  - [ ] In combo detection logic, check flag before calculating/adding bonus
  - [ ] If flag is false: Skip combo bonus calculation and display
  - [ ] Allow toggling flag (optional: add UI toggle in settings, or keep as code flag for now)

- [ ] **Task 8: Testing and Verification** (AC: All)
  - [ ] Test combo detection: 2 captures in 2 turns → +10 bonus
  - [ ] Test combo detection: 3 captures in 3 turns → +20 bonus
  - [ ] Test combo reset: 1 turn without capture → combo resets
  - [ ] Test combo display: Shows "2x Combo" and "+10" badge when combo triggers
  - [ ] Test combo display: Shows "3x Combo" and "+20" badge when combo triggers
  - [ ] Test combo tracking resets on match start
  - [ ] Test combo tracking persists during match (not reset during match)
  - [ ] Test feature flag: When disabled, no combo bonuses awarded
  - [ ] Test visual feedback: Combo badge animates when combo triggers
  - [ ] Verify no console errors or warnings

[Source: docs/epics.md#Story-3.8-Optional-Combo-Bonus-System, docs/architecture.md#Session-Layer]

## Dev Notes

### Architecture Patterns and Constraints

**Session Layer:**
- Combo tracking: `captureHistory: Array<{ turn: number; piece: string; timestamp: number }>` in session store (Architecture section 3 - Session Layer)
- Combo bonus calculation: Bonus points added to session score (Architecture section 3 - Session Layer)
- Session-only: Combo tracking NOT persisted to localStorage (Architecture section 3 - Session Layer)
- Session store: `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)
- Combo detection: After piece capture detected, check capture history for streaks (Architecture section 4 - Data Flow: During Match)

**Game Engine Layer:**
- Capture detection: Use existing capture detection from Story 3.7 (`moveResult.move?.captured`) (chess.js API)
- ChessEngine integration: Check captured piece after move execution (from Story 3.5, 3.6, 3.7)
- No direct persistence: Game engine layer does not write to localStorage (Architecture section 3 - Game Engine Layer)

**UI Layer:**
- Combo display component: `/src/components/Board/ComboDisplay.tsx` (custom component)
- Visual feedback: Animation/highlight when combo triggers (UX Design Specification section 7.2 - Feedback Patterns)
- Layout: Combo display positioned near score display or above board (UX Design Specification section 5.2, Journey 2, step 4)

**Component Integration:**
- Combo tracking: Store capture history in session store
- Combo detection: Check capture history after each capture
- Combo bonus: Add bonus to session score using `incrementSessionScore()` action
- Combo display: Reactive component that reads combo state from session store

[Source: docs/architecture.md#Component-Responsibilities, docs/architecture.md#Session-Layer, docs/architecture.md#Data-Flow-Summary]

### Project Structure Notes

**Aligned with Architecture Specification:**
- Combo display component: `/src/components/Board/ComboDisplay.tsx` (Architecture section 8 - File & Folder Structure)
- Combo tracking: Session store actions in `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)

**Integration with Existing Setup:**
- React Router from Story 1.1 supports navigation
- Zustand session store from Story 1.4 provides session state management
- ChessBoard component from Story 3.4, 3.5, 3.6, 3.7 provides move execution and capture detection
- Score calculation utility from Story 3.7 provides piece-to-score mapping
- Score display component from Story 3.7 provides score display patterns
- shadcn/ui components from Story 1.3 provide Badge for combo display styling
- TailwindCSS and Classic Chess theme from Story 1.3 provide styling

**File Structure:**
- New files: `/src/components/Board/ComboDisplay.tsx` (combo display component)
- Modified files: `/src/stores/sessionStore.ts` (add combo tracking fields and actions)
- Modified files: `/src/components/Board/ChessBoard.tsx` (add combo detection logic)
- Modified files: `/src/pages/Play.tsx` (add ComboDisplay component)
- No conflicts with existing structure - follows Architecture section 8 specification

**Component Dependencies:**
- Uses Zustand `useSessionStore` for combo state management
- Uses ChessEngine from Story 3.5, 3.6, 3.7 for move execution and capture detection
- Uses React hooks: `useState`, `useEffect` for component state (if needed)
- Uses shadcn/ui Badge component for combo display styling

[Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo, docs/epics.md#Story-3.8-Optional-Combo-Bonus-System]

### Learnings from Previous Story

**From Story 3.7 (Status: done)**

**New Files Created:**
- `/src/utils/calculateScore.ts` - Score calculation utility function with piece-to-score mapping
- `/src/components/Board/ScoreDisplay.tsx` - Score display component with XP preview and animations

**Modified Files:**
- `/src/stores/sessionStore.ts` - Added session score actions: `setSessionScore`, `incrementSessionScore`, `resetSessionScore`
- `/src/components/Board/ChessBoard.tsx` - Added capture detection and score update logic after user moves
- `/src/core/chess/engine.ts` - Added `history()` method to access move history with verbose information
- `/src/pages/Play.tsx` - Integrated ScoreDisplay component into game board page layout

**Architectural Patterns Established:**
- Capture detection pattern: Use `moveResult.move?.captured` from chess.js to detect captured pieces
- Score update pattern: Call `incrementSessionScore(points)` action from session store after capture detected
- Score display pattern: Create reactive component that reads `sessionScore` from session store
- Visual feedback pattern: Use CSS animations (scale + color change) for score update animations
- Session-only storage: Score stored in Zustand session store, NOT persisted to localStorage

**Technical Notes:**
- Capture detection: `moveResult.move?.captured` contains captured piece type (e.g., "p", "n", "b", "r", "q")
- Score calculation: Use `calculateScoreForPiece(piece)` utility function to map piece type to score value
- Score update: Call `incrementSessionScore(points)` action from session store after capture detected
- Score display: Reactive component that reads `sessionScore` from session store and displays with XP preview
- Visual feedback: CSS animations with scale and color transitions for score update animations
- Session store actions: `incrementSessionScore`, `resetSessionScore` available for score management

**Implementation Approach:**
- Combo tracking: Store capture history in session store with turn numbers
- Combo detection: Check last 2-3 captures in history to detect streaks
- Combo bonus: Calculate bonus based on streak (2 captures: +10, 3 captures: +20)
- Combo display: Create reactive component that shows combo streak and bonus
- Combo reset: Reset capture history when user makes move without capture

**Components Ready for Use:**
- ChessEngine class from Story 3.5, 3.6, 3.7 with `makeMove()`, `getTurn()`, `getFEN()`, `history()` methods
- ChessBoard component from Story 3.4, 3.5, 3.6, 3.7 with move execution, capture detection, and score update
- Session store with `sessionScore`, `boardState`, `difficulty`, `currentTurn`, `gameStatus` fields and actions
- Score calculation utility: `calculateScoreForPiece(piece)` from Story 3.7
- Score display component: ScoreDisplay from Story 3.7 (can be referenced for combo display patterns)
- shadcn/ui components: Button, Card, Badge, Separator, Toast (for combo display and feedback)
- React Router navigation patterns established
- Icon library: lucide-react (for combo display icons if needed)

**Senior Developer Review Notes from Story 3.7:**
- **Approved:** Story 3.7 is complete and approved. All acceptance criteria satisfied. All tasks completed and verified.
- **No unresolved action items:** All review feedback addressed, no pending items
- **Key takeaway:** Score tracking system working correctly, capture detection accurate, visual feedback smooth
- **Capture detection:** `moveResult.move?.captured` provides captured piece type - use this for combo tracking
- **Score update pattern:** Use `incrementSessionScore(points)` action from session store - follow this pattern for combo bonuses
- **Visual feedback:** CSS animations with scale and color transitions work well - use similar pattern for combo display

[Source: docs/sprint-artifacts/3-7-session-score-tracking-system.md#Dev-Agent-Record, docs/sprint-artifacts/3-7-session-score-tracking-system.md#File-List, docs/sprint-artifacts/3-7-session-score-tracking-system.md#Senior-Developer-Review-AI]

### References

- [Source: docs/epics.md#Story-3.8-Optional-Combo-Bonus-System] - Story acceptance criteria and technical notes
- [Source: docs/prd.md#Scoring-Rules] - Product requirements for combo bonuses (PRD section 6 - Optional combo bonuses)
- [Source: docs/architecture.md#Session-Layer] - Session Layer architecture (Zustand session state, combo tracking)
- [Source: docs/architecture.md#Data-Flow-Summary] - Data flow during match (combo bonus calculation)
- [Source: docs/architecture.md#Component-Responsibilities] - Component responsibilities and data flow
- [Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo] - File structure for combo display component
- [Source: docs/sprint-artifacts/3-7-session-score-tracking-system.md#Dev-Agent-Record] - Learnings from Story 3.7 implementation
- [Source: docs/ux-design-specification.md] - UX Design Specification for combo display component (section 7.2 - Feedback Patterns)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

**2025-01-27** - Story drafted by Scrum Master agent using create-story workflow in yolo mode.

