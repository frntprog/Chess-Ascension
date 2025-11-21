/**
 * Level-Up Modal Component
 * 
 * Displays level-up notification with unlocks (skins, abilities, rank change).
 * Uses shadcn/ui Dialog component per Story 4.0 AC5.
 * 
 * Features:
 * - Level-up message: "Level Up! You're now Level {level}!"
 * - Rank change display (if applicable)
 * - Lists unlocked skins
 * - Lists unlocked abilities
 * - "Continue" button to dismiss
 * - Centered, max-width 600px (UX Design Specification section 7.3)
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';

export interface LevelUpData {
  level: number;
  rank: string;
  unlockedSkins: string[];
  unlockedAbilities: string[];
  previousRank?: string;
}

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  level: number;
  rank: string;
  unlockedSkins: string[];
  unlockedAbilities: string[];
  previousRank?: string;
}

export function LevelUpModal({
  open,
  onClose,
  level,
  rank,
  unlockedSkins,
  unlockedAbilities,
  previousRank,
}: LevelUpModalProps) {
  const hasRankChange = previousRank && previousRank !== rank;
  const hasUnlocks = unlockedSkins.length > 0 || unlockedAbilities.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-[#78350f]">
            Level Up!
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            <div className="space-y-4">
              <div className="text-lg font-semibold text-slate-700">
                You're now Level <span className="text-[#78350f]">{level}</span>!
              </div>
              
              {hasRankChange && (
                <div className="text-base text-slate-600">
                  Rank: <span className="font-semibold text-[#78350f]">{previousRank}</span> →{' '}
                  <span className="font-semibold text-[#78350f]">{rank}</span>
                </div>
              )}
              
              {hasUnlocks && (
                <div className="space-y-2 pt-2">
                  {unlockedSkins.length > 0 && (
                    <div className="text-base text-slate-600">
                      <span className="font-semibold">New skins unlocked:</span>{' '}
                      <span className="text-[#78350f]">
                        {unlockedSkins.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {unlockedAbilities.length > 0 && (
                    <div className="text-base text-slate-600">
                      <span className="font-semibold">New abilities unlocked:</span>{' '}
                      <span className="text-[#78350f]">
                        {unlockedAbilities.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

