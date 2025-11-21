/**
 * Score Display Component
 * 
 * Displays current session score and XP preview.
 * Updates in real-time when score changes in session store.
 * 
 * Architecture: UI Layer (Architecture section 3)
 * Location: /src/components/Board/ScoreDisplay.tsx (Architecture section 8)
 * 
 * Features:
 * - Current score prominently displayed
 * - XP preview: "XP: {floor(score / 10)}"
 * - Visual feedback when score updates (animation/highlight)
 * - Uses shadcn/ui Card and Badge components
 * - Classic Chess theme colors (primary, accent)
 */

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { Card, CardContent } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { cn } from '@/utils';

/**
 * ScoreDisplay Component
 * 
 * Displays session score and XP preview with visual feedback on updates.
 */
export function ScoreDisplay() {
  const sessionScore = useSessionStore((state) => state.sessionScore);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousScore, setPreviousScore] = useState(sessionScore);

  // Calculate XP preview: floor(score / 10)
  const xpValue = Math.floor(sessionScore / 10);

  // Detect score changes and trigger animation
  useEffect(() => {
    if (sessionScore !== previousScore && sessionScore > previousScore) {
      // Score increased - trigger animation
      setIsUpdating(true);
      
      // Reset animation state after animation completes
      const timeout = setTimeout(() => {
        setIsUpdating(false);
      }, 600); // Animation duration

      setPreviousScore(sessionScore);
      
      return () => clearTimeout(timeout);
    } else if (sessionScore !== previousScore) {
      // Score changed but didn't increase (e.g., reset)
      setPreviousScore(sessionScore);
    }
  }, [sessionScore, previousScore]);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-3">
          {/* Score Label */}
          <div className="text-sm font-medium text-muted-foreground">
            Score
          </div>
          
          {/* Score Number - Prominently displayed with animation */}
          <div
            className={cn(
              "text-5xl font-bold transition-all duration-300",
              "text-primary", // Primary color for score
              isUpdating && "scale-110 text-accent" // Scale up and highlight on update
            )}
            style={{
              transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
            }}
          >
            {sessionScore.toLocaleString()}
          </div>
          
          {/* XP Preview Badge */}
          <Badge variant="secondary" className="text-base px-4 py-1.5">
            XP: {xpValue}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

