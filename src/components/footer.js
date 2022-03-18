import React from 'react';

export default function footer () {
  return (
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
  );
}
