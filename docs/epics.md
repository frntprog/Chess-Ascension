# Chess Ascention - Epic Breakdown

**Author:** Den
**Date:** 2025-01-27
**Project Level:** intermediate
**Target Scale:** MVP

---

## Overview

This document provides the complete epic and story breakdown for Chess Ascention, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This document incorporates context from PRD, UX Design Specification, and Architecture documents.

---

## Functional Requirements Inventory

Based on analysis of the PRD, the following functional requirements are identified:

- **FR1:** Landing page with clear navigation and feature highlights
- **FR2:** Create local profile with nickname
- **FR3:** Load existing local profile from localStorage  
- **FR4:** User profile creation in localStorage upon profile creation
- **FR5:** User profile display (XP, level, rank, stats, skins, abilities)
- **FR6:** localStorage profile updates (XP, level, rank, stats after matches)
- **FR7:** Mode selection (Classic Mode vs RPG Mode)
- **FR8:** Difficulty selection (Beginner, Intermediate, Advanced)
- **FR9:** Classic Mode game board display (react-chessboard)
- **FR10:** Chess move validation (chess.js rules engine)
- **FR11:** AI opponent moves (Stockfish.js Web Worker integration)
- **FR12:** Session score tracking (Zustand, session-only)
- **FR13:** Score calculation from piece captures (Pawn: +10, Knight/Bishop: +20, Rook: +40, Queen: +60)
- **FR14:** Optional combo bonuses (2 captures in 2 turns: +10, 3 captures in 3 turns: +20)
- **FR15:** XP conversion from score (XP = floor(score / 10))
- **FR16:** Level calculation from accumulated XP
- **FR17:** Rank mapping from level (Level 1-2: Pawn, 3-4: Knight, 5-6: Bishop, 7-8: Rook, 9-10: Queen)
- **FR18:** Profile stats tracking (gamesPlayed, bestScore, wins, losses)
- **FR19:** Match result display (Win/Loss/Draw, score, XP gained)
- **FR20:** RPG Mode with ability panel display
- **FR21:** Double Move ability (cost: ~60 score, allows two moves back-to-back)
- **FR22:** Tactical Hint ability (cost: ~25 score, shows recommended move)
- **FR23:** Shield ability (cost: ~90-100 score, unlock-based, protects piece from capture)
- **FR24:** Ability activation system (deduct score cost, activate ability, show visual feedback)
- **FR25:** Skin unlocks based on level (Level 1: Classic, Level 3: Monochrome, Level 5: Neon, Level 7: Gold)
- **FR26:** Skin selection and application (applied via Tailwind CSS theme variables)
- **FR27:** Unlocked abilities storage (unlockedAbilities: string[])
- **FR28:** Level-up notifications (when XP threshold reached, show unlocks)

---

## Epic Structure Summary

**Epic 1: Foundation & Project Setup**
- Establishes development environment, build system, deployment pipeline, and core dependencies
- Foundation enables all subsequent work

**Epic 2: Local Profile Management**
- Users can create/load local profile with nickname (localStorage)
- Users can view and manage their profile
- Covers FR2, FR3, FR4, FR5

**Epic 3: Classic Mode Chess Gameplay**
- Users can play chess against AI opponent
- Score tracking, move validation, AI moves
- Covers FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14

**Epic 4: Progression System & Persistence**
- Users earn XP, level up, unlock content
- Profile stats tracking and localStorage persistence
- Covers FR6, FR15, FR16, FR17, FR18, FR19, FR25, FR27, FR28

**Epic 5: RPG Mode & Abilities**
- Users can play with enhanced abilities
- Ability panel, activation system, visual feedback
- Covers FR20, FR21, FR22, FR23, FR24, FR26

---

## FR Coverage Map

- **Epic 1 (Foundation):** Infrastructure needs for all FRs
- **Epic 2 (Local Profile Management):** FR2, FR3, FR4, FR5
- **Epic 3 (Classic Mode):** FR1, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14
- **Epic 4 (Progression System):** FR6, FR15, FR16, FR17, FR18, FR19, FR25, FR27, FR28
- **Epic 5 (RPG Mode):** FR20, FR21, FR22, FR23, FR24, FR26

---

## Epic 1: Foundation & Project Setup

**Goal:** Establish the development environment, build system, deployment pipeline, and core dependencies to enable all subsequent development work.

**Value:** Foundation enables all development work and ensures consistent project structure.

### Story 1.1: Project Initialization with React + Vite + TypeScript

As a developer,
I want the project initialized with React, Vite, TypeScript, and TailwindCSS,
So that I have a modern development environment ready for building the chess application.

**Acceptance Criteria:**

**Given** a new project directory
**When** I run the initialization command
**Then** the project structure is created with:
- React 18+ configured with Vite
- TypeScript with strict mode enabled
- TailwindCSS configured with PostCSS
- ESLint and Prettier configured
- Basic folder structure matching Architecture spec (`/src`, `/src/components`, `/src/pages`, `/src/stores`, `/src/services`, `/src/core`, `/src/utils`, `/src/themes`)
- `package.json` with all core dependencies listed
- `.gitignore` configured for Node.js

**And** the project runs without errors with `npm run dev`
**And** TypeScript compilation passes with no errors
**And** TailwindCSS styles are working

**Prerequisites:** None

**Technical Notes:**
- Use Vite template: `npm create vite@latest . -- --template react-ts`
- Install React Router: `npm install react-router-dom`
- Install TailwindCSS: `npm install -D tailwindcss postcss autoprefixer`
- Initialize Tailwind: `npx tailwindcss init -p`
- Configure Tailwind config to scan `./src/**/*.{js,ts,jsx,tsx}`
- Set up ESLint with React and TypeScript plugins
- Configure Prettier with reasonable defaults
- File structure per Architecture section 8: `/src/app`, `/src/app/routes.ts` (React Router route definitions), `/src/components/Board`, `/src/components/UI`, `/src/core/chess`, `/src/core/abilities`, `/src/stores`, `/src/services`, `/src/utils`, `/src/pages`, `/src/themes`
- Reference: Architecture section 3 (Routing Layer - React Router)
- Reference: Architecture section 8 (File structure: `/src/app/routes.ts`)

---

### Story 1.2: localStorage Profile System Setup

As a developer,
I want localStorage profile utilities set up,
So that user profile data can be persisted client-side without backend dependencies.

**Acceptance Criteria:**

**Given** localStorage utilities are created
**When** the profile system is initialized
**Then** the following utilities exist:
- Profile storage utility at `/src/services/profileStorage.ts`
- Functions for:
  - `saveProfile(profile: Profile): void` - Save profile to localStorage
  - `loadProfile(): Profile | null` - Load profile from localStorage
  - `clearProfile(): void` - Clear profile from localStorage
  - `profileExists(): boolean` - Check if profile exists
- Profile data structure matches PRD section 8 (localStorage data model)
- Storage key: `chessAscensionProfile`
- JSON serialization/deserialization handling

