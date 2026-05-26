import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import Logo from '../components/Logo'
import { useauth } from '../hook/useauth'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const { handleregister, loading } = useauth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState('')

  // Refs for GSAP animations
  const scrollRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const buttonRef = useRef(null)
  const editorialRef = useRef(null)
  const sellerToggleRef = useRef(null)

  useEffect(() => {
    // 1. Initialize Locomotive Scroll
    let scroll
    if (scrollRef.current) {
      scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1.0,
      })
    }

    // 2. Custom Cursor Movement
    const onMouseMove = (e) => {
      const { clientX, clientY } = e
      
      // Instantly position the dot
      gsap.to(cursorDotRef.current, {
        x: clientX,
        y: clientY,
        duration: 0,
      })
      
      // Smoothly lag the ring behind the dot
      gsap.to(cursorRingRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMouseMove)

    // 3. Page Entrance Animations
    const entranceTimeline = gsap.timeline()
    
    // Logo entrance
    entranceTimeline.fromTo('.logo-container', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )

    // Divider line
    entranceTimeline.fromTo('.divider-line', 
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' },
      '-=0.4'
    )

    // Heading splits and falls in
    entranceTimeline.fromTo('.heading-char',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, stagger: 0.03, ease: 'expo.out' },
      '-=0.4'
    )

    // Input fields stagger in from the left
    entranceTimeline.fromTo('.auth-input-wrapper',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
      '-=0.6'
    )

    // CTA button fade entrance
    entranceTimeline.fromTo(buttonRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    )

    // isSeller toggle fades in last and very subtly (max opacity 0.5)
    entranceTimeline.fromTo(sellerToggleRef.current,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )

    // Left editorial column slide-in + blur fade
    gsap.fromTo(editorialRef.current,
      { x: -60, filter: 'blur(10px)', opacity: 0 },
      { x: 0, filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power4.out' }
    )

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (scroll) scroll.destroy()
    }
  }, [])

  // 4. CTA Button Hover Setup (only for custom cursor scaling)
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleMouseEnter = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.add('hovered')
      }
    }

    const handleMouseLeave = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.remove('hovered')
      }
    }

    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (button) {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Client-side validations matching the backend rules for instant feedback
    if (!fullName) {
      setError('Full Name is required.')
      return
    }
    if (fullName.trim().length < 3) {
      setError('Full Name must be at least 3 characters long.')
      return
    }
    if (!email) {
      setError('Email address is required.')
      return
    }
    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!contactNumber) {
      setError('Contact number is required.')
      return
    }
    // Contact 10 digit check
    const contactRegex = /^[0-9]{10}$/
    if (!contactRegex.test(contactNumber)) {
      setError('Contact number must be exactly 10 digits.')
      return
    }
    if (!password) {
      setError('Password is required.')
      return
    }
    // Password complexity check: >= 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).')
      return
    }

    try {
      const res = await handleregister({
        email,
        contact: contactNumber,
        fullname: fullName,
        password,
        isseller: isSeller
      })
      if (res && res.success) {
        navigate('/')
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        // express-validator error array - pick the first error message
        setError(err.errors[0].msg)
      } else if (err.msg) {
        setError(err.msg)
      } else {
        setError('Registration failed. Please check your credentials and try again.')
      }
    }
  }

  const headingText = "Create Account"

  return (
    <div data-scroll-container ref={scrollRef} className="w-full min-h-screen bg-[#0A0A0A] flex flex-row overflow-hidden relative">
      {/* Custom Cursors */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div ref={cursorRingRef} className="custom-cursor-ring" />

      {/* Left editorial column (55%) */}
      <div 
        ref={editorialRef}
        className="editorial-column w-[55%] h-screen relative hidden md:block overflow-hidden"
      >
        {/* Dark overlay and slow parallax image */}
        <div 
          className="absolute inset-0 w-full h-full object-cover scale-110"
          data-scroll
          data-scroll-speed="-2"
          style={{
            backgroundImage: "url('/editorial_fashion.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark luxury overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />
        
        {/* High-fashion brand Statement Pull Quote */}
        <div className="absolute inset-x-12 bottom-20 z-10 flex flex-col justify-end text-left select-none">
          <p className="font-logo text-3xl lg:text-4xl italic text-[#F0F0F0] leading-relaxed tracking-wider font-light max-w-xl">
            "A study in silent luxury. The architecture of modern attire."
          </p>
          <div className="h-[1px] w-20 bg-[#C0C0C0] mt-6 opacity-60" />
          <span className="font-label text-[11px] font-medium tracking-[2px] uppercase text-[#888888] mt-3">
            LUOMI EDITORIAL STILLS
          </span>
        </div>
      </div>

      {/* Right Form column (45%) */}
      <div className="form-column w-full md:w-[45%] h-screen bg-[#0A0A0A] flex flex-col justify-between py-8 px-8 sm:px-16 overflow-y-auto z-10 no-scrollbar">
        {/* Top brand header */}
        <div className="w-full flex flex-col items-center shrink-0">
          <Logo />
          <div className="divider-line h-[1px] bg-[#1E1E1E] w-full mt-4 mb-2 origin-center" />
        </div>

        {/* Center Auth Form */}
        <div className="flex-1 w-full max-w-[400px] mx-auto flex flex-col justify-center">
          {/* Header */}
          <h1 className="font-heading text-[34px] sm:text-[38px] font-medium text-[#F0F0F0] mb-5 leading-none tracking-tight flex flex-row flex-wrap">
            {headingText.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="flex flex-row mr-3">
                {word.split("").map((char, charIdx) => (
                  <span key={charIdx} className="inline-block heading-char origin-bottom">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col text-left">
            {/* Error messaging */}
            {error && (
              <p className="font-body text-xs text-red-500 mb-4 tracking-wide font-medium uppercase">
                {error}
              </p>
            )}

            {/* Field 1: Full Name */}
            <div className="auth-input-wrapper flex flex-col">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-input"
              />
              <span className="input-underline" />
            </div>

            {/* Field 2: Email Address */}
            <div className="auth-input-wrapper flex flex-col">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
              <span className="input-underline" />
            </div>

            {/* Field 3: Contact Number */}
            <div className="auth-input-wrapper flex flex-col">
              <label className="auth-label">Contact Number</label>
              <input
                type="text"
                placeholder="Enter contact number..."
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="auth-input"
              />
              <span className="input-underline" />
            </div>

            {/* Field 4: Password */}
            <div className="auth-input-wrapper flex flex-col relative">
              <label className="auth-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <span className="input-underline" />
              {/* Minimal text show/hide */}
              <div className="absolute right-4 top-[38px] flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-label font-medium tracking-[1.5px] uppercase text-[#888888] hover:text-[#C0C0C0] transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* isSeller Pill Switch Toggle (Bottom Right of the Form Area) */}
            <div className="w-full flex justify-end mb-4">
              <div 
                ref={sellerToggleRef}
                onClick={() => setIsSeller(!isSeller)}
                className={`switch-container ${isSeller ? 'active' : ''}`}
              >
                <span>Register as Seller</span>
                <div className="pill-switch">
                  <div className="pill-switch-handle" />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              className="cta-button"
            >
              {loading ? 'CREATING ACCOUNT...' : 'JOIN LUOMI'}
            </button>
          </form>

          {/* Google Sign Up Divider */}
          <div className="w-full flex items-center gap-4 mt-5 mb-4">
            <div className="flex-1 h-[1px] bg-[#1E1E1E]" />
            <span className="font-label text-[10px] tracking-[1.5px] uppercase text-[#444444] whitespace-nowrap">or</span>
            <div className="flex-1 h-[1px] bg-[#1E1E1E]" />
          </div>

          {/* Google Register Button */}
          <a href="/api/auth/google"
            type="button" 
            className="w-full h-[44px] border-[0.5px] border-[#2A2A2A] bg-transparent text-[#888888] hover:text-[#C0C0C0] hover:border-[#888888] font-label text-[11px] uppercase tracking-[2px] rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-[14px] font-semibold">G</span>
            <span className="text-[10px] tracking-[1.5px]">REGISTER WITH GOOGLE</span>
          </a>
        </div>

        {/* Bottom Footer links — with proper breathing room */}
        <div className="w-full text-center flex flex-col items-center gap-3 pt-6 shrink-0">
          <p className="font-label text-xs text-[#888888]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F0F0F0] hover:text-[#C0C0C0] underline transition-colors">
              Log in
            </Link>
          </p>
          <p className="font-legal text-[11px] text-[#444444] tracking-wide">
            © 2026 LUOMI LTD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
