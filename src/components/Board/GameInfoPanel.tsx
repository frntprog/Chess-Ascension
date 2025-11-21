/**
 * Game Info Panel Component
 * 
 * Displays turn indicator and game status information.
 * Updates in real-time when game state changes in session store.
 * 
 * Architecture: UI Layer (Architecture section 3)
 * Location: /src/components/Board/GameInfoPanel.tsx (Architecture section 8)
 * 
 * Features:
 * - Turn indicator (Your turn / AI thinking...)
 * - Game status (Normal / Check / Checkmate / Stalemate / Draw)
 * - Uses shadcn/ui Card components
 * - Classic Chess theme colors
 */

import { useSessionStore } from '@/stores/sessionStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';

/**
 * GameInfoPanel Component
 * 
 * Displays current turn and game status information.
 */
export function GameInfoPanel() {
  const currentTurn = useSessionStore((state) => state.currentTurn);
  const gameStatus = useSessionStore((state) => state.gameStatus);

  // Determine turn indicator text
  const turnText = currentTurn === 'white' ? 'Your turn' : 'AI thinking...';

  // Determine game status display
  const getStatusDisplay = () => {
    switch (gameStatus) {
      case 'normal':
        return { text: 'Normal', variant: 'secondary' as const };
      case 'check':
        return { text: 'Check', variant: 'default' as const }; // Warning color (default variant)
      case 'checkmate':
        return { text: 'Checkmate', variant: 'destructive' as const }; // Error color
      case 'stalemate':
        return { text: 'Stalemate', variant: 'outline' as const }; // Muted color
      case 'draw':
        return { text: 'Draw', variant: 'outline' as const }; // Muted color
      default:
        return { text: 'Normal', variant: 'secondary' as const };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Game Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Turn Indicator */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            Turn
          </div>
          <div className="text-base font-semibold text-primary">
            {turnText}
          </div>
        </div>

        {/* Game Status */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            Status
          </div>
          <Badge variant={statusDisplay.variant} className="w-fit">
            {statusDisplay.text}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

