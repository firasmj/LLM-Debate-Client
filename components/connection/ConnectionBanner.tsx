'use client'

export function ConnectionBanner({ connected, requestId }: { connected: boolean, requestId?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/50">
      <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-400' : 'bg-slate-500'}`} />
      <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
      {requestId && <span className="text-xs text-slate-400">#{requestId}</span>}
    </div>
  )
}
