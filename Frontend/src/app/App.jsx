import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { useauth } from './features/auth/hook/useauth.js'

function App() {

  const {handlegetme}=useauth()
  useEffect(()=>{
    handlegetme()
  },[])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
