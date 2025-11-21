# Story 1.5: Deployment Pipeline - Firebase Hosting Setup

Status: drafted

## Story

As a developer,
I want Firebase Hosting configured for deployment,
So that the application can be deployed and accessed online.

**Note:** This story is marked as DEFERRED in epics.md - deployment pipeline will be implemented at the end of development. Development will proceed on localhost.

## Acceptance Criteria

**AC1: Firebase CLI Installation**
Given Firebase CLI needs to be available
When the deployment setup is initiated
Then Firebase CLI is installed: `npm install -g firebase-tools` (or available via npx)
And Firebase CLI can be executed: `firebase --version` returns version number
And Firebase login configured locally: `firebase login` works

**AC2: Firebase Hosting Configuration**
And `firebase.json` created with hosting configuration:
- Public directory: `dist` (matches Vite build output)
- Single-page app (SPA) routing: `rewrites` to `index.html` for all routes
- Hosting configuration structure matches Firebase Hosting requirements

**AC3: Firebase Project Configuration**
And `.firebaserc` created with Firebase project ID
And Project ID is correctly configured for deployment target
And `.firebaserc` contains no secrets (safe to commit to version control)

**AC4: Build Script Configuration**
And Build script configured in `package.json`: `"build": "vite build"`
And Vite build output directory configured as `dist/` (matches Firebase public directory)
And Build command works: `npm run build` produces `dist/` directory with production files

**AC5: Local Preview Functionality**
And `firebase serve` works locally (preview deployment before production)
And Local preview serves application from `dist/` directory correctly
And SPA routing works in local preview (all routes resolve to `index.html`)

**AC6: Deployment Verification**
And Deployment command works: `firebase deploy --only hosting` (optional, can defer actual deployment)
And Deployment configuration is verified (no blocking configuration errors)
And Build output is correctly configured for Firebase Hosting

**AC7: Configuration Files Commit Safety**
And `.firebaserc` and `firebase.json` are safe to commit (no secrets or sensitive data)
And Configuration files follow Firebase best practices
And Files are ready for version control inclusion

