/**
 * Play Page Component
 * 
 * Game board page displaying the chess board.
 * Implements centered layout per UX Design Specification section 4.1.
 */

import { ChessBoard } from "@/components/Board/ChessBoard"

export function Play() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-center items-center py-8">
          <ChessBoard />
        </div>
      </div>
    </div>
  )
}

