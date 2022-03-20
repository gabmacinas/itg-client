import React from 'react'
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap'
const navbar = ({ authenticate, user, isAuthenticated, isAuthenticating, logout }) => {
  const getEthSubString = (ethAddress) => {
    return `${ethAddress.substring(0, 5)}...${ethAddress.substring(ethAddress.length - 4)}`
  }

  return (
    <Navbar collapseOnSelect variant='dark' expand='lg' sticky='top' className='navbar navigation-clean'>
      <Container>
        <Navbar.Brand href='/'>
          <img id='sm-logo' src='assets/img/android-logo.png' />
          In The Game
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='navbar-toggler' />
        <Navbar.Collapse id='basic-navbar-nav' className='collapse navbar-collapse'>
          <Nav className='navbar-nav ms-auto'>
            <NavDropdown title='Play' id='basic-nav-dropdown' className='nav-item dropdown'>
              <NavDropdown.Item className='nav-item dropdown' href='/challenges'>
                Challenges
              </NavDropdown.Item>
              <NavDropdown.Item className='nav-item dropdown' href='/handicap'>
                Handicap
              </NavDropdown.Item>
              <NavDropdown.Item className='nav-item dropdown' href='/prediction'>
                Prediction
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link className='navbar-item' href='/collections'>
              Collections
            </Nav.Link>
            <Nav.Link className='navbar-item' href='/winners'>
              Winners
            </Nav.Link>
            <Nav.Link className='navbar-item' href='/about'>
              About
            </Nav.Link>
            {isAuthenticated
              ? (
              <Button className='btn btn-light' onClick={() => logout()}>
                Sign Out: {getEthSubString(user.get('ethAddress'))}
              </Button>
                )
              : (
              <Button
                className='btn btn-light'
                onClick={() => authenticate({ signingMessage: 'In The Game: Sign-In' })}
              >
                {isAuthenticating ? 'Loading' : 'Connect'}
              </Button>
                )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default navbar
