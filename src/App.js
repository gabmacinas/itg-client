import React from 'react';
import './styles/App.css';
import './styles/App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './views/home/Home';
import Handicap from './views/game/Handicap';
import { useMoralis } from 'react-moralis';

function App () {
  const { authenticate, user, isAuthenticated, isAuthenticating, logout } = useMoralis();
  return (
    <BrowserRouter>
      <Navbar
        authenticate={authenticate}
        user={user}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        logout={logout}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/handicap' element={<Handicap isAuthenticated={isAuthenticated} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
