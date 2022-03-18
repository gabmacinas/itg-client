import React from 'react';
import {
  BrowserRouter as Router,
  useRoutes
} from 'react-router-dom';
import './styles/App.css';
import './styles/App.scss';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './views/home/Home';
import Handicap from './views/game/Handicap';

function App () {
  const InternalRoute = () => {
    const routes = useRoutes([
      { path: '/', element: <Home /> },
      { path: '/handicap', element: <Handicap /> }
    ]);
    return routes;
  };
  return (
    <>
        <Router>
          <Navbar />
          <InternalRoute/>
        </Router>
      <Footer />
    </>
  );
}

export default App;
