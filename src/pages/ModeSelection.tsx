/**
 * Mode Selection Page Component
 * 
 * Implements Story 3.2: Mode Selection Page
 * Displays two mode options (Classic Mode, RPG Mode) with navigation logic.
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Gamepad2 } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { useSessionStore } from "@/stores/sessionStore"

export function ModeSelection() {
  const navigate = useNavigate()
  const setMode = useSessionStore((state) => state.setMode)
  const [selectedMode, setSelectedMode] = useState<'classic' | 'rpg' | null>(null)
  
  // Handle Classic Mode selection
  const handleClassicMode = () => {
    // Store mode in session store (AC2 requirement)
    setMode('classic')
    setSelectedMode('classic')
    // Navigate to difficulty selection with mode query parameter
    navigate("/difficulty-selection?mode=classic")
  }
  
  // Handle RPG Mode selection
  const handleRPGMode = () => {
    // Store mode in session store (AC3 requirement)
    setMode('rpg')
    setSelectedMode('rpg')
    // Navigate to difficulty selection with mode query parameter
    navigate("/difficulty-selection?mode=rpg")
  }
  
  // Handle Back button click
  const handleBack = () => {
    navigate("/")
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container - Centered with max-width 1200px */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button - Positioned top-left */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="bg-[#475569] text-white hover:bg-[#64748b] border-none"
          >
            Back
          </Button>
        </div>
        
        {/* Centered Mode Selection Cards */}
        <section className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Page Title */}
          <h1 className="text-[2rem] font-bold text-[#1e293b] mb-12 text-center leading-[1.2]">
            Select Game Mode
          </h1>
          
          {/* Mode Cards Container - Side-by-side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            {/* Classic Mode Card */}
            <Card 
              className={`bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:shadow-md ${
                selectedMode === 'classic'
                  ? 'border-2 border-[#f59e0b] bg-[#fffbeb] shadow-md'
                  : 'border border-[#e2e8f0]'
              }`}
              onClick={handleClassicMode}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="h-6 w-6 text-[#1e293b]" />
                  <CardTitle className="text-[1.25rem] font-semibold text-[#1e293b]">
                    Classic Mode
                  </CardTitle>
                </div>
                <CardDescription className="text-[0.875rem] text-[#64748b]">
                  Traditional chess vs AI opponent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                  Play classic chess against AI opponents of varying difficulty. 
                  Focus on strategy and improving your game.
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClassicMode()
                  }}
                  className="w-full bg-[#1e293b] text-white hover:bg-[#334155] border-none"
                >
                  Play
                </Button>
              </CardContent>
            </Card>
            
            {/* RPG Mode Card */}
            <Card 
              className={`bg-white cursor-pointer transition-all hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:shadow-md ${
                selectedMode === 'rpg'
                  ? 'border-2 border-[#f59e0b] bg-[#fffbeb] shadow-md'
                  : 'border border-[#e2e8f0]'
              }`}
              onClick={handleRPGMode}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-[#1e293b]" />
                  <CardTitle className="text-[1.25rem] font-semibold text-[#1e293b]">
                    RPG Mode
                  </CardTitle>
                </div>
                <CardDescription className="text-[0.875rem] text-[#64748b]">
                  Chess with abilities, scores, and progression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                  Play chess with RPG elements. Earn XP, unlock abilities, 
                  and progress through ranks.
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRPGMode()
                  }}
                  className="w-full bg-[#1e293b] text-white hover:bg-[#334155] border-none"
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

