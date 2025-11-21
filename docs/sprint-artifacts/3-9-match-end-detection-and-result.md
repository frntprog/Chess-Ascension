# Story 3.9: Match End Detection and Result

Status: ready-for-dev

## Story

As a user,
I want to see the match result when the game ends,
so that I know if I won, lost, or drew.

## Acceptance Criteria

**AC1: Match End Detection**
Given a chess game reaches an end condition
When checkmate, stalemate, or draw occurs
Then the match end is detected:
- chess.js detects game end: `chess.isCheckmate()`, `chess.isStalemate()`, `chess.isDraw()`
- Game status is updated in session store: `setGameStatus('checkmate' | 'stalemate' | 'draw')`
- Match result modal is triggered when game end is detected

**AC2: Match Result Modal Display**
And when match end is detected:
- Match result modal is displayed (shadcn/ui Dialog)
- Modal shows:
  - Result: "You Win!" / "You Lose!" / "Draw"
  - Final score (from session store)
  - XP gained: `floor(score / 10)`
  - "Play Again" button (primary)
  - "Home" button (secondary)
- Modal is centered, max-width 600px (UX Design Specification section 7.3 - Modal Patterns)
- Modal cannot be dismissed by clicking outside (user must choose action)

**AC3: Play Again Navigation**
And when user clicks "Play Again":
- Navigate back to mode/difficulty selection (`/mode-selection`)
- Session store is reset: `resetSessionScore()`, `resetTurnNumber()`, `resetCaptureHistory()`, `setBoardState(STARTING_FEN)`, `setGameStatus('normal')`, `setSessionLifecycle('idle')`
- Match result modal is closed

**AC4: Home Navigation**
And when user clicks "Home":
- Navigate to landing page (`/`)
- Session store is reset (same as AC3)
- Match result modal is closed

