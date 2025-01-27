import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

export default function footer () {
  return (
    <footer className='footer-dark'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-6 col-md-3 item'>
              <h3 className='footer-head'>About</h3>
              <ul>
                <li>
                <LinkContainer to='/'>
                  <a>FAQs</a>
                </LinkContainer>
                </li>
                <li>
                  <LinkContainer to='/team'>
                  <a>Team</a>
                  </LinkContainer>
                </li>
                <li>
                  <LinkContainer to='/terms'>
                  <a>Terms And Conditions</a>
                  </LinkContainer>
                </li>
                <li>
                  <a href='mailto:team@inthegamenft.io'>team@inthegamenft.io</a>
                </li>
              </ul>
            </div>
            <div className='col-md-9 item text'>
              <h3 className='footer-head'>In The Game</h3>
              <p>
                Using a crowd sourced prize pool, In The Game provides members with a chance to win thousands of dollars
                worth of prizes each day by predicting the outcome of various sports results. In The Game also provides
                exclusive access to daily Top Shot challenges, rewarding collectors with cash, NFTs and high-end Top
                Shot moments.
              </p>
            </div>
            <div className='col item social'>
              <a className='social-icons' href='https://discord.com/invite/FcdNGASgeg'>
                <img className="icon-img" src='../assets/img/discord.png' />
              </a>
              <a className='social-icons' href='https://twitter.com/InTheGameNFT'>
                <i className='icon ion-social-twitter'></i>
              </a>
              <a className='social-icons' href='https://opensea.io/collection/in-the-game-nft'>
                <img className="icon-img" src='../assets/img/opensea-icon2.png' />
              </a>
              <a className='social-icons' href='https://etherscan.io/address/0x430FE8feb76f7F7a611fa84ac0bbCF66827816B3'>
                <img className="icon-img" src='../assets/img/etherscan-icon.png' />
              </a>
            </div>
          </div>
          <p className='copyright'>In The Game © 2022</p>
        </div>
      </footer>
  )
}
