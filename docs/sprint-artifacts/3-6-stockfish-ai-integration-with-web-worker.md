# Story 3.6: Stockfish AI Integration with Web Worker

Status: ready-for-dev

## Story

As a user,
I want the AI to make moves automatically,
so that I can play chess against a computer opponent.

## Acceptance Criteria

**AC1: AI Move Calculation**
Given a user makes a valid move
When it becomes the AI's turn
Then the AI calculates and makes a move:
- Stockfish Web Worker is invoked
- AI calculates best move based on difficulty:
  - Beginner: Lower depth (e.g., depth 5)
  - Intermediate: Medium depth (e.g., depth 10)
  - Advanced: Higher depth (e.g., depth 15)
- Best move is returned from Stockfish
- Move is executed on board (chess.js applies move)
- Board state is updated (FEN updated in session store)
- Turn switches back to user

**AC2: AI Thinking Indicator**
And while AI is thinking:
- Loading indicator shown (spinner or "AI thinking..." message)
- Board is disabled (user cannot make moves)
- Difficulty indicator shows current AI level

**AC3: Web Worker Implementation**
And Stockfish worker:
- Runs in separate Web Worker thread (non-blocking)
- Uses Stockfish WASM for better performance
- Worker file: `/public/worker/stockfish.js` or loaded from CDN

