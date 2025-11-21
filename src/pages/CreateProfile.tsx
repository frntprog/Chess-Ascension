/**
 * Create Profile Page Component
 * 
 * Implements Story 2.1: Create Local Profile Flow
 * Allows users to create a local profile with a nickname.
 */

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/UI/button"
import { Input } from "@/components/UI/input"
import { Label } from "@/components/UI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { saveProfile, profileExists, type Profile } from "@/services/profileStorage"
import { useProfileStore } from "@/stores/profileStore"
import { useToast } from "@/components/UI/toast"

/**
 * Validation patterns
 */
const NICKNAME_PATTERN = /^[a-zA-Z0-9 ]+$/
const MIN_LENGTH = 3
const MAX_LENGTH = 20

/**
 * Validation error types
 */
type ValidationError = "too-short" | "too-long" | "invalid-chars" | null

export function CreateProfile() {
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState<ValidationError>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  
  // Get profile store update function
  const updateProfile = useProfileStore((state) => state.updateProfile)

  // Check for existing profile on mount
  useEffect(() => {
    const exists = profileExists()
    setHasExistingProfile(exists)
  }, [])

  /**
   * Validate nickname input
   */
  const validateNickname = (value: string): ValidationError => {
    const trimmed = value.trim()
    
    if (trimmed.length < MIN_LENGTH) {
      setErrorMessage("Nickname must be at least 3 characters")
      return "too-short"
    }
    
    if (trimmed.length > MAX_LENGTH) {
      setErrorMessage("Nickname must be 20 characters or less")
      return "too-long"
    }
    
    if (!NICKNAME_PATTERN.test(trimmed)) {
      setErrorMessage("Nickname can only contain letters, numbers, and spaces")
      return "invalid-chars"
    }
    
    setErrorMessage("")
    return null
  }

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNickname(value)
    
    // Clear error when user starts typing
    if (error) {
      const validationError = validateNickname(value)
      setError(validationError)
    }
  }

  /**
   * Handle input blur - validate on blur
   */
  const handleInputBlur = () => {
    if (nickname.trim()) {
      const validationError = validateNickname(nickname)
      setError(validationError)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate before submission
    const validationError = validateNickname(nickname)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setIsLoading(true)
    
    try {
      const trimmedNickname = nickname.trim()
      
      // Create initial profile data structure
      const profile: Profile = {
        nickname: trimmedNickname,
        xp: 0,
        level: 1,
        rank: "Pawn",
        gamesPlayed: 0,
        bestScore: 0,
        wins: 0,
        losses: 0,
        unlockedSkins: ["Classic"],
        selectedSkin: "Classic",
        unlockedAbilities: [],
      }
      
      // Save to localStorage
      saveProfile(profile)
      
      // Update Zustand profile store
      updateProfile({
        nickname: profile.nickname,
        xp: profile.xp,
        level: profile.level,
        rank: profile.rank,
        unlockedSkins: profile.unlockedSkins,
        selectedSkin: profile.selectedSkin,
        unlockedAbilities: profile.unlockedAbilities,
        bestScore: profile.bestScore,
        stats: {
          gamesPlayed: profile.gamesPlayed,
          wins: profile.wins,
          losses: profile.losses,
        },
      })
      
      // Show success toast
      showToast({
        message: "Profile created successfully!",
        variant: "success",
        duration: 3000,
      })
      
      // Wait a moment for toast to be visible, then redirect
      setTimeout(() => {
        // Navigate to mode selection or profile page
        // For now, redirect to home (mode selection will be implemented in Epic 3)
        navigate("/")
      }, 1500)
    } catch (error) {
      setIsLoading(false)
      console.error("Failed to create profile:", error)
      
      // Show error toast
      showToast({
        message: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "error",
        duration: 5000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ToastContainer />
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Profile</CardTitle>
          <CardDescription className="text-slate-600">
            Enter a nickname to create your profile and start playing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing Profile Warning */}
            {hasExistingProfile && (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm">
                <p className="font-medium text-amber-900">Warning: Profile Already Exists</p>
                <p className="mt-1 text-slate-700">
                  Creating a new profile will replace your existing profile.
                </p>
                {/* TODO: Add link to load profile (Story 2.2) */}
              </div>
            )}
            
            {/* Nickname Input */}
            <div className="space-y-2">
              <Label htmlFor="nickname">
                Nickname <span className="text-muted-foreground">*</span>
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter nickname (3-20 characters)"
                value={nickname}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                maxLength={MAX_LENGTH}
                disabled={isLoading}
                className={error ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "nickname-error" : undefined}
              />
              
              {/* Character Count */}
              <p className="text-sm text-slate-600">
                {nickname.length}/{MAX_LENGTH} characters
              </p>
              
              {/* Error Message */}
              {error && errorMessage && (
                <p
                  id="nickname-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !!error || !nickname.trim()}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
            
            {/* Load Profile Link */}
            {hasExistingProfile && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-primary hover:underline"
                >
                  Already have a profile? Load Profile
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

