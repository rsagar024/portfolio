import { ImageResponse } from 'next/og'

// Edge runtime: on Windows, next/og's Node runtime fails to resolve its bundled font (Next 15.1).
export const runtime = 'edge'
export const alt = 'Sagar — Flutter Developer, Frontend Engineer & Ethical Hacker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#020408',
          backgroundImage: 'linear-gradient(135deg, #020408 0%, #04142a 55%, #1a0430 100%)',
        }}
      >
        <div style={{ display: 'flex', color: '#00ff88', fontSize: 30, marginBottom: 24 }}>
          $ whoami
        </div>
        <div style={{ display: 'flex', fontSize: 170, fontWeight: 700, color: '#00d4ff', letterSpacing: 4 }}>
          SAGAR
        </div>
        <div style={{ display: 'flex', color: '#cbd5e1', fontSize: 36, marginTop: 16 }}>
          Flutter Developer · Frontend Engineer · Ethical Hacker
        </div>
        <div style={{ display: 'flex', color: '#b829ff', fontSize: 32, marginTop: 40 }}>
          Building futuristic apps and secure digital experiences.
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            height: 10,
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, #00d4ff, #b829ff, #00ff88)',
          }}
        />
      </div>
    ),
    size,
  )
}
