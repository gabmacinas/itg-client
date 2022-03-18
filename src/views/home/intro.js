import React from 'react';

export default function intro () {
  return (
    <>
      <div
        className='d-flex align-content-center'
        data-bss-parallax-bg='true'
        id='intro-section'
        style={{ backgroundImage: 'url(' + 'assets/img/bg1.jpg' + ')' }}
      >
        <div className='container'>
          <div className='row d-flex align-items-center align-content-center' id='main-intro-container'>
            <div className='col-md-6' id='hero-left'>
              <h1 className='animated fw-bold intro-head pulse' id='main-heading' >
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
    </>
  );
}
