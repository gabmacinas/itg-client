import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useMoralis, useMoralisCloudFunction, useNewMoralisObject, useMoralisQuery } from 'react-moralis'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Moment from 'react-moment'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

const Challenge = ({ user, isAuthenticated }) => {
  const { enableWeb3 } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [onSelected, setOnSelected] = useState([])
  const [isMatchOver, setIsMatchOver] = useState(false)
  const [nftSelected, setNftSelected] = useState(null)
  const [collectionsPerPage] = useState(30)
  const [topShotCollected, setTopshotCollected] = useState([])
  const [topShotSelected, setTopshotSelected] = useState([])
  // const [topShotCount, setTopShotCount] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const pushTopShotSelected = async (nftSelected) => {
    // check if nft is already exists in the array
    if (topShotSelected.find(nft => nft.id === nftSelected.id)) {
      return
    }
    // else push the nft to the array
    setTopshotSelected([...topShotSelected, nftSelected])
  }

  const removeTopShotSelected = async (nftSelected) => {
    // remove from top shot selected array
    setTopshotSelected(topShotSelected.filter(nft => nft.id !== nftSelected.id))
  }

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

    axios.request(options)
      .then((data) => {
        console.log('data', data)
        const responseBody = data.data.body.data.getTokensPublic
        console.log('responseBody', responseBody)
        try {
          console.log('totalCount', responseBody.totalCount)
          const totalCount = responseBody?.totalCount
          if (totalCount > 0) {
            if (topShotCollected.length >= totalCount) {
              // this.setState({ hasMore: false });
              setHasMore(false)
              return
            }
            // setTopshotCollected(currTokens => currtokeresponseBody.tokens)
            // concat topShotCollected with new data
            setTopshotCollected(currTokens => [...currTokens, ...responseBody.tokens])
            setCurrentOffset(currOffset => currOffset + collectionsPerPage)
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
              cancelButtonText: 'Ok'
            }).then((result) => {
            })
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

  const { data: inTheGameNfts, fetch: getItgNfts } = useMoralisCloudFunction('getItgNfts', {
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
  const { data: challenges, isLoading: isChallengeLoading } = useMoralisQuery(
    'Challenges',
    (item) => item.equalTo('status', 'active').ascending('matchDate'),
    []
  )
  const { data: challengeSubmissions, fetch } = useMoralisCloudFunction('getUserSubmissionsChallenge', {}, [], {
    autoFetch: false
  })
  const { save } = useNewMoralisObject('ChallengeSubmissions')

  const submitBetting = (index, challenge) => {
    let hasEmptySubmission = false
    console.log('on selected before submit', onSelected[index])
    if (topShotSelected.length === 0) hasEmptySubmission = true
    console.log('hasEmptySubs', hasEmptySubmission)
    if (!hasEmptySubmission && nftSelected !== null) {
      enableWeb3()
      MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to update your submission!",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        customClass: {
          confirmButton: 'btn btn-primary'
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
          await save(challengeBody,
            {
              onSuccess: async function () {
                // await authenticate({ signingMessage: JSON.stringify(challengeBody) })
                Swal.fire({
                  title: '<a href="https://twitter.com/InTheGameNFT?ref_src=twsrc%5Etfw" class="fa fa-twitter" data-show-count="true">Follow @InTheGameNFT</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
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
            }
          )
        }
      })
    } else {
      MySwal.fire({
        title: 'Notice!',
        text: 'Make sure to put your selection and membership!',
        icon: 'warning',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      })
    }
  }

  useEffect(() => {
    if (challenges.length > 0) {
      challenges?.map(async (challenge, index) => {
        return await challenge
          .relation('challengeMatches')
          .query()
          .ascending('createdAt')
          .ascending('matchDate')
          .find()
          .then(() => {
            const now = new Date()
            const matchDate = new Date(challenge.attributes.matchDate)
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
  }, [challenges])

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

  useEffect(() => {

    // fetch()
  }, [])

  return (
    <>
    <div className='text-white'>
      <div
        className='pt-5'
        data-bss-parallax-bg='true'
        data-pg-name='Main Section'
        style={{ backgroundImage: 'url(' + 'assets/img/bg1.jpg' + ')', marginBottom: '100px' }}
      >
      <div className='container lh-lg text-center'>
          {isChallengeLoading
            ? (
            <div className='col-lg-12'>
              <div className='text-center'>
                <img src='./img/Eclipse-1s-200px.svg' alt='' />
              </div>
            </div>
              )
            : (
            <>
              {challenges?.length > 0
                ? (<>
                  {challenges?.map((challenge, index) => {
                    return (
                      <div key={index} >
                        <div className='container pb-4 pt-4'>
                          <div className='align-items-center row'>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                            <div className='col-auto'>
                              <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>{challenge.attributes.title}</h2>
                            </div>
                            <div className='col'>
                              <hr className='border-secondary mb-0 mt-0' />
                            </div>
                          </div>
                          <div className='col-md-12'>
                            <h4 className='h4 lh-base p-5 text-center text-light'>
                              {challenge.attributes.description}
                            </h4>
                          </div>
                        </div>
                        <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>Match Starts <Moment fromNow>{challenge.attributes.matchDate}</Moment></h5>
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
                                      <div className="col-lg-12"><h5 style={{ textAlign: 'center' }}>Pick your Membership</h5></div>
                                        {inTheGameNfts?.map((nft, index) => {
                                          return (
                                            <div key={index} className='col-lg-2 col-md-4' onClick={() => setNftSelected(nft) } >
                                              <p className='nft__item'>{'#' + nft.token_id + ' Membership'}</p>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                    <div className="col-lg-12"><h5 className='h5 lh-base p-5 text-center'>{nftSelected !== null ? 'Membership selected: #' + nftSelected?.token_id : ''}</h5></div>
                                  </>
                                  )}
                          </div>
                        </div>

                          <div className='game-row row'>
                          {challenge.matches?.map((game, matchIndex) => {
                            return (
                              <div className='col-md-6' key={matchIndex}>
                                <div className='game'>
                                  <h3 className='h4'>{game.team1} vs {game.team2}</h3>
                                    <Tabs
                                      fill
                                      className='my-nav-tabs nav nav-tabs'
                                      defaultActiveKey={
                                        onSelected?.[index]?.[matchIndex]?.selection
                                          ? onSelected?.[index]?.[matchIndex]?.selection
                                          : game.option3
                                      }
                                      onClick={(event) => {
                                        console.log('clicked', event)
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
                              !isMatchOver && submitBetting(index, challenge)
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
        {isChallengeLoading
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
                  <h4 className='p-4'>Your Submissions</h4>
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
                  <th scope='col'>Status</th>
                  <th scope='col'>Date</th>
                </tr>
                <tr></tr>
              </thead>
              <tbody>
                {challengeSubmissions?.map((submission, index) => {
                  let dataResult = ''
                  let iconResult = 'fa fa-clock'
                  if (submission?.result !== '' && submission?.challenge?.winner && submission?.challenge?.status === 'closed') {
                    dataResult = '$$WIN$$'
                    iconResult = 'fa fa-trophy'
                  } else if (submission?.result !== '' && submission?.challenge?.status === 'active') {
                    dataResult = 'Pending'
                  } else {
                    dataResult = 'LOSE'
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
                      <td>{submission?.result.join()}</td>
                      <td>{submission?.challenge?.status === 'active' ? 'Open' : 'Finished'}</td>
                      <td>
                        <Moment fromNow>{submission?.createdAt}</Moment>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
            )}
          </div>
          <div className="row">
            {/* selected topshot */}
          {topShotSelected.map((nft, index) => (
                <div key={index} className='d-item col-lg-2 col-md-6 col-sm-6 col-xs-12' onClick={() => removeTopShotSelected(nft)}>
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
            <div className="container-fluid">
              <InfiniteScroll
                dataLength={topShotCollected.length}
                next={getTopShot}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                className='row'
              >
                {topShotCollected.map((nft, index) => (
                  <div key={index} className='d-item col-lg-2 col-md-6 col-sm-6 col-xs-12' onClick={() => pushTopShotSelected(nft)}>
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
          </div>
      </div>
          </>
  )
}

Challenge.propTypes = {
  user: PropTypes.object,
  content: PropTypes.array,
  isAuthenticated: PropTypes.bool
}

export default Challenge
