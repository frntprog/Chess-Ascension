/**
 * Play Page Component
 * 
 * Game board page displaying the chess board and score display.
 * Implements centered layout per UX Design Specification section 4.1.
 */

import { ChessBoard } from "@/components/Board/ChessBoard"
import { ScoreDisplay } from "@/components/Board/ScoreDisplay"

export function Play() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-8 py-8">
          {/* Chess Board */}
          <div className="flex justify-center">
            <ChessBoard />
          </div>
          
          {/* Score Display - Positioned to the side on large screens, below on small screens */}
          <div className="flex justify-center lg:justify-start">
            <ScoreDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}

