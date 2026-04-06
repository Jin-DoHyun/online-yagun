'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getOrCreateNick } from '@/lib/nick'
import { ROOMS, Message, Room } from '@/types'

// ─── 서브 컴포넌트들 ───────────────────────────────────────

function Header({ onlineCount, myRoom }: { onlineCount: number; myRoom: Room }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="h-14 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="font-dot text-lg tracking-widest" style={{ color: 'var(--accent)', textShadow: '0 0 20px rgba(79,195,247,0.5)' }}>
        🖥️ 온라인<span style={{ color: 'var(--accent2)' }}>야근</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--green)', display: 'inline-block' }} />
          <span>{onlineCount.toLocaleString()}명 야근 중</span>
        </div>
        <div className="font-mono text-sm" style={{ color: 'var(--accent2)' }}>{time}</div>
      </div>
    </header>
  )
}

function Ticker() {
  return (
    <div style={{ background: '#0d0d1a', borderBottom: '1px solid var(--border)' }}
      className="py-2 px-6 flex items-center gap-3 overflow-hidden">
      <div className="shrink-0 font-mono text-xs px-2 py-0.5 rounded"
        style={{ background: 'rgba(255,82,82,0.15)', border: '1px solid rgba(255,82,82,0.3)', color: 'var(--red)' }}>
        ● LIVE
      </div>
      <div className="font-mono text-xs animate-scroll-ticker whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
        지금 2,847명이 함께 야근 중 &nbsp;&nbsp; │ &nbsp;&nbsp; "야근수당은 내 월급이 아닙니다" &nbsp;&nbsp; │ &nbsp;&nbsp;
        오늘 최다 야근: 새벽4시반에퇴근함 (22:30~04:30) &nbsp;&nbsp; │ &nbsp;&nbsp;
        이번 주 야근왕: 스타트업개발자_김모씨 &nbsp;&nbsp; │ &nbsp;&nbsp; 무한 야근 연대 💙 &nbsp;&nbsp; │ &nbsp;&nbsp;
        "퇴근이라는 단어가 낯설어졌다" &nbsp;&nbsp; │ &nbsp;&nbsp; 커피 4잔째인 분들 화이팅
      </div>
    </div>
  )
}

