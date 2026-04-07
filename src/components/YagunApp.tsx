'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getOrCreateNick } from '@/lib/nick'
import { Message } from '@/types'

// ── 레트로 캐릭터 ────────────────────────────────────────
function RetroWorker({ isTyping }: { isTyping: boolean }) {
  return (
    <svg
      viewBox="0 0 14 18"
      width={56}
      height={72}
      style={{ imageRendering: 'pixelated' }}
      className="retro-char"
    >
      {/* hair */}
      <rect x="3" y="0" width="8" height="2" fill="#3d2b1f"/>
      <rect x="2" y="1" width="10" height="2" fill="#3d2b1f"/>
      {/* face */}
      <rect x="3" y="2" width="8" height="5" fill="#f5c89a"/>
      {/* eyes */}
      <rect x="4" y="4" width="2" height="1" fill="#1a1a2e"/>
      <rect x="8" y="4" width="2" height="1" fill="#1a1a2e"/>
      {/* mouth */}
      {isTyping ? (
        <rect x="5" y="6" width="4" height="1" fill="#c0392b"/>
      ) : (
        <rect x="5" y="6" width="4" height="1" fill="#7f5c4a"/>
      )}
      {/* shirt */}
      <rect x="2" y="7" width="10" height="6" fill="#4fc3f7"/>
      {/* tie */}
      <rect x="6" y="7" width="2" height="5" fill="#e74c3c"/>
      {/* arms */}
      <rect x="0" y="7" width="2" height="5" fill="#f5c89a"/>
      <rect x="12" y="7" width="2" height="5" fill="#f5c89a"/>
      {/* hands */}
      <rect x="0" y="12" width="2" height="2" fill="#f5c89a"/>
      <rect x="12" y="12" width="2" height="2" fill="#f5c89a"/>
      {/* pants */}
      <rect x="2" y="13" width="10" height="4" fill="#2c3e50"/>
      {/* legs */}
      <rect x="2" y="16" width="4" height="2" fill="#1a252f"/>
      <rect x="8" y="16" width="4" height="2" fill="#1a252f"/>
    </svg>
  )
}

// ── 스네이크 게임 ────────────────────────────────────────
const GRID = 16
type Pos = { x: number; y: number }

function SnakeGame() {
  const [snake, setSnake] = useState<Pos[]>([{ x: 8, y: 8 }])
  const [food, setFood] = useState<Pos>({ x: 4, y: 4 })
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 })
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [dead, setDead] = useState(false)
  const dirRef = useRef(dir)
  const snakeRef = useRef(snake)

  dirRef.current = dir
  snakeRef.current = snake

  const randomFood = useCallback((s: Pos[]): Pos => {
    let f: Pos
    do {
      f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    } while (s.some(p => p.x === f.x && p.y === f.y))
    return f
  }, [])

  const reset = () => {
    const init = [{ x: 8, y: 8 }]
    setSnake(init)
    setFood(randomFood(init))
    setDir({ x: 1, y: 0 })
    setScore(0)
    setDead(false)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const d = dirRef.current
      const s = snakeRef.current
      const head = { x: (s[0].x + d.x + GRID) % GRID, y: (s[0].y + d.y + GRID) % GRID }
      if (s.some(p => p.x === head.x && p.y === head.y)) {
        setRunning(false); setDead(true); return
      }
      setFood(prev => {
        const ate = head.x === prev.x && head.y === prev.y
        if (ate) {
          setScore(sc => sc + 1)
          const ns = [head, ...s]
          setSnake(ns)
          return randomFood(ns)
        } else {
          setSnake([head, ...s.slice(0, -1)])
          return prev
        }
      })
    }, 150)
    return () => clearInterval(id)
  }, [running, randomFood])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!running) return
      const map: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (!nd) return
      const cd = dirRef.current
      if (nd.x === -cd.x && nd.y === -cd.y) return
      e.preventDefault()
      setDir(nd)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [running])

  const cells = Array.from({ length: GRID * GRID }, (_, i) => ({
    x: i % GRID, y: Math.floor(i / GRID)
  }))

  const dpad = (d: Pos) => {
    if (!running) return
    const cd = dirRef.current
    if (d.x === -cd.x && d.y === -cd.y) return
    setDir(d)
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center gap-4 mb-1">
        <span style={{ color: 'var(--accent)', fontFamily: 'Share Tech Mono, monospace', fontSize: 13 }}>
          SCORE: {score}
        </span>
        {dead && <span style={{ color: 'var(--red)', fontSize: 12 }}>GAME OVER</span>}
      </div>

      {/* 게임 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          width: 256, height: 256,
          background: 'var(--surface2)',
          border: '2px solid var(--border)',
          borderRadius: 4,
        }}
      >
        {cells.map((c, i) => {
          const isHead = snake[0]?.x === c.x && snake[0]?.y === c.y
          const isBody = !isHead && snake.some(p => p.x === c.x && p.y === c.y)
          const isFood = food.x === c.x && food.y === c.y
          return (
            <div
              key={i}
              style={{
                background: isHead ? '#4fc3f7' : isBody ? '#1e88e5' : isFood ? '#ffd54f' : 'transparent',
                borderRadius: isFood ? '50%' : 0,
              }}
            />
          )
        })}
      </div>

      {/* D-패드 (모바일) */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        <div />
        <button
          onClick={() => dpad({ x: 0, y: -1 })}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text)', cursor: 'pointer' }}
        >▲</button>
        <div />
        <button
          onClick={() => dpad({ x: -1, y: 0 })}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text)', cursor: 'pointer' }}
        >◀</button>
        <button
          onClick={reset}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 4px', color: 'var(--accent)', fontSize: 10, cursor: 'pointer' }}
        >{dead ? 'RETRY' : running ? 'STOP' : 'START'}</button>
        <button
          onClick={() => dpad({ x: 1, y: 0 })}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text)', cursor: 'pointer' }}
        >▶</button>
        <div />
        <button
          onClick={() => dpad({ x: 0, y: 1 })}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text)', cursor: 'pointer' }}
        >▼</button>
        <div />
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>WASD / 방향키로 조작</p>
    </div>
  )
}

