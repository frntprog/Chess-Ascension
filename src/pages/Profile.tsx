/**
 * Profile Page Component
 * 
 * Implements Story 2.3: User Profile Page - Display Profile Information
 * Displays user profile information from Zustand profile store.
 */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { Badge } from "@/components/UI/badge"
import { Separator } from "@/components/UI/separator"
import { Button } from "@/components/UI/button"
import { useProfileStore } from "@/stores/profileStore"
import { loadProfile, profileExists, saveProfile } from "@/services/profileStorage"
import { useToast } from "@/components/UI/toast"
import { calculateLevel } from "@/utils/calculateLevel"
import { getRankFromLevel } from "@/utils/rankMapping"
import { getSkinsUnlockedAtLevel } from "@/utils/skinUnlocks"
import { getAbilitiesUnlockedAtLevel } from "@/utils/abilityUnlocks"

/**
 * Calculate win rate percentage
 * @param wins - Number of wins
 * @param losses - Number of losses
 * @param gamesPlayed - Total games played
 * @returns Win rate as percentage, or null if calculation not applicable
 */
function calculateWinRate(wins: number, losses: number, gamesPlayed: number): number | null {
  if (gamesPlayed > 0 && (wins + losses) > 0) {
    return Math.round((wins / (wins + losses)) * 100)
  }
  return null
}

