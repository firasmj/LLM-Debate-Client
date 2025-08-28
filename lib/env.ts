export function getEnv() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'
  const wsBase = process.env.NEXT_PUBLIC_WS_BASE || apiBase
  return { apiBase, wsBase }
}