[Source: docs/epics.md#Story-3.9-Match-End-Detection-and-Result]

## Tasks / Subtasks

- [ ] **Task 1: Create Match Result Modal Component** (AC: 2)
  - [ ] Create `/src/components/Board/MatchResultModal.tsx` file
  - [ ] Import shadcn/ui Dialog components: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
  - [ ] Import Button component from shadcn/ui
  - [ ] Import session store: `useSessionStore` to read `sessionScore`, `gameStatus`
  - [ ] Create props interface: `{ isOpen: boolean; onClose: () => void; onPlayAgain: () => void; onHome: () => void }`
  - [ ] Calculate XP gained: `Math.floor(sessionScore / 10)`
  - [ ] Determine result message based on `gameStatus`:
    - `gameStatus === 'checkmate'` and `currentTurn === 'black'` → "You Win!" (user checkmated AI)
    - `gameStatus === 'checkmate'` and `currentTurn === 'white'` → "You Lose!" (AI checkmated user)
    - `gameStatus === 'stalemate'` → "Draw" (stalemate)
    - `gameStatus === 'draw'` → "Draw" (other draw conditions)
  - [ ] Display result message, final score, XP gained
  - [ ] Add "Play Again" button (primary, calls `onPlayAgain`)
  - [ ] Add "Home" button (secondary, calls `onHome`)
  - [ ] Style modal: Centered, max-width 600px, Classic Chess theme colors
  - [ ] Prevent modal dismissal by clicking outside (set `onOpenChange` to prevent closing)

- [ ] **Task 2: Integrate Match End Detection in ChessBoard Component** (AC: 1)
  - [ ] Open `/src/components/Board/ChessBoard.tsx`
  - [ ] Import `useSessionStore` to read `gameStatus`, `currentTurn`
  - [ ] Import `useNavigate` from `react-router-dom` for navigation
  - [ ] Add state: `const [showMatchResult, setShowMatchResult] = useState(false)`
  - [ ] Add useEffect to watch `gameStatus` changes:
    - When `gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw'`
    - Set `showMatchResult = true` to show modal
  - [ ] Note: Match end detection already implemented in `handlePieceDrop` and `triggerAIMove` (lines 212-226, 292-306) - this task adds modal trigger

- [ ] **Task 3: Add Session Reset Actions** (AC: 3, 4)
  - [ ] Open `/src/stores/sessionStore.ts`
  - [ ] Add action: `resetSession(): void` - Resets all session state:
    - `resetSessionScore()`
    - `resetTurnNumber()`
    - `resetCaptureHistory()`
    - `setBoardState(STARTING_FEN)` (use `STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'`)
    - `setGameStatus('normal')`
    - `setSessionLifecycle('idle')`
    - `setCurrentCombo(null)`
  - [ ] Export `resetSession` action

- [ ] **Task 4: Integrate Match Result Modal in Play Page** (AC: 2, 3, 4)
  - [ ] Open `/src/pages/Play.tsx`
  - [ ] Import `MatchResultModal` component: `import MatchResultModal from '@/components/Board/MatchResultModal'`
  - [ ] Import `useNavigate` from `react-router-dom`
  - [ ] Import session store: `useSessionStore` to read `gameStatus`, `sessionScore`, `currentTurn`, and call `resetSession`
  - [ ] Add state: `const [showMatchResult, setShowMatchResult] = useState(false)`
  - [ ] Add useEffect to watch `gameStatus`:
    - When `gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw'`
    - Set `showMatchResult = true`
  - [ ] Add `handlePlayAgain` function:
    - Call `resetSession()` from session store
    - Navigate to `/mode-selection`
    - Set `showMatchResult = false`
  - [ ] Add `handleHome` function:
    - Call `resetSession()` from session store
    - Navigate to `/`
    - Set `showMatchResult = false`
  - [ ] Add `MatchResultModal` component to JSX:
    - `isOpen={showMatchResult}`
    - `onClose={() => setShowMatchResult(false)}` (prevented by modal, but required prop)
    - `onPlayAgain={handlePlayAgain}`
    - `onHome={handleHome}`
  - [ ] Position modal in layout (Dialog handles overlay/centering automatically)

- [ ] **Task 5: Determine Match Result Logic** (AC: 2)
  - [ ] In `MatchResultModal` component, determine result based on `gameStatus` and `currentTurn`:
    - Checkmate: If `currentTurn === 'black'` → user won (AI's turn but checkmated = user checkmated AI)
    - Checkmate: If `currentTurn === 'white'` → user lost (user's turn but checkmated = AI checkmated user)
    - Stalemate: Always "Draw"
    - Draw: Always "Draw"
  - [ ] Display appropriate result message: "You Win!", "You Lose!", or "Draw"
  - [ ] Style result message with appropriate colors (green for win, red for loss, gray for draw)

- [ ] **Task 6: Testing and Verification** (AC: All)
  - [ ] Test checkmate detection: User checkmates AI → "You Win!" modal shown
  - [ ] Test checkmate detection: AI checkmates user → "You Lose!" modal shown
  - [ ] Test stalemate detection: Stalemate occurs → "Draw" modal shown
  - [ ] Test draw detection: Draw occurs → "Draw" modal shown
  - [ ] Test "Play Again" button: Navigates to `/mode-selection`, session reset
  - [ ] Test "Home" button: Navigates to `/`, session reset
  - [ ] Test modal display: Shows final score and XP gained correctly
  - [ ] Test session reset: All session state reset after navigation
  - [ ] Test modal cannot be dismissed by clicking outside
  - [ ] Verify no console errors or warnings

[Source: docs/epics.md#Story-3.9-Match-End-Detection-and-Result, docs/architecture.md#Session-Layer, docs/architecture.md#Data-Flow-Summary]

## Dev Notes

### Architecture Patterns and Constraints

**Session Layer:**
- Match end detection: `gameStatus` field in session store tracks game state (Architecture section 3 - Session Layer)
- Session reset: Reset all session state when match ends (Architecture section 4 - Data Flow: Match End)
- Session store: `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)
- Match end detection: Check `gameStatus` after each move (Architecture section 4 - Data Flow: During Match)

**Game Engine Layer:**
- Match end detection: Use `chess.isCheckmate()`, `chess.isStalemate()`, `chess.isDraw()` from chess.js (Architecture section 3 - Game Engine Layer)
- ChessEngine integration: `moveResult.isCheckmate`, `moveResult.isStalemate`, `moveResult.isDraw` already available from Story 3.5, 3.6
- No direct persistence: Game engine layer does not write to localStorage (Architecture section 3 - Game Engine Layer)

**UI Layer:**
- Match result modal: `/src/components/Board/MatchResultModal.tsx` (custom component using shadcn/ui Dialog)
- Modal patterns: Centered, max-width 600px (UX Design Specification section 7.3 - Modal Patterns)
- Navigation: Use React Router `useNavigate` for navigation (Architecture section 3 - Routing Layer)
- Layout: Modal displayed in Play page, triggered by game status changes

**Component Integration:**
- Match end detection: Already implemented in ChessBoard component (lines 212-226, 292-306) - sets `gameStatus` in session store
- Modal trigger: Watch `gameStatus` changes in Play page, show modal when end condition detected
- Session reset: Call `resetSession()` action from session store before navigation
- Navigation: Navigate to `/mode-selection` (Play Again) or `/` (Home) after session reset

[Source: docs/architecture.md#Component-Responsibilities, docs/architecture.md#Session-Layer, docs/architecture.md#Data-Flow-Summary]

### Project Structure Notes

**Aligned with Architecture Specification:**
- Match result modal component: `/src/components/Board/MatchResultModal.tsx` (Architecture section 8 - File & Folder Structure)
- Session reset: Session store actions in `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)

**Integration with Existing Setup:**
- React Router from Story 1.1 supports navigation
- Zustand session store from Story 1.4 provides session state management
- ChessBoard component from Story 3.4, 3.5, 3.6, 3.7, 3.8 provides match end detection (already implemented)
- ChessEngine from Story 3.5, 3.6 provides match end detection methods
- shadcn/ui components from Story 1.3 provide Dialog, Button for modal
- TailwindCSS and Classic Chess theme from Story 1.3 provide styling
- Play page from Story 3.4 provides game board layout

**File Structure:**
- New files: `/src/components/Board/MatchResultModal.tsx` (match result modal component)
- Modified files: `/src/stores/sessionStore.ts` (add `resetSession` action)
- Modified files: `/src/pages/Play.tsx` (add MatchResultModal integration and navigation handlers)
- No conflicts with existing structure - follows Architecture section 8 specification

**Component Dependencies:**
- Uses Zustand `useSessionStore` for session state management
- Uses ChessEngine from Story 3.5, 3.6 for match end detection (already integrated)
- Uses React Router `useNavigate` for navigation
- Uses shadcn/ui Dialog, Button components for modal UI
- Uses React hooks: `useState`, `useEffect` for component state

[Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo, docs/epics.md#Story-3.9-Match-End-Detection-and-Result]

### Learnings from Previous Story

**From Story 3.8 (Status: done)**

**New Files Created:**
- `/src/components/Board/ComboDisplay.tsx` - Combo display component with visual feedback

**Modified Files:**
- `/src/stores/sessionStore.ts` - Added combo tracking fields and actions (captureHistory, turnNumber, comboBonusesEnabled, currentCombo, and related actions)
- `/src/components/Board/ChessBoard.tsx` - Integrated combo detection logic after capture detection, match end detection already implemented (lines 212-226, 292-306)
- `/src/pages/Play.tsx` - Added ComboDisplay component to game board layout

**Architectural Patterns Established:**
- Match end detection pattern: Already implemented in ChessBoard component - sets `gameStatus` in session store after each move
- Session state management: Use Zustand session store for game state tracking
- Visual feedback pattern: Use CSS animations (scale + pulse) for component animations
- Session-only storage: Game state stored in Zustand session store, NOT persisted to localStorage

**Technical Notes:**
- Match end detection: `moveResult.isCheckmate`, `moveResult.isStalemate`, `moveResult.isDraw` already available from ChessEngine
- Game status tracking: `setGameStatus()` action already available in session store
- Session store actions: `setGameStatus`, `setCurrentTurn` available for game state management
- Component integration: ChessBoard component already sets `gameStatus` after moves - modal just needs to watch this state

**Implementation Approach:**
- Match end detection: Already implemented in ChessBoard - just need to watch `gameStatus` changes
- Modal display: Create MatchResultModal component that reads `gameStatus` and `sessionScore` from session store
- Session reset: Create `resetSession()` action to reset all session state before navigation
- Navigation: Use React Router `useNavigate` to navigate to `/mode-selection` or `/` after session reset

**Components Ready for Use:**
- ChessEngine class from Story 3.5, 3.6 with `makeMove()`, `getTurn()`, `getFEN()`, `isCheckmate()`, `isStalemate()`, `isDraw()` methods
- ChessBoard component from Story 3.4, 3.5, 3.6, 3.7, 3.8 with match end detection already implemented
- Session store with `gameStatus`, `sessionScore`, `currentTurn`, `boardState`, `sessionLifecycle` fields and actions
- shadcn/ui components: Dialog, Button, Card, Badge, Separator (for modal UI)
- React Router navigation patterns established
- Icon library: lucide-react (for modal icons if needed)

**Senior Developer Review Notes from Story 3.8:**
- **Approved:** Story 3.8 is complete and approved. All acceptance criteria satisfied. All tasks completed and verified.
- **No unresolved action items:** All review feedback addressed, no pending items
- **Key takeaway:** Match end detection already implemented in ChessBoard component - modal integration is straightforward
- **Match end detection:** `gameStatus` is set in session store after each move - use this to trigger modal
- **Session reset pattern:** Create `resetSession()` action to reset all session state - follow this pattern for match end cleanup
- **Visual feedback:** CSS animations with scale and color transitions work well - use similar pattern for modal animations if needed

[Source: docs/sprint-artifacts/3-8-optional-combo-bonus-system.md#Dev-Agent-Record, docs/sprint-artifacts/3-8-optional-combo-bonus-system.md#File-List, docs/sprint-artifacts/3-8-optional-combo-bonus-system.md#Senior-Developer-Review-AI]

### References

- [Source: docs/epics.md#Story-3.9-Match-End-Detection-and-Result] - Story acceptance criteria and technical notes
- [Source: docs/prd.md#Features] - Product requirements for match result display (PRD section 5.1 - Core Features)
- [Source: docs/architecture.md#Session-Layer] - Session Layer architecture (Zustand session state, match end detection)
- [Source: docs/architecture.md#Data-Flow-Summary] - Data flow during match and match end (Architecture section 4)
- [Source: docs/architecture.md#Component-Responsibilities] - Component responsibilities and data flow
- [Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo] - File structure for match result modal component
- [Source: docs/sprint-artifacts/3-8-optional-combo-bonus-system.md#Dev-Agent-Record] - Learnings from Story 3.8 implementation
- [Source: docs/ux-design-specification.md] - UX Design Specification for modal patterns (section 7.3 - Modal Patterns)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-9-match-end-detection-and-result.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

**2025-01-27** - Story drafted by Scrum Master agent using create-story workflow in yolo mode.

