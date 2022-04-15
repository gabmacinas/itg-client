import React, { useState, useEffect } from 'react'
// import InfiniteScroll from 'react-infinite-scroll-component'
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
  isAuthenticated
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

  const { data: inTheGameNfts, fetch: getItgNfts } = useMoralisCloudFunction(
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
      icon: 'info',
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
              console.log(data)
              fetchMoments()
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

  const submitBetting = (index, challenge) => {
    let hasEmptySubmission = false
    console.log('on selected before submit', onSelected[index])
    if (topShotSelected.length === 0) hasEmptySubmission = true
    console.log('hasEmptySubs', hasEmptySubmission)
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
          // get the name of the topshotSelected and push it in an array
          // const topshotSelectedName = []
          // for (let i = 0; i < topShotSelected.length; i++) {
          //   topshotSelectedName.push(topShotSelected[i].title)
          // }
          const challengeBody = {
            result: topShotSelected,
            user,
            challenge,
            onSelected: topShotSelected,
            nftSelected: nftSelected.token_id
          }
          await save(challengeBody, {
            onSuccess: async function () {
              // await authenticate({ signingMessage: JSON.stringify(challengeBody) })
              MySwal.fire({
                title:
                  '<a href="https://twitter.com/InTheGameNFT?ref_src=twsrc%5Etfw" class="fa fa-twitter" data-show-count="true">Follow @InTheGameNFT</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
                icon: 'success',
                html: '<p>Your selection has been submitted!</p>',
                showCloseButton: true,
                focusConfirm: false,
                // confirmButtonColor: '#fee600',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                cancelButtonAriaLabel: 'Thumbs down',
                customClass: {
                  confirmButton: 'btn btn-primary'
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
      })
    } else {
      MySwal.fire({
        title: 'Notice!',
        text: 'Make sure to put your selection and membership!',
        icon: 'warning',
        customClass: {
          confirmButton: 'btn-swal'
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
              <div className='col-lg-12'>
                <h5 className='h5 lh-base p-5 text-center'>
                  {nftSelected !== null ? 'Membership selected: #' + nftSelected?.token_id : ''}
                </h5>
              </div>
            </div>
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