function Monitor({ coffeeCount, status, onClick }: { coffeeCount: number; status: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      {/* 모니터 */}
      <div className="relative" style={{
        width: 280, height: 190,
        background: 'var(--surface2)',
        border: '2px solid #333344',
        borderRadius: '8px 8px 0 0',
        padding: 12,
        boxShadow: '0 0 60px rgba(79,195,247,0.06)',
        transition: 'border-color 0.3s',
      }}>
        {/* 천장 형광등 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-flicker"
          style={{ width: 160, height: 4, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', filter: 'blur(1px)' }} />

        <div className="w-full h-full rounded crt-lines flex flex-col items-center justify-center gap-2 relative overflow-hidden"
          style={{ background: '#050510' }}>
          <div className="font-mono text-center leading-relaxed px-2" style={{ fontSize: 10, color: 'var(--accent)' }}>
            <div>&gt; 야근.exe 실행 중...</div>
            <div>&gt; 퇴근시간: <span style={{ color: 'var(--red)' }}>미정</span></div>
            <div>&gt; 커피잔: <span style={{ color: 'var(--accent2)' }}>{coffeeCount}잔째</span></div>
            <div>&gt; {status}<span className="inline-block w-1.5 h-3 ml-0.5 animate-blink" style={{ background: 'var(--accent)', verticalAlign: 'middle' }} /></div>
          </div>
        </div>
      </div>
      {/* 스탠드 */}
      <div style={{ width: 40, height: 18, background: '#1e1e2a', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
      <div style={{ width: 100, height: 8, background: '#1e1e2a', borderRadius: 4 }} />
    </div>
  )
}

function DeskItem({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer select-none"
      style={{ transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onClick={onClick}>
      <div style={{ fontSize: 28 }}>{emoji}</div>
      <div className="font-mono" style={{ fontSize: 9, color: 'var(--text-dim)' }}>{label}</div>
    </div>
  )
}

function CoffeeCup({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center cursor-pointer select-none"
      style={{ transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onClick={onClick}>
      <div className="relative">
        {/* 증기 */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          {[12, 8, 10].map((h, i) => (
            <div key={i} className="steam-line rounded-sm"
              style={{ width: 2, height: h, background: 'linear-gradient(to top, rgba(255,255,255,0.4), transparent)' }} />
          ))}
        </div>
        {/* 컵 */}
        <div className="relative flex items-center justify-center"
          style={{ width: 36, height: 42, background: 'linear-gradient(180deg,#2a2a3a,#1a1a28)', border: '1.5px solid #3a3a50', borderRadius: '3px 3px 6px 6px' }}>
          <span className="font-mono font-bold tracking-wider" style={{ fontSize: 8, color: 'var(--accent2)' }}>야근</span>
          <div className="absolute" style={{ right: -10, top: 8, width: 10, height: 18, border: '1.5px solid #3a3a50', borderLeft: 'none', borderRadius: '0 8px 8px 0' }} />
        </div>
      </div>
      <div className="font-mono mt-1" style={{ fontSize: 9, color: 'var(--text-dim)' }}>커피 마시기</div>
    </div>
  )
}

function ChatMessage({ msg, myNick }: { msg: Message; myNick: string }) {
  const isMe = msg.nick === myNick
  const isSystem = msg.isSystem

  const time = new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })

  if (isSystem) {
    return (
      <div className="animate-msg-in font-mono italic" style={{ fontSize: 11, color: 'var(--text-dim)', padding: '2px 4px' }}>
        {msg.text}
      </div>
    )
  }

  return (
    <div className="animate-msg-in flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="font-mono font-medium" style={{ fontSize: 11, color: isMe ? 'var(--accent2)' : 'var(--accent)' }}>
          {msg.nick}
        </span>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>{time}</span>
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text)',
        lineHeight: 1.6,
        padding: '8px 12px',
        background: isMe ? 'rgba(79,195,247,0.06)' : 'var(--surface2)',
        borderRadius: '4px 12px 12px 12px',
        borderLeft: `2px solid ${isMe ? 'var(--accent)' : 'var(--border)'}`,
        wordBreak: 'break-all',
      }}>
        {msg.text}
      </div>
    </div>
  )
}

// ─── 광고 컴포넌트 (AdSense 준비) ─────────────────────────

function AdBanner({ slot, style }: { slot: string; style?: React.CSSProperties }) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle) (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return (
      <div className="ad-container" style={{ height: 90, ...style }}>
        [광고 영역 — AdSense 승인 후 활성화]
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

// ─── 메인 앱 ──────────────────────────────────────────────

export default function YagunApp() {
  const [myNick, setMyNick] = useState('')
  const [currentRoom, setCurrentRoom] = useState<Room>(ROOMS[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [coffeeCount, setCoffeeCount] = useState(0)
  const [monitorStatus, setMonitorStatus] = useState('대기')
  const [overtimeStart, setOvertimeStart] = useState<number | null>(null)
  const [overtimeDisplay, setOvertimeDisplay] = useState('00:00:00')
  const [onlineCount, setOnlineCount] = useState(2847)
  const [isMobile, setIsMobile] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 닉네임 초기화
  useEffect(() => {
    setMyNick(getOrCreateNick())
    setIsMobile(window.innerWidth < 768)
  }, [])

  // 야근 타이머
  useEffect(() => {
    if (!overtimeStart) return
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - overtimeStart) / 1000)
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
      const s = String(elapsed % 60).padStart(2, '0')
      setOvertimeDisplay(`${h}:${m}:${s}`)
    }, 1000)
    return () => clearInterval(id)
  }, [overtimeStart])

  // 온라인 숫자 미세 변동
  useEffect(() => {
    const id = setInterval(() => {
      setOnlineCount(2847 + Math.floor(Math.random() * 60 - 30))
    }, 7000)
    return () => clearInterval(id)
  }, [])

  // Supabase: 초기 메시지 로드 + Realtime 구독
  useEffect(() => {
    if (!myNick) return

    // 최근 50개 로드
    supabase
      .from('messages')
      .select('*')
      .eq('room', currentRoom.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setMessages((data as Message[]).reverse())
      })

    // Realtime 구독
    const channel = supabase
      .channel(`room:${currentRoom.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room=eq.${currentRoom.id}` },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => [...prev.slice(-99), newMsg])
        }
      )
      .subscribe()

    // 입장 시스템 메시지
    addLocalSystemMsg(`[ ${currentRoom.emoji} ${currentRoom.label} 입장 ]`)

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom, myNick])

  // 채팅 자동 스크롤
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const addLocalSystemMsg = (text: string) => {
    const sysMsg: Message = {
      id: Date.now().toString(),
      room: currentRoom.id,
      nick: 'system',
      text,
      created_at: new Date().toISOString(),
      isSystem: true,
    }
    setMessages(prev => [...prev, sysMsg])
  }

  const startOvertime = useCallback(() => {
    if (!overtimeStart) {
      setOvertimeStart(Date.now())
      sendChatMessage('야근을 시작했습니다 🖥️')
    }
  }, [overtimeStart])

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || !myNick) return
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: currentRoom.id, nick: myNick, text }),
    })
  }

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text) return
    startOvertime()
    setInputText('')
    await sendChatMessage(text)
  }

  const handleCoffee = () => {
    startOvertime()
    const count = coffeeCount + 1
    setCoffeeCount(count)
    const msgs = ['커피 한 잔 마셨다. 버텨야지...', `오늘 ${count}잔째다. 손이 떨린다.`, '이 커피가 마지막이야. 진짜로.', '카페인 없이는 못 살아']
    setMonitorStatus(`커피 ${count}잔째 ☕`)
    sendChatMessage(msgs[Math.floor(Math.random() * msgs.length)])
    floatEmoji('☕')
  }

  const handleSnack = (emoji: string, msgs: string[]) => {
    startOvertime()
    sendChatMessage(msgs[Math.floor(Math.random() * msgs.length)])
    floatEmoji(emoji)
  }

  const handleMonitorClick = () => {
    startOvertime()
    const statuses = ['슬랙 알림 무시 중...', '버그 수정 중... 또 나왔다', '야근 중 (퇴근시간 미정)', '회의 자료 만드는 중']
    setMonitorStatus(statuses[Math.floor(Math.random() * statuses.length)])
  }

  const handleReaction = (text: string) => {
    startOvertime()
    sendChatMessage(text)
  }

  const floatEmoji = (emoji: string) => {
    const el = document.createElement('div')
    el.textContent = emoji
    el.style.cssText = `position:fixed;pointer-events:none;font-size:28px;z-index:9999;left:50%;top:40%;animation:float-up 1.5s ease-out forwards`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1500)
  }

  const roomBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    background: active ? 'rgba(79,195,247,0.08)' : 'transparent',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 20,
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'Noto Sans KR, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  })

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Ticker />
      <Header onlineCount={onlineCount} myRoom={currentRoom} />

      {/* 광고 상단 배너 (수평 배너) */}
      <div style={{ padding: '4px 16px', background: 'var(--surface)' }}>
        <AdBanner slot="1234567890" style={{ height: 60 }} />
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', overflow: 'hidden', minHeight: 0 }}>

        {/* ── 왼쪽 패널 ── */}
        <div style={{
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderRight: '1px solid var(--border)',
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* 야근 타이머 */}
          <div className="text-center">
            <div className="font-mono tracking-widest uppercase mb-2" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 3 }}>
              야근 시작한 지
            </div>
            <div className="font-dot" style={{ fontSize: 42, color: 'var(--accent2)', letterSpacing: 4, textShadow: '0 0 30px rgba(255,213,79,0.4)', lineHeight: 1 }}>
              {overtimeDisplay}
            </div>
            <div className="font-mono mt-2" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              {overtimeStart ? '야근 진행 중... 언제 끝나지 😢' : '모니터를 클릭하면 야근 시작!'}
            </div>
          </div>

          {/* 방 선택 */}
          <div className="flex flex-wrap gap-2 justify-center">
            {ROOMS.map(room => (
              <button
                key={room.id}
                style={roomBtnStyle(currentRoom.id === room.id)}
                onClick={() => setCurrentRoom(room)}
              >
                {room.emoji} {room.label}
              </button>
            ))}
          </div>

          {/* 모니터 */}
          <Monitor coffeeCount={coffeeCount} status={monitorStatus} onClick={handleMonitorClick} />

          {/* 책상 아이템 */}
          <div className="flex gap-5 items-end">
            <CoffeeCup onClick={handleCoffee} />
            <DeskItem emoji="🍜" label="컵라면" onClick={() => handleSnack('🍜', ['컵라면으로 저녁 해결... 슬프다', '라면 먹으면서도 일해야 해 ㅠ'])} />
            <DeskItem emoji="😤" label="한숨 쉬기" onClick={() => handleSnack('😤', ['하... 언제 끝나지', '한숨이 절로 나온다'])} />
            <DeskItem emoji="📱" label="카톡 확인" onClick={() => handleSnack('📱', ['카톡 확인했다가 더 우울해졌다', '가족들은 자고 있겠지 ㅠ'])} />
          </div>

          {/* 리액션 버튼 */}
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              ['야근 시작 🖥️', '야근 시작'],
              ['같이 힘냅시다 💪', '연대하기'],
              ['퇴근하고 싶다 😭', '퇴근 요청'],
            ].map(([text, label]) => (
              <button key={label} onClick={() => handleReaction(text)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'Noto Sans KR, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.background = 'rgba(79,195,247,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                {text}
              </button>
            ))}
          </div>

          {/* 모바일: 채팅 열기 버튼 */}
          {isMobile && (
            <button onClick={() => setShowChat(true)}
              style={{ padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#050510', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              💬 채팅 참여하기
            </button>
          )}
        </div>

        {/* ── 오른쪽 채팅 패널 ── */}
        {(!isMobile || showChat) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            ...(isMobile ? { position: 'fixed', inset: 0, zIndex: 100 } : {}),
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                {currentRoom.emoji} {currentRoom.label}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--green)' }}>
                  ● {currentRoom.count.toLocaleString()}명
                </span>
                {isMobile && (
                  <button onClick={() => setShowChat(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
                )}
              </div>
            </div>

            {/* 채팅 사이드 광고 */}
            <div style={{ padding: '8px 12px', flexShrink: 0 }}>
              <AdBanner slot="0987654321" style={{ height: 60 }} />
            </div>

            <div ref={chatRef} className="custom-scroll"
              style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              {messages.map(msg => (
                <ChatMessage key={msg.id} msg={msg} myNick={myNick} />
              ))}
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                내 닉네임: <span style={{ color: 'var(--accent2)' }}>{myNick}</span>
              </div>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="야근의 고통을 나눠보세요..."
                  maxLength={200}
                  style={{ flex: 1 }}
                />
                <button onClick={handleSend}
                  style={{ padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#050510', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  전송
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
