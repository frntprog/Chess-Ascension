import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Landing } from "./pages/Landing"
import { CreateProfile } from "./pages/CreateProfile"
import { Profile } from "./pages/Profile"
import { Play } from "./pages/Play"
import { ModeSelection } from "./pages/ModeSelection"
import { DifficultySelection } from "./pages/DifficultySelection"
import { Navbar } from "./components/Navbar"
import { loadProfile, profileExists, saveProfile } from "./services/profileStorage"
import { useProfileStore } from "./stores/profileStore"
import { useToast } from "./components/UI/toast"
import { getSkinsUnlockedAtLevel } from "./utils/skinUnlocks"
import { getAbilitiesUnlockedAtLevel } from "./utils/abilityUnlocks"
import { calculateLevel } from "./utils/calculateLevel"
import { getRankFromLevel } from "./utils/rankMapping"

function App() {
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const { showToast, ToastContainer } = useToast()

  // Load profile on app initialization (AC1, AC2, AC5)
  useEffect(() => {
    // Prevent duplicate profile loads - check if store already has profile data
    const currentProfile = useProfileStore.getState()
    if (currentProfile.nickname) {
      // Profile already loaded, skip
      return
    }

    try {
      // Check if profile exists before attempting load (AC7)
      if (profileExists()) {
        // Load profile from localStorage (AC2)
        const profile = loadProfile()
        
        if (profile) {
          // Recalculate level and rank from XP (handles formula changes)
          const recalculatedLevel = calculateLevel(profile.xp);
          const recalculatedRank = getRankFromLevel(recalculatedLevel);
          
          // Recalculate unlocked skins and abilities based on new level
          const unlockedSkins = getSkinsUnlockedAtLevel(recalculatedLevel);
          const unlockedAbilities = getAbilitiesUnlockedAtLevel(recalculatedLevel);
          
          // Sync profile data to Zustand store (AC3)
          // Map Profile interface to ProfileState interface
          updateProfile({
            nickname: profile.nickname,
            xp: profile.xp,
            level: recalculatedLevel,
            rank: recalculatedRank,
            unlockedSkins: unlockedSkins,
            selectedSkin: profile.selectedSkin || 'Classic',
            unlockedAbilities: unlockedAbilities,
            bestScore: profile.bestScore,
            stats: {
              gamesPlayed: profile.gamesPlayed,
              wins: profile.wins,
              losses: profile.losses,
            },
          })
          
          // Save recalculated profile back to localStorage
          try {
            saveProfile({
              nickname: profile.nickname,
              xp: profile.xp,
              level: recalculatedLevel,
              rank: recalculatedRank,
              unlockedSkins: unlockedSkins,
              selectedSkin: profile.selectedSkin || 'Classic',
              unlockedAbilities: unlockedAbilities,
              gamesPlayed: profile.gamesPlayed,
              bestScore: profile.bestScore,
              wins: profile.wins,
              losses: profile.losses,
            });
          } catch (error) {
            console.warn('Failed to save recalculated profile:', error);
          }
        } else {
          // Profile exists check returned true but loadProfile returned null
          // This indicates corrupted data - handled gracefully by loadProfile
          // Show user-facing error message (AC6)
          showToast({
            message: 'Profile data appears to be corrupted. Please create a new profile.',
            variant: 'error',
            duration: 5000,
          })
          console.warn('Profile exists check passed but loadProfile returned null. Profile may be corrupted.')
        }
      }
      // If profile doesn't exist, no action needed (AC4)
      // User can create profile via CreateProfile page
    } catch (error) {
      // Error handling for profile load failures (AC6)
      console.error('Failed to load profile on app initialization:', error)
      // Don't crash app - gracefully handle error
      // User can still use app and create new profile if needed
    }
  }, [updateProfile])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/play" element={<Play />} />
        <Route path="/mode-selection" element={<ModeSelection />} />
        <Route path="/difficulty-selection" element={<DifficultySelection />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding" element={<CreateProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

