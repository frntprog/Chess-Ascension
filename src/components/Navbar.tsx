/**
 * Navigation Bar Component
 * 
 * Implements Story 2.4: Navigation Bar with Auth State
 * Displays navigation links and profile state (with/without profile).
 */

import { useState, useRef, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/UI/button"
import { useProfileStore } from "@/stores/profileStore"
import { clearProfile } from "@/services/profileStorage"
import { useToast } from "@/components/UI/toast"

export function Navbar() {
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  
  // Profile store data
  const nickname = useProfileStore((state) => state.nickname)
  const resetProfile = useProfileStore((state) => state.resetProfile)
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Check if profile exists (has nickname)
  const hasProfile = !!nickname
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])
  
  // Handle clear profile
  const handleClearProfile = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to clear your profile? This action cannot be undone."
    )
    
    if (confirmed) {
      try {
        // Clear localStorage
        clearProfile()
        
        // Reset Zustand store
        resetProfile()
        
        // Show success toast
        showToast({
          message: "Profile cleared successfully",
          variant: "success",
          duration: 3000,
        })
        
        // Navigate to home or create profile page
        navigate("/create-profile")
        
        // Close dropdown
        setIsDropdownOpen(false)
      } catch (error) {
        console.error("Failed to clear profile:", error)
        showToast({
          message: "Failed to clear profile. Please try again.",
          variant: "error",
          duration: 5000,
        })
      }
    }
  }
  
  // Active link class function
  const getActiveLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-[#1e293b] font-semibold border-b-2 border-[#1e293b]"
      : "text-[#64748b] hover:text-[#1e293b] transition-colors"
  }
  
  return (
    <>
      <nav className="w-full bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-[#1e293b]">
                  Chess Ascension
                </span>
              </Link>
            </div>
            
            {/* Center: Navigation Links */}
            <div className="hidden xl:flex items-center space-x-8">
              <NavLink to="/" className={getActiveLinkClass}>
                Home
              </NavLink>
              <NavLink to="/play" className={getActiveLinkClass}>
                Play
              </NavLink>
              {hasProfile && (
                <NavLink to="/profile" className={getActiveLinkClass}>
                  Profile
                </NavLink>
              )}
            </div>
            
            {/* Right side: Profile State Display */}
            <div className="flex items-center">
              {hasProfile ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Nickname Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md text-[#1e293b] hover:bg-[#f8fafc] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="font-medium">{nickname}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#e2e8f0] z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-[#1e293b] hover:bg-[#f8fafc] transition-colors"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleClearProfile}
                          className="block w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
                        >
                          Clear Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/create-profile">
                  <Button variant="default">Create Profile</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </>
  )
}

