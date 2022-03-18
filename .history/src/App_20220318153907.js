import React from 'react';
import './styles/App.css';
import './styles/App.scss';

function App () {
  return (
    <div className='body'>
      <nav className='navbar navbar-expand-lg navbar-light navigation-clean sticky-top'>
        <div className='container'>
          <a className='navbar-brand' href='#'>
            <img id='sm-logo' src='assets/img/android-logo.png' />
            In The Game
          </a>
          <button data-bs-toggle='collapse' className='navbar-toggler' data-bs-target='#navcol-1'>
            <span className='visually-hidden'>Toggle navigation</span>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navcol-1'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item dropdown'>
                <a className='dropdown-toggle nav-link' aria-expanded='false' data-bs-toggle='dropdown' href='#'>
                  Play&nbsp;
                </a>
                <div className='dropdown-menu'>
                  <a className='dropdown-item' href='#'>
                    Game 1
                  </a>
                  <a className='dropdown-item' href='#'>
                    Game 2
                  </a>
                  <a className='dropdown-item' href='#'>
                    Game 3
                  </a>
                </div>
              </li>
              <li className='nav-item'>
                <a className='nav-link active' href='#'>
                  Results
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Mint
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Activity
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>
                  Winners
                </a>
              </li>
              <button type='button' className='btn btn-light'>
                Connect Wallet
              </button>
            </ul>
          </div>
        </div>
      </nav>
      <div
        className='d-flex align-content-center'
        data-bss-parallax-bg='true'
        id='intro-section'
        style={{ backgroundImage: 'url(' + 'assets/img/bg1.jpg' + ')' }}
      >
        <div className='container'>
          <div className='row d-flex align-items-center align-content-center' id='main-intro-container'>
            <div className='col-md-6' id='hero-left'>
              <h1 className='animated fw-bold intro-head pulse' id='main-heading' style={{ color: '#FEE603' }}>
                In The Game
              </h1>
              <h3 className='fw-bold' id='sub-head'>
                <strong className='subhead'>
                  In The Game is an exclusive membership rewarding sports fans and Top Shot collectors alike.
                </strong>
              </h3>
              <p>
                Using a crowd sourced prize pool, In the Game provides members with a chance to win thousands of dollars
                worth of prizes each day by predicting the outcome of various sports results. In the Game also provides
                exclusive access to daily Top Shot challenges, rewarding collectors with cash, NFTs and high-end Top
                Shot moments.
              </p>
              <button className='btn btn-primary' type='button'>
                View Collections
              </button>
            </div>
            <div className='col-md-6 d-flex justify-content-center grow' id='hero-right'>
              <img className='animated img-fluid pulse' id='logo-hero' src='assets/img/logo-lg.png' alt='In The Game' />
            </div>
          </div>
        </div>
      </div>
      <section className='d-flex d-lg-flex align-items-lg-center faq-section'>
        <div className='container-md d-flex flex-column'>
          <h2 className='fw-bold text-center'>FAQ</h2>
          <div className='align-items-start justify-content-center row row-cols-1 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 row-cols-xl-3 row-cols-xxl-3'>
            <div className='col'>
              <div className='card-container grow text-center'>
                <i className='fas fa-basketball-ball card-icon'></i>
                <div className='card-outer'>
                  <div className='text-center card-inner'>
                    <h4 className='card-header'>How many NFTs will be released?</h4>
                    <p>We have 5000 NFTs to be released.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='text-center card-container grow'>
                <i className='fas fa-basketball-ball card-icon'></i>
                <div className='card-outer'>
                  <div className='text-center card-inner'>
                    <h4 className='card-header'>How much does it cost?</h4>
                    <p>0.05 ETH per mint.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='text-center card-container grow'>
                <i className='fas fa-basketball-ball card-icon'></i>
                <div className='card-outer'>
                  <div className='text-center card-inner'>
                    <h4 className='card-header'>When can I mint?</h4>
                    <p>Early March.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='text-center card-container grow'>
                <i className='fas fa-basketball-ball card-icon'></i>
                <div className='card-outer'>
                  <div className='text-center card-inner'>
                    <h4 className='card-header'>Where can I get more information?</h4>
                    <p>You can look at our Discord, Twitter page for more information.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='text-center card-container grow'>
                <i className='fas fa-basketball-ball card-icon'></i>
                <div className='card-outer'>
                  <div className='text-center card-inner'>
                    <h4 className='card-header'>I have only ever bought Top Shot Moments; how do I buy In the Game?</h4>
                    <p>
                      You can mint <a href='https://in-the-game-client-staging.herokuapp.com/'>here</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className='footer-dark'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-6 col-md-3 item'>
              <h3 className='footer-head'>About</h3>
              <ul>
                <li>
                  <a href='#'>Company</a>
                </li>
                <li>
                  <a href='#'>Team</a>
                </li>
                <li>
                  <a href='#'>Careers</a>
                </li>
              </ul>
            </div>
            <div className='col-md-9 item text'>
              <h3 className='footer-head'>In The Game</h3>
              <p>
                Using a crowd sourced prize pool, In the Game provides members with a chance to win thousands of dollars
                worth of prizes each day by predicting the outcome of various sports results. In the Game also provides
                exclusive access to daily Top Shot challenges, rewarding collectors with cash, NFTs and high-end Top
                Shot moments.
              </p>
            </div>
            <div className='col item social'>
              <a className='social-icons' href='#'>
                <i className='icon ion-social-facebook'></i>
              </a>
              <a className='social-icons' href='#'>
                <i className='icon ion-social-twitter'></i>
              </a>
              <a className='social-icons' href='#'>
                <i className='icon ion-social-snapchat'></i>
              </a>
              <a className='social-icons' href='#'>
                <i className='icon ion-social-instagram'></i>
              </a>
            </div>
          </div>
          <p className='copyright'>In The Game © 2022</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
