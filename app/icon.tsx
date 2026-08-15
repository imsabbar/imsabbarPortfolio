import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// Favicon dimensions
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

// Dynamic App Icon Generator (High-Visibility White Capsule)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          border: '2.5px solid #E2E8F0',
          boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
        }}
      >
        <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
          <path
            d="M14 17 L32 32 L14 47"
            stroke="#0891B2"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M37 47 L51 47"
            stroke="#0891B2"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
