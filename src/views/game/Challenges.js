import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useMoralisCloudFunction, useNewMoralisObject, useMoralisQuery } from 'react-moralis'
import Moment from 'react-moment'
import ModalChallenge from './modalChallenge'
import Countdown from 'react-countdown'
import { useNavigate } from 'react-router-dom'

const Challenge = ({ user, isAuthenticated, content, signMessage, verifyMessage }) => {
  const navigate = useNavigate()
  const [onSelected, setOnSelected] = useState([])
  const [isMatchOver, setIsMatchOver] = useState(false)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { data: challenges, isLoading: isChallengeLoading } = useMoralisQuery(
    'Challenges',
    (item) => item.equalTo('status', 'active').ascending('matchDate'),
    []
  )
  const { data: challengeSubmissions, fetch } = useMoralisCloudFunction('getUserSubmissionsChallenge', {}, [], {
    autoFetch: false
  })
  const { save } = useNewMoralisObject('ChallengeSubmissions')

  useEffect(() => {
    if (challenges.length > 0) {
      challenges?.map(async (challenge, index) => {
        const now = new Date()
        const matchDate = new Date(challenge.attributes.matchDate)
        const diff = matchDate.getTime() - now.getTime()
        const diffMinutes = Math.ceil(diff / (1000 * 60))
        if (diffMinutes <= 15) {
          setIsMatchOver(true)
        }
      })
    }
  }, [challenges])

  useEffect(() => {
    if (!isAuthenticated) return null
    const getSubmissions = async () => {
      const usernameUpdated = await user.get('usernameUpdated') || false
      if (!usernameUpdated) return navigate('/link')
      await fetch()
    }
    getSubmissions()
  }, [isAuthenticated])

  useEffect(() => {
    // fetch()
    return () => {
      setOnSelected([])
      setIsMatchOver(false)
      setShow(false)
    }
  }, [])

  // Random component
  const CompletionMessage = () => <div>Match already started</div>

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
    // Render a completed state
      return <CompletionMessage />
    } else {
    // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>
    }
  }

  return (
    <>
      <div>
        <div
          className='pt-5'
          data-bss-parallax-bg='true'
          data-pg-name='Main Section'
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
                  ? (
                  <>
                    {challenges?.map((challenge, index) => {
                      return (
                        <div key={index}>
                          <div className='container pb-4 pt-4'>
                            <div className='align-items-center row'>
                              <div className='col'>
                                <hr className='border-secondary mb-0 mt-0' />
                              </div>
                              <div className='col-auto'>
                                <h2 className='fw-bold h4 mb-0 text-uppercase' style={{ color: '#fee600' }}>
                                  {challenge.attributes.title}
                                </h2>
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
                          <h5 className='fw-bold h5 pb-3 pe-0 ps-0 pt-0 text-center text-light'>
                            {!isMatchOver ? 'Match starts in: ' : null} <Countdown date={challenge.attributes.matchDate} renderer={renderer} />
                          </h5>
                          <div className='container text-center'>
                            <div className='accent game-row'>
                              <div className='proportions-box-square'>
                                <div className='align-items-center d-flex flex-column justify-content-center proportions-box-content rounded-3 shadow text-dark'>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='game-row row'>
                            {challenge.matches?.map((game, matchIndex) => {
                              return (
                                <div className='col-lg-6 col-md-4' key={matchIndex}>
                                  <div className='game'>
                                    <h3 className='h4'>
                                      {game.team1} vs {game.team2}
                                    </h3>
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
                                value='Enter Challenge'
                                onClick={() => {
                                  !isMatchOver && handleShow()
                                }}
                                disabled={isMatchOver}
                              />
                              <ModalChallenge
                                show={show}
                                onSelected={onSelected}
                                user={user}
                                fetch={fetch}
                                challenge={challenge}
                                index={index}
                                isMatchOver={isMatchOver}
                                handleClose={handleClose}
                                isAuthenticated={isAuthenticated}
                                save={save}
                                content={content}
                                signMessage={signMessage}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                    )
                  : (
                  <>
                    <div className='col-lg-12'>
                      <div className='text-center'>
                        <h2>No Match For Today</h2>
                      </div>
                    </div>
                  </>
                    )}
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
                      <h4 className='p-4' style={{ color: '#fee600' }}>Your Submissions</h4>
                      <div className='small-border'></div>
                    </div>
                  </div>
                </div>
                <table className='table de-table table-rank text-white'>
                  <thead>
                    <tr>
                      <th scope='col'>
                        <Button
                          type='button'
                          id='submit'
                          className='btn btn-light'
                          value=''
                          onClick={() => {
                            fetch()
                          }}
                        >
                          <i className='fa fa-spinner'></i> Refresh
                        </Button>
                      </th>
                      <th scope='col'>Result</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Date</th>
                      <th scope='col'>Verified</th>
                    </tr>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {challengeSubmissions?.map((submission, index) => {
                      let dataResult = ''
                      let iconResult = 'fa fa-clock'
                      if (
                        submission?.result !== '' &&
                        submission?.challenge?.winner &&
                        submission?.challenge?.status === 'closed'
                      ) {
                        dataResult = '$$WIN$$'
                        iconResult = 'fa fa-trophy'
                      } else if (submission?.result !== '' && submission?.challenge?.status === 'active') {
                        dataResult = 'Submitted'
                      } else {
                        dataResult = ''
                        iconResult = 'fa fa-times'
                      }
                      return (
                        <tr key={index}>
                          <th scope='row'>
                            <div className='coll_list_pp'>
                              <img className='lazy' src='./img/author/author-6.jpg' alt='' />
                              <i className={iconResult}></i>
                            </div>
                            {dataResult}
                          </th>
                          <td>{submission?.result.join()}</td>
                          <td>{submission?.challenge?.status === 'active' ? 'Open' : 'Finished'}</td>
                          <td>
                            <Moment fromNow>{submission?.createdAt}</Moment>
                          </td>
                          <td><i className={verifyMessage({ message: JSON.stringify(submission?.result), address: submission?.address, signature: submission?.signature }) ? 'fa fa-check' : 'fa fa-times'} ></i></td>
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

Challenge.propTypes = {
  user: PropTypes.object,
  content: PropTypes.array,
  isAuthenticated: PropTypes.bool,
  signMessage: PropTypes.func,
  verifyMessage: PropTypes.func
}

export default Challenge
