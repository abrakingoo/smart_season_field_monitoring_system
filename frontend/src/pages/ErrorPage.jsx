import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate  = useNavigate()
  const role      = localStorage.getItem('role')
  const isLoggedIn = localStorage.getItem('auth')

  const handleBack = () => {
    if (!isLoggedIn) return navigate('/')
    navigate(role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f0ede6' }}>

      {/* Illustration */}
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" className="w-72 mb-8 opacity-80">
        {/* Ground */}
        <rect x="0" y="160" width="320" height="40" fill="#c8b89a" rx="4"/>
        {/* Soil rows */}
        <path d="M20 165 Q60 158 100 165 Q140 172 180 165 Q220 158 260 165 Q290 170 310 165" fill="none" stroke="#a89070" strokeWidth="2"/>
        <path d="M10 175 Q50 168 90 175 Q130 182 170 175 Q210 168 250 175 Q285 180 310 175" fill="none" stroke="#a89070" strokeWidth="2"/>

        {/* Wilted plant */}
        <line x1="100" y1="160" x2="100" y2="100" stroke="#8a7a5a" strokeWidth="3" strokeLinecap="round"/>
        <path d="M100 130 Q80 110 65 115" fill="none" stroke="#8a7a5a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 115 Q120 95 135 100" fill="none" stroke="#8a7a5a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 100 Q95 85 100 75" fill="none" stroke="#8a7a5a" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Drooping head */}
        <path d="M100 75 Q108 68 105 80" fill="none" stroke="#8a7a5a" strokeWidth="2" strokeLinecap="round"/>

        {/* Healthy plant */}
        <line x1="200" y1="160" x2="200" y2="80" stroke="#5a8a3a" strokeWidth="3" strokeLinecap="round"/>
        <path d="M200 130 Q175 108 160 112" fill="none" stroke="#5a8a3a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M200 110 Q225 88 240 92" fill="none" stroke="#5a8a3a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M200 90 Q195 72 200 60" fill="none" stroke="#5a8a3a" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Upright head */}
        <ellipse cx="200" cy="55" rx="8" ry="12" fill="#c8a84b" opacity="0.8"/>

        {/* 404 sign post */}
        <line x1="155" y1="160" x2="155" y2="95" stroke="#8a7a5a" strokeWidth="3" strokeLinecap="round"/>
        <rect x="118" y="88" width="74" height="32" rx="4" fill="#2d4a1e"/>
        <text x="155" y="109" textAnchor="middle" fill="#a8c97a" fontSize="18" fontWeight="bold" fontFamily="monospace">404</text>

        {/* Sun */}
        <circle cx="270" cy="40" r="18" fill="#c8a84b" opacity="0.5"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <line key={i}
            x1={270 + 22 * Math.cos(angle * Math.PI / 180)}
            y1={40  + 22 * Math.sin(angle * Math.PI / 180)}
            x2={270 + 28 * Math.cos(angle * Math.PI / 180)}
            y2={40  + 28 * Math.sin(angle * Math.PI / 180)}
            stroke="#c8a84b" strokeWidth="2" strokeLinecap="round" opacity="0.5"
          />
        ))}
      </svg>

      {/* Text */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#1e3314' }}>Page Not Found</h1>
      <p className="text-sm sm:text-base text-center max-w-sm mb-8" style={{ color: '#8a8278' }}>
        Looks like this field doesn't exist. It may have been moved, harvested, or never planted.
      </p>

      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition cursor-pointer"
        style={{ backgroundColor: '#2d4a1e' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a5c28'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2d4a1e'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        {isLoggedIn ? 'Back to Dashboard' : 'Back to Login'}
      </button>
    </div>
  )
}
