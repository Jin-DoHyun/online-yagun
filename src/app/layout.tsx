import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🖥️ 온라인 야근 — 지금 다같이 야근 중',
  description: '혼자 야근하는 것 같지만, 우리는 다 같이 야근 중입니다. 야근하는 사람들을 위한 실시간 익명 소셜 공간.',
  keywords: ['야근', '직장인', '야근 커뮤니티', '익명 채팅', '직장인 커뮤니티'],
  openGraph: {
    title: '🖥️ 온라인 야근',
    description: '지금 이 시간, 당신만 야근하는 게 아닙니다.',
    url: 'https://yagun.vercel.app',
    siteName: '온라인 야근',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🖥️ 온라인 야근 — 다같이 야근 중',
    description: '지금 이 시간, 당신만 야근하는 게 아닙니다.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense — 승인 후 client 값 교체 */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
