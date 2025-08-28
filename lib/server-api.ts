import { getEnv } from './env'

export async function startDebate(input: { prompt: string; rounds?: number }) {
  const res = await fetch(`${getEnv().apiBase}/api/debate/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || 'Failed to start'}`)
  }
  return res.json() as Promise<{ ok: boolean; requestId: string }>
}
