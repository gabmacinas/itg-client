import React, { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function BindAccount () {
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate()

  const { user, isAuthenticated } = useMoralis()
  const [username, setUsername] = useState('')
  const [hasError, setError] = useState({})

  useEffect(() => {
    if (!isAuthenticated) return null
    const getInformation = async () => {
      const usernameUpdated = await user.get('usernameUpdated') || false
      if (usernameUpdated) navigate('/')
    }
    getInformation()
    // console.log('challengeSubmissions', challengeSubmissions)
  }, [isAuthenticated])

  const getDapperUser = async () => {
    if (user === null) return false
    setError({})
    const url = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_MAINNET_API : process.env.REACT_APP_TESTNET_API
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `${user.attributes.sessionToken}` },
      body: `{"requestType":"getUser","owner":"${username}"}`
    })
      .then((response) => {
        // console.log(response);
        return response.json()
      })
      .then((data) => {
        try {
          // setImgUrl(data.body.data.getPublicAccountWithAvatar.avatar.imageURL);
          if (data.body?.errors?.length > 0) {
            console.log('has errors')
            setError({ message: 'Top shot account does not exist' })
          } else {
            bindAccount()
          }
        } catch (error) {
          // navigate('/link');
          console.log('error', error)
        }
      })
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }

  const refreshMoments = async () => {
    if (user === null) return false
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
    Toast.fire({
      icon: 'info',
      title: 'Refreshing moments. It might take a while.'
    })
    const url = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_MAINNET_API : process.env.REACT_APP_TESTNET_API
    const options = {
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json', Authorization: `${user.attributes.sessionToken}` },
      data: {
        requestType: 'scrape',
        owner: user.attributes.username
      }
    }

    axios
      .request(options)
      .then((data) => {
        try {
          console.log(data)
          Toast.fire({
            icon: 'success',
            title: 'Moments updated successfully.'
          })
        } catch (error) {
          // navigate('/link');
          Toast.fire({
            icon: 'error',
            title: 'Encountered problem in refreshing moments. Please try again later.'
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const bindAccount = async () => {
    if (user === null) return false
    if (user) {
      user.set('username', username)
      user.set('requestType', 'linkAccount')
      user.save().then(
        (result) => {
          // console.log('saved', result);
          MySwal.fire({
            title: 'Success!',
            text: 'Account has been successfully linked',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-swal'
            }
          }).then(() => {
            navigate('/')
            refreshMoments()
          })
        },
        (error) => {
          // console.log('error', JSON.stringify(error));
          setError(error)
        }
      )
    }
  }
  return (
    <>
    <div className='container-fluid'>
    <div
        className='d-flex align-content-center'
        data-bss-parallax-bg='true'
        id='intro-section'
        style={{ backgroundImage: 'url(' + 'assets/img/bg1.jpg' + ')' }}
      >
      <div className="pb-5"></div>
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
                Using a crowd sourced prize pool, In The Game provides members with a chance to win thousands of dollars
                worth of prizes each day by predicting the outcome of various sports results. In The Game also provides
                exclusive access to daily Top Shot challenges, rewarding collectors with cash, NFTs and high-end Top
                Shot moments.
              </p>
            </div>
              <div className='col-lg-4 offset-lg-2 wow fadeIn' data-wow-delay='.5s'>
                <div className='box-login'>
                  <h3 className='mb10'>Link Top Shot</h3>
                  <p>Link your Top Shot Account to access exclusive features and rewards.</p>
                  <form name='username' id='username' className='form-border' action='#'>
                    <div className='field-set'>
                      <input
                        type='text'
                        name='username'
                        id='username'
                        className='form-control'
                        placeholder='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      {hasError && (<p className='text-danger'>{hasError.message}</p>)}
                    </div>
                    <div className='field-set'>
                      <input
                        type='button'
                        id='submit'
                        className='btn btn-main btn-fullwidth color-2'
                        value='Bind Account'
                        onClick={() => {
                          getDapperUser()
                        }}
                      />
                    </div>
                    <div className='clearfix'></div>
                    <div className='spacer-single'></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BindAccount
