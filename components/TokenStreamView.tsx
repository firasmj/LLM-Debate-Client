'use client'

export function TokenStreamView({ title, text, done }: { title: string, text: string, done?: boolean }) {
  return (
    <div className="card p-4 h-[420px] flex flex-col"
      style={{
        //hide scrollbar
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <h3 className="font-medium">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${done ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/10 text-blue-300'}`}>
          {done ? 'Done' : 'Streaming'}
        </span>
      </div>
      <pre className="mono mt-3 text-sm whitespace-pre-wrap scrollable overflow-scroll flex-1">{text || '—'}</pre>
    </div>
  )
}
