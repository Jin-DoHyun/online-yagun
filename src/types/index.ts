export type Room = {
  id: string
  label: string
  emoji: string
  count: number
}

export type Message = {
  id: string
  room: string
  nick: string
  text: string
  created_at: string
  isMe?: boolean
  isSystem?: boolean
}

export const ROOMS: Room[] = [
  { id: 'startup', label: '스타트업 사무실', emoji: '💻', count: 847 },
  { id: 'bigcorp', label: '대기업 사무실', emoji: '🏢', count: 1203 },
  { id: 'remote', label: '재택근무방', emoji: '🏠', count: 621 },
  { id: 'parttime', label: '편의점 야간 알바', emoji: '🏪', count: 156 },
  { id: 'silence', label: '침묵의 방', emoji: '🔇', count: 20 },
]
