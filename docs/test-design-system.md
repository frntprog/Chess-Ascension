# System-Level Test Design - Chess Ascension

**Date:** 2025-01-27
**Author:** Den
**Status:** Draft

---

## Executive Summary

**Scope:** System-level testability review for Chess Ascension architecture before solutioning gate check.

**Testability Assessment Summary:**

- **Controllability:** PASS with minor concerns
- **Observability:** CONCERNS (limited logging/telemetry)
- **Reliability:** PASS (client-side architecture supports isolation)

**Test Levels Strategy:**

- **Unit:** 50% - Business logic (score calculation, XP conversion, level/rank mapping)
- **Integration:** 20% - Firebase Auth/Firestore operations, Stockfish worker integration
- **E2E:** 30% - Critical user journeys (registration, login, gameplay, progression)

**NFR Testing Approach:**

- **Security:** Playwright E2E tests for Firebase Auth/authz, Firestore security rules validation
- **Performance:** k6 load testing for Firebase Firestore read/write operations (not applicable for client-side chess engine)
- **Reliability:** Playwright E2E tests for error handling, offline mode, Firestore connection failures
- **Maintainability:** CI tools for test coverage (≥80% target), code duplication (<5%), npm audit

---

## Testability Assessment

### Controllability: PASS (with minor concerns)

**Assessment:** The client-side architecture provides good controllability for testing.

**Strengths:**

- ✅ **State Control:** Zustand stores (sessionStore, profileStore) allow direct state manipulation for testing
- ✅ **Mockable Dependencies:** Firebase Auth and Firestore can be mocked via Playwright's `context.route()` or test doubles
- ✅ **Chess Engine Control:** chess.js provides deterministic game state (FEN strings) - can seed any board position
- ✅ **Stockfish Worker:** Can be mocked or replaced with deterministic move responses for testing
- ✅ **No External APIs:** Fully client-side eliminates external service dependencies

**Concerns:**

- ⚠️ **Firebase Emulator Setup:** Requires Firebase Emulator Suite for integration tests (adds setup complexity)
- ⚠️ **Stockfish Worker Testing:** Web Worker testing requires special handling (Playwright supports this, but adds complexity)

**Recommendations:**

- Use Firebase Emulator Suite for integration tests (auth, firestore)
- Mock Stockfish worker responses for deterministic E2E tests
- Create test factories for Zustand store state (sessionStore, profileStore)

---

### Observability: CONCERNS

**Assessment:** Limited observability infrastructure identified in architecture.

**Strengths:**

- ✅ **Browser DevTools:** Standard debugging tools available
- ✅ **React DevTools:** Component state inspection possible
- ✅ **Firebase Console:** Firestore data inspection available

**Concerns:**

- ⚠️ **No Structured Logging:** Architecture doesn't mention logging framework (console.log only)
- ⚠️ **No Error Tracking:** No Sentry or error monitoring service mentioned
- ⚠️ **No Performance Monitoring:** No APM or performance tracking (Core Web Vitals, Firebase Performance)
- ⚠️ **No Telemetry Headers:** No Server-Timing or trace IDs (not applicable for client-only app)

**Recommendations:**

- Add structured logging (e.g., `winston` or `pino` for browser)
- Integrate error tracking (Sentry or Firebase Crashlytics)
- Add Firebase Performance Monitoring for Core Web Vitals
- Add console logging for critical operations (auth failures, Firestore errors, Stockfish worker failures)

**Testability Impact:**

- E2E tests can validate error handling via UI feedback (toast notifications, error messages)
- Cannot validate telemetry/logging without infrastructure (default to CONCERNS)

---

### Reliability: PASS

**Assessment:** Client-side architecture supports reliable, isolated testing.

**Strengths:**

- ✅ **Stateless Design:** Session state in Zustand (no server-side state)
- ✅ **Isolated Tests:** Each test can start with fresh state (reset Zustand stores)
- ✅ **No Shared State:** No database connections or shared resources
- ✅ **Deterministic Chess Engine:** chess.js provides deterministic game logic
- ✅ **Parallel-Safe:** Tests can run in parallel (no shared state)

**Concerns:**

- ⚠️ **Firestore Connection Failures:** Need to test offline mode and Firestore connection errors
- ⚠️ **Stockfish Worker Failures:** Need to test worker initialization failures and timeout scenarios

**Recommendations:**

- Test offline mode (Firestore offline persistence)
- Test Firestore connection failures (mock network errors)
- Test Stockfish worker initialization failures
- Test timeout scenarios (worker takes too long to respond)

---

## Architecturally Significant Requirements (ASRs)

### ASR-1: Client-Side Chess Engine Performance (PERF)

**Requirement:** Stockfish Web Worker must compute moves within acceptable time limits (beginner: <2s, intermediate: <5s, advanced: <10s).

**Risk Score:** 3 (Probability: 1 - Unlikely, Impact: 3 - Critical)

**Rationale:** 
- Low probability: Stockfish.js is mature and performant
- High impact: Slow AI moves degrade user experience significantly

**Testability Approach:**
- Unit tests: Mock Stockfish worker, measure response times
- E2E tests: Measure actual move computation time in browser
- Performance tests: Not applicable (client-side, no load testing needed)

**Mitigation:**
- Set timeout thresholds per difficulty level
- Show loading indicator during AI thinking
- Fallback to simpler move if timeout exceeded

---

### ASR-2: Firebase Authentication Security (SEC)

**Requirement:** Only authenticated users can access protected routes and Firestore data.

**Risk Score:** 6 (Probability: 2 - Possible, Impact: 3 - Critical)

**Rationale:**
- Medium probability: Firebase Auth misconfiguration possible
- High impact: Unauthorized access to user data is critical security issue

**Testability Approach:**
- E2E tests: Unauthenticated access attempts, RBAC validation
- Integration tests: Firestore security rules validation (via Firebase Emulator)
- Security tests: OWASP Top 10 validation (XSS, injection)

**Mitigation:**
- Firestore security rules: `allow read, write: if request.auth.uid == userId`
- Route protection: React Router guards for protected routes
- Input sanitization: Validate all user inputs

---

### ASR-3: Data Integrity in Firestore (DATA)

**Requirement:** User profile data (XP, level, rank, stats) must remain consistent after match completion.

**Risk Score:** 4 (Probability: 2 - Possible, Impact: 2 - Degraded)

**Rationale:**
- Medium probability: Race conditions possible during Firestore writes
- Medium impact: Data corruption affects user progression

**Testability Approach:**
- Integration tests: Firestore write operations, transaction validation
- E2E tests: Match completion → profile update validation
- Unit tests: XP calculation, level/rank mapping logic

**Mitigation:**
- Use Firestore transactions for atomic updates
- Validate data before write (XP ≥ 0, level ≥ 1, rank valid)
- Add retry logic for transient Firestore failures

---

### ASR-4: Session State Isolation (TECH)

**Requirement:** Session state (score, board state, abilities) must not persist across matches or users.

**Risk Score:** 3 (Probability: 1 - Unlikely, Impact: 3 - Critical)

**Rationale:**
- Low probability: Zustand stores are properly scoped
- High impact: State leakage causes incorrect scoring/progression

**Testability Approach:**
- Unit tests: Store reset logic, state isolation
- E2E tests: Multiple matches, verify state resets
- Integration tests: Store initialization, cleanup

**Mitigation:**
- Explicit store reset on match end
- No global state outside Zustand stores
- Clear session boundaries (match start → match end)

---

## Test Levels Strategy

### Recommended Split: 50% Unit / 20% Integration / 30% E2E

**Rationale:**

- **Unit (50%):** High coverage for business logic (score calculation, XP conversion, level/rank mapping, ability costs). Fast feedback, high maintainability.
- **Integration (20%):** Firebase Auth/Firestore operations, Stockfish worker integration. Validates external service contracts.
- **E2E (30%):** Critical user journeys (registration → login → gameplay → progression). Validates end-to-end workflows.

**Technology Mapping:**

