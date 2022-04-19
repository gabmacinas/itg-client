import React from 'react'
import PropTypes from 'prop-types'
import Intro from './intro'
import Faqs from './faqs'

const Home = ({ mint, isMinting, totalMint, maxSupply, isMintPaused, isWhitelistEnabled, isUserWhitelisted, mintQty, setMintQty, maxMintQty, balanceOf, isAuthenticated }) => {
  return (
    <>
      <Intro
        isMinting={isMinting}
        mint={mint}
        totalMint={Number(totalMint)}
        maxSupply={Number(maxSupply)}
        isMintPaused={isMintPaused}
        isWhitelistEnabled={isWhitelistEnabled}
        isUserWhitelisted={isUserWhitelisted}
        setMintQty={setMintQty}
        mintQty={Number(mintQty)}
        maxMintQty={Number(maxMintQty)}
        balanceOf={Number(balanceOf)}
        isAuthenticated={isAuthenticated}
      />
      <section className="mb-5">
        <div className="container text-center ">
          <h2>What&apos;s This About?</h2>
          <div className="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/drP4C3ru7lk" title="YouTube video" allowFullScreen></iframe>
          </div>
        </div>
      </section>
      <Faqs />
    </>
  )
}

Home.propTypes = {
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

export default Home
