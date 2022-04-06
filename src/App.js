import React, { useState, useEffect } from 'react'
import '@sweetalert2/theme-dark/dark.css'
import './styles/App.css'
import './styles/App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './views/home/Home'
import { useMoralis, useMoralisQuery } from 'react-moralis'
import contractAbi from './contractAbi.json'
import Web3 from 'web3'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2/dist/sweetalert2'
// Pages
import Handicap from './views/game/Handicap'
import Challenges from './views/game/Challenges'
import Prediction from './views/game/Prediction'

import BindAccount from './views/utils/BindAccount'
// import Collections = from './views/utils/Collections'
import TermsAndConditions from './views/TermsAndConditions'
import Team from './views/Team'

const provider = new Web3.providers.HttpProvider(process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_MAINNET_NODE_API : process.env.REACT_APP_TESTNET_NODE_API)
const web3 = new Web3(provider)
const contractAddress = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS : process.env.REACT_APP_TESTNET_CONTRACT_ADDRESS
const nftContract = new web3.eth.Contract(contractAbi.abi, contractAddress)

function App () {
  // const { authenticate, user, isAuthenticated, isAuthenticating, logout } = useMoralis()
  const { enableWeb3, Moralis, isWeb3Enabled, isAuthenticated, authenticate, user, web3: metamaskWeb3, isAuthenticating, logout } = useMoralis()
  const MySwal = withReactContent(Swal)
  const [isMinting, setMinting] = useState(false)
  const [totalMint, setTotalMint] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [isMintPaused, setMintPaused] = useState(true)
  const [isWhitelistEnabled, setWhitelistEnabled] = useState(false)
  const [isUserWhitelisted, setUserWhitelisted] = useState(false)
  const [maxMintQty, setMaxMintQty] = useState(0)
  const [mintQty, setMintQty] = useState(1)
  const [balanceOf, setUserBalanceOf] = useState(0)
  const [mintCost, setMintCost] = useState(0)

  const { data: content, fetch: getContent } = useMoralisQuery(
    'Contents', query => query.equalTo('status', 'active'), [],
    { autoFetch: false }
  )

  const getContractInformation = async () => {
    setTotalMint(await nftContract.methods.totalSupply().call())
    setMaxSupply(await nftContract.methods.maxSupply().call())
    setMintPaused(await nftContract.methods.paused().call())
    setWhitelistEnabled(await nftContract.methods.whitelistMintEnabled().call())
    setMaxMintQty(await nftContract.methods.maxMintAmountPerTx().call())
    setMintCost(await nftContract.methods.cost().call())

    if (isAuthenticated) {
      setUserBalanceOf(await nftContract.methods.balanceOf(user.attributes.ethAddress).call())
      setUserWhitelisted(await nftContract.methods.whitelistClaimed(user.attributes.ethAddress).call())
    }
  }

  const mint = async () => {
    if (!isAuthenticated) return authenticate()
    if (mintQty > 0 && mintQty <= maxMintQty) {
      setMinting(true)
      const nonce = await web3.eth.getTransactionCount(user.attributes.ethAddress, 'latest')
      const gasPrice = await web3.eth.getGasPrice()
      const cost = Moralis.Units.FromWei(mintCost)
      console.log('nonce', nonce, 'gasPrice', gasPrice, 'cost', cost)
      console.log(user)
      const mintOptions = {
        from: user.attributes.ethAddress,
        gasPrice: gasPrice,
        nonce: nonce,
        value: Moralis.Units.ETH(mintQty * cost)
      }
      await nftContract.methods
        .mint(mintQty)
        .estimateGas(mintOptions)
        .then(async (gasLimit) => {
          console.log('gasLimit', gasLimit)
          const mmkWeb3 = new Web3(metamaskWeb3.provider)
          const metamaskContract = new mmkWeb3.eth.Contract(contractAbi.abi, contractAddress)
          await metamaskContract.methods
            .mint(mintQty)
            .send({
              from: user.attributes.ethAddress,
              gasPrice: gasPrice,
              nonce: nonce,
              value: Moralis.Units.ETH(mintQty * cost),
              gas: gasLimit
            })
            .then(async (receipt) => {
              // console.log('receipt', receipt);
              setMinting(false)
              setTotalMint(Number(totalMint) + Number(mintQty))
              MySwal.fire({
                title: 'Thank You!',
                html: `
                <p>You have successfully purchased <b>${mintQty}</b> membership${mintQty > 1 ? 's' : ''}. 
                <a href='https://${process.env.REACT_APP_NODE_ENV === 'development' && process.env.REACT_APP_TESTNET_NETWORK_NAME + '.'}etherscan.io/tx/${
                  receipt.transactionHash
                }' target="_blank">Click here to view your transaction in Etherscan</a>
                </p>
                `,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'btn btn-swal'
                }
              })
              await getContractInformation()
            })
            .catch((error) => {
              console.log('error', error)
              setMinting(false)
              MySwal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'btn btn-swal'
                }
              })
            })
          // console.log(response);
        })
        .catch((err) => {
          MySwal.fire({
            title: 'Metamask Error',
            text: err.message,
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-swal'
            }
          })
        })
      setMinting(false)
    } else {
      MySwal.fire({
        title: 'Error',
        text: 'Please enter a valid quantity',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-swal'
        }
      })
    }
  }

  useEffect(() => {
    enableWeb3()
    return () => {
      setMinting(false)
      setTotalMint(0)
      setMaxSupply(0)
      setMintPaused(true)
      setWhitelistEnabled(false)
      setUserWhitelisted(false)
      setMaxMintQty(0)
      setMintQty(1)
      setUserBalanceOf(1)
    }
  }, [])

  useEffect(() => {
    getContent()

    if (isAuthenticated && isWeb3Enabled) {
      getContractInformation()
    }
  }, [isWeb3Enabled, isAuthenticated])

  return (
    <BrowserRouter>
      <Navbar
        authenticate={authenticate}
        user={user}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        logout={logout}
        content={content}
        balanceOf={Number(balanceOf)}
      />
        <Routes>
          <Route path='/' element={<Home
            isMinting={isMinting}
            mint={mint}
            totalMint={Number(totalMint)}
            maxSupply={Number(maxSupply)}
            isMintPaused={isMintPaused}
            isWhitelistEnabled={isWhitelistEnabled}
            isUserWhitelisted={isUserWhitelisted}
            setMintQty={setMintQty}
            mintQty={Number(mintQty)}
            maxMintQty={Number(maxMintQty)}
            balanceOf={Number(balanceOf)}
            isAuthenticated={isAuthenticated}
          />} />
          <Route path='/handicap' element={<Handicap user={user} content={content} />} />
          <Route path='/challenges' element={<Challenges user={user} isAuthenticated={isAuthenticated} content={content} />} />
          <Route path='/prediction' element={<Prediction user={user} content={content} />} />

          {/* <Route path='/collections' element={<Collections isAuthenticated={isAuthenticated} />} /> */}
          <Route path='/link' element={<BindAccount isAuthenticated={isAuthenticated} />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/team' element={<Team />} />
          <Route path="*" element={<Home />} />
        </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