// ── 메인 앱 ───────────────────────────────────────────────
export default function YagunApp() {
  const [nick] = useState(() => (typeof window !== 'undefined' ? getOrCreateNick() : 'anon'))
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [overtimeStart, setOvertimeStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState('00:00:00')
  const [visitorCount, setVisitorCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'chat' | 'game'>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 방문자 카운트 & 타이머 자동 시작
  useEffect(() => {
    // 방문자 추적
    const visited = typeof window !== 'undefined' && sessionStorage.getItem('yagun_visited')
    if (!visited) {
      fetch('/api/visits', { method: 'POST' })
        .then(r => r.json())
        .then(d => setVisitorCount(d.count || 0))
        .catch(() => {})
      if (typeof window !== 'undefined') sessionStorage.setItem('yagun_visited', '1')
    } else {
      fetch('/api/visits')
        .then(r => r.json())
        .then(d => setVisitorCount(d.count || 0))
        .catch(() => {})
    }

    // 타이머 자동 시작
    setOvertimeStart(Date.now())
  }, [])

  // 타이머 틱
  useEffect(() => {
    if (!overtimeStart) return
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - overtimeStart) / 1000)
      const h = String(Math.floor(s / 3600)).padStart(2, '0')
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
      const sec = String(s % 60).padStart(2, '0')
      setElapsed(`${h}:${m}:${sec}`)
    }, 1000)
    return () => clearInterval(id)
  }, [overtimeStart])

  // 현재 시각
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // 메시지 로드
  useEffect(() => {
    fetch('/api/messages?room=office')
      .then(r => r.json())
      .then(d => setMessages(d.messages || []))
      .catch(() => {})
  }, [])

  // Realtime 구독
  useEffect(() => {
    const ch = supabase
      .channel('messages:office')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'room=eq.office',
      }, payload => {
        const msg = payload.new as Message
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, { ...msg, isMe: msg.nick === nick }]
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [nick])

  // 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 전송
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setIsTyping(false)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: 'office', nick, text }),
    })
  }, [input, nick])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* 헤더 */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="animate-flicker" style={{ fontFamily: 'DotGothic16, monospace', fontSize: 20, color: 'var(--accent)', letterSpacing: 2 }}>
            💼 온라인 야근
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
            {time}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--green)' }}>
            <span className="animate-pulse-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginRight: 6, verticalAlign: 'middle' }}/>
            {visitorCount.toLocaleString()}명 야근 중
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--accent2)' }}>
            ⏱ {elapsed}
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 왼쪽: 캐릭터 패널 */}
        <aside style={{
          width: 120,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          flexShrink: 0,
        }}>
          <RetroWorker isTyping={isTyping} />
          <div style={{ fontFamily: 'DotGothic16, monospace', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            {nick}<br/>
            <span style={{ color: 'var(--accent)', fontSize: 10 }}>야근 중</span>
          </div>
          {/* 커피 스팀 */}
          <div style={{ fontSize: 24, position: 'relative' }}>
            ☕
            <div style={{ position: 'absolute', top: -8, left: 6, display: 'flex', gap: 2 }}>
              <div className="steam-line" style={{ width: 2, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }}/>
              <div className="steam-line" style={{ width: 2, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }}/>
              <div className="steam-line" style={{ width: 2, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }}/>
            </div>
          </div>
        </aside>

        {/* 오른쪽: 탭 패널 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 탭 헤더 */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
            {[{ id: 'chat', label: '🏢 사무실' }, { id: 'game', label: '🎮 미니게임' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'chat' | 'game')}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Noto Sans KR, sans-serif',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'chat' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* 메시지 목록 */}
              <div className="custom-scroll crt-lines" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 12, marginTop: 40, fontFamily: 'Share Tech Mono, monospace' }}>
                    아직 메시지가 없습니다. 야근 중인 동료에게 인사해보세요!
                  </div>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="animate-msg-in"
                    style={{
                      display: 'flex',
                      flexDirection: msg.isMe ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 8,
                    }}
                  >
                    {!msg.isMe && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                        👤
                      </div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      {!msg.isMe && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, paddingLeft: 4 }}>{msg.nick}</div>
                      )}
                      <div style={{
                        background: msg.isMe ? 'var(--accent)' : 'var(--surface2)',
                        color: msg.isMe ? '#0a0a0f' : 'var(--text)',
                        borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: '8px 14px',
                        fontSize: 13,
                        lineHeight: 1.5,
                        border: msg.isMe ? 'none' : '1px solid var(--border)',
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 3, textAlign: msg.isMe ? 'right' : 'left', paddingInline: 4 }}>
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* 입력창 */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 8, flexShrink: 0 }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value)
                    setIsTyping(e.target.value.length > 0)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
                  }}
                  placeholder="야근 중... 말 걸어보기"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: 'var(--accent)',
                    color: '#0a0a0f',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  전송
                </button>
              </div>
            </div>
          ) : (
            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              <SnakeGame />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
