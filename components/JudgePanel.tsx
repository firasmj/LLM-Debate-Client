'use client'

export function JudgePanel({ text, loading }: { text: string, loading?: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <h3 className="font-medium">Judge</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${text ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-300'}`}>
          {text ? 'Ready' : (loading ? 'Waiting…' : '—')}
        </span>
      </div>
      <pre className="mono mt-3 text-sm whitespace-pre-wrap">{text || (loading ? 'The judge is thinking…' : '—')}</pre>
    </div>
  )
}
