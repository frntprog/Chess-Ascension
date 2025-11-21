/**
 * Stockfish Worker Module
 * 
 * Provides functions to interact with Stockfish Web Worker for AI move calculation.
 * 
 * Architecture: Game Engine Layer (Architecture section 3)
 * Location: /src/core/chess/stockfishWorker.ts (Architecture section 8)
 */

/**
 * Difficulty to depth mapping
 * - Beginner: depth 5 (faster, weaker moves)
 * - Intermediate: depth 10 (balanced)
 * - Advanced: depth 15 (slower, stronger moves)
 */
export const DIFFICULTY_DEPTH_MAP: Record<'beginner' | 'intermediate' | 'advanced', number> = {
  beginner: 5,
  intermediate: 10,
  advanced: 15,
};

/**
 * Get Stockfish depth for a given difficulty level
 * @param difficulty Difficulty level
 * @returns Stockfish depth (defaults to 10 if difficulty is null)
 */
export function getDepthForDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
): number {
  if (!difficulty) {
    return 10; // Default to intermediate
  }
  return DIFFICULTY_DEPTH_MAP[difficulty];
}

/**
 * Create and initialize a Stockfish worker
 * @returns Worker instance
 */
export function createStockfishWorker(): Worker {
  // Check if WebAssembly is supported
  const wasmSupported = typeof WebAssembly === 'object' && 
    WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

  // Use local files from public/worker directory (as per Architecture section 8)
  // Files are copied from node_modules/stockfish.js during setup
  const workerUrl = wasmSupported
    ? '/worker/stockfish.wasm.js'
    : '/worker/stockfish.js';

  const worker = new Worker(workerUrl, { type: 'module' });

  // Initialize Stockfish with UCI protocol
  worker.postMessage('uci');

  return worker;
}

/**
 * Get best move from Stockfish worker
 * @param worker Stockfish worker instance
 * @param fen Current board position in FEN format
 * @param depth Search depth (higher = stronger but slower)
 * @returns Promise that resolves to best move in UCI format (e.g., "e2e4")
 */
export function getBestMove(worker: Worker, fen: string, depth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let bestMove: string | null = null;
    let isResolved = false;

    // Set up message handler
    const messageHandler = (e: MessageEvent) => {
      const message = e.data;

      // Handle UCI responses
      if (typeof message === 'string') {
        // Best move found: "bestmove e2e4"
        if (message.startsWith('bestmove')) {
          const parts = message.split(' ');
          if (parts.length >= 2 && parts[1] !== 'none') {
            bestMove = parts[1];
            if (!isResolved) {
              isResolved = true;
              worker.removeEventListener('message', messageHandler);
              resolve(bestMove);
            }
          } else {
            // No legal moves (checkmate/stalemate)
            if (!isResolved) {
              isResolved = true;
              worker.removeEventListener('message', messageHandler);
              reject(new Error('No legal moves available'));
            }
          }
        }
      }
    };

    // Set up error handler
    const errorHandler = (error: ErrorEvent) => {
      if (!isResolved) {
        isResolved = true;
        worker.removeEventListener('message', messageHandler);
        worker.removeEventListener('error', errorHandler);
        reject(new Error(`Stockfish worker error: ${error.message}`));
      }
    };

    worker.addEventListener('message', messageHandler);
    worker.addEventListener('error', errorHandler);

    // Set position and start search
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);

    // Timeout after 30 seconds (safety measure)
    setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        worker.removeEventListener('message', messageHandler);
        worker.removeEventListener('error', errorHandler);
        reject(new Error('Stockfish move calculation timeout'));
      }
    }, 30000);
  });
}

/**
 * Terminate Stockfish worker
 * @param worker Worker instance to terminate
 */
export function terminateWorker(worker: Worker): void {
  worker.terminate();
}

