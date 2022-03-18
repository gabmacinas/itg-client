import React from 'react';
import './App.css';
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
    </div>
  );
}

export default App;
