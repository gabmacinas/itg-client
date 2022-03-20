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
const Challenges = React.lazy(() => import('./views/game/Challenges'))
const Prediction = React.lazy(() => import('./views/game/Prediction'))

const BindAccount = React.lazy(() => import('./views/utils/BindAccount'))
const Collections = React.lazy(() => import('./views/utils/Collections'))
const TermsAndConditions = React.lazy(() => import('./views/TermsAndConditions'))

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
          <Route path='/challenges' element={<Challenges isAuthenticated={isAuthenticated} />} />
          <Route path='/prediction' element={<Prediction isAuthenticated={isAuthenticated} />} />

          <Route path='/collections' element={<Collections isAuthenticated={isAuthenticated} />} />
          <Route path='/link' element={<BindAccount isAuthenticated={isAuthenticated} />} />
          <Route path='/terms' element={<TermsAndConditions />} />
        </Routes>
      </React.Suspense>
      <Footer />
    </BrowserRouter>
  )
}

export default App
