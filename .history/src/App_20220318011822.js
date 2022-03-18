import React from 'react';
import './App.scss';

function App () {
  return (
    <div className="body">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light navigation-clean sticky-top">
              <div className="container"><a className="navbar-brand" href="#"><img id="sm-logo" src="assets/img/android-logo.png"/>In The Game</a>
                  <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navcol-1">
                      <ul className="navbar-nav ms-auto">
                          <li className="nav-item dropdown"><a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">Play&nbsp;</a>
                              <div className="dropdown-menu"><a className="dropdown-item" href="#">Game 1</a><a className="dropdown-item" href="#">Game 2</a><a className="dropdown-item" href="#">Game 3</a>
                              </div>
                          </li>
                          <li className="nav-item">
                              <a className="nav-link active" href="#">Results</a>
                          </li>
                          <li className="nav-item"><a className="nav-link" href="#">Mint</a>
                          </li>
                          <li className="nav-item"><a className="nav-link" href="#">Activity</a>
                          </li>
                          <li className="nav-item"><a className="nav-link" href="#">Winners</a>
                          </li>
                          <button type="button" className="btn btn-light">Connect Wallet</button>
                      </ul>
                  </div>
              </div>
          </nav>
      </div>
      <div className="d-flex align-content-center" data-bss-parallax-bg="true" id="intro-section" style="background-image: url(assets/img/bg1.jpg);">
            <div className="container">
                <div className="row d-flex align-items-center align-content-center" id="main-intro-container">
                    <div className="col-md-6" id="hero-left">
                        <h1 className="animated fw-bold intro-head pulse text-primary" id="main-heading">In The Game</h1>
                        <h3 className="fw-bold" id="sub-head"><strong className="subhead">In The Game is an exclusive membership rewarding sports fans and Top Shot collectors alike.</strong></h3>
                        <p>Using a crowd sourced prize pool, In the Game provides members with a chance to win thousands of dollars worth of prizes each day by predicting the outcome of various sports results. In the Game also provides exclusive access to daily Top Shot challenges, rewarding collectors with cash, NFTs and high-end Top Shot moments.</p>
                        <button className="btn btn-primary" type="button">View Collections</button>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center grow" id="hero-right">
                        <img className="animated img-fluid pulse" id="logo-hero" src="assets/img/logo-lg.png" alt="In The Game"/>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}

export default App;
