'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { startDebate } from '@/lib/server-api'
import { getEnv } from '@/lib/env'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { ConnectionBanner } from '@/components/connection/ConnectionBanner'
import { SplitStream } from '@/components/SplitStream'
import { JudgePanel } from '@/components/JudgePanel'
import { RoundTimeline } from '@/components/RoundTimeline'
import type { StreamEvent } from '@/lib/types'
import Link from 'next/link'

type Side = 'gpt'|'gemini'

export default function DebatePage() {
  const [prompt, setPrompt] = useState('Explain quantum entanglement for high-schoolers.')
  const [rounds, setRounds] = useState(1)
  const [requestId, setRequestId] = useState<string | null>(null)

  const [gptText, setGptText] = useState('')
  const [geminiText, setGeminiText] = useState('')
  const [judgeText, setJudgeText] = useState<string>('')
  const [status, setStatus] = useState<string>('Idle')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const stompRef = useRef<Client | null>(null)
  const subRef = useRef<StompSubscription | null>(null)

  const wsBase = getEnv().wsBase
  const topic = useMemo(() => requestId ? `/topic/stream/${requestId}` : null, [requestId])

  const reset = useCallback(() => {
    setGptText('')
    setGeminiText('')
    setJudgeText('')
    setStatus('Preparing…')
    setDone(false)
    setError(null)
  }, [])

  const connectAndSubscribe = useCallback((reqId: string) => {
    // Clean old sub/client
    try { subRef.current?.unsubscribe() } catch {}
    try { stompRef.current?.deactivate() } catch {}
    const client = new Client({
      reconnectDelay: 2000,
      webSocketFactory: () => new SockJS(`${wsBase}/ws`),
      onConnect: () => {
        setStatus('Starting')
        setConnected(true)
        subRef.current = client.subscribe(`/topic/stream/${reqId}`, (msg: IMessage) => {
          try {
            const evt = JSON.parse(msg.body) as StreamEvent
            if (evt.type === 'token') {
              setStatus('Generating (GPT) Generating (Gemini)')
              if (evt.source === 'gpt') setGptText(prev => prev + (evt.token ?? ''))
              else if (evt.source === 'gemini') setGeminiText(prev => prev + (evt.token ?? ''))
            } else if (evt.type === 'status') {
              setStatus(evt.stage ? `${evt.stage}: ${evt.detail ?? ''}` : (evt.detail ?? ''))
            } else if (evt.type === 'final') {
              setStatus('Judging')
              // Attempt to read common fields; fallback to stringifying
              const finalAnswer = (evt.result && (evt.result.final_answer || evt.result.judge || evt.result.answer || evt.result.summary))
              setJudgeText(finalAnswer ? String(finalAnswer) : JSON.stringify(evt.result, null, 2))
            } else if (evt.type === 'error') {
              setError(evt.message || 'Unknown error from server')
            } else if (evt.type === 'done') {
              setStatus('Finalizing')
              setDone(true)
            }
          } catch (e) {
            console.error('Bad message', e, msg.body)
          }
        })
      },
      onStompError: (frame) => {
        console.error('Broker error', frame)
        setError(frame?.headers['message'] || 'Broker error')
      },
      onWebSocketError: (e) => {
        console.error('WS error', e)
        setError('WebSocket error')
      },
      onDisconnect: () => setConnected(false)
    })
    stompRef.current = client
    client.activate()
  }, [wsBase])

  useEffect(() => {
    return () => {
      try { subRef.current?.unsubscribe() } catch {}
      try { stompRef.current?.deactivate() } catch {}
    }
  }, [])

  const onStart = useCallback(async () => {
    reset()
    try {
      const res = await startDebate({ prompt, rounds })
      if (!res?.ok || !res?.requestId) throw new Error('Failed to start stream')
      setRequestId(res.requestId)
      connectAndSubscribe(res.requestId)
      setStatus('Connected. Streaming tokens…')
    } catch (e:any) {
      console.error(e)
      setError(e?.message ?? 'Failed to start')
    }
  }, [prompt, rounds, reset, connectAndSubscribe])

  // Save history when done
  useEffect(() => {
    if (!done || !requestId) return
    const item = {
      id: requestId,
      prompt,
      gptText, geminiText, judgeText,
      endedAt: new Date().toISOString()
    }
    try {
      const key = 'debate-history'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.unshift(item)
      localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)))
    } catch {}
  }, [done, requestId, prompt, gptText, geminiText, judgeText])

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* // add back button that navigates to root "/" */}
      <Link href="/" className="text-sm text-slate-400 hover:underline">
        &larr; Back to home
      </Link>
      <header className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-semibold">LLM Debate Console</h1>
        <ConnectionBanner connected={connected} requestId={requestId || undefined} />
      </header>

      <section className="mt-6 card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300">Rounds</label>
            <input type="number" min={1} max={5} value={rounds}
              onChange={e => setRounds(parseInt(e.target.value || '1', 10))}
              className="w-24 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700" />
          </div>
          <button onClick={onStart}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700"
            disabled={!prompt.trim()}>
            Start debate
          </button>
        </div>
        <div className="text-sm text-slate-400 mt-2">Status: {status}</div>
        {error && <div className="mt-2 text-sm text-red-400">Error: {error}</div>}
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SplitStream
          leftTitle="GPT"
          rightTitle="Gemini"
          leftText={gptText}
          rightText={geminiText}
          done={done}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4">
        <JudgePanel text={judgeText} loading={!judgeText && !error} />
        <RoundTimeline activeLabel={status} done={done} />
      </section>

      <footer className="mt-10 text-xs text-slate-500">
        Server: <code className="mono">{getEnv().apiBase}</code> · WS: <code className="mono">{wsBase}</code>
      </footer>
    </main>
  )
}