[Source: docs/epics.md#Story-1.5-Deployment-Pipeline-Firebase-Hosting-Setup, docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5-Firebase-Hosting-Setup]

## Tasks / Subtasks

- [ ] **Task 1: Install Firebase CLI** (AC: 1)
  - [ ] Install Firebase CLI globally: `npm install -g firebase-tools` OR verify npx availability
  - [ ] Verify Firebase CLI installation: `firebase --version` returns version number
  - [ ] Configure Firebase login: `firebase login` (authenticates with Google account)
  - [ ] Verify Firebase authentication works: `firebase projects:list` shows available projects
  - [ ] Document Firebase CLI installation method (global vs npx) in project README

- [ ] **Task 2: Initialize Firebase Hosting** (AC: 2)
  - [ ] Run `firebase init hosting` command
  - [ ] Select existing Firebase project OR create new project via Firebase Console
  - [ ] Configure public directory: `dist` (matches Vite build output directory)
  - [ ] Configure SPA routing: Select "Yes" to configure as single-page app
  - [ ] Verify `firebase.json` created with correct hosting configuration:
    - `"public": "dist"`
    - `"rewrites": [{ "source": "**", "destination": "/index.html" }]`

- [ ] **Task 3: Configure Firebase Project** (AC: 3)
  - [ ] Verify `.firebaserc` created with project ID
  - [ ] Verify project ID matches target Firebase project
  - [ ] Verify `.firebaserc` contains only project ID (no secrets)
  - [ ] Verify `.firebaserc` format: `{ "projects": { "default": "<project-id>" } }`
  - [ ] Test configuration: `firebase use` shows correct project

- [ ] **Task 4: Configure Build Script** (AC: 4)
  - [ ] Verify build script exists in `package.json`: `"build": "vite build"`
  - [ ] Verify Vite config outputs to `dist/` directory (check `vite.config.ts`)
  - [ ] Test build command: Run `npm run build`
  - [ ] Verify build output: Check `dist/` directory contains production files (index.html, assets/)
  - [ ] Verify build completes without errors

- [ ] **Task 5: Test Local Preview** (AC: 5)
  - [ ] Run `npm run build` to generate production build
  - [ ] Run `firebase serve` command
  - [ ] Verify local preview starts on expected port (default: http://localhost:5000)
  - [ ] Verify application loads correctly in browser from local preview
  - [ ] Test SPA routing: Navigate to non-root route, verify it resolves to `index.html`
  - [ ] Verify all static assets (CSS, JS) load correctly from local preview

- [ ] **Task 6: Verify Deployment Configuration** (AC: 6)
  - [ ] Verify `firebase.json` configuration is correct for production deployment
  - [ ] Verify `.firebaserc` project ID is correct for target environment
  - [ ] Run `firebase deploy --only hosting --dry-run` (if available) to check for errors
  - [ ] Verify deployment command works: `firebase deploy --only hosting` (can defer actual deployment)
  - [ ] Document deployment process in README or deployment guide

- [ ] **Task 7: Verify Configuration Files Safety** (AC: 7)
  - [ ] Review `firebase.json` contents - verify no secrets or sensitive data
  - [ ] Review `.firebaserc` contents - verify only project ID (no API keys, tokens)
  - [ ] Verify files follow Firebase best practices (public directory, SPA routing)
  - [ ] Add `firebase.json` and `.firebaserc` to git (verify they're safe to commit)
  - [ ] Verify `.gitignore` doesn't exclude these files (they should be committed)

[Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5-Firebase-Hosting-Setup-Sequence, docs/epics.md#Story-1.5-Deployment-Pipeline-Firebase-Hosting-Setup]

## Dev Notes

### Architecture Patterns and Constraints

**Deployment Layer:**
- Firebase Hosting provides static site hosting for client-only React application (Architecture section 1 - System Overview)
- Deployment configuration supports single-page app (SPA) routing via rewrites to `index.html` (Architecture section 3 - Routing Layer)
- Build output from Vite (`dist/` directory) is served as static files by Firebase Hosting
- No backend dependencies - fully client-side application (Architecture section 1)

**Deployment Architecture:**
- Firebase Hosting configuration: `firebase.json` (Architecture section 8 - File & Folder Structure)
- Firebase project configuration: `.firebaserc` (project ID reference)
- Build system: Vite production build generates `dist/` directory with optimized static assets
- Deployment process: Manual deployment via Firebase CLI (`firebase deploy --only hosting`)

**Configuration Files:**
- `firebase.json`: Firebase Hosting configuration (public directory, rewrites, headers)
- `.firebaserc`: Firebase project ID mapping (safe to commit, no secrets)
- Both files are version-controlled and contain no sensitive data (Architecture section 11 - Summary)

**Build Integration:**
- Vite build process (`npm run build`) generates production-ready static files in `dist/` directory
- Firebase Hosting serves files from `dist/` directory as public files
- SPA routing handled via Firebase rewrites: all routes resolve to `index.html` for client-side routing

**Deployment Notes:**
- Story is marked as DEFERRED in epics.md - deployment can be implemented at end of development
- Development proceeds on localhost during MVP development
- Firebase Hosting setup ensures deployment pipeline is ready when needed
- Architecture remains modular to allow alternative deployment targets if needed (Architecture section 11)

[Source: docs/architecture.md#System-Overview, docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo, docs/architecture.md#Summary]

### Project Structure Notes

**Aligned with Architecture Specification:**
- Firebase configuration files: Root directory (`firebase.json`, `.firebaserc`)
- Build output: `dist/` directory (Vite production build output)
- File structure supports Firebase Hosting deployment without modifications (Architecture section 8)

**Integration with Existing Setup:**
- Vite build system from Story 1.1 generates `dist/` directory
- React Router configuration from Story 1.1 supports SPA routing
- Static assets (CSS, JS) from build process served by Firebase Hosting
- No conflicts with existing development setup (localhost development unaffected)

**Configuration File Locations:**
- `firebase.json`: Root directory (Firebase Hosting configuration)
- `.firebaserc`: Root directory (Firebase project ID reference)
- Both files are safe to commit to version control (no secrets)

**Build Output Structure:**
- `dist/` directory contains:
  - `index.html` (main HTML file)
  - `assets/` (compiled CSS, JS bundles)
  - Static files served directly by Firebase Hosting

**No Conflicts Detected:**
- Firebase configuration doesn't interfere with localhost development
- Build process remains unchanged (Vite build continues to output to `dist/`)
- Deployment is optional until end of development (deferred per epics.md)

[Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo, docs/epics.md#Story-1.5-Deployment-Pipeline-Firebase-Hosting-Setup]

### Learnings from Previous Story

**From Story 1.4 (Status: done)**

**New Files Created:**
- `/src/stores/sessionStore.ts` - Session store with SessionState interface and placeholder Zustand store
- `/src/stores/profileStore.ts` - Profile store with ProfileState interface and placeholder Zustand store

**Modified Files:**
- `package.json` - Added Zustand 5.0.8 to dependencies

**Architectural Patterns Established:**
- TypeScript strict mode enabled (Firebase config files should use TypeScript interfaces if needed)
- Store structure aligns with Architecture section 3 (deployment config aligns with Architecture section 8)
- File structure follows Architecture section 8 specification (Firebase config in root directory)

**Technical Notes:**
- Project uses TypeScript 5.5.3 with strict mode
- Build system (Vite) configured and working - produces `dist/` directory
- Path aliases available: `@/` resolves to `src/` directory
- TypeScript compilation verified: `npm run build` passes with no errors

**Implementation Approach:**
- Configuration files should follow project patterns (version-controlled, no secrets)
- Firebase config files are safe to commit (no sensitive data)
- Build output directory (`dist/`) already configured from Story 1.1

**Deployment Integration Notes:**
- Firebase Hosting serves static files from `dist/` directory (build output from Vite)
- SPA routing handled via Firebase rewrites (React Router client-side routing preserved)
- Deployment doesn't require changes to existing codebase structure
- Story is deferred - can be implemented at end of development without blocking other work

[Source: docs/sprint-artifacts/1-4-zustand-state-management-setup.md#File-List, docs/sprint-artifacts/1-4-zustand-state-management-setup.md#Completion-Notes-List]

### References

- [Source: docs/epics.md#Story-1.5-Deployment-Pipeline-Firebase-Hosting-Setup] - Story acceptance criteria and technical notes
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5-Firebase-Hosting-Setup] - Technical specification and setup sequence
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Dependencies-and-Integrations] - Firebase CLI and deployment dependencies
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Non-Functional-Requirements] - Deployment reliability and security requirements
- [Source: docs/architecture.md#System-Overview] - Client-only deployment architecture
- [Source: docs/architecture.md#File--Folder-Structure-Client-Only-Monorepo] - Firebase configuration file locations
- [Source: docs/prd.md#Technical-Stack] - Firebase Hosting deployment target

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

