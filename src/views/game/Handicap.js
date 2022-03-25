import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useMoralis, useMoralisCloudFunction, useNewMoralisObject } from 'react-moralis'
import Swal from 'sweetalert2/dist/sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Moment from 'react-moment'

const Handicap = ({ user }) => {
  const { isAuthenticated, enableWeb3, isWeb3Enabled } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [onSelected, setOnSelected] = useState([])
  const [isMatchOver, setIsMatchOver] = useState(false)
  const [handicaps, setHandicaps] = useState()
  const { data, isLoading: isHandicapLoading } = useMoralisCloudFunction('fetchHandicaps')
  const [nftSelected, setNftSelected] = useState(null)
  // const [inTheGameNfts, setInTheGameNfts] = useState([])

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

  const { data: handicapSubmissions, fetch } = useMoralisCloudFunction('getUserSubmissions', {}, [], {
    autoFetch: false
  })
  const { save } = useNewMoralisObject('HandicapSubmissions')

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
        confirmButtonColor: '#fee600',
        confirmButtonText: 'Yes, submit it!'
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
          console.log('token_id:', nftSelected.token_id)
          const handicapBody = {
            user,
            result: stringResult,
            handicap: handicap.attributes.objectId,
            onSelected: onSelected[index],
            nftSelected: nftSelected.token_id
          }
          await save(handicapBody, {
            onSuccess: async function () {
              // await authenticate({ signingMessage: JSON.stringify(handicapBody) })
              MySwal.fire({
                title:
                  '<a href="https://twitter.com/InTheGameNFT?ref_src=twsrc%5Etfw" class="fa fa-twitter" data-show-count="true">Follow @InTheGameNFT</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
                icon: 'success',
                html: '<p>Your selection has been submitted!</p>',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonColor: '#fee600',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                cancelButtonAriaLabel: 'Thumbs down'
              })
            },
            onError: function (error) {
              MySwal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'warning'
              })
            }
          })
        }
      })
    } else {
      MySwal.fire({
        title: 'Notice!',
        text: 'Make sure to select all matches and membership',
        icon: 'warning',
        confirmButtonColor: '#fee600'
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
        console.log('matchDateElement', result.matchDate.iso)
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
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return null
    const getSubmissions = async () => {
      fetch()
      getItgNfts()
    }
    getSubmissions()
    console.log('handicapSubmissions', handicapSubmissions)
  }, [isWeb3Enabled, isAuthenticated])

  useEffect(() => {
    console.log('onSelected', onSelected)
  }, [onSelected])

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
                        <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>Match Starts <Moment fromNow>{handicap.attributes.matchDate.iso}</Moment></h5>
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
                          {handicap.matches?.map((game, matchIndex) => {
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
                  <th scope='col'>Membership</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Date</th>
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
                      <td>{submission?.result}</td>
                      <td>#{submission?.membership}</td>
                      <td>{submission?.handicap?.status === 'active' ? 'Open' : 'Finished'}</td>
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
          </div>
      </div>
          </>
  )
}

Handicap.propTypes = {
  user: PropTypes.object,
  content: PropTypes.array
}

export default Handicap
