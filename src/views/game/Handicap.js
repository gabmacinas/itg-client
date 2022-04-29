import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useMoralis, useMoralisCloudFunction, useNewMoralisObject } from 'react-moralis'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Moment from 'react-moment'
import Countdown from 'react-countdown'

const Handicap = ({ user, content, signMessage, verifyMessage }) => {
  const { isAuthenticated, enableWeb3, isWeb3Enabled } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [onSelected, setOnSelected] = useState([])
  const [isMatchOver, setIsMatchOver] = useState(false)
  const [handicaps, setHandicaps] = useState()
  const [nftSelected, setNftSelected] = useState(null)
  const { data, isLoading: isHandicapLoading } = useMoralisCloudFunction('fetchHandicaps')

  const { data: inTheGameNfts, fetch: getItgNfts, isLoading: isMembershipLoading } = useMoralisCloudFunction('getItgNfts', {
    tokenAddress: process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
      : process.env.REACT_APP_TESTNET_CONTRACT_ADDRESS,
    chain: process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_MAINNET_NETWORK_NAME
      : process.env.REACT_APP_TESTNET_NETWORK_NAME,
    address: user?.attributes?.ethAddress
  }, [], {
    autoFetch: false
  })

  const newTweetHandler = (index) => {
    let str = content[0].attributes.tweetMessageHandler

    let stringResult = ''

    onSelected[index].forEach((element, index) => {
      if (index === 0) {
        stringResult += element.selection
      } else {
        stringResult += ',' + element.selection
      }
    })

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

  const { data: handicapSubmissions, fetch } = useMoralisCloudFunction('getUserSubmissions', {}, [], {
    autoFetch: false
  })
  const { save } = useNewMoralisObject('HandicapSubmissions')

  const CompletionMessage = () => <div>Match already started</div>

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <CompletionMessage />
    } else {
      return <span>{hours}:{minutes}:{seconds}</span>
    }
  }

  const submitBetting = (index, handicap) => {
    let hasEmptySubmission = false
    onSelected[index].forEach((element) => {
      if (element.selection === '') hasEmptySubmission = true
    })
    if (!hasEmptySubmission && nftSelected !== null) {
      MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to update your submission!",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        customClass: {
          confirmButton: 'btn btn-swal'
        }
      }).then(async (result) => {
        if (result.value) {
          let stringResult = ''
          onSelected[index].forEach((element, index) => {
            if (index === 0) {
              stringResult += element.selection
            } else {
              stringResult += ',' + element.selection
            }
          })
          const signed = await signMessage({ message: stringResult })
          if (signed) {
            const handicapBody = {
              user,
              result: stringResult,
              handicap: handicap.attributes.objectId,
              onSelected: onSelected[index],
              nftSelected: nftSelected.token_id,
              signature: signed.signature,
              address: signed.address
            }
            await save(handicapBody, {
              onSuccess: async function () {
                MySwal.fire({
                  title: 'Submission successful!',
                  icon: 'success',
                  text: 'Share your submission with your friends on Twitter!',
                  showCloseButton: true,
                  focusConfirm: false,
                  confirmButtonText: `<i class="icon ion-social-twitter"></i> ${content?.[0]?.attributes?.tweetButton || 'Tweet'}`,
                  customClass: {
                    confirmButton: 'btn btn-swal'
                  }
                }).then((result) => {
                  if (result.value) {
                    newTweetHandler(index)
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
                    confirmButton: 'btn btn-swal'
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
        text: 'Make sure to select all matches and membership',
        icon: 'warning',
        customClass: {
          confirmButton: 'btn btn-swal'
        }
      })
    }
  }

  useEffect(() => {
    setOnSelected([])
    setHandicaps(
      data?.map((element) => {
        const result = JSON.parse(element.handicap)
        const matches = JSON.parse(element.handicapMatches)
        const matchArray = []
        const now = new Date()
        const matchDate = new Date(result.matchDate.iso)
        const diff = matchDate.getTime() - now.getTime()
        const diffMinutes = Math.ceil(diff / (1000 * 60))
        if (diffMinutes <= 15) setIsMatchOver(true)
        matches.forEach((match) => {
          matchArray.push({ matchId: match.objectId, matchDate, selection: '' })
        })
        setOnSelected((onSelected) => [...onSelected, matchArray])
        return { attributes: result, matches }
      })
    )
  }, [data])

  useEffect(() => {
    enableWeb3()
    return () => {
      setOnSelected([])
      setIsMatchOver(false)
      setHandicaps([])
      setNftSelected(null)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return null
    const getSubmissions = async () => {
      getItgNfts()
      fetch()
    }
    getSubmissions()
  }, [isWeb3Enabled, isAuthenticated])

  return (
    <>
    <div className='text-white'>
      <div
        className='pt-5'
        data-bss-parallax-bg='true'
        data-pg-name='Main Section'
      >
      <div className='container lh-lg text-center'>
          {isHandicapLoading
            ? (
            <div className='col-lg-12'>
              <div className='text-center'>
                <img src='./img/Eclipse-1s-200px.svg' alt='' />
              </div>
            </div>
              )
            : (
            <>
              {handicaps?.length > 0
                ? (<>
                  {handicaps?.map((handicap, index) => {
                    return (
                      <div key={index} >
                        <div className='container pb-4 pt-4'>
                          <div className='align-items-center row'>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                            <div className='col-auto'>
                              <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>{handicap.attributes.title}</h2>
                            </div>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                          </div>
                          <div className='col-md-12'>
                            <h4 className='h4 lh-base p-5 text-center text-light'>
                              {handicap.attributes.description}
                            </h4>
                          </div>
                        </div>
                        <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>
                          {!isMatchOver ? 'Match starts in: ' : null} <Countdown date={handicap.attributes.matchDate.iso} renderer={renderer} />
                        </h5>
                          <div className='container text-center'>
                            <div className='accent game-row'>
                              <div className='proportions-box-square'>
                                <div className='align-items-center border-width-3 d-flex flex-column justify-content-center proportions-box-content rounded-3 shadow text-dark'></div>
                              </div>
                            </div>
                          </div>

                          <div className='row'>
                          <div className='col-lg-12'>
                              {isMatchOver
                                ? (
                                <h2>Match already started</h2>
                                  )
                                : (
                                  <>
                                  <div id='zero2' className='onStep fadeIn'>
                                    <div className='row'>
                                      <div className="col-lg-12"><h5 style={{ textAlign: 'center', color: '#fee600' }}>Pick your Membership</h5></div>
                                        {isMembershipLoading
                                          ? (
                                            <>
                                            {/* {create a bootstrap center spinner} */}
                                            <div className='d-flex justify-content-center mb-5 mt-5'>
                                              <div className='spinner-border text-light' role='status'>
                                                <span className='sr-only'>Loading...</span>
                                              </div>
                                            </div>
                                          </>
                                            )
                                          : (
                                            <>
                                            {inTheGameNfts?.map((nft, index) => {
                                              return (
                                            <div key={index} className='col-lg-2 col-md-4' onClick={() => setNftSelected(nft) } >
                                              <p className='nft__item'>{'#' + nft.token_id + ' Membership'}</p>
                                            </div>
                                              )
                                            })}
                                            </>
                                            )}
                                      </div>
                                    </div>
                                    <div className="col-lg-12 membership-selected"><h5 className='h5 lh-base p-5 text-center'>{nftSelected !== null ? 'Membership selected: #' + nftSelected?.token_id : ''}</h5></div>
                                  </>
                                  )}
                          </div>
                        </div>

                          <div className='game-row row'>
                          {handicap.matches?.map((game, matchIndex) => {
                            return (
                              <div className='col-md-6' key={matchIndex}>
                                <div className='game'>
                                  <h3 className='h4'>{game.team1} @ {game.team2}</h3>
                                    <Tabs
                                      fill
                                      className='my-nav-tabs nav nav-tabs'
                                      defaultActiveKey={
                                        onSelected?.[index]?.[matchIndex]?.selection
                                          ? onSelected?.[index]?.[matchIndex]?.selection
                                          : game.option3
                                      }
                                      onClick={(event) => {
                                        const clonedData = [...onSelected]
                                        clonedData[index][matchIndex].selection = event.target.outerText
                                        setOnSelected(clonedData)
                                      }}
                                      disabled={isMatchOver}
                                    >
                                    <Tab eventKey={game.option1} title={game.option1} disabled={isMatchOver} />
                                    {game.option3 !== ''
                                      ? (
                                      <Tab
                                        eventKey={game.option3}
                                        title={game.option3 !== '' ? game.option3 : ''}
                                        disabled={isMatchOver}
                                      />
                                        )
                                      : null}
                                    <Tab eventKey={game.option2} title={game.option2} disabled={isMatchOver} />
                                  </Tabs>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {!isMatchOver && (
                          <div className='p-4'>
                            <input
                          type='button'
                          id='submit'
                          className='btn btn-light'
                          value='Submit'
                          onClick={() => {
                            !isMatchOver && submitBetting(index, handicap)
                          }}
                          disabled={isMatchOver}
                        />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>)
                : (<>
                  <div className='col-lg-12'>
                    <div className='text-center'>
                      <h2>No Match For Today</h2>
                    </div>
                  </div>
                </>)}
            </>
              )}
        {isHandicapLoading
          ? (
          <div className='col-lg-12'>
            <div className='text-center'>
              <h2>Loading ... Please Wait</h2>
            </div>
          </div>
            )
          : (
          <>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='text-center'>
                  <h4 className='p-4' style={{ color: '#fee600' }}>Your Submissions</h4>
                  <div className='small-border'></div>
                </div>
              </div>
            </div>
            <table className='table de-table table-rank text-white'>
              <thead>
                <tr>
                  <th scope='col'><Button
                    type='button'
                    id='submit'
                    className='btn btn-light'
                    value=''
                    onClick={() => {
                      fetch()
                    }}
                  ><i className="fa fa-spinner"></i> Refresh</Button></th>
                  <th scope='col'>Result</th>
                  <th scope='col'>Membership</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Date</th>
                  <th scope='col'>Verified</th>
                </tr>
                <tr></tr>
              </thead>
              <tbody>
                {handicapSubmissions?.map((submission, index) => {
                  let dataResult = ''
                  let iconResult = 'fa fa-clock'
                  if (submission?.result !== '' && submission?.handicap?.winner && submission?.handicap?.status === 'closed') {
                    dataResult = '$$WIN$$'
                    iconResult = 'fa fa-trophy'
                  } else if (submission?.result !== '' && submission?.handicap?.status === 'active') {
                    dataResult = 'Submitted'
                  } else {
                    iconResult = 'fa fa-times'
                  }
                  return (
                    <tr key={index}>
                      <th scope='row'>
                        <div className='coll_list_pp'>
                          <img className='lazy' src='./img/author/author-6.jpg' alt='' />
                          <i className={ iconResult }></i>
                        </div>
                        { dataResult }
                      </th>
                      <td>{submission?.result}</td>
                      <td>#{submission?.membership}</td>
                      <td>{submission?.handicap?.status === 'active' ? 'Open' : 'Finished'}</td>
                      <td>
                        <Moment fromNow>{submission?.createdAt}</Moment>
                      </td>
                      <td><i className={verifyMessage({ message: submission?.result, address: submission?.address, signature: submission?.signature }) ? 'fa fa-check' : 'fa fa-times'} ></i></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
            )}
          </div>
          </div>
      </div>
          </>
  )
}

Handicap.propTypes = {
  user: PropTypes.object,
  content: PropTypes.array,
  signMessage: PropTypes.func,
  verifyMessage: PropTypes.func
}

export default Handicap
