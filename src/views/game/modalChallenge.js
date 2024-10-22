import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'

function modalChallenge ({
  onSelected,
  user,
  show,
  fetch,
  index,
  challenge,
  isMatchOver,
  handleClose,
  save,
  isAuthenticated,
  content,
  signMessage
}) {
  const { enableWeb3 } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [topShotSelected, setTopshotSelected] = useState([])
  const [nftSelected, setNftSelected] = useState(null)

  const { data: challengeMoments, fetch: fetchMoments } = useMoralisCloudFunction(
    'getUserChallengeMoments',
    { id: challenge?.id, username: user?.attributes?.username },
    [challenge, user],
    {
      autoFetch: false
    }
  )

  const { data: inTheGameNfts, fetch: getItgNfts, isLoading: isMembershipLoading } = useMoralisCloudFunction(
    'getItgNfts',
    {
      tokenAddress:
        process.env.REACT_APP_NODE_ENV === 'production'
          ? process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
          : process.env.REACT_APP_TESTNET_CONTRACT_ADDRESS,
      chain:
        process.env.REACT_APP_NODE_ENV === 'production'
          ? process.env.REACT_APP_MAINNET_NETWORK_NAME
          : process.env.REACT_APP_TESTNET_NETWORK_NAME,
      address: user?.attributes?.ethAddress
    },
    [],
    {
      autoFetch: false
    }
  )

  const refreshMoments = async () => {
    if (user === null) return false
    MySwal.fire({
      title: 'Refresh Moments',
      text: 'This might take a while, are you sure you want to refresh moments?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#FEE603',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    }).then((result) => {
      if (result.value) {
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
              fetchMoments()
              Toast.fire({
                icon: 'success',
                title: 'Moments updated successfully.'
              })
            } catch (error) {
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
    })
  }

  const pushTopShotSelected = async (nftSelected) => {
    if (Number(challenge.attributes.momentQty) <= Number(topShotSelected.length)) {
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
      return await Toast.fire({
        icon: 'warning',
        title: 'You have reached the maximum TopShot Moments you can add.'
      })
    }
    if (topShotSelected.find((nft) => nft === nftSelected)) return
    setTopshotSelected([...topShotSelected, nftSelected])
  }

  const removeTopShotSelected = async (nftSelected) => {
    setTopshotSelected(topShotSelected.filter((nft) => nft !== nftSelected))
  }

  const newTweetHandler = () => {
    let str = content[0].attributes.tweetMessageHandler

    const stringResult = ''

    const mapObj = {
      USER_RESULT: stringResult
    }
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi')
    str = str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()]
    })

    const tweetIntent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(str)
    const newWindow = window.open(tweetIntent, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const submitBetting = (index, challenge) => {
    let hasEmptySubmission = false
    if (topShotSelected.length === 0) hasEmptySubmission = true
    if (
      !hasEmptySubmission &&
      nftSelected !== null &&
      Number(challenge.attributes.momentQty) === Number(topShotSelected.length)
    ) {
      enableWeb3()
      MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to update your submission!",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        confirmButtonColor: '#FEE603',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      }).then(async (result) => {
        if (result.value) {
          const signed = await signMessage({ message: JSON.stringify(topShotSelected) })
          if (signed) {
            const challengeBody = {
              result: topShotSelected,
              user,
              challenge,
              onSelected: topShotSelected,
              nftSelected: nftSelected.token_id,
              signature: signed.signature,
              address: signed.address
            }
            await save(challengeBody, {
              onSuccess: async function () {
                MySwal.fire({
                  title: 'Submission successful!',
                  icon: 'success',
                  text: 'Share your submission with your friends on Twitter!',
                  showCloseButton: true,
                  focusConfirm: false,
                  confirmButtonText: `<i class="icon ion-social-twitter"></i> ${content?.[0]?.attributes?.tweetButton || 'Tweet'}`
                }).then((result) => {
                  if (result.value) {
                    newTweetHandler()
                  }
                })
                fetch()
              },
              onError: function (error) {
                MySwal.fire({
                  title: 'Error!',
                  text: error.message,
                  icon: 'warning',
                  customClass: {
                    confirmButton: 'btn btn-primary'
                  }
                })
              }
            })
          }
        }
      })
    } else {
      MySwal.fire({
        title: 'Notice!',
        text: 'Make sure to put your selection and membership!',
        icon: 'warning',
        confirmButtonColor: '#FEE603',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      })
    }
  }

  useEffect(() => {
    if (!isAuthenticated && !show) return null
    const getSubmissions = async () => {
      await fetch()
      await getItgNfts()
      await fetchMoments()
    }
    getSubmissions()
    return () => {
      setTopshotSelected([])
      setNftSelected(null)
    }
  }, [isAuthenticated])

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false} fullscreen={true} centered>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Modal.Body style={{ backgroundColor: '#20212d', color: 'white' }}>
          <div className='container pb-4 pt-4'>
            <div className='align-items-center row'>
              <div className='col'>
                <hr className='border-secondary mb-0 mt-0' />
              </div>
              <div className='col-auto'>
                <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>
                  Enter Challenge
                </h2>
              </div>
              <div className='col'>
                <hr className='border-secondary mb-0 mt-0' />
              </div>
            </div>
            <div className='col-md-12'>
              <h4 className='h4 lh-base p-5 text-center text-light' style={{ color: '#fee600' }}>Pick Your Membership</h4>
            </div>
              {isMembershipLoading
                ? (
                  <>
                    {/* {create a bootstrap center spinner} */}
                    <div className='d-flex justify-content-center mb-5'>
                      <div className='spinner-border text-light' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    </div>
                  </>
                  )
                : (
                  <div className='col-md-12'>
              <div className='row'>
                {inTheGameNfts?.map((nft, index) => {
                  return (
                    <div key={index} className='col-lg-2 col-md-4 ntf_mem' onClick={() => setNftSelected(nft)}>
                      <p className='nft__item'>{'#' + nft.token_id + ' Membership'}</p>
                    </div>
                  )
                })}
              </div>
              <div className="col-lg-12 membership-selected"><h5 className='h5 lh-base p-5 text-center'>{nftSelected !== null ? 'Membership selected: #' + nftSelected?.token_id : ''}</h5></div>
            </div>
                  )}
            <div className='col-lg-12 text-center pb-4'>
              <Button
                variant='btn btn-light'
                onClick={() => !isMatchOver && submitBetting(index, challenge)}
                disabled={isMatchOver}
              >
                Submit
              </Button>
            </div>
            <div className='col-md-12'>
              <div className='row'>
                {topShotSelected.map((nft, index) => (
                  <div key={index} className='col-lg-2 col-md-4 ntf_mem' onClick={() => removeTopShotSelected(nft)}>
                    <p className='nft__item'>{nft}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='col-lg-12 text-center'>
                <h4 className='h4 lh-base p-5 text-center text-light'>Select moments below</h4>
                <Button variant='btn btn-light' onClick={() => refreshMoments()} disabled={isMatchOver}>
                  <i className='fa fa-spinner'></i> Refresh
                </Button>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='row'>
              {challengeMoments?.map((nft, index) => (
                <div key={index} className='col-lg-2 col-md-4 ntf_mem' onClick={() => pushTopShotSelected(nft)}>
                  <p className='nft__item'>{nft}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default modalChallenge
