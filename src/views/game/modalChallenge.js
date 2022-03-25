import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
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
  const [hasMore, setHasMore] = useState(true)
  const [topShotCollected, setTopshotCollected] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [collectionsPerPage] = useState(30)

  const getTopShot = async () => {
    if (user === null) return false
    const topShotUsername = await user.get('username')
    const options = {
      method: 'POST',
      url: 'https://fxtj224aij.execute-api.us-east-1.amazonaws.com/api/top-shot',
      headers: { 'Content-Type': 'application/json' },
      data: {
        requestType: 'topshot',
        limit: collectionsPerPage,
        offset: currentOffset,
        owner: topShotUsername,
        sortDirection: 'DESC'
      }
    }

    axios
      .request(options)
      .then((data) => {
        console.log('data', data)
        const responseBody = data.data.body.data.getTokensPublic
        console.log('responseBody', responseBody)
        try {
          console.log('totalCount', responseBody.totalCount)
          const totalCount = responseBody?.totalCount
          if (totalCount > 0) {
            if (topShotCollected.length >= totalCount) {
              setHasMore(false)
              return
            }
            setTopshotCollected((currTokens) => [...currTokens, ...responseBody.tokens])
            setCurrentOffset((currOffset) => currOffset + collectionsPerPage)
            console.log('currOffset', currentOffset)
          } else {
            MySwal.fire({
              title: 'Oops...',
              text: 'You have not collected any TopShot yet!. Please collect some TopShot to continue.',
              icon: 'info',
              confirmButtonText: 'Go to TopShot',
              denyButtonText: 'Link TopShot Account',
              showCancelButton: true,
              showDenyButton: true,
              denyButtonColor: '#f6851a',
              cancelButtonText: 'Ok',
              customClass: {
                confirmButton: 'btn btn-swal'
              }
            }).then((result) => {})
          }
        } catch (error) {
          // navigate('/link')
          console.log('error', error)
        }
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

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
    if (topShotSelected.find((nft) => nft.id === nftSelected.id)) return
    setTopshotSelected([...topShotSelected, nftSelected])
  }

  const removeTopShotSelected = async (nftSelected) => {
    setTopshotSelected(topShotSelected.filter((nft) => nft.id !== nftSelected.id))
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
          confirmButton: 'btn btn-swal'
        }
      }).then(async (result) => {
        if (result.value) {
          // get the name of the topshotSelected and push it in an array
          const topshotSelectedName = []
          for (let i = 0; i < topShotSelected.length; i++) {
            topshotSelectedName.push(topShotSelected[i].title)
          }
          const challengeBody = {
            result: topshotSelectedName,
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
                  confirmButton: 'btn btn-swal'
                }
              })
              fetch()
              handleClose()
            },
            onError: function (error) {
              MySwal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'warning',
                customClass: {
                  confirmButton: 'btn btn-swal'
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
          confirmButton: 'btn btn-swal'
        }
      })
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return null
    const getSubmissions = async () => {
      await fetch()
      await getItgNfts()
      await getTopShot()
    }
    getSubmissions()
    // console.log('challengeSubmissions', challengeSubmissions)
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
              <h4 className='h4 lh-base p-5 text-center text-light'>Pick Membership</h4>
            </div>
            <div className='col-md-12'>
              <div className='row'>
                {inTheGameNfts?.map((nft, index) => {
                  return (
                    <div key={index} className='col-lg-2 col-md-4' onClick={() => setNftSelected(nft)}>
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
            <div className='col-lg-12 text-center'>
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
                  <div
                    key={index}
                    className='d-item col-lg-2 col-md-6 col-sm-6 col-xs-12'
                    onClick={() => removeTopShotSelected(nft)}
                  >
                    <div className='nft__item'>
                      <div className='nft__item_info'>
                        <span>
                          <h4>{nft.title}</h4>
                        </span>
                        <div className='nft__item_price pb-3'>{nft.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='col-md-12'>
              <h4 className='h4 lh-base p-5 text-center text-light'>Select moments below</h4>
            </div>
          </div>
          <div id='scrollableDiv' className='container-fluid' >
            <InfiniteScroll
              dataLength={topShotCollected.length}
              next={getTopShot}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              height={600}
              className='row'
              scrollableTarget='scrollableDiv'
            >
              {topShotCollected.map((nft, index) => (
                <div
                  key={index}
                  className='d-item col-lg-2 col-md-6 col-sm-6 col-xs-12'
                  onClick={() => pushTopShotSelected(nft)}
                >
                  <div className='nft__item'>
                    <div className='nft__item_info'>
                      <span>
                        <h4>{nft.title}</h4>
                      </span>
                      <div className='nft__item_price pb-3'>{nft.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default modalChallenge