**And** profile utilities work without errors
**And** profile data persists across page reloads
**And** profile utilities can be imported and used

**Prerequisites:** Story 1.1

**Technical Notes:**
- Profile storage utility: `/src/services/profileStorage.ts`
- Use browser localStorage API: `localStorage.setItem()`, `localStorage.getItem()`, `localStorage.removeItem()`
- Profile stored as JSON string in localStorage
- Storage key: `chessAscensionProfile` (per PRD section 8)
- Profile structure: `{ nickname, xp, level, rank, unlockedSkins, selectedSkin, unlockedAbilities, gamesPlayed, bestScore, wins, losses }`
- Handle JSON parse errors gracefully (return null if invalid)
- Note: Architecture remains modular to enable Firebase integration post-MVP (Architecture section 11 mentions Firebase Hosting for deployment)

---

### Story 1.3: shadcn/ui Component Library Setup

As a developer,
I want shadcn/ui installed and configured,
So that I can use pre-built, accessible UI components matching the UX Design Specification.

**Acceptance Criteria:**

**Given** shadcn/ui is installed
**When** the component library is initialized
**Then** shadcn/ui is configured with:
- CLI tool installed: `npx shadcn-ui@latest init`
- Tailwind config updated with shadcn theme
- Components directory created: `/src/components/ui` (or configured path)
- CSS variables configured for theming (matching Classic Chess theme colors from UX spec)
- Initial theme configuration with Classic Chess colors:
  - Primary: `#1e293b` (Slate 800)
  - Secondary: `#475569` (Slate 600)
  - Accent: `#f59e0b` (Amber 500)
  - Success: `#10b981` (Green 500)
  - Error: `#ef4444` (Red 500)

**And** I can import and use Button, Card, Dialog, Input, Label, Badge, Separator components
**And** components render with Classic Chess theme colors
**And** components are accessible (WCAG AA compliant)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Install shadcn/ui: `npx shadcn-ui@latest init`
- Configure `components.json` with project paths
- Set up CSS variables in global CSS file (`/src/themes/globals.css`)
- Install core components: Button, Card, Dialog, Input, Label, Badge, Separator
- Reference UX Design Specification section 1.1 for design system details
- Color values from UX Design Specification section 3.1 (Classic Chess theme)
- CSS variables approach allows theme switching for skin system (future)

---

### Story 1.4: Zustand State Management Setup

As a developer,
I want Zustand installed and store structure created,
So that session state and profile state can be managed effectively.

**Acceptance Criteria:**

**Given** Zustand is installed
**When** store structure is created
**Then** the following store files exist:
- `/src/stores/sessionStore.ts` (placeholder structure)
- `/src/stores/profileStore.ts` (placeholder structure)
- Zustand installed: `npm install zustand`
- TypeScript types defined for store state
- Store slices exported but not yet implemented (implementation in later stories)

**And** stores can be imported without errors
**And** TypeScript types are properly defined
**And** store structure matches Architecture section 3:
  - Session store: `boardState`, `sessionScore`, `sessionAbilities`, `rpgFlags`, `difficulty`, `sessionLifecycle`
  - Profile store: `xp`, `level`, `rank`, `unlockedSkins`, `selectedSkin`, `unlockedAbilities`, `bestScore`, `stats`

**Prerequisites:** Story 1.1

**Technical Notes:**
- Install Zustand: `npm install zustand`
- Create store files with TypeScript interfaces
- Session store structure per Architecture section 3 (Session Layer)
- Profile store structure per Architecture section 3 (Profile Layer)
- Store implementations will be added in later stories

---

### Story 1.5: Deployment Pipeline - Firebase Hosting Setup

**STATUS: DEFERRED** - Development will proceed on localhost. Deployment pipeline will be implemented at the end of development.

As a developer,
I want Firebase Hosting configured for deployment,
So that the application can be deployed and accessed online.

**Acceptance Criteria:**

**Given** Firebase project is set up
**When** Firebase Hosting is initialized
**Then** deployment configuration is complete:
- `firebase.json` created with hosting configuration
- `.firebaserc` created with project ID
- Build script configured in `package.json` (`npm run build`)
- Vite build output directory configured (`dist/`)
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase login configured locally
- Deployment command works: `firebase deploy --only hosting`

**And** the site can be previewed locally: `firebase serve`
**And** build output is correctly configured for Firebase Hosting
**And** `.firebaserc` and `firebase.json` are committed (no secrets)

**Prerequisites:** Story 1.2

**Technical Notes:**
- Install Firebase CLI globally or use npx
- Run `firebase init hosting` and select existing project
- Configure public directory as `dist` (Vite output)
- Configure single-page app (SPA) routing: `rewrites` to `index.html`
- Add build command to `package.json`: `"build": "vite build"`
- Test deployment with `firebase deploy --only hosting`

---

## Epic 2: Local Profile Management

**Goal:** Enable users to create a local profile with nickname and view their progression. Users can access their progression data and see their stats stored in localStorage.

**Value:** Users can create a lightweight local profile (nickname-based) and view their profile information including XP, level, rank, and statistics. All data persists in localStorage.

### Story 2.1: Create Local Profile Flow

As a new user,
I want to create a local profile with a nickname,
So that I can start playing and track my progression.

**Acceptance Criteria:**

**Given** a user is on the create profile page
**When** the user enters a nickname
**Then** the create profile form includes:
- Nickname input field (required)
- Character limit: 3-20 characters
- Character validation: Alphanumeric and spaces allowed
- "Create Profile" button (primary action)
- Optional: "Already have a profile? Load Profile" link (if profile exists check added later)
- Loading state during profile creation (spinner on button, disabled form)

**And** when valid nickname is submitted:
- Profile is created in localStorage using profileStorage utility
- Initial profile data set: `nickname: "{entered}"`, `xp: 0`, `level: 1`, `rank: "Pawn"`, `gamesPlayed: 0`, `bestScore: 0`, `wins: 0`, `losses: 0`, `unlockedSkins: ["Classic"]`, `selectedSkin: "Classic"`, `unlockedAbilities: []`
- Profile data is synced to Zustand profile store
- User is redirected to profile page or mode selection
- Success feedback shown (toast notification: "Profile created successfully!")

**And** when nickname is too short (< 3 characters):
- Error message displays below nickname field: "Nickname must be at least 3 characters"
- Red border on nickname input
- Form submission is blocked

**And** when nickname is too long (> 20 characters):
- Error message displays below nickname field: "Nickname must be 20 characters or less"
- Red border on nickname input
- Form submission is blocked

**And** when nickname contains invalid characters:
- Error message displays: "Nickname can only contain letters, numbers, and spaces"
- Form submission is blocked

**And** if profile already exists:
- Check localStorage for existing profile
- If exists, show option to load existing profile or create new (warns: "Creating new profile will replace existing profile")