[Source: docs/epics.md#Story-3.6-Stockfish-AI-Integration-with-Web-Worker]

## Tasks / Subtasks

- [ ] **Task 1: Install Stockfish Package** (AC: 3)
  - [ ] Research Stockfish.js options: `stockfish.js` npm package or CDN
  - [ ] Install Stockfish package: `npm install stockfish.js` or configure CDN loading
  - [ ] Verify package includes WASM support for better performance
  - [ ] Verify TypeScript types are available (package includes types or @types/stockfish.js)
  - [ ] Test import: `import Stockfish from 'stockfish.js'` or CDN loading

- [ ] **Task 2: Create Stockfish Worker Module** (AC: 3)
  - [ ] Create `/src/core/chess/stockfishWorker.ts` file
  - [ ] Create Stockfish worker instance using Web Worker API
  - [ ] Implement worker message handling:
    - Send position to Stockfish: `worker.postMessage({ type: 'position', fen })`
    - Receive best move: `worker.onmessage` handler
    - Handle worker errors: `worker.onerror` handler
  - [ ] Implement difficulty-to-depth mapping:
    - Beginner: depth 5
    - Intermediate: depth 10
    - Advanced: depth 15
  - [ ] Export functions:
    - `createStockfishWorker(): Worker` - Create and initialize worker
    - `getBestMove(worker: Worker, fen: string, depth: number): Promise<string>` - Get best move from Stockfish
    - `terminateWorker(worker: Worker): void` - Clean up worker

- [ ] **Task 3: Create Stockfish Loader Utility** (AC: 3)
  - [ ] Create `/src/core/chess/stockfishLoader.ts` file
  - [ ] Implement Stockfish WASM loading:
    - Load Stockfish WASM file from `/public/worker/stockfish.wasm` or CDN
    - Handle loading errors gracefully
    - Return worker instance when ready
  - [ ] Export function:
    - `loadStockfishWorker(): Promise<Worker>` - Load and initialize Stockfish worker

- [ ] **Task 4: Integrate Stockfish with ChessBoard Component** (AC: 1)
  - [ ] Open `/src/components/Board/ChessBoard.tsx`
  - [ ] Import Stockfish worker utilities: `import { loadStockfishWorker, getBestMove } from '@/core/chess/stockfishWorker'`
  - [ ] Add state for AI thinking: `const [isAIThinking, setIsAIThinking] = useState(false)`
  - [ ] Add state for Stockfish worker: `const [stockfishWorker, setStockfishWorker] = useState<Worker | null>(null)`
  - [ ] Initialize Stockfish worker on component mount (use `useEffect`)
  - [ ] After user makes valid move, check if it's AI's turn:
    - If `engine.getTurn() === 'b'` (AI's turn):
      - Set `isAIThinking = true`
      - Disable board interaction
      - Get difficulty from session store
      - Map difficulty to depth
      - Call `getBestMove(worker, currentFEN, depth)`
      - Wait for best move response
      - Execute move using `engine.makeMove(from, to)`
      - Update board state in session store
      - Set `isAIThinking = false`
      - Re-enable board interaction

- [ ] **Task 5: Implement AI Thinking Indicator** (AC: 2)
  - [ ] Add loading indicator UI component:
    - Show spinner or "AI thinking..." message when `isAIThinking === true`
    - Display current difficulty level (from session store)
    - Position indicator above or below chess board
  - [ ] Use shadcn/ui components if available (e.g., Badge for difficulty, Spinner for loading)
  - [ ] Style indicator with Classic Chess theme colors
  - [ ] Hide indicator when `isAIThinking === false`

- [ ] **Task 6: Disable Board During AI Turn** (AC: 2)
  - [ ] Update `handlePieceDrop` to check `isAIThinking`:
    - If `isAIThinking === true`, return false immediately (reject move)
    - Show message: "AI is thinking, please wait..."
  - [ ] Update `handleSquareClick` to check `isAIThinking`:
    - If `isAIThinking === true`, return early (prevent piece selection)
  - [ ] Disable react-chessboard interaction when `isAIThinking === true`:
    - Use `arePiecesDraggable` prop or similar to disable dragging
    - Use `areArrowsAllowed` prop or similar to disable interactions

- [ ] **Task 7: Update Session Store with Difficulty** (AC: 1)
  - [ ] Verify session store has `difficulty` field (already exists from Story 3.3)
  - [ ] Verify `setDifficulty` action exists (already exists from Story 3.3)
  - [ ] In ChessBoard component, read difficulty from session store: `const { difficulty } = useSessionStore()`
  - [ ] Map difficulty to Stockfish depth:
    - `'beginner'` → depth 5
    - `'intermediate'` → depth 10
    - `'advanced'` → depth 15

- [ ] **Task 8: Handle Worker Lifecycle** (AC: 3)
  - [ ] Initialize worker on component mount
  - [ ] Clean up worker on component unmount:
    - Call `terminateWorker(worker)` in `useEffect` cleanup function
  - [ ] Handle worker errors gracefully:
    - Show error message if worker fails to load
    - Show error message if worker crashes during move calculation
    - Fallback: Disable AI moves if worker unavailable

- [ ] **Task 9: Testing and Verification** (AC: All)
  - [ ] Test AI makes moves after user moves
  - [ ] Test AI move is legal (validated by chess.js)
  - [ ] Test board state updates after AI move
  - [ ] Test turn switches back to user after AI move
  - [ ] Test loading indicator shows during AI thinking
  - [ ] Test board is disabled during AI thinking
  - [ ] Test difficulty mapping (beginner = depth 5, intermediate = depth 10, advanced = depth 15)
  - [ ] Test worker cleanup on component unmount
  - [ ] Test worker error handling
  - [ ] Test AI move calculation performance (should be non-blocking)
  - [ ] Verify no console errors or warnings

[Source: docs/epics.md#Story-3.6-Stockfish-AI-Integration-with-Web-Worker, docs/architecture.md#Game-Engine-Layer]

## Dev Notes

### Architecture Patterns and Constraints

**Game Engine Layer:**
- Stockfish worker: `/src/core/chess/stockfishWorker.ts` (Architecture section 8 - File & Folder Structure)
- Stockfish loader: `/src/core/chess/stockfishLoader.ts` (Architecture section 8)
- Stockfish WASM files: `/public/worker/stockfish.wasm`, `/public/worker/stockfish.js` (Architecture section 8)
- Stockfish integration: AI move calculation (Architecture section 3 - Game Engine Layer)
- chess.js integration: Move execution after Stockfish returns best move (Architecture section 3 - Game Engine Layer)
- No direct persistence: Game engine layer does not write to localStorage (Architecture section 3 - Game Engine Layer)

**Session Layer:**
- Board state: FEN string stored in `boardState` field (Architecture section 3 - Session Layer)
- Difficulty: Stored in `difficulty` field (from Story 3.3)
- Current turn: Stored in `currentTurn` field (from Story 3.5)
- Session store: `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)
- Board state updates: After AI move execution (Architecture section 4 - Data Flow)

**UI Layer:**
- Chess board component: `/src/components/Board/ChessBoard.tsx` (from Story 3.4, 3.5)
- Loading indicator: Use shadcn/ui components or custom spinner (UX Design Specification section 7.2 - Feedback Patterns)
- Difficulty display: Use Badge component to show current AI level
- Board disabling: Prevent user interaction during AI thinking (UX Design Specification section 7.2)

**Component Integration:**
- Stockfish worker: Should be initialized once per component mount
- Worker lifecycle: Initialize on mount, terminate on unmount
- AI move trigger: After user makes valid move and turn switches to black (AI)
- Move execution: Use chess.js `makeMove()` to execute AI move
- Board state sync: Update session store `boardState` after AI move

[Source: docs/architecture.md#Component-Responsibilities, docs/architecture.md#Game-Engine-Layer, docs/architecture.md#Session-Layer]

### Project Structure Notes

**Aligned with Architecture Specification:**
- Stockfish worker: `/src/core/chess/stockfishWorker.ts` (Architecture section 8 - File & Folder Structure)
- Stockfish loader: `/src/core/chess/stockfishLoader.ts` (Architecture section 8)
- Stockfish WASM files: `/public/worker/stockfish.wasm`, `/public/worker/stockfish.js` (Architecture section 8)
- Chess board component: `/src/components/Board/ChessBoard.tsx` (from Story 3.4, 3.5)
- Session store: `/src/stores/sessionStore.ts` (Architecture section 3 - Session Layer)

**Integration with Existing Setup:**
- React Router from Story 1.1 supports navigation
- Zustand session store from Story 1.4 provides `boardState`, `difficulty`, `currentTurn` fields
- ChessBoard component from Story 3.4, 3.5 provides board display and move validation
- ChessEngine from Story 3.5 provides move execution via `makeMove()`
- shadcn/ui components from Story 1.3 provide Badge, Spinner (if available) for loading indicator
- TailwindCSS and Classic Chess theme from Story 1.3 provide styling
- Difficulty selection from Story 3.3 stores difficulty in session store

**File Structure:**
- New files: `/src/core/chess/stockfishWorker.ts` (Stockfish worker module)
- New files: `/src/core/chess/stockfishLoader.ts` (Stockfish loader utility)
- New files: `/public/worker/stockfish.wasm` (Stockfish WASM binary, if using local file)
- New files: `/public/worker/stockfish.js` (Stockfish worker script, if using local file)
- Modified files: `/src/components/Board/ChessBoard.tsx` (integrate Stockfish AI moves)
- Modified files: `/package.json` (add stockfish.js dependency, if using npm package)
- No conflicts with existing structure - follows Architecture section 8 specification

**Component Dependencies:**
- Uses stockfish.js package or CDN (to be installed/configured)
- Uses Zustand `useSessionStore` for board state and difficulty management
- Uses React hooks: `useState`, `useEffect` for component state and lifecycle
- Uses ChessEngine from Story 3.5 for move execution
- Uses shadcn/ui Badge, Spinner components for loading indicator (optional)

[Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo, docs/epics.md#Story-3.6-Stockfish-AI-Integration-with-Web-Worker]

### Learnings from Previous Story

**From Story 3.5 (Status: done)**

**New Files Created:**
- `/src/core/chess/engine.ts` - Chess engine wrapper class with chess.js integration, move validation, game state queries (check, checkmate, stalemate, draw), FEN management

**Modified Files:**
- `/src/components/Board/ChessBoard.tsx` - Integrated chess.js validation, error feedback, turn management, game status tracking
- `/src/stores/sessionStore.ts` - Added optional `gameStatus` and `currentTurn` fields with actions
- `/package.json` - Added chess.js dependency (v1.4.0)

**Architectural Patterns Established:**
- Chess engine pattern: Use `ChessEngine` class with `useRef` to persist instance across re-renders
- Move validation pattern: Call `engine.validateMove()` before accepting move
- Move execution pattern: Call `engine.makeMove()` to execute move, get updated FEN
- Board state sync pattern: Update session store `boardState` after valid move using `setBoardState` action
- Turn management pattern: Check `engine.getTurn()` to determine current turn, prevent moves when not user's turn
- Game status tracking: Update `gameStatus` in session store after each move (for Story 3.9 match end detection)
- Error feedback pattern: Use shadcn/ui toast component and inline error message for invalid moves

**Technical Notes:**
- ChessEngine instance should persist across re-renders using `useRef` (prevents recreation on re-render)
- Move validation should be called in `handlePieceDrop` function before accepting move
- Board state should be updated in session store after valid move using `setBoardState` action
- Turn management: User plays white, AI plays black (turn switches after user move)
- Game status tracking: Added `gameStatus` and `currentTurn` fields to session store for future match end detection
- Error feedback: Uses both toast notification and inline message for better UX
- Chess.js handles all special move rules automatically (en passant, castling, promotion) - no custom logic needed

**Implementation Approach:**
- Stockfish worker should be initialized once per component mount using `useEffect`
- Worker should be cleaned up on component unmount to prevent memory leaks
- AI move should be triggered after user makes valid move and turn switches to black (AI)
- AI move should be executed using `engine.makeMove()` after Stockfish returns best move
- Board state should be updated in session store after AI move using `setBoardState` action
- Loading indicator should show during AI thinking, board should be disabled
- Difficulty mapping: Beginner = depth 5, Intermediate = depth 10, Advanced = depth 15

**Components Ready for Use:**
- ChessEngine class from Story 3.5 with `makeMove()`, `getTurn()`, `getFEN()` methods
- ChessBoard component from Story 3.4, 3.5 with `handlePieceDrop` handler ready for AI integration
- Session store with `boardState`, `difficulty`, `currentTurn`, `gameStatus` fields and actions
- shadcn/ui components: Button, Card, Badge, Separator, Toast (for loading indicator and error feedback)
- React Router navigation patterns established
- Icon library: lucide-react (for loading spinner or AI thinking indicator)

**Senior Developer Review Notes from Story 3.5:**
- **Approved:** Story 3.5 is complete and approved. All acceptance criteria satisfied. All tasks completed and verified.
- **No unresolved action items:** All review feedback addressed, no pending items
- **Key takeaway:** ChessEngine wrapper properly implements all required methods, move validation and execution working correctly
- **Turn management:** User plays white, AI plays black - turn switches correctly after user move
- **Game status tracking:** Added `gameStatus` and `currentTurn` fields to session store for Story 3.9 (match end detection) - good forward-thinking implementation
- **Error feedback:** Uses both toast and inline message for better UX
- **Implementation note:** Chess.js handles all special move rules automatically - no custom logic needed, which is correct per architecture

[Source: docs/sprint-artifacts/3-5-chess-move-validation-with-chess-js.md#Dev-Agent-Record, docs/sprint-artifacts/3-5-chess-move-validation-with-chess-js.md#File-List, docs/sprint-artifacts/3-5-chess-move-validation-with-chess-js.md#Senior-Developer-Review-AI]

### References

- [Source: docs/epics.md#Story-3.6-Stockfish-AI-Integration-with-Web-Worker] - Story acceptance criteria and technical notes
- [Source: docs/prd.md#Features] - Product requirements for Stockfish AI integration (PRD section 5.1 - stockfish.js AI browser Web Worker)
- [Source: docs/architecture.md#Game-Engine-Layer] - Game Engine Layer architecture (stockfish.wasm Worker)
- [Source: docs/architecture.md#Session-Layer] - Session Layer architecture (Zustand session state, boardState, difficulty)
- [Source: docs/architecture.md#Component-Responsibilities] - Component responsibilities and data flow
- [Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo] - File structure for Stockfish worker and loader
- [Source: docs/sprint-artifacts/3-5-chess-move-validation-with-chess-js.md#Dev-Agent-Record] - Learnings from Story 3.5 implementation
- [Source: docs/ux-design-specification.md] - UX Design Specification for loading indicators and feedback patterns (section 7.2)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-6-stockfish-ai-integration-with-web-worker.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

**2025-01-27** - Story drafted by Scrum Master agent using create-story workflow in yolo mode.

