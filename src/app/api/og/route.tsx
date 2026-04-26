import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const CREAM = '#FAF7EE'
const YELLOW = '#FCE16E'
const BLACK = '#0a0a0a'
const ACCENT = '#D85A30'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.slice(0, 140) || 'Pass The Plate'
  const subtitle =
    searchParams.get('subtitle')?.slice(0, 200) ||
    'The Marketplace for the $240B Asian F&B Transition'
  const eyebrow = searchParams.get('eyebrow')?.slice(0, 60) || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: CREAM,
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 360,
            height: 360,
            background: YELLOW,
            transform: 'translate(120px,-120px) rotate(15deg)',
            borderRadius: 48,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -120,
            width: 280,
            height: 280,
            background: ACCENT,
            opacity: 0.18,
            borderRadius: 9999,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: BLACK,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              background: ACCENT,
              borderRadius: 9999,
            }}
          />
          PASS THE PLATE
        </div>

        {eyebrow && (
          <div
            style={{
              marginTop: 'auto',
              fontSize: 22,
              fontWeight: 600,
              color: '#3f3f46',
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            color: BLACK,
            marginTop: eyebrow ? 0 : 'auto',
          }}
        >
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 700,
              fontFamily: 'serif',
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: '#3f3f46',
              maxWidth: 920,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 22,
            color: '#71717a',
            fontWeight: 500,
          }}
        >
          passtheplate.store
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
