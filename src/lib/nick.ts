const adjectives = [
  '새벽', '야근', '만년', '월화수목금금금', '스타트업', '대기업',
  '을지로', '강남', '판교', '여의도', '인턴', '야근충', '칼퇴꿈꾸는',
  '커피없인못사는', '슬랙알림끄고싶은', '퇴사고민중인', '연봉협상실패한'
]

const nouns = [
  '개발자', '디자이너', '기획자', '마케터', '회계담당', '인사팀',
  '영업왕', '팀장', '사원', '알바생', '프리랜서', '야근러', 'PM',
  '퍼포먼스마케터', 'UX디자이너', '백엔드개발자', '프론트개발자'
]

const suffixes = ['_김모씨', '_이씨', '_박씨', '_최씨', '_정씨', '_한씨', '_조씨', '_윤씨']

export function generateNick(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return adj + '_' + noun + suffix
}

export function getOrCreateNick(): string {
  if (typeof window === 'undefined') return ''
  let nick = localStorage.getItem('yagun_nick')
  if (!nick) {
    nick = generateNick()
    localStorage.setItem('yagun_nick', nick)
  }
  return nick
}
