import React from 'react'
import PropTypes from 'prop-types'

const Intro = ({
  mint,
  isMinting,
  totalMint,
  maxSupply,
  isMintPaused,
  isWhitelistEnabled,
  isUserWhitelisted,
  mintQty,
  setMintQty,
  maxMintQty,
  balanceOf,
  isAuthenticated
}) => {
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
              <h1 className='animated fw-bold intro-head pulse' id='main-heading'>
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
              {/* <button className='btn btn-primary' type='button'>
                View Collections
              </button> */}
              {isMintPaused
                ? (
                    isWhitelistEnabled && isUserWhitelisted
                      ? (
                  <>
                    <span className='inline lead'>
                      <input
                        className='form-mint '
                        id='txtMintQty'
                        name='txtMintQty'
                        placeholder='Qty'
                        type='number'
                        value={mintQty}
                        onChange={(event) => {
                          if (event.target.value.length > maxMintQty.length) return null
                          const re = /^[0-9\b]+$/
                          if (event.target.value === '' || re.test(event.target.value)) {
                            setMintQty(event.target.value)
                          }
                        }}
                      />
                    </span>
                    <span onClick={() => mint()} className='btn-main inline lead'>
                      {isMinting ? 'Minting...' : 'Eligible for Exclusive Pass: Mint Now!'}
                    </span>
                  </>
                        )
                      : (
                        <h3 className='fw-bold' id='sub-head'>Mint Closed</h3>
                        )
                  )
                : (
                <>
                  <span className='inline lead'>
                    <input
                      className='form-mint '
                      id='txtMintQty'
                      name='txtMintQty'
                      placeholder='Qty'
                      type='text'
                      value={mintQty}
                      onChange={(event) => {
                        if (event.target.value.length > maxMintQty.length) return null
                        const re = /^[0-9\b]+$/
                        if (event.target.value === '' || re.test(event.target.value)) {
                          if (event.target.value > maxMintQty) return setMintQty(maxMintQty)
                          setMintQty(event.target.value)
                        }
                      }}
                    />
                  </span>
                  <span onClick={() => mint()} className='btn btn-primary'>
                    {isMinting ? 'Minting...' : 'Mint Now'}
                  </span>
                </>
                  )}
            </div>
            <div className='col-md-6 d-flex justify-content-center grow' id='hero-right'>
              <img className='animated img-fluid pulse' id='logo-hero' src='assets/img/logo-lg.png' alt='In The Game' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Intro.propTypes = {
  mint: PropTypes.func,
  isMinting: PropTypes.bool,
  totalMint: PropTypes.number,
  maxSupply: PropTypes.number,
  isMintPaused: PropTypes.bool,
  isWhitelistEnabled: PropTypes.bool,
  isUserWhitelisted: PropTypes.bool,
  mintQty: PropTypes.number,
  maxMintQty: PropTypes.number,
  balanceOf: PropTypes.number,
  setMintQty: PropTypes.func,
  isAuthenticated: PropTypes.bool
}

export default Intro
