import AI from '@/models/tictactoe/ai';
import type { WorkerPayload } from '@/types/models/tictactoe';

self.onmessage = (event: MessageEvent): void => {
  const data = JSON.parse(event.data) as WorkerPayload;
  const ai = new AI(data.board, data.player);
  const move = ai.makeMove(data.level);
  self.postMessage(move);
};
