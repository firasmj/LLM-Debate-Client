# Next.js LLM Debate Console

> ⚡ This is the frontend for the [LLM Debate Spring Boot Backend (DuetLLM)](https://github.com/firasmj/DuetLLM).

A professional, real-time split-screen viewer for a two-LLM debate (GPT vs Gemini) with a judge synthesis panel. Connects to a Spring Boot backend that exposes:

- `POST /api/debate/stream` → `{ ok, requestId }`
- STOMP over SockJS at `/ws`
- Topic subscription: `/topic/stream/{requestId}`

## Related Repositories

- [LLM Debate Spring Boot Backend (DuetLLM)](https://github.com/firasmj/DuetLLM)

## Quick start

```bash
cp .env.local.example .env.local
npm i
npm run dev
# http://localhost:3000
```

## Configuration

- `NEXT_PUBLIC_API_BASE` – HTTP origin of your Spring server (e.g., `http://localhost:8080`).
- `NEXT_PUBLIC_WS_BASE` – WebSocket/STOMP origin if different. Defaults to `NEXT_PUBLIC_API_BASE`.

## Production

```bash
npm run build
npm start
```

## Notes

- The UI is resilient to slightly different event shapes (it tries common fields in the `final` payload).
- History is cached in `localStorage` (the last 50 debates). Replace with your own backend to persist.
