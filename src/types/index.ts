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
  { id: 'office', label: '사무실', emoji: '🏢', count: 0 },
]
