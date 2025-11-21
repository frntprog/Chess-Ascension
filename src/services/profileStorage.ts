/**
 * Profile Storage Utility
 * 
 * Provides localStorage abstraction for profile persistence.
 * Storage key: `chessAscensionProfile` (per PRD section 8)
 * 
 * Architecture: Service layer pattern enables clean separation of concerns
 * and future Firebase integration without refactoring.
 */

/**
 * Profile interface matching PRD section 8 (localStorage data model)
 */
export interface Profile {
  nickname: string;
  xp: number;
  level: number;
  rank: string;
  unlockedSkins: string[];
  selectedSkin: string;
  unlockedAbilities: string[];
  gamesPlayed: number;
  bestScore: number;
  wins: number;
  losses: number;
}

/**
 * Storage key constant: `chessAscensionProfile`
 * Per PRD section 8 and story acceptance criteria AC2
 */
const CHESS_ASCENSION_PROFILE_KEY = 'chessAscensionProfile';

/**
 * Save profile to localStorage
 * 
 * Serializes profile object to JSON string and saves to localStorage.
 * 
 * @param profile - Profile object to save
 * @throws Error if localStorage is unavailable or quota exceeded
 * 
 * @example
 * ```typescript
 * saveProfile({
 *   nickname: "Player",
 *   xp: 0,
 *   level: 1,
 *   rank: "Pawn",
 *   unlockedSkins: ["Classic"],
 *   selectedSkin: "Classic",
 *   unlockedAbilities: [],
 *   gamesPlayed: 0,
 *   bestScore: 0,
 *   wins: 0,
 *   losses: 0
 * });
 * ```
 */
export function saveProfile(profile: Profile): void {
  try {
    const jsonString = JSON.stringify(profile);
    localStorage.setItem(CHESS_ASCENSION_PROFILE_KEY, jsonString);
  } catch (error) {
    // Handle localStorage quota exceeded or unavailable
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('localStorage quota exceeded. Please free up some space and try again.');
      }
      if (error.name === 'SecurityError' || error.name === 'ReferenceError') {
        throw new Error('localStorage is unavailable in this context.');
      }
    }
    // Re-throw unknown errors
    throw error;
  }
}

/**
 * Load profile from localStorage
 * 
 * Retrieves JSON string from localStorage and parses it to Profile object.
 * Returns null if profile not found or corrupted.
 * 
 * @returns Profile object if exists and valid, null if not found or corrupted
 * 
 * @example
 * ```typescript
 * const profile = loadProfile();
 * if (profile) {
 *   console.log(`Loaded profile: ${profile.nickname}`);
 * } else {
 *   console.log('No profile found');
 * }
 * ```
 */
export function loadProfile(): Profile | null {
  try {
    const jsonString = localStorage.getItem(CHESS_ASCENSION_PROFILE_KEY);
    
    if (jsonString === null) {
      return null;
    }
    
    // Parse JSON string with try-catch for graceful error handling
    try {
      const profile = JSON.parse(jsonString) as Profile;
      return profile;
    } catch (parseError) {
      // JSON parse error - corrupted data
      // Return null gracefully, don't throw
      console.warn('Failed to parse profile data from localStorage. Data may be corrupted.');
      return null;
    }
  } catch (error) {
    // localStorage unavailable (rare in modern browsers)
    console.error('localStorage is unavailable:', error);
    return null;
  }
}

/**
 * Clear profile from localStorage
 * 
 * Removes profile data from localStorage using the storage key.
 * 
 * @example
 * ```typescript
 * clearProfile();
 * // Profile data has been removed from localStorage
 * ```
 */
export function clearProfile(): void {
  try {
    localStorage.removeItem(CHESS_ASCENSION_PROFILE_KEY);
  } catch (error) {
    // localStorage unavailable (rare in modern browsers)
    console.error('Failed to clear profile from localStorage:', error);
    // Don't throw - clearing is best-effort operation
  }
}

/**
 * Check if profile exists in localStorage
 * 
 * Verifies if localStorage key exists and contains valid JSON.
 * Returns false if key doesn't exist or data is corrupted.
 * 
 * @returns true if valid profile exists, false otherwise
 * 
 * @example
 * ```typescript
 * if (profileExists()) {
 *   const profile = loadProfile();
 *   // Use profile...
 * } else {
 *   // Create new profile...
 * }
 * ```
 */
export function profileExists(): boolean {
  try {
    const jsonString = localStorage.getItem(CHESS_ASCENSION_PROFILE_KEY);
    
    if (jsonString === null) {
      return false;
    }
    
    // Verify JSON is valid by attempting to parse
    try {
      JSON.parse(jsonString);
      return true;
    } catch (parseError) {
      // Corrupted data - return false gracefully
      return false;
    }
  } catch (error) {
    // localStorage unavailable - return false
    return false;
  }
}

