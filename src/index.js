import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MoralisProvider } from 'react-moralis'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_MAINNET_APP_ID
        : process.env.REACT_APP_TESTNET_APP_ID}
      serverUrl={process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_MAINNET_SERVER_URL
        : process.env.REACT_APP_TESTNET_SERVER_URL}>
        <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