- **Unit Tests:** Vitest (Vite's test runner) for pure functions and business logic
- **Component Tests:** Playwright Component Testing for UI components (Button, Card, ChessBoard)
- **Integration Tests:** Playwright API tests + Firebase Emulator Suite for Firestore operations
- **E2E Tests:** Playwright for full user journeys

**Test Environment Needs:**

- **Local Development:** Vite dev server, Firebase Emulator Suite
- **CI/CD:** Same setup, parallel test execution
- **Staging (Optional):** Firebase test project for E2E validation

---

## NFR Testing Approach

### Security: PASS (with implementation required)

**Approach:**

- **Playwright E2E Tests:**
  - Unauthenticated access to protected routes (should redirect to login)
  - RBAC validation (users can only read/write their own Firestore documents)
  - Input sanitization (XSS attempts in user inputs)
  - Firebase Auth token expiry validation

- **Firebase Emulator Tests:**
  - Firestore security rules validation
  - Authentication provider configuration

**Tools:**
- Playwright for E2E security tests
- Firebase Emulator Suite for security rules testing
- npm audit for dependency vulnerabilities

**Criteria:**
- ✅ PASS: All security tests green, no critical vulnerabilities
- ⚠️ CONCERNS: Minor gaps with mitigation plans
- ❌ FAIL: Critical security exposure (unauthorized access, data leak)

---

### Performance: CONCERNS (client-side limitations)

**Approach:**

- **Client-Side Performance:**
  - Stockfish worker move computation time (per difficulty level)
  - React rendering performance (board updates, score updates)
  - Firestore read/write latency (profile updates)

- **Load Testing:**
  - Not applicable for client-side chess engine (no server load)
  - Firebase Firestore quotas apply (read/write limits per user)

**Tools:**
- Playwright performance tests (measure move computation time)
- Lighthouse (Core Web Vitals) for page load performance
- Firebase Performance Monitoring (optional, for production)

**Criteria:**
- ✅ PASS: Move computation <10s for advanced, <5s for intermediate, <2s for beginner
- ⚠️ CONCERNS: Performance trending toward limits
- ❌ FAIL: Move computation >10s consistently

**Note:** k6 load testing not applicable (client-side app, no API endpoints to load test)

---

### Reliability: PASS (with test coverage required)

**Approach:**

- **Playwright E2E Tests:**
  - Error handling: Firestore connection failures → graceful degradation
  - Offline mode: App works offline (Firestore offline persistence)
  - Stockfish worker failures: Timeout handling, fallback moves
  - Retry logic: Firestore write retries on transient failures

- **Integration Tests:**
  - Health checks: Firebase services availability
  - Circuit breaker: Stop retries after failure threshold

**Tools:**
- Playwright for E2E error handling tests
- Firebase Emulator Suite for connection failure simulation

**Criteria:**
- ✅ PASS: Error handling graceful, retries implemented, offline mode works
- ⚠️ CONCERNS: Partial coverage or missing telemetry
- ❌ FAIL: No recovery path (500 error crashes app)

---

### Maintainability: CONCERNS (requires CI setup)

**Approach:**

- **CI Tools (GitHub Actions):**
  - Test coverage: ≥80% target (Vitest coverage reports)
  - Code duplication: <5% (jscpd)
  - Vulnerability scanning: npm audit (no critical/high vulnerabilities)

- **Playwright E2E Tests:**
  - Observability validation: Error tracking (if Sentry integrated)
  - Structured logging: Console log validation (if logging framework added)

**Tools:**
- Vitest for coverage reports
- jscpd for duplication detection
- npm audit for vulnerabilities

**Criteria:**
- ✅ PASS: Coverage ≥80%, duplication <5%, no critical vulnerabilities
- ⚠️ CONCERNS: Coverage 60-79%, duplication 5-10%
- ❌ FAIL: Coverage <60%, duplication >10%, critical vulnerabilities

**Note:** Maintainability tests require CI pipeline setup (not yet implemented)

---

## Test Environment Requirements

### Local Development

- **Vite Dev Server:** `npm run dev` for local development
- **Firebase Emulator Suite:** 
  - Authentication Emulator
  - Firestore Emulator
- **Test Runner:** Vitest for unit tests, Playwright for E2E tests

### CI/CD Pipeline

- **GitHub Actions (or similar):**
  - Install dependencies: `npm ci`
  - Run unit tests: `npm run test:unit`
  - Run E2E tests: `npm run test:e2e` (with Firebase Emulator)
  - Coverage report: `npm run test:coverage`
  - Duplication check: `npx jscpd src/ --threshold 5`

### Staging (Optional)

- **Firebase Test Project:** Separate Firebase project for E2E validation
- **Deployment:** Firebase Hosting preview for manual testing

---

## Testability Concerns

### ⚠️ CONCERNS (Non-Blockers)

1. **Limited Observability Infrastructure**
   - **Issue:** No structured logging, error tracking, or performance monitoring mentioned in architecture
   - **Impact:** Cannot validate NFR observability requirements in tests
   - **Mitigation:** Add Sentry (error tracking) and Firebase Performance Monitoring (optional)
   - **Owner:** Dev team
   - **Timeline:** Before production launch

2. **Firebase Emulator Setup Complexity**
   - **Issue:** Integration tests require Firebase Emulator Suite setup
   - **Impact:** Adds setup complexity for CI/CD pipeline
   - **Mitigation:** Document emulator setup, add CI scripts for emulator startup
   - **Owner:** Dev team
   - **Timeline:** During Epic 1 (Foundation setup)

3. **Stockfish Worker Testing Complexity**
   - **Issue:** Web Worker testing requires special handling
   - **Impact:** E2E tests may be slower or more complex
   - **Mitigation:** Mock Stockfish worker for deterministic E2E tests, test worker separately
   - **Owner:** Dev team
   - **Timeline:** During Epic 3 (Classic Mode)

4. **Maintainability CI Setup Not Yet Implemented**
   - **Issue:** Coverage, duplication, and vulnerability scanning require CI pipeline
   - **Impact:** Cannot validate maintainability NFR until CI is set up
   - **Mitigation:** Set up CI pipeline in Epic 1 (Foundation), add coverage/duplication checks
   - **Owner:** Dev team
   - **Timeline:** Epic 1 (Foundation setup)

### ✅ PASS (No Blockers)

- **Controllability:** Architecture supports good test control (Zustand stores, mockable dependencies)
- **Reliability:** Client-side architecture supports isolated, parallel-safe tests
- **Security:** Firebase Auth/Firestore security rules can be validated via Emulator
- **Performance:** Client-side performance can be measured via Playwright (move computation time)

---

## Recommendations for Sprint 0

### 1. Test Framework Setup (`*framework` workflow)

**Actions:**
- Initialize Playwright test framework
- Set up Vitest for unit tests
- Configure Firebase Emulator Suite for integration tests
- Create test directory structure: `/tests/unit`, `/tests/integration`, `/tests/e2e`

**Deliverables:**
- `playwright.config.ts` with Firebase Emulator setup
- `vitest.config.ts` for unit tests
- Test utilities: factories, fixtures, helpers

---

### 2. CI/CD Pipeline Setup (`*ci` workflow)

**Actions:**
- Set up GitHub Actions (or similar CI platform)
- Configure test execution stages (unit → integration → E2E)
- Add coverage reporting (Vitest coverage)
- Add duplication checking (jscpd)
- Add vulnerability scanning (npm audit)

**Deliverables:**
- `.github/workflows/test.yml` (or equivalent)
- Coverage thresholds: ≥80%
- Duplication threshold: <5%

---

### 3. Test Data Factories

**Actions:**
- Create user factory (Firebase Auth test users)
- Create profile factory (Firestore user documents)
- Create game state factory (Zustand store state)
- Create chess position factory (FEN strings)

**Deliverables:**
- `/tests/factories/userFactory.ts`
- `/tests/factories/profileFactory.ts`
- `/tests/factories/gameStateFactory.ts`
- `/tests/factories/chessPositionFactory.ts`

---

### 4. Observability Infrastructure (Optional, Recommended)

**Actions:**
- Integrate Sentry for error tracking
- Add Firebase Performance Monitoring (optional)
- Add structured logging (console.log with levels)

**Deliverables:**
- Sentry integration in app
- Error tracking validation in E2E tests

---

## Quality Gate Criteria

### Testability Gate (Before Implementation Phase)

**PASS Criteria:**
- ✅ Controllability: PASS (Zustand stores, mockable dependencies)
- ✅ Observability: CONCERNS acceptable (logging can be added later)
- ✅ Reliability: PASS (isolated, parallel-safe)
- ✅ No critical testability blockers

**CONCERNS Criteria:**
- ⚠️ Observability gaps with mitigation plans (Sentry integration planned)
- ⚠️ Firebase Emulator setup complexity documented

**FAIL Criteria:**
- ❌ Architecture makes testing impossible (not applicable)
- ❌ Critical security risks unmitigated (not applicable)

**Gate Decision:** ✅ **PASS** (with CONCERNS for observability)

**Rationale:** Architecture supports testability. Minor concerns (observability, emulator setup) are non-blockers with documented mitigation plans.

---

## Next Steps

1. **Review testability assessment** with team
2. **Set up test framework** (`*framework` workflow)
3. **Set up CI/CD pipeline** (`*ci` workflow)
4. **Create test data factories** (user, profile, game state)
5. **Proceed to Epic-Level test design** (Phase 4) for detailed test scenarios

---

## Appendix

### Knowledge Base References

- `nfr-criteria.md` - NFR validation approach
- `test-levels-framework.md` - Test level selection guidance
- `risk-governance.md` - Risk classification framework
- `test-quality.md` - Quality standards and Definition of Done

### Related Documents

- PRD: `docs/prd.md`
- Architecture: `docs/architecture.md`
- Epics: `docs/epics.md`

---

**Generated by:** BMad TEA Agent - Test Architect Module
**Workflow:** `.bmad/bmm/testarch/test-design`
**Version:** 4.0 (BMad v6)

