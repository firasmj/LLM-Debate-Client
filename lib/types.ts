export type StreamEvent =
  | { type: 'token'; requestId: string; source: 'gpt'|'gemini'|'judge'; token: string; chunkIx?: number; round?: number }
  | { type: 'status'; requestId: string; stage?: string; detail?: string; round?: number }
  | { type: 'final'; requestId: string; result: any }
  | { type: 'done'; requestId: string }
  | { type: 'error'; requestId: string; message: string }
