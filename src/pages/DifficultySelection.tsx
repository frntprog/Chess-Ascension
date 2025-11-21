/**
 * Difficulty Selection Page Component
 * 
 * Implements Story 3.3: Difficulty Selection Component
 * Displays three difficulty options (Beginner, Intermediate, Advanced) with navigation logic.
 */

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { Badge } from "@/components/UI/badge"
import { useSessionStore } from "@/stores/sessionStore"

export function DifficultySelection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setDifficulty = useSessionStore((state) => state.setDifficulty)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null)
  const [mode, setMode] = useState<'classic' | 'rpg' | null>(null)
  
  // Extract mode from query string (AC2 requirement)
  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'classic' || modeParam === 'rpg') {
      setMode(modeParam)
    } else {
      // Mode missing - redirect to mode selection (AC3 requirement)
      navigate("/mode-selection")
    }
  }, [searchParams, navigate])
  
  // Handle Beginner difficulty selection
  const handleBeginner = () => {
    setSelectedDifficulty('beginner')
    setDifficulty('beginner')
    // Navigate to game board page with mode and difficulty query parameters (AC2 requirement)
    navigate(`/play?mode=${mode}&difficulty=beginner`)
  }
  
  // Handle Intermediate difficulty selection
  const handleIntermediate = () => {
    setSelectedDifficulty('intermediate')
    setDifficulty('intermediate')
    // Navigate to game board page with mode and difficulty query parameters (AC2 requirement)
    navigate(`/play?mode=${mode}&difficulty=intermediate`)
  }
  
  // Handle Advanced difficulty selection
  const handleAdvanced = () => {
    setSelectedDifficulty('advanced')
    setDifficulty('advanced')
    // Navigate to game board page with mode and difficulty query parameters (AC2 requirement)
    navigate(`/play?mode=${mode}&difficulty=advanced`)
  }
  
  // Handle Back button click (AC1 requirement)
  const handleBack = () => {
    navigate("/mode-selection")
  }
  
  // Don't render until mode is determined
  if (!mode) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container - Centered with max-width 1200px */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button - Positioned top-left (AC1 requirement) */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="bg-[#475569] text-white hover:bg-[#64748b] border-none"
          >
            Back
          </Button>
        </div>
        
        {/* Centered Difficulty Selection Cards */}
        <section className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Page Title */}
          <h1 className="text-[2rem] font-bold text-[#1e293b] mb-12 text-center leading-[1.2]">
            Select Difficulty Level
          </h1>
          
          {/* Difficulty Cards Container - Grid layout for three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            {/* Beginner Difficulty Card */}
            <Card 
              className={`bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:shadow-md ${
                selectedDifficulty === 'beginner'
                  ? 'border-2 border-[#f59e0b] bg-[#fffbeb] shadow-md'
                  : 'border border-[#e2e8f0]'
              }`}
              onClick={handleBeginner}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-[1.25rem] font-semibold text-[#1e293b]">
                    Beginner
                  </CardTitle>
                  <Badge variant="default" className="bg-[#fef3c7] text-[#78350f] border-[#cbd5e1]">
                    Level 1
                  </Badge>
                </div>
                <CardDescription className="text-[0.875rem] text-[#64748b]">
                  Beginner - Great for learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                  Perfect for new players learning the basics of chess. 
                  The AI will make simpler moves to help you practice.
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBeginner()
                  }}
                  className="w-full bg-[#1e293b] text-white hover:bg-[#334155] border-none"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
            
            {/* Intermediate Difficulty Card */}
            <Card 
              className={`bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:shadow-md ${
                selectedDifficulty === 'intermediate'
                  ? 'border-2 border-[#f59e0b] bg-[#fffbeb] shadow-md'
                  : 'border border-[#e2e8f0]'
              }`}
              onClick={handleIntermediate}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-[1.25rem] font-semibold text-[#1e293b]">
                    Intermediate
                  </CardTitle>
                  <Badge variant="default" className="bg-[#fef3c7] text-[#78350f] border-[#cbd5e1]">
                    Level 2
                  </Badge>
                </div>
                <CardDescription className="text-[0.875rem] text-[#64748b]">
                  Intermediate - Balanced challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                  A balanced challenge for players with some chess experience. 
                  The AI will provide a good match without being overwhelming.
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleIntermediate()
                  }}
                  className="w-full bg-[#1e293b] text-white hover:bg-[#334155] border-none"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
            
            {/* Advanced Difficulty Card */}
            <Card 
              className={`bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:shadow-md ${
                selectedDifficulty === 'advanced'
                  ? 'border-2 border-[#f59e0b] bg-[#fffbeb] shadow-md'
                  : 'border border-[#e2e8f0]'
              }`}
              onClick={handleAdvanced}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-[1.25rem] font-semibold text-[#1e293b]">
                    Advanced
                  </CardTitle>
                  <Badge variant="default" className="bg-[#fef3c7] text-[#78350f] border-[#cbd5e1]">
                    Level 3
                  </Badge>
                </div>
                <CardDescription className="text-[0.875rem] text-[#64748b]">
                  Advanced - Expert level challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                  For experienced players seeking a serious challenge. 
                  The AI will play at a high level and test your strategic skills.
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAdvanced()
                  }}
                  className="w-full bg-[#1e293b] text-white hover:bg-[#334155] border-none"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

