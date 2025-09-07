import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          fontSize: 60,
          fontWeight: 300,
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Background accents */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 300,
              letterSpacing: '8px',
              marginBottom: 20,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            Seedream Studio
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: '2px',
              opacity: 0.9,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            Where Dreams Take Shape
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}