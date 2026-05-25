import React from 'react'
import { DiJoomla } from 'react-icons/di'
import { DiJira } from "react-icons/di";
function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 select-none logo-container">
      {/* Metallic SVG Gradient definitions and Icon */}
      <div className="relative flex items-center justify-center" style={{ width: '28px', height: '28px' }}>
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="metallic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C0C0C0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
          </defs>
        </svg>
        <DiJira size={30} style={{ fill: 'url(#metallic-grad)' }} />
      </div>
      
      {/* Text "LUOMI" */}
      <span 
        className="text-[20px] font-semibold tracking-[5px] leading-none uppercase" 
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          background: 'linear-gradient(135deg, #C0C0C0, #FFFFFF, #888888)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 200
        }}
      >
        LUOMI
      </span>
    </div>
  )
}

export default Logo