**Prerequisites:** Story 1.2, Story 1.3

**Technical Notes:**
- Use shadcn/ui Input and Label components (UX Design Specification section 6.1)
- Nickname validation: 3-20 characters, alphanumeric and spaces
- Profile storage: Use `saveProfile()` from `/src/services/profileStorage.ts` (Story 1.2)
- Profile structure per PRD section 8 (localStorage data model)
- Profile store sync: Update Zustand profile store with created profile data
- Error handling: Client-side validation before profile creation
- Form patterns per UX Design Specification section 7.3 (Form Patterns)
- Success feedback per UX Design Specification section 7.2 (Feedback Patterns - toast notification)
- Create profile page layout: Centered modal or page (UX Design Specification section 5.1, Journey 1, step 2)
- Profile check: Use `profileExists()` from profileStorage utility to check for existing profile

---

### Story 2.2: Load Local Profile Flow

As a returning user,
I want my existing profile to load automatically,
So that I can continue playing and see my progression.

**Acceptance Criteria:**

**Given** a user visits the application
**When** the app initializes
**Then** the system checks for existing profile:
- Profile check on app load (localStorage lookup)
- If profile exists: Profile is loaded from localStorage
- If profile exists: Profile data is synced to Zustand profile store
- If profile exists: User sees their nickname in navigation/profile
- If profile doesn't exist: User sees "Create Profile" option

**And** when profile exists and loads:
- Profile data loaded using `loadProfile()` from profileStorage utility
- Profile store updated with loaded data (nickname, xp, level, rank, stats, unlocks)
- No redirect needed (user can navigate freely)
- Profile data persists across page reloads automatically (localStorage)

**And** when profile doesn't exist:
- User can create new profile (Story 2.1)
- No error message needed (this is expected for first-time users)

**And** profile loading:
- Automatic on app initialization
- No user action required (profile loads from localStorage)
- Handles JSON parse errors gracefully (show error if profile corrupted, offer to create new)

**Prerequisites:** Story 2.1, Story 1.2

**Technical Notes:**
- Profile loading: Use `loadProfile()` from `/src/services/profileStorage.ts` (Story 1.2)
- Profile check: Use `profileExists()` utility function
- App initialization: Check localStorage on app mount (in main App component or route guard)
- Profile store sync: Update Zustand profile store with loaded profile data on app load
- Error handling: Catch JSON parse errors if profile data is corrupted (return null, show error option)
- Profile persistence: Automatic via localStorage (no user action needed)
- No authentication required: Profile is tied to browser/device (localStorage scope)
- Reference: PRD section 8 (localStorage data model)

---

### Story 2.3: User Profile Page - Display Profile Information

As a logged-in user,
I want to view my profile information,
So that I can see my progression, stats, and unlocked content.

**Acceptance Criteria:**

**Given** a user has a profile and navigates to profile page
**When** the profile page loads
**Then** the profile displays:
- Profile card component (shadcn/ui Card) with:
  - User nickname (from localStorage profile)
  - Level badge (shadcn/ui Badge): Large, prominent, shows "Level {level}"
  - Rank badge: Shows current rank (Pawn, Knight, Bishop, Rook, Queen)
  - XP progress bar or display: Current XP / XP needed for next level
  - Stats grid:
    - Games Played: `gamesPlayed`
    - Best Score: `bestScore`
    - Wins: `wins`
    - Losses: `losses`
    - Win Rate: Calculated from wins/losses (if gamesPlayed > 0)
  - Unlocked Skins section: List of unlocked skin names with badges
  - Selected Skin indicator: Shows currently selected skin
  - Unlocked Abilities section: List of unlocked ability names (if any)

**And** all data is loaded from Zustand profile store (synced from localStorage on app load)
**And** loading state is shown while profile data loads (skeleton or spinner)
**And** error state is handled if profile load fails (show error message, retry button)

**Prerequisites:** Story 2.2

**Technical Notes:**
- Profile page component: `/src/pages/Profile.tsx`
- Use ProfileCard component (custom, per UX Design Specification section 6.1, Component 4)
- Data source: Zustand profile store (synced from localStorage on app load)
- Profile loading: Profile loads automatically from localStorage (Story 2.2)
- shadcn/ui components: Card, Badge, Separator
- Layout: Centered card layout (UX Design Specification section 4.1 - Spacious & Centered)
- Typography per UX Design Specification section 3.2
- Stats calculation: Win rate = (wins / (wins + losses)) * 100 if gamesPlayed > 0
- XP progress calculation: Need to determine XP thresholds per level (implementation in Epic 4)
- Loading state: Skeleton loader or spinner (UX Design Specification section 7.2)
- Error handling: Display error message with retry button

---

### Story 2.4: Navigation Bar with Auth State

As a user,
I want a navigation bar that shows my login status,
So that I can easily navigate and access account features.

**Acceptance Criteria:**

**Given** the application has a navigation bar
**When** the user views any page
**Then** the navigation bar includes:
- Logo/brand name on the left ("Chess Ascension")
- Navigation links: "Play", "Profile" (if profile exists), "Home"
- Right side: "Create Profile" button (if no profile) OR user nickname with dropdown (if profile exists)
- Active state indication: Underline or slight background color change (UX Design Specification section 7.4 - Navigation Patterns)
- Responsive design: Horizontal navbar for desktop (1280px+ minimum)

**And** when user has a profile:
- User nickname shown (from localStorage profile)
- Dropdown menu includes: "Profile", "Clear Profile" (optional, clears localStorage)
- Profile automatically loads from localStorage on app initialization

**And** when user doesn't have a profile:
- "Create Profile" button shown
- Button navigates to create profile page

**Prerequisites:** Story 2.2, Story 1.3

