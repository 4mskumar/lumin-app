import React from 'react'
import Hero from './components/Hero'
import LandingPage from './Pages/LandingPage'
import ChatPage from './Pages/ChatPage'
import { Routes, Route } from 'react-router-dom'
import About from './Pages/About'
import AuthChecker from './service/AuthChecker'
import Development from './components/Development'

const appRoutes = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/chat/:id',
    element: <AuthChecker><ChatPage /></AuthChecker>
  },
  {
    path: '/development',
    element: <Development />
  }
]

const App = () => {
  return (
    <div className='bg-gray'>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  )
}

export default App