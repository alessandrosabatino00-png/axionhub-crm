export default function LogoSVG({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orbital rings */}
      <ellipse cx="20" cy="20" rx="18" ry="8" stroke="url(#ring1)" strokeWidth="1.2" transform="rotate(-22 20 20)" fill="none" opacity="0.9"/>
      <ellipse cx="20" cy="20" rx="18" ry="8" stroke="url(#ring2)" strokeWidth="0.8" transform="rotate(18 20 20)" fill="none" opacity="0.6"/>
      {/* Center dot */}
      <circle cx="20" cy="20" r="2.5" fill="url(#center)"/>
      {/* Orbital dot */}
      <circle cx="35" cy="18" r="1.8" fill="#0ABDD4"/>
      <defs>
        <linearGradient id="ring1" x1="2" y1="20" x2="38" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4FD6"/>
          <stop offset="1" stopColor="#0ABDD4"/>
        </linearGradient>
        <linearGradient id="ring2" x1="2" y1="20" x2="38" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ABDD4" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#1A4FD6" stopOpacity="0.4"/>
        </linearGradient>
        <linearGradient id="center" x1="17.5" y1="17.5" x2="22.5" y2="22.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4FD6"/>
          <stop offset="1" stopColor="#0ABDD4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
