import React from 'react'
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
const navbar = ({ authenticate, user, isAuthenticated, isAuthenticating, logout }) => {
  const navigate = useNavigate()
  const getEthSubString = (ethAddress) => {
    return `${ethAddress.substring(0, 5)}...${ethAddress.substring(ethAddress.length - 4)}`
  }

  return (
    <Navbar collapseOnSelect variant='dark' expand='lg' sticky='top' className='navbar navigation-clean'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <img id='sm-logo' src='assets/img/android-logo.png' />
            In The Game
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='navbar-toggler' />
        <Navbar.Collapse id='basic-navbar-nav' className='collapse navbar-collapse'>
          <Nav className='navbar-nav ms-auto'>
            <NavDropdown title='Play' id='basic-nav-dropdown' className='nav-item dropdown'>
              <LinkContainer to='/challenges'>
                <NavDropdown.Item className='nav-item dropdown'>Challenges</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/handicap'>
                <NavDropdown.Item className='nav-item dropdown'>Handicap</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/prediction'>
                <NavDropdown.Item className='nav-item dropdown'>Prediction</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to='/team'>
              <Nav.Link className='navbar-item'>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/terms'>
              <Nav.Link className='navbar-item'>T&amp;C</Nav.Link>
            </LinkContainer>
            {isAuthenticated
              ? (
              <Button className='btn btn-light' onClick={() => {
                logout()
                navigate('/')
              }}>
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
