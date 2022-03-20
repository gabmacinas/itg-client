import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Handicap = ({ isAuthenticated }) => {
  return (
    <div className='text-white'>
      <div
        className='pt-5'
        data-bss-parallax-bg='true'
        data-pg-name='Main Section'
        style={{ backgroundImage: 'url(' + 'assets/img/bg1.jpg' + ')', marginBottom: '100px' }}
      >
        <div className='container lh-lg text-center'>
          <div className='container pb-4 pt-4'>
            <div className='align-items-center row'>
              <div className='col'>
                <hr className='border-secondary mb-0 mt-0' />
              </div>
              <div className='col-auto'>
                <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>Game Demo</h2>
              </div>
              <div className='col'>
                <hr className='border-secondary mb-0 mt-0' />
              </div>
            </div>
            <div className='col-md-12'>
              <h4 className='h4 lh-base p-5 text-center text-light'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam
              </h4>
            </div>
          </div>
          <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>Match Starts in 10 hours</h5>
          <div className='container text-center'>
            <div className='accent game-row'>
              <div className='proportions-box-square'>
                <div className='align-items-center border-width-3 d-flex flex-column justify-content-center proportions-box-content rounded-3 shadow text-dark'></div>
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='row'>
              <h4 style={{ textAlign: 'center' }}>Pick your Membership</h4>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
              <div className='col-lg-2 col-md-4'>
                <p className='nft__item'>#291 Membership</p>
              </div>
            </div>
          </div>

          <div className='game-row row'>
            <div className='col-md-6'>
              <div className='game'>
                <h3 className='h4'>PHX Suns vs MIL Bucks</h3>
                <ul className='my-nav-tabs nav nav-tabs' role='tablist'>
                  <li className='nav-item'>
                    {' '}
                    <a
                      className='nav-link active'
                      href='#'
                      data-bs-toggle='tab'
                      role='tab'
                      aria-controls=''
                      aria-expanded='true'
                    >
                      +3.25
                    </a>
                  </li>
                  <li className='nav-item'>
                    {' '}
                    <a
                      className='nav-link'
                      href='#'
                      data-bs-toggle='tab'
                      role='tab'
                      aria-controls=''
                      aria-expanded='true'
                    >
                      -3.25
                    </a>
                  </li>
                  <li className='nav-item'> </li>
                  <li className='nav-item'> </li>
                </ul>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='game'>
                <h3 className='h4'>PHX Suns vs MIL Bucks</h3>
                <Tabs className='my-nav-tabs nav nav-tabs' fill>
                  <Tab eventKey='o1' title='+3.25'/>
                  <Tab eventKey='02' title='-3.25' />
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Handicap.propTypes = {
  isAuthenticated: PropTypes.bool
};

export default Handicap;
