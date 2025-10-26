import { ImageResponse } from 'next/og'

// 192x192 icon
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 140,
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
