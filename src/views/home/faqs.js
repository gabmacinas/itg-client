import React from 'react'

const Faqs = () => {
  return (
    <>
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
    </>
  )
}

export default Faqs
