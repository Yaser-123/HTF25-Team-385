import { ImageResponse } from 'next/og'

// 512x512 icon
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 380,
          background: '#1B1B1B',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        🌌
      </div>
    ),
    {
      ...size,
    }
  )
}
