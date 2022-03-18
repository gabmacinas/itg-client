import React from 'react';

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
const navbar = () => {
  return (
    <Navbar collapseOnSelect variant='dark' expand="lg" sticky="top" className='navbar navigation-clean' >
        <Container>
        <Navbar.Brand href="/"><img id='sm-logo' src='assets/img/android-logo.png' />In The Game</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='navbar-toggler' />
        <Navbar.Collapse id="basic-navbar-nav" className="collapse navbar-collapse">
            <Nav className="navbar-nav ms-auto">
              <NavDropdown title="Play" id="basic-nav-dropdown" className='nav-item dropdown'>
                  <NavDropdown.Item className='nav-item dropdown' href="/challenges">Challenges</NavDropdown.Item>
                  <NavDropdown.Item className='nav-item dropdown' href="/handicap">Handicap</NavDropdown.Item>
                  <NavDropdown.Item className='nav-item dropdown' href="/prediction">Prediction</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className='navbar-item' href="/collections">Collections</Nav.Link>
              <Nav.Link className='navbar-item' href="/winners">Winners</Nav.Link>
              <Nav.Link className='navbar-item' href="/about">About</Nav.Link>
              <button type="button" className="btn btn-light">Connect Wallet</button>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>

  //   <Navbar collapseOnSelect className='navbar navbar-expand-lg navbar-light navigation-clean' fixed='top'>
  //   <Container>
  //     <Navbar.Brand href="/"><img id='sm-logo' src='assets/img/android-logo.png' />In The Game</Navbar.Brand>
  //     <Navbar.Toggle aria-controls='navCol-1' className='navbar-toggler'>
  //       <span className='visually-hidden'>Toggle navigation</span>
  //       <span className='navbar-toggler-icon'></span>
  //     </Navbar.Toggle>
  //     <Navbar.Collapse id="navCol-1" className='collapse navbar-collapse'>
  //       <Nav className="navbar-nav ms-auto">
  //         <NavDropdown title="Play" className='nav-item dropdown'>
  //           <NavDropdown.Item href="/challenges">Challenges</NavDropdown.Item>
  //           <NavDropdown.Item href="/handicap">Handicap</NavDropdown.Item>
  //           <NavDropdown.Item href="/prediction">Prediction</NavDropdown.Item>
  //         </NavDropdown>
  //         <Nav.Link href="/collections">Collections</Nav.Link>
  //         <Nav.Link href="/winners">Winners</Nav.Link>
  //         <button type="button" className="btn btn-light">Connect Wallet</button>
  //       </Nav>
  //     </Navbar.Collapse>
  //   </Container>
  // </Navbar>
  // <nav className='navbar navbar-expand-lg navbar-light navigation-clean sticky-top'>
  //     <div className='container'>
  //       <a className='navbar-brand' href='#'>
  //         <img id='sm-logo' src='assets/img/android-logo.png' />
  //         In The Game
  //       </a>
  //       <button data-bs-toggle='collapse' className='navbar-toggler' data-bs-target='#navcol-1' onClick={() => toggleMenu()}>
  //         <span className='visually-hidden'>Toggle navigation</span>
  //         <span className='navbar-toggler-icon'></span>
  //       </button>
  //       <div className='collapse navbar-collapse' id='navcol-1'>
  //         <ul className='navbar-nav ms-auto'>
  //           <li className='nav-item dropdown'>
  //             <a className='dropdown-toggle nav-link' aria-expanded='false' data-bs-toggle='dropdown' href='#'>
  //               Play&nbsp;
  //             </a>
  //         {openMenu && (
  //             <div className='dropdown-menu'>
  //               <a className='dropdown-item' href='#'>
  //                 Game 1
  //               </a>
  //               <a className='dropdown-item' href='#'>
  //                 Game 2
  //               </a>
  //               <a className='dropdown-item' href='#'>
  //                 Game 3
  //               </a>
  //             </div>
  //         )}
  //         {openMenu && (
  //                         <div className='item-dropdown'>
  //                           <div className='dropdown' onClick={() => toggleMenu()}>
  //                             <NavLink to='/challenges' onClick={() => toggleMenu()}>
  //                               Challenges
  //                             </NavLink>
  //                             <NavLink to='/handicap' onClick={() => toggleMenu()}>
  //                               Handicap
  //                             </NavLink>
  //                             <NavLink to='/prediction' onClick={() => toggleMenu()}>
  //                               Prediction
  //                             </NavLink>
  //                           </div>
  //                         </div>
  //         )}
  //           </li>
  //           <li className='nav-item'>
  //             <a className='nav-link active' href='#'>
  //               Results
  //             </a>
  //           </li>
  //           <li className='nav-item'>
  //             <a className='nav-link' href='#'>
  //               Mint
  //             </a>
  //           </li>
  //           <li className='nav-item'>
  //             <a className='nav-link' href='#'>
  //               Activity
  //             </a>
  //           </li>
  //           <li className='nav-item'>
  //             <a className='nav-link' href='#'>
  //               Winners
  //             </a>
  //           </li>
  //           <button type='button' className='btn btn-light'>
  //             Connect Wallet
  //           </button>
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  );
};

export default navbar;
