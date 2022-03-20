import React from 'react'
import './styles/App.css'
import './styles/App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './views/home/Home'
import { useMoralis } from 'react-moralis'

// import Handicap from './views/game/Handicap';

// TODO: Implement a loading screen spinner
const loading = (
  <div className='text-center'>
    <h1>Loading...</h1>
  </div>
)

// Pages
const Handicap = React.lazy(() => import('./views/game/Handicap'))

function App () {
  const { authenticate, user, isAuthenticated, isAuthenticating, logout } = useMoralis()
  return (
    <BrowserRouter>
      <Navbar
        authenticate={authenticate}
        user={user}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        logout={logout}
      />
      <React.Suspense fallback={loading}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/handicap' element={<Handicap isAuthenticated={isAuthenticated} />} />
        </Routes>
      </React.Suspense>
      <Footer />
    </BrowserRouter>
  )
}

export default App
