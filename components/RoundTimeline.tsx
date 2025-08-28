'use client'

export function RoundTimeline({ activeLabel, done }: { activeLabel?: string, done?: boolean }) {
  const steps = ['Queued', 'Starting', 'Generating (GPT)', 'Generating (Gemini)', 'Judging', 'Finalizing']
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <h3 className="font-medium">Rounds</h3>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2 text-xs">
        {steps.map((s, i) => {
          const active = activeLabel?.toLowerCase().includes(s.split(' ')[0].toLowerCase())
          return (
            <div key={i} className={`px-2 py-2 rounded-lg text-center border ${active ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/40'}`}>
              {s}
            </div>
          )
        })}
      </div>
      {done && <div className="text-green-300 text-xs mt-3">All rounds complete.</div>}
    </div>
  )
}
