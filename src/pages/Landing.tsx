/**
 * Landing Page Component
 * 
 * Implements Story 3.1: Landing Page with Mode Selection
 * Displays hero section, feature cards, and Start Playing button with navigation logic.
 */

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { useProfileStore } from "@/stores/profileStore"

export function Landing() {
  const navigate = useNavigate()
  const nickname = useProfileStore((state) => state.nickname)
  
  // Check if profile exists (nickname check)
  const hasProfile = !!nickname
  
  // Handle Start Playing button click
  const handleStartPlaying = () => {
    if (hasProfile) {
      // Navigate to mode selection page
      navigate("/mode-selection")
    } else {
      // Navigate to create profile page
      navigate("/create-profile")
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container - Centered with max-width 1200px */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-[2rem] font-bold text-[#1e293b] mb-4 leading-[1.2]">
            Chess Ascension
          </h1>
          <p className="text-[1rem] text-[#64748b] mb-8 leading-[1.6] max-w-2xl mx-auto">
            Experience chess like never before. Combine classic gameplay with RPG elements 
            in fast-paced matches where every move matters.
          </p>
          <Button
            onClick={handleStartPlaying}
            className="bg-[#f59e0b] text-white hover:bg-[#d97706] border-none px-8 py-2 h-auto text-base font-medium"
          >
            Start Playing
          </Button>
        </section>
        
        {/* Feature Cards Section - 3-column grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Classic Mode Card */}
          <Card className="bg-white border-[#e2e8f0]">
            <CardHeader>
              <CardTitle className="text-[1.125rem] font-semibold text-[#1e293b]">
                Classic Mode
              </CardTitle>
              <CardDescription className="text-[0.875rem] text-[#64748b]">
                Traditional chess gameplay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                Play classic chess against AI opponents of varying difficulty. 
                Focus on strategy, tactics, and improving your game.
              </p>
            </CardContent>
          </Card>
          
          {/* RPG Elements Card */}
          <Card className="bg-white border-[#e2e8f0]">
            <CardHeader>
              <CardTitle className="text-[1.125rem] font-semibold text-[#1e293b]">
                RPG Elements
              </CardTitle>
              <CardDescription className="text-[0.875rem] text-[#64748b]">
                Level up and unlock abilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                Earn XP, level up, and unlock new abilities and skins. 
                Progress through ranks from Pawn to Grandmaster.
              </p>
            </CardContent>
          </Card>
          
          {/* Quick Sessions Card */}
          <Card className="bg-white border-[#e2e8f0]">
            <CardHeader>
              <CardTitle className="text-[1.125rem] font-semibold text-[#1e293b]">
                Quick Sessions
              </CardTitle>
              <CardDescription className="text-[0.875rem] text-[#64748b]">
                Fast-paced matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[1rem] text-[#1e293b] leading-[1.6]">
                Jump into quick matches anytime. No lengthy setup required. 
                Get from landing page to game board in seconds.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