export function Profile() {
  const navigate = useNavigate()
  const { ToastContainer } = useToast()
  
  // Profile store data
  const nickname = useProfileStore((state) => state.nickname)
  const xp = useProfileStore((state) => state.xp)
  const level = useProfileStore((state) => state.level)
  const rank = useProfileStore((state) => state.rank)
  const unlockedSkins = useProfileStore((state) => state.unlockedSkins)
  const selectedSkin = useProfileStore((state) => state.selectedSkin)
  const unlockedAbilities = useProfileStore((state) => state.unlockedAbilities)
  const bestScore = useProfileStore((state) => state.bestScore)
  const gamesPlayed = useProfileStore((state) => state.stats.gamesPlayed)
  const wins = useProfileStore((state) => state.stats.wins)
  const losses = useProfileStore((state) => state.stats.losses)
  
  const updateProfile = useProfileStore((state) => state.updateProfile)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if profile exists and load data
  useEffect(() => {
    // Profile should already be loaded from App.tsx (Story 2.2)
    // But check store state to determine loading/error state
    const currentProfile = useProfileStore.getState()
    
    if (!currentProfile.nickname) {
      // Profile not in store - check if exists in localStorage
      if (!profileExists()) {
        // No profile exists - show error and redirect option
        setError("No profile found. Please create a profile to continue.")
        setIsLoading(false)
        return
      }
      
      // Profile exists in localStorage but not in store - try loading
      try {
        const profile = loadProfile()
        if (profile) {
          // Recalculate level and rank from XP (handles formula changes)
          const recalculatedLevel = calculateLevel(profile.xp);
          const recalculatedRank = getRankFromLevel(recalculatedLevel);
          
          // Recalculate unlocked skins and abilities based on new level
          const unlockedSkins = getSkinsUnlockedAtLevel(recalculatedLevel);
          const unlockedAbilities = getAbilitiesUnlockedAtLevel(recalculatedLevel);
          
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
          
          setIsLoading(false)
        } else {
          setError("Failed to load profile data. Please try again.")
          setIsLoading(false)
        }
      } catch (err) {
        setError("An error occurred while loading profile data.")
        setIsLoading(false)
        console.error("Profile load error:", err)
      }
    } else {
      // Profile already in store
      setIsLoading(false)
    }
  }, [updateProfile])
  
  // Retry loading profile
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (profileExists()) {
        const profile = loadProfile()
        if (profile) {
          // Recalculate level and rank from XP (handles formula changes)
          const recalculatedLevel = calculateLevel(profile.xp);
          const recalculatedRank = getRankFromLevel(recalculatedLevel);
          
          // Recalculate unlocked skins and abilities based on new level
          const unlockedSkins = getSkinsUnlockedAtLevel(recalculatedLevel);
          const unlockedAbilities = getAbilitiesUnlockedAtLevel(recalculatedLevel);
          
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
          
          setIsLoading(false)
        } else {
          setError("Failed to load profile data. Please try again.")
          setIsLoading(false)
        }
      } else {
        setError("No profile found. Please create a profile to continue.")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred while loading profile data.")
      setIsLoading(false)
      console.error("Profile load error:", err)
    }
  }
  
  // Calculate win rate
  const winRate = calculateWinRate(wins, losses, gamesPlayed)
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
            <CardDescription>Please wait while we load your profile data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Error state
  if (error || !nickname) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Profile Error</CardTitle>
            <CardDescription>{error || "Profile not found"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error || "Please create a profile to view your information."}
            </p>
            <div className="flex gap-4">
              <Button onClick={handleRetry}>Retry</Button>
              <Button variant="outline" onClick={() => navigate("/create-profile")}>
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      
      {/* Centered card layout - UX Design Specification section 4.1 - Spacious & Centered */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-[#1e293b]">{nickname}'s Profile</CardTitle>
            <CardDescription className="text-[#475569]">
              View your progression, stats, and unlocked content
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Level and Rank Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-[#cbd5e1] bg-[#fef3c7] text-[#78350f] px-6 py-3 text-lg font-semibold">
                Level {level}
              </div>
              <Badge variant="secondary" className="text-base px-3 py-1.5">
                {rank}
              </Badge>
            </div>
            
            <Separator />
            
            {/* XP Progress Display */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#1e293b]">Experience Points</span>
                <span className="text-sm text-[#475569]">{xp} XP</span>
              </div>
              <div className="w-full bg-[#e2e8f0] rounded-full h-3">
                <div 
                  className="bg-[#f59e0b] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((xp % 100) / 100 * 100, 100)}%` }}
                  title={`${xp} XP (XP thresholds for level progression will be implemented in Epic 4)`}
                />
              </div>
              <p className="text-xs text-[#64748b]">
                XP thresholds for level progression will be implemented in Epic 4
              </p>
            </div>
            
            <Separator />
            
            {/* Stats Grid */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-[#1e293b]">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-[#64748b]">Games Played</p>
                  <p className="text-2xl font-bold text-[#1e293b]">{gamesPlayed}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#64748b]">Best Score</p>
                  <p className="text-2xl font-bold text-[#1e293b]">{bestScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#64748b]">Wins</p>
                  <p className="text-2xl font-bold text-[#10b981]">{wins}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#64748b]">Losses</p>
                  <p className="text-2xl font-bold text-[#ef4444]">{losses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#64748b]">Win Rate</p>
                  <p className="text-2xl font-bold text-[#1e293b]">
                    {winRate !== null ? `${winRate}%` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Unlocked Skins */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-[#1e293b]">Unlocked Skins</h3>
              {unlockedSkins.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {unlockedSkins.map((skin) => (
                    <Badge 
                      key={skin} 
                      variant={skin === selectedSkin ? "default" : "outline"}
                      className={skin === selectedSkin ? "ring-2 ring-[#f59e0b]" : ""}
                    >
                      {skin}
                      {skin === selectedSkin && (
                        <span className="ml-2 text-xs text-[#78350f]">✓</span>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748b]">No skins unlocked yet</p>
              )}
            </div>
            
            {selectedSkin && unlockedSkins.includes(selectedSkin) && (
              <div className="bg-[#fef3c7]/30 p-3 rounded-lg border border-[#cbd5e1]">
                <p className="text-sm font-medium text-[#1e293b]">
                  Selected Skin: <span className="text-[#f59e0b]">{selectedSkin}</span>
                </p>
              </div>
            )}
            
            <Separator />
            
            {/* Unlocked Abilities */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-[#1e293b]">Unlocked Abilities</h3>
              {unlockedAbilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {unlockedAbilities.map((ability) => (
                    <Badge key={ability} variant="secondary">
                      {ability}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748b]">No abilities unlocked yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