**Technical Notes:**
- Navigation component: `/src/components/Navbar.tsx` or `/src/components/UI/Navbar.tsx`
- Use shadcn/ui Button components
- Profile state: Check Zustand profile store for profile existence (profile loads from localStorage on app init)
- Profile check: Use `profileExists()` from profileStorage utility or check profile store state
- Navigation: React Router (per Architecture section 3 - Routing Layer)
- Route definitions in `/src/app/routes.ts` (Architecture section 8)
- Use React Router's `Link` and `NavLink` components for navigation
- Active state: Use `NavLink` with activeClassName or activeStyle for active link styling
- Styling: Classic Chess theme colors (UX Design Specification section 3.1)
- Layout: Top navbar, horizontal (UX Design Specification section 4.1)
- Active state: Primary color (#1e293b) for active link (UX Design Specification section 7.4)
- Dropdown menu: shadcn/ui DropdownMenu component or custom implementation
- Reference: Architecture section 3 (Routing Layer - React Router)
- Reference: Architecture section 8 (File structure: `/src/app/routes.ts`)

---

## Epic 3: Classic Mode Chess Gameplay

**Goal:** Enable users to play chess against an AI opponent. Users can select difficulty, make moves, and see score updates in real-time.

**Value:** Users can play complete chess matches and earn scores from capturing pieces.

### Story 3.1: Landing Page with Mode Selection

As a user,
I want to see a landing page with clear navigation and mode selection,
So that I can easily start playing chess.

**Acceptance Criteria:**

**Given** a user visits the landing page
**When** the page loads
**Then** the landing page displays:
- Hero section with "Chess Ascension" title and tagline
- Feature cards highlighting Classic Mode, RPG Elements, Quick Sessions (3-column grid)
- "Start Playing" button (primary action, accent color)
- Navigation bar (from Story 2.4)
- Centered layout with max-width 1200px (UX Design Specification section 4.1)

**And** when user clicks "Start Playing":
- If logged in: Navigate to mode selection page
- If not logged in: Navigate to registration/login page

**Prerequisites:** Story 1.3, Story 2.4

**Technical Notes:**
- Landing page component: `/src/pages/Landing.tsx`
- Use shadcn/ui Card, Button components
- Navigation: Use React Router's `Link` component or `useNavigate` hook (per Architecture section 3 - Routing Layer)
- Layout: Spacious & Centered approach (UX Design Specification section 4.1)
- Hero section with centered content
- Feature cards: 3-column grid on desktop (flex-wrap for smaller screens)
- Primary CTA button: Accent color (#f59e0b) per UX Design Specification section 7.1
- Journey reference: UX Design Specification section 5.1, Journey 1, step 1

---

### Story 3.2: Mode Selection Page

As a user,
I want to select between Classic Mode and RPG Mode,
So that I can choose my preferred gameplay experience.

**Acceptance Criteria:**

**Given** a logged-in user navigates to mode selection
**When** the mode selection page loads
**Then** the page displays:
- Centered card with two mode options (Classic Mode, RPG Mode)
- Each mode card shows:
  - Mode name and icon/badge
  - Brief description of the mode
  - "Play" button or clickable card
- Selected mode is highlighted (hover state, selected state)
- "Back" button or link to return to landing page

**And** when user selects Classic Mode:
- Navigate to difficulty selection page (Classic Mode)

**And** when user selects RPG Mode:
- Navigate to difficulty selection page (RPG Mode)

**Prerequisites:** Story 2.2, Story 3.1

**Technical Notes:**
- Mode selection page: `/src/pages/ModeSelection.tsx`
- Use DifficultySelector component pattern (UX Design Specification section 6.1, Component 5)
- Navigation: Use React Router's `Link` component or `useNavigate` hook (per Architecture section 3 - Routing Layer)
- Card-based selection with hover/selected states
- Layout: Centered card layout (UX Design Specification section 4.1)
- Journey reference: UX Design Specification section 5.1, Journey 1, step 3

---

### Story 3.3: Difficulty Selection Component

As a user,
I want to select the AI difficulty level,
So that I can play at an appropriate challenge level.

**Acceptance Criteria:**

**Given** a user is on difficulty selection page
**When** the page loads
**Then** the difficulty selector displays:
- Centered card with difficulty options: Beginner, Intermediate, Advanced
- Each difficulty card shows:
  - Difficulty name and level indicator
  - Brief description (e.g., "Beginner - Great for learning")
  - "Select" button or clickable card
- Selected difficulty is highlighted
- "Back" button to return to mode selection

**And** when user selects a difficulty:
- Difficulty is stored in Zustand session store
- Navigate to game board page with selected mode and difficulty

**Prerequisites:** Story 1.4, Story 3.2

**Technical Notes:**
- Difficulty selection page: `/src/pages/DifficultySelection.tsx`
- Use DifficultySelector component (custom, per UX Design Specification section 6.1, Component 5)
- Navigation: Use React Router's `Link` component or `useNavigate` hook (per Architecture section 3 - Routing Layer)
- Store selected difficulty in session store: `difficulty: 'beginner' | 'intermediate' | 'advanced'`
- Difficulty mapping to Stockfish depth (implementation in Story 3.6)
- Journey reference: UX Design Specification section 5.1, Journey 1, step 4

---

### Story 3.4: Chess Board Display with react-chessboard

As a user,
I want to see a visual chess board,
So that I can make moves and see the game state.

**Acceptance Criteria:**

**Given** a user is on the game board page
**When** the page loads
**Then** the chess board displays:
- Centered chess board using react-chessboard component
- Board size: Appropriate for desktop (minimum 1280px width)
- Square colors: Classic Chess theme (dark/light squares matching theme)
- Pieces: Standard chess pieces rendered correctly
- Board orientation: User plays white (bottom), AI plays black (top)
- Board is interactive (can click squares to make moves)

**And** when a piece is selected:
- Selected square is highlighted (primary color outline)
- Available move squares are highlighted (subtle highlight)
- Invalid moves are not highlighted

**And** board styling matches Classic Chess theme:
- Dark squares: Slate 600 (#475569)
- Light squares: White or Slate 50 (#f8fafc)
- Highlight colors: Accent color (#f59e0b) for selected, subtle for available moves

**Prerequisites:** Story 1.3, Story 3.3

**Technical Notes:**
- Install react-chessboard: `npm install react-chessboard`
- ChessBoard component: `/src/components/Board/ChessBoard.tsx`
- Board styling: Custom CSS or Tailwind classes
- react-chessboard props: `position`, `onPieceDrop`, `boardOrientation`, `boardWidth`
- Initial position: Standard chess starting position (FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
- Board state managed in session store: `boardState` (FEN string)
- Reference: UX Design Specification section 6.1, Component 1 (ChessBoard Component)
- Reference: Architecture section 3 (Game Engine Layer)

---

### Story 3.5: Chess Move Validation with chess.js

As a user,
I want my moves to be validated according to chess rules,
So that I can only make legal moves.

**Acceptance Criteria:**

**Given** a user attempts to make a move on the chess board
**When** the user clicks on a destination square
**Then** the system validates the move using chess.js:
- Checks if move is legal according to chess rules
- Validates piece movement patterns (pawn, knight, bishop, rook, queen, king)
- Checks for check/checkmate conditions
- Validates en passant, castling, pawn promotion rules

**And** when move is valid:
- Move is executed on board
- Board state is updated (FEN string updated in session store)
- Captured piece (if any) is removed from board
- Turn switches to AI opponent

**And** when move is invalid:
- Move is rejected
- Error feedback shown (visual highlight, tooltip: "Invalid move")
- Board state remains unchanged
- User can try another move

**Prerequisites:** Story 3.4

**Technical Notes:**
- Install chess.js: `npm install chess.js`
- Chess engine wrapper: `/src/core/chess/engine.ts`
- Initialize chess.js: `new Chess()` with initial position
- Validate move: `chess.move({ from, to, promotion })`
- Update board: `chess.fen()` to get updated FEN
- Store FEN in session store: `boardState` in `sessionStore.ts`
- Handle move validation in `onPieceDrop` callback of react-chessboard
- Reference: Architecture section 3 (Game Engine Layer - chess.js controls legal moves)
- Reference: PRD section 5.1 (chess.js rules)

---

### Story 3.6: Stockfish AI Integration with Web Worker

As a user,
I want the AI to make moves automatically,
So that I can play chess against a computer opponent.

**Acceptance Criteria:**

**Given** a user makes a valid move
**When** it becomes the AI's turn
**Then** the AI calculates and makes a move:
- Stockfish Web Worker is invoked
- AI calculates best move based on difficulty:
  - Beginner: Lower depth (e.g., depth 5)
  - Intermediate: Medium depth (e.g., depth 10)
  - Advanced: Higher depth (e.g., depth 15)
- Best move is returned from Stockfish
- Move is executed on board (chess.js applies move)
- Board state is updated (FEN updated in session store)
- Turn switches back to user

**And** while AI is thinking:
- Loading indicator shown (spinner or "AI thinking..." message)
- Board is disabled (user cannot make moves)
- Difficulty indicator shows current AI level

**And** Stockfish worker:
- Runs in separate Web Worker thread (non-blocking)
- Uses Stockfish WASM for better performance
- Worker file: `/public/worker/stockfish.js` or loaded from CDN

**Prerequisites:** Story 3.5

**Technical Notes:**
- Stockfish integration: `/src/core/chess/stockfishWorker.ts`
- Stockfish loader: `/src/core/chess/stockfishLoader.ts`
- Install stockfish.js or use CDN: `npm install stockfish.js` or load from URL
- Create Web Worker: `new Worker('/worker/stockfish.js')` or similar
- Send position to Stockfish: `worker.postMessage({ type: 'position', fen })`
- Receive best move: `worker.onmessage` handler
- Difficulty mapping: Store difficulty in session store, map to Stockfish depth
- Reference: Architecture section 3 (stockfish.wasm Worker)
- Reference: PRD section 5.1 (stockfish.js AI browser Web Worker)
- Reference: Architecture section 6 (File structure: `/public/worker/stockfish.wasm`, `/public/worker/stockfish.js`)

---

### Story 3.7: Session Score Tracking System

As a user,
I want to see my score increase when I capture pieces,
So that I can track my performance during the match.

**Acceptance Criteria:**

**Given** a user captures an opponent's piece
**When** the capture occurs
**Then** the score is calculated and updated:
- Piece capture value added to score:
  - Pawn: +10
  - Knight/Bishop: +20
  - Rook: +40
  - Queen: +60
- Score is updated in Zustand session store (`sessionScore`)
- Score display component updates in real-time
- Visual feedback: Score number animates or highlights briefly

**And** score is session-only:
- Stored only in Zustand session store (client-side)
- Not persisted to localStorage during match
- Reset to 0 when new match starts

**And** score display shows:
- Current score prominently
- XP preview: "XP: {floor(score / 10)}" (calculated on the fly)
- Score updates immediately after capture

**Prerequisites:** Story 3.5, Story 1.4

**Technical Notes:**
- Score calculation: `/src/utils/calculateScore.ts` or inline in session store
- Session store: `/src/stores/sessionStore.ts` - `sessionScore: number`
- Score display component: `/src/components/Board/ScoreDisplay.tsx` (custom, per UX Design Specification section 6.1, Component 2)
- Detect capture: Check if `chess.history({ verbose: true })` shows captured piece
- Score values per PRD section 6 (Scoring Rules)
- Reference: Architecture section 3 (Session Layer - score logic)
- Reference: Architecture section 4 (Data Flow - During Match: Score increments)

---

### Story 3.8: Optional Combo Bonus System

As a user,
I want bonus points for consecutive captures,
So that I'm rewarded for aggressive play.

**Acceptance Criteria:**

**Given** a user captures pieces in consecutive turns
**When** capture streaks occur
**Then** combo bonuses are awarded:
- 2 captures in 2 turns: +10 bonus
- 3 captures in 3 turns: +20 bonus
- Combo bonus is added to session score
- Combo indicator shown (visual feedback: "Combo! +10" badge)

**And** combo tracking:
- Tracks last 3 turns for capture detection
- Resets if user goes 1 turn without capture
- Combo bonus is optional (can be disabled via feature flag)

**And** combo display:
- Shows combo streak (e.g., "2x Combo")
- Visual feedback when combo triggers (badge or animation)

**Prerequisites:** Story 3.7

**Technical Notes:**
- Combo tracking: Store last N moves in session store (`captureHistory: Move[]`)
- Combo detection: Check if last 2 or 3 moves were captures
- Combo bonus calculation: Add bonus to score if combo detected
- Optional feature: Can be disabled (PRD section 6 mentions "Optional combo bonuses")
- Reference: PRD section 6 (Optional combo bonuses)

---

### Story 3.9: Match End Detection and Result

As a user,
I want to see the match result when the game ends,
So that I know if I won, lost, or drew.

**Acceptance Criteria:**

**Given** a chess game reaches an end condition
**When** checkmate, stalemate, or draw occurs
**Then** the match end is detected:
- chess.js detects game end: `chess.isCheckmate()`, `chess.isStalemate()`, `chess.isDraw()`
- Match result modal is displayed (shadcn/ui Dialog)
- Modal shows:
  - Result: "You Win!" / "You Lose!" / "Draw"
  - Final score
  - XP gained: `floor(score / 10)`
  - "Play Again" button (primary)
  - "Home" button (secondary)

**And** when user clicks "Play Again":
- Navigate back to mode/difficulty selection
- Session store is reset

**And** when user clicks "Home":
- Navigate to landing page
- Session store is reset

**Prerequisites:** Story 3.5, Story 1.3

**Technical Notes:**
- Match end detection: Check `chess.isCheckmate()`, `chess.isStalemate()`, `chess.isDraw()`
- Match result modal: Use shadcn/ui Dialog component
- Modal layout: Centered, max-width 600px (UX Design Specification section 7.3 - Modal Patterns)
- Result modal component: `/src/components/Board/MatchResultModal.tsx`
- Session reset: Reset `sessionScore`, `boardState`, `sessionLifecycle` in session store
- Journey reference: UX Design Specification section 5.1, Journey 1, step 6
- Journey reference: UX Design Specification section 5.2, Journey 2, step 5

---

### Story 3.10: Game Board Page Layout with Score Display

As a user,
I want a well-organized game board layout,
So that I can see all game information clearly.

**Acceptance Criteria:**

**Given** a user is playing a match
**When** the game board page is displayed
**Then** the layout includes:
- Chess board (centered, main focus)
- Score display component (sidebar or below board):
  - Current score (large, prominent)
  - XP preview: "XP: {floor(score / 10)}"
- Difficulty indicator badge (shows current difficulty level)
- "Back" button or link (top-left, returns to mode selection)
- Game info panel (optional):
  - Turn indicator (Your turn / AI thinking)
  - Game status (Normal / Check / Checkmate)

**And** layout is responsive:
- Desktop (1280px+): Board centered, score sidebar
- Layout matches "Spacious & Centered" design (UX Design Specification section 4.1)
- Adequate spacing between elements

**Prerequisites:** Story 3.4, Story 3.7, Story 3.3

**Technical Notes:**
- Game board page: `/src/pages/PlayClassic.tsx`
- Layout: Flexbox or CSS Grid
- Score display: `/src/components/Board/ScoreDisplay.tsx` (custom component)
- Difficulty badge: shadcn/ui Badge component
- Layout reference: UX Design Specification section 5.2, Journey 2, step 4 (Centered game board with sidebar info)

---

## Epic 4: Progression System & Persistence

**Goal:** Enable users to earn XP, level up, unlock content, and persist their progression data to localStorage.

**Value:** Users can track their progress, unlock new content, and see their achievements persist across sessions.

### Story 4.1: XP Calculation and Level System

As a user,
I want my score to convert to XP and my level to increase,
So that I can track my progression.

**Acceptance Criteria:**

**Given** a match ends with a final score
**When** XP is calculated
**Then** XP conversion works:
- XP = floor(score / 10) (from session score)
- XP is added to user's total XP in profile store
- Level is recalculated based on total XP:
  - Level 1: 0-99 XP
  - Level 2: 100-199 XP
  - Level 3: 200-299 XP
  - ... (progressive thresholds, determine appropriate XP curve)

**And** when user levels up:
- Level increases in profile store
- Rank is recalculated from level:
  - Level 1-2: "Pawn"
  - Level 3-4: "Knight"
  - Level 5-6: "Bishop"
  - Level 7-8: "Rook"
  - Level 9-10: "Queen"
- Level-up notification shown (toast or modal)

**Prerequisites:** Story 3.9, Story 1.4

**Technical Notes:**
- XP calculation: `/src/utils/calculateXP.ts` - `calculateXP(score: number): number` returns `Math.floor(score / 10)`
- Level calculation: `/src/utils/calculateLevel.ts` - Calculate level from total XP
- Rank mapping: `/src/utils/rankMapping.ts` - Map level to rank string
- Profile store update: Update `xp`, `level`, `rank` in Zustand profile store
- XP thresholds: Determine progressive curve (e.g., 100 XP per level, or exponential)
- Reference: PRD section 7 (Progression System - XP, Level, Rank)
- Reference: Architecture section 3 (Profile Layer - xp, level, rank)

---

### Story 4.2: localStorage Profile Update After Match

As a user,
I want my progression data saved to localStorage,
So that my progress persists across sessions.

**Acceptance Criteria:**

**Given** a match ends and XP/level are calculated
**When** profile data needs to be updated
**Then** localStorage profile is updated:
- Profile in localStorage (key: `chessAscensionProfile`) is updated with:
  - `xp`: Updated total XP
  - `level`: Updated level
  - `rank`: Updated rank
  - `gamesPlayed`: Incremented by 1
  - `bestScore`: Updated if current score > bestScore
  - `wins`: Incremented if user won
  - `losses`: Incremented if user lost
- Update is written to localStorage via profileStorage utility
- Profile store is synced with localStorage data

**And** update happens after match end:
- Single write per match (no writes during match)
- Update is synchronous (localStorage write is immediate)
- Loading state shown while update is in progress (if needed)
- Error handling: If update fails (e.g., localStorage quota exceeded), show error message, allow retry

**Prerequisites:** Story 4.1, Story 1.2, Story 2.2

**Technical Notes:**
- Profile storage utility: `/src/services/profileStorage.ts` - `saveProfile(profile: Profile): void`
- Update call: Load existing profile from localStorage, merge updates, save back
- Profile update: Use `saveProfile()` from profileStorage utility (Story 1.2)
- Profile store sync: Update Zustand profile store after successful localStorage write
- Single write per match per Architecture section 4 (Data Flow - Match End)
- localStorage limitations: Handle quota exceeded errors gracefully (rare but possible)
- Reference: PRD section 8 (Data Model - localStorage: `chessAscensionProfile` key)
- Reference: Architecture section 3 (Profile Layer - localStorage syncing instead of Firestore)

---

### Story 4.3: Skin Unlock System Based on Level

As a user,
I want to unlock new skins as I level up,
So that I can customize my game appearance.

**Acceptance Criteria:**

**Given** a user levels up to specific thresholds
**When** level unlocks are detected
**Then** skins are unlocked:
- Level 1: "Classic" skin unlocked (initial)
- Level 3: "Monochrome" skin unlocked
- Level 5: "Neon" skin unlocked
- Level 7: "Gold" skin unlocked
- Unlocked skins are added to `unlockedSkins` array in profile
- Unlock notification shown (toast: "New skin unlocked: Monochrome!")

**And** when skin is unlocked:
- Skin is added to localStorage profile `unlockedSkins` array
- Profile store is updated
- Profile is saved to localStorage via profileStorage utility
- Skin can be selected in profile settings (future story)

**Prerequisites:** Story 4.1, Story 4.2

**Technical Notes:**
- Skin unlock detection: Check level against unlock thresholds
- Skin unlock logic: `/src/utils/skinUnlocks.ts` or in level calculation
- Unlock mapping: `{ level: 3, skin: 'Monochrome' }`, etc.
- localStorage update: Load profile, add skin to `unlockedSkins` array if not already present, save profile
- Reference: PRD section 7 (Skins - Skin unlocks by level)
- Reference: PRD section 5.2 (Extended Features - Skin unlocks by level)

---

### Story 4.4: Ability Unlock System Based on Level

As a user,
I want to unlock new abilities as I level up,
So that I can use them in RPG Mode.

**Acceptance Criteria:**

**Given** a user levels up to specific thresholds
**When** ability unlocks are detected
**Then** abilities are unlocked:
- Shield ability unlocks at Level 5
- Unlocked abilities are added to `unlockedAbilities` array in profile
- Unlock notification shown (toast: "New ability unlocked: Shield!")

**And** when ability is unlocked:
- Ability is added to localStorage profile `unlockedAbilities` array
- Profile store is updated
- Profile is saved to localStorage via profileStorage utility
- Ability becomes available in RPG Mode (future story)

**Prerequisites:** Story 4.1, Story 4.2

**Technical Notes:**
- Ability unlock detection: Check level against unlock thresholds
- Ability unlock logic: `/src/utils/abilityUnlocks.ts` or in level calculation
- Unlock mapping: `{ level: 5, ability: 'Shield' }`
- localStorage update: Load profile, add ability to `unlockedAbilities` array if not already present, save profile
- Reference: PRD section 7 (Abilities - Abilities unlock at certain levels)
- Reference: PRD section 5.2 (Shield - unlock-based)

---

### Story 4.5: Level-Up Notification with Unlocks

As a user,
I want to see what I unlocked when I level up,
So that I'm aware of new content available.

**Acceptance Criteria:**

**Given** a user levels up
**When** level-up is detected
**Then** level-up notification is displayed:
- Modal or toast notification (shadcn/ui Dialog or toast)
- Shows: "Level Up! You're now Level {level}!"
- Lists any unlocks:
  - New skins unlocked
  - New abilities unlocked
  - Rank change (if applicable)
- "Continue" button to dismiss

**And** notification is shown:
- After match ends and XP is calculated
- Before or after match result modal
- Can be combined with match result modal

**Prerequisites:** Story 4.1, Story 4.3, Story 4.4

**Technical Notes:**
- Level-up modal: `/src/components/LevelUpModal.tsx` or use shadcn/ui Dialog
- Modal content: Show level, rank change, unlocks list
- Trigger: Check if `level` increased after XP calculation
- Layout: Centered modal, max-width 600px (UX Design Specification section 7.3)
- Reference: UX Design Specification section 5.3, Journey 3, step 5 (Unlock notification if leveled up)

---

## Epic 5: RPG Mode & Abilities

**Goal:** Enable users to play with enhanced abilities that modify gameplay. Users can spend session score to activate abilities during matches.

**Value:** Users can use strategic abilities to enhance their gameplay and increase their chances of winning.

### Story 5.1: RPG Mode Game Board with Ability Panel

As a user,
I want to see an ability panel in RPG Mode,
So that I can activate abilities during the match.

**Acceptance Criteria:**

**Given** a user selects RPG Mode and starts a match
**When** the game board page loads
**Then** the RPG Mode layout displays:
- Chess board (centered, same as Classic Mode)
- Ability panel component (below or side of board):
  - Shows available abilities with costs
  - Each ability button shows:
    - Ability name (e.g., "Double Move")
    - Cost: "{cost} points" (e.g., "60 points")
    - Button enabled/disabled based on score
  - Abilities available:
    - Double Move (~60 score) - always available
    - Tactical Hint (~25 score) - always available
    - Shield (~90-100 score) - only if unlocked (check `unlockedAbilities` from profile)

**And** ability panel styling:
- Card or sidebar layout (shadcn/ui Card)
- Ability buttons: Primary/secondary button style
- Disabled state: Grayed out if insufficient score or not unlocked
- Active state: Highlighted if ability is active

**Prerequisites:** Story 3.10, Story 1.4, Story 4.4

**Technical Notes:**
- Ability panel component: `/src/components/Board/AbilityPanel.tsx` (custom, per UX Design Specification section 6.1, Component 3)
- RPG Mode page: `/src/pages/PlayRPG.tsx`
- Ability definitions: `/src/core/abilities/abilities.ts` - Define abilities with costs
- Unlock check: Check if ability is in `unlockedAbilities` array from profile store (Shield requires unlock)
- Layout: Centered board with ability panel below or to side
- Reference: UX Design Specification section 6.1, Component 3 (AbilityPanel Component)
- Reference: Architecture section 3 (Session Layer - sessionAbilities)
- Reference: PRD section 5.2 (In-match abilities with costs)

---

### Story 5.2: Ability Activation System

As a user,
I want to activate abilities by spending score,
So that I can use strategic advantages during the match.

**Acceptance Criteria:**

**Given** a user has sufficient score for an ability
**When** the user clicks an ability button
**Then** the ability is activated:
- Score cost is deducted from session score
- Ability is activated (flag set in session store)
- Ability button shows "Active" state
- Visual feedback: Ability effect is applied
- Ability cannot be activated again until deactivated

**And** when user has insufficient score:
- Ability button is disabled
- Tooltip or message: "Need {cost} points to activate"

**And** when ability is not unlocked (for Shield):
- Ability button is disabled or hidden
- Tooltip: "Unlock at Level 5" or similar

**And** ability activation updates:
- Session score updated: `sessionScore -= abilityCost`
- Ability flags updated in session store:
  - `doubleMoveActive: boolean`
  - `hintModeActive: boolean`
  - `shieldActive: boolean` (if unlocked)

**Prerequisites:** Story 5.1, Story 3.7

**Technical Notes:**
- Ability activation logic: `/src/core/abilities/useAbilities.ts` (Zustand slice)
- Check score: `sessionScore >= abilityCost` before activation
- Check unlock: Verify ability is in `unlockedAbilities` array (for Shield)
- Deduct score: Update `sessionScore` in session store
- Set ability flags: Update `rpgFlags` in session store
- Reference: Architecture section 3 (Session Layer - rpgFlags: doubleMoveActive, shieldActive, etc.)
- Reference: Architecture section 5 (Ability System Architecture)
- Reference: PRD section 5.2 (In-match abilities purchased using session score)

---

### Story 5.3: Double Move Ability Implementation

As a user,
I want to make two moves in a row when I activate Double Move,
So that I can gain a strategic advantage.

**Acceptance Criteria:**

**Given** Double Move ability is activated
**When** the user makes a move
**Then** the system allows a second move:
- User makes first move (normal chess move validation)
- After first move completes, user can immediately make second move
- AI turn is skipped between the two moves
- After second move, turn switches to AI
- Double Move flag is deactivated after use

**And** move validation:
- Both moves are validated using chess.js
- Second move follows normal chess rules
- Board state updates correctly after both moves

**Prerequisites:** Story 5.2, Story 3.5

**Technical Notes:**
- Double Move logic: Check `doubleMoveActive` flag in session store
- After first move: Keep turn with user, allow second move
- After second move: Set `doubleMoveActive = false`, switch turn to AI
- No chess.js modification needed - handled via session state flags
- Reference: Architecture section 5 (Ability System - Double Move: session flag `doubleMoveActive = true`)
- Reference: PRD section 5.2 (Double Move - ~60 score)

---

### Story 5.4: Tactical Hint Ability Implementation

As a user,
I want to see a recommended move when I activate Tactical Hint,
So that I can get strategic guidance.

**Acceptance Criteria:**

**Given** Tactical Hint ability is activated
**When** the ability is clicked
**Then** the system shows a recommended move:
- Stockfish Worker calculates best move (quick calculation, depth 5-10)
- Best move is displayed on board:
  - Source square highlighted (primary color)
  - Destination square highlighted (accent color)
  - Move indicator shown (arrow or highlight)
- Hint remains visible until user makes a move or cancels
- Hint is deactivated after user makes any move

**And** visual feedback:
- Highlighted squares are clearly visible
- Move suggestion is non-intrusive (doesn't block board)
- User can ignore hint and make their own move

**Prerequisites:** Story 5.2, Story 3.6

**Technical Notes:**
- Hint calculation: Use Stockfish Worker with lower depth for speed
- Hint display: Highlight squares using react-chessboard square styling
- Hint state: `hintModeActive: boolean` in session store
- Cancel hint: User makes any move or clicks "Cancel" button
- Reference: Architecture section 5 (Ability System - Tactical Hint: call Stockfish Worker for best move)
- Reference: PRD section 5.2 (Tactical Hint - ~25 score)

---

### Story 5.5: Shield Ability Implementation

As a user,
I want to protect a piece from capture when I activate Shield,
So that I can save important pieces.

**Acceptance Criteria:**

**Given** Shield ability is unlocked (Level 5+) and activated
**When** the user activates Shield
**Then** the user selects a piece to protect:
- Shield activation prompts piece selection
- User clicks on a piece to shield (or square)
- Selected piece/square is marked as shielded (visual indicator: shield icon or glow)
- Shield flag is set: `shieldedPieceSquare: string` (e.g., "e4")

**And** when AI attempts to capture shielded piece:
- Capture is prevented (AI move is rejected or ignored)
- AI must choose another move
- Shield remains active for one capture attempt
- Shield is deactivated after protecting once

**Prerequisites:** Story 5.2, Story 4.4, Story 3.6

**Technical Notes:**
- Shield logic: Store `shieldedPieceSquare: string | null` in session store
- Piece selection: User clicks piece/square after activating Shield
- AI move validation: Check if AI move targets shielded square, if so, reject move
- Shield deactivation: Set `shieldedPieceSquare = null` after one protection
- Unlock check: Verify Shield is in `unlockedAbilities` array from profile store
- No chess.js modification - handled via session state and move validation
- Reference: Architecture section 5 (Ability System - Shield: session flag `shieldedPieceSquare = "e4"`)
- Reference: PRD section 5.2 (Shield - ~90-100 score, unlock-based)

---

### Story 5.6: Skin Selection and Application

As a user,
I want to select and apply unlocked skins,
So that I can customize my game appearance.

**Acceptance Criteria:**

**Given** a user has unlocked multiple skins
**When** the user views their profile or settings
**Then** skin selection interface is available:
- Shows list of unlocked skins (from `unlockedSkins` array)
- Selected skin is indicated (checkmark or highlight)
- User can click on a skin to select it
- Selected skin is saved to localStorage profile `selectedSkin` field
- Selected skin is applied to game UI:
  - CSS theme variables updated
  - Colors change according to skin theme

**And** skin themes applied:
- Classic: Default Classic Chess theme colors
- Monochrome: Grayscale color scheme
- Neon: Bright neon color scheme
- Gold: Gold/amber color scheme

**Prerequisites:** Story 4.3, Story 2.3, Story 1.3

**Technical Notes:**
- Skin selection: Add to profile page or settings modal
- Skin themes: CSS variables in `/src/themes/skins.css`
- Theme switching: Update CSS variables based on `selectedSkin` from profile store
- localStorage update: Load profile, update `selectedSkin` field, save profile via profileStorage utility
- Reference: Architecture section 8 (File structure: `/src/themes/skins.css`)
- Reference: Architecture section 2 (UI Layer - Applying selected skin via Tailwind CSS theme variables)
- Reference: PRD section 5.2 (Skin unlocks by level)
- Reference: UX Design Specification section 1.1 (CSS variables approach allows theme switching)

---

## FR Coverage Matrix

| FR | Description | Epic | Story |
|----|-------------|------|-------|
| FR1 | Landing page | Epic 3 | Story 3.1 |
| FR2 | Create local profile | Epic 2 | Story 2.1 |
| FR3 | Load local profile | Epic 2 | Story 2.2 |
| FR4 | Profile creation | Epic 2 | Story 2.1 |
| FR5 | Profile display | Epic 2 | Story 2.3 |
| FR6 | Profile updates | Epic 4 | Story 4.2 |
| FR7 | Mode selection | Epic 3 | Story 3.2 |
| FR8 | Difficulty selection | Epic 3 | Story 3.3 |
| FR9 | Game board display | Epic 3 | Story 3.4 |
| FR10 | Move validation | Epic 3 | Story 3.5 |
| FR11 | AI moves | Epic 3 | Story 3.6 |
| FR12 | Session score tracking | Epic 3 | Story 3.7 |
| FR13 | Score calculation | Epic 3 | Story 3.7 |
| FR14 | Combo bonuses | Epic 3 | Story 3.8 |
| FR15 | XP conversion | Epic 4 | Story 4.1 |
| FR16 | Level calculation | Epic 4 | Story 4.1 |
| FR17 | Rank mapping | Epic 4 | Story 4.1 |
| FR18 | Stats tracking | Epic 4 | Story 4.2 |
| FR19 | Match result display | Epic 3 | Story 3.9 |
| FR20 | RPG Mode ability panel | Epic 5 | Story 5.1 |
| FR21 | Double Move ability | Epic 5 | Story 5.3 |
| FR22 | Tactical Hint ability | Epic 5 | Story 5.4 |
| FR23 | Shield ability | Epic 5 | Story 5.5 |
| FR24 | Ability activation | Epic 5 | Story 5.2 |
| FR25 | Skin unlocks | Epic 4 | Story 4.3 |
| FR26 | Skin selection | Epic 5 | Story 5.6 |
| FR27 | Unlocked abilities storage | Epic 4 | Story 4.4 |
| FR28 | Level-up notifications | Epic 4 | Story 4.5 |

---

## Summary

**Epic Breakdown Complete**

**Total Epics:** 5
**Total Stories:** 34

**Epic Summary:**
- **Epic 1: Foundation & Project Setup** - 5 stories (project setup, localStorage profile system, shadcn/ui, Zustand, hosting) - *Note: Story 1.5 (Deployment) deferred to end of development*
- **Epic 2: Local Profile Management** - 4 stories (create profile, load profile, profile display, navigation)
- **Epic 3: Classic Mode Chess Gameplay** - 10 stories (landing, mode selection, difficulty, board, moves, AI, scoring, combos, match end, layout)
- **Epic 4: Progression System & Persistence** - 5 stories (XP/level, localStorage updates, skin unlocks, ability unlocks, notifications)
- **Epic 5: RPG Mode & Abilities** - 6 stories (ability panel, activation, Double Move, Tactical Hint, Shield, skin selection)

**FR Coverage:** All 28 functional requirements from PRD are mapped to stories.

**Context Incorporated:**
- ✅ PRD requirements (updated for localStorage profile system)
- ✅ UX Design Specification (interaction patterns, component specs, layout, styling)
- ✅ Architecture decisions (tech stack, data flow, component structure, file organization)

**Scope Adjustment:**
- ✅ All Firebase Authentication + Firestore references replaced with localStorage profile system
- ✅ Stories updated to use `profileStorage` utility instead of Firebase services
- ✅ Profile persistence via localStorage (key: `chessAscensionProfile`)

**Status:** COMPLETE - Ready for Phase 4 Implementation!

**Next Steps:**
- Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown
- Stories are sized for single dev agent session completion
- All stories include detailed acceptance criteria, prerequisites, and technical notes

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document incorporates context from PRD, UX Design Specification, and Architecture documents._

---
