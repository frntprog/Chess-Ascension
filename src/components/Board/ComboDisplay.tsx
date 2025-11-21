/**
 * Combo Display Component
 * 
 * Displays combo streak and bonus when combo triggers.
 * Shows visual feedback (badge animation) when combo activates.
 * 
 * Architecture: UI Layer (Architecture section 3)
 * Location: /src/components/Board/ComboDisplay.tsx (Architecture section 8)
 * 
 * Features:
 * - Displays combo streak: "2x Combo" or "3x Combo"
 * - Displays combo bonus: "+10" or "+20"
 * - Visual feedback: Animate combo badge when combo triggers (scale up, fade in)
 * - Hides when no active combo
 * - Uses shadcn/ui Badge component for styling
 * - Styled with accent color (#f59e0b) for combo badges
 */

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { Badge } from '@/components/UI/badge';
import { cn } from '@/utils';

/**
 * ComboDisplay Component
 * 
 * Displays combo streak and bonus with visual feedback animation.
 */
export function ComboDisplay() {
  const currentCombo = useSessionStore((state) => state.currentCombo);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCombo, setPreviousCombo] = useState<{ streak: number; bonus: number } | null>(null);

  // Detect combo trigger and trigger animation
  useEffect(() => {
    if (currentCombo && currentCombo !== previousCombo) {
      // Combo triggered - animate
      setIsAnimating(true);
      
      // Reset animation state after animation completes
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 600); // Animation duration
      
      setPreviousCombo(currentCombo);
      
      return () => clearTimeout(timeout);
    } else if (!currentCombo && previousCombo) {
      // Combo cleared
      setPreviousCombo(null);
      setIsAnimating(false);
    }
  }, [currentCombo, previousCombo]);

  // Hide component when no active combo
  if (!currentCombo) {
    return null;
  }

  const { streak, bonus } = currentCombo;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Combo Streak Badge */}
      <Badge
        variant="default"
        className={cn(
          "text-base px-4 py-2 font-bold",
          "bg-accent text-accent-foreground",
          "transition-all duration-300",
          isAnimating && "scale-110 animate-pulse"
        )}
        style={{
          backgroundColor: '#f59e0b', // Accent color
          color: '#ffffff',
        }}
      >
        {streak}x Combo
      </Badge>
      
      {/* Combo Bonus Badge */}
      <Badge
        variant="default"
        className={cn(
          "text-lg px-4 py-2 font-bold",
          "bg-accent text-accent-foreground",
          "transition-all duration-300",
          isAnimating && "scale-110"
        )}
        style={{
          backgroundColor: '#f59e0b', // Accent color
          color: '#ffffff',
        }}
      >
        +{bonus}
      </Badge>
    </div>
  );
}

