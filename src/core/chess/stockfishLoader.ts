/**
 * Stockfish Loader Utility
 * 
 * Handles loading and initialization of Stockfish Web Worker.
 * 
 * Architecture: Game Engine Layer (Architecture section 3)
 * Location: /src/core/chess/stockfishLoader.ts (Architecture section 8)
 */

import { createStockfishWorker } from './stockfishWorker';

/**
 * Load and initialize Stockfish worker
 * @returns Promise that resolves to initialized Worker instance
 */
export async function loadStockfishWorker(): Promise<Worker> {
  try {
    const worker = createStockfishWorker();
    
    // Wait for worker to be ready (UCI initialization)
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Stockfish worker initialization timeout'));
      }, 5000);

      const messageHandler = (e: MessageEvent) => {
        const message = e.data;
        // UCI protocol sends "uciok" when ready
        if (typeof message === 'string' && message.includes('uciok')) {
          clearTimeout(timeout);
          worker.removeEventListener('message', messageHandler);
          resolve(worker);
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.addEventListener('error', (error) => {
        clearTimeout(timeout);
        worker.removeEventListener('message', messageHandler);
        reject(new Error(`Failed to load Stockfish worker: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Failed to create Stockfish worker: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

