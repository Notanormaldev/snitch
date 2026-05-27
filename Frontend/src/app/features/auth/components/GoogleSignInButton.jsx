import React from 'react'
import { FcGoogle } from 'react-icons/fc'

function GoogleSignInButton({ mode = 'login' }) {
  return (
    <a
      href="/api/auth/google"
      className="google-button-custom"
    >
      <FcGoogle />

      <span>
        {mode === 'login'
          ? 'Sign in with Google'
          : 'Sign up with Google'}
      </span>
    </a>
  )
}

export default GoogleSignInButton