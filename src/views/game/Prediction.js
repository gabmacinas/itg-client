import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useMoralis, useMoralisCloudFunction, useNewMoralisObject, useMoralisQuery } from 'react-moralis'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Moment from 'react-moment'
import Countdown from 'react-countdown'

const Prediction = ({ user, content, signMessage, verifyMessage }) => {
  const { enableWeb3, isAuthenticated, isWeb3Enabled } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [onSelected, setOnSelected] = useState([])
  const [isMatchOver, setIsMatchOver] = useState(false)
  const [nftSelected, setNftSelected] = useState(null)

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
  const { data: predictions, isLoading: isPredictionLoading } = useMoralisQuery(
    'Predictions',
    (item) => item.equalTo('status', 'active').ascending('matchDate'),
    []
  )
  const { data: predictionSubmissions, fetch } = useMoralisCloudFunction('getUserSubmissionsPrediction', {}, [], {
    autoFetch: false
  })
  const { save } = useNewMoralisObject('PredictionSubmissions')

  const CompletionMessage = () => <div>Match already started</div>

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <CompletionMessage />
    } else {
      return <span>{hours}:{minutes}:{seconds}</span>
    }
  }

  const newTweetHandler = () => {
    let str = content[0].attributes.tweetMessageHandler

    const mapObj = {
      USER_RESULT: onSelected[0]
    }
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi')
    str = str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()]
    })

    const tweetIntent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(str)
    const newWindow = window.open(tweetIntent, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const submitBetting = (index, prediction) => {
    let hasEmptySubmission = false

    if (onSelected[index].selection === '') hasEmptySubmission = true

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
          const signed = await signMessage({ message: onSelected[index].selection })
          if (signed) {
            const predictionBody = {
              result: onSelected[index].selection,
              user,
              prediction,
              onSelected: onSelected[index],
              nftSelected: nftSelected.token_id,
              signature: signed.signature,
              address: signed.address
            }
            await save(predictionBody,
              {
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
                      confirmButton: 'btn btn-swal'
                    }
                  })
                }
              }
            )
          }
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
    if (predictions.length > 0) {
      predictions?.map(async (prediction, index) => {
        return await prediction
          .relation('predictionMatches')
          .query()
          .ascending('createdAt')
          .ascending('matchDate')
          .find()
          .then(() => {
            const now = new Date()
            const matchDate = new Date(prediction.attributes.matchDate)
            const diff = matchDate.getTime() - now.getTime()
            const diffMinutes = Math.ceil(diff / (1000 * 60))
            if (diffMinutes <= 15) {
              setIsMatchOver(true)
            }
            setOnSelected((onSelected) => [
              ...onSelected,
              { selection: '' }
            ])
          })
      })
    }
  }, [predictions])

  useEffect(() => {
    if (!isAuthenticated) return null
    const getSubmissions = async () => {
      await fetch()
      await getItgNfts()
    }
    getSubmissions()
  }, [isWeb3Enabled, isAuthenticated])

  useEffect(() => {
    enableWeb3()
    return () => {
      setOnSelected([])
      setIsMatchOver(false)
      setNftSelected(null)
    }
  }, [])

  return (
    <>
    <div className='text-white'>
      <div
        className='pt-5'
        data-bss-parallax-bg='true'
        data-pg-name='Main Section'
      >
      <div className='container lh-lg text-center'>
          {isPredictionLoading
            ? (
            <div className='col-lg-12'>
              <div className='text-center'>
                <img src='./img/Eclipse-1s-200px.svg' alt='' />
              </div>
            </div>
              )
            : (
            <>
              {predictions?.length > 0
                ? (<>
                  {predictions?.map((prediction, index) => {
                    return (
                      <div key={index} >
                        <div className='container pb-4 pt-4'>
                          <div className='align-items-center row'>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                            <div className='col-auto'>
                              <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>{prediction.attributes.title}</h2>
                            </div>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                          </div>
                          <div className='col-md-12'>
                            <h4 className='h4 lh-base p-5 text-center text-light'>
                              {prediction.attributes.description}
                            </h4>
                          </div>
                        </div>
                        <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>
                          {!isMatchOver ? 'Match starts in: ' : null} <Countdown date={prediction.attributes.matchDate} renderer={renderer} />
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
                              {!isMatchOver && (
                                  <>
                                  <div id='zero2' className='onStep fadeIn'>
                                    <div className='row'>
                                      <div className="col-lg-12 h-accent"><h4>Pick your Membership</h4></div>
                                      {isMembershipLoading
                                        ? (
                                          <div className='d-flex justify-content-center mb-5'>
                                            <div className='spinner-border text-light' role='status'>
                                              <span className='sr-only'>Loading...</span>
                                            </div>
                                          </div>
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
                                    <h4 className='h-accent text-center'>Enter Your Result</h4>
                                  </>
                              )}
                          </div>
                        </div>

                          <div className='game-row row'>
                          {prediction.matches?.map((game, matchIndex) => {
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
                          <div className='p-4 enter-result mb-2'>
                          <input
                              className='form-control pb-2'
                              id='txtEnterResult'
                              name='txtEnterResult'
                              placeholder='Enter your result'
                              type='text'
                              value={onSelected[index]?.selection || ''}
                              onChange={(event) => {
                                if (event.target.value.length > 5) return null
                                const re = /^[0-9\b]+$/
                                if (event.target.value === '' || re.test(event.target.value)) {
                                  const clonedData = [...onSelected]
                                  clonedData[index].selection = event.target.value
                                  setOnSelected(clonedData)
                                }
                              }}
                            />
                          <input
                            type='button'
                            id='submit'
                            className='btn btn-light mt-2'
                            value='Submit'
                            onClick={() => {
                              !isMatchOver && submitBetting(index, prediction)
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
        {isPredictionLoading
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
                  <h4 className='p-4 h-accent'>Your Submissions</h4>
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
                {predictionSubmissions?.map((submission, index) => {
                  let dataResult = ''
                  let iconResult = 'fa fa-clock'
                  if (submission?.result !== '' && submission?.prediction?.winner && submission?.prediction?.status === 'closed') {
                    dataResult = '$$WIN$$'
                    iconResult = 'fa fa-trophy'
                  } else if (submission?.result !== '' && submission?.prediction?.status === 'active') {
                    dataResult = 'Pending'
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
                      <td>{submission?.prediction?.status === 'active' ? 'Open' : 'Finished'}</td>
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

Prediction.propTypes = {
  user: PropTypes.object,
  content: PropTypes.array,
  signMessage: PropTypes.func,
  verifyMessage: PropTypes.func
}

export default Prediction
