import React, { useEffect, useState } from 'react'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from '@nfteyez/sol-rayz'
import { clusterApiUrl } from '@solana/web3.js'
import axios from 'axios'
import * as _ from 'lodash'
import { ProductCard } from './components/ProductCard'

const MyWallet = () => {
  const { connection } = useConnection()
  const [walletAddress, setWalletAddress] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredproducts, setFilteredproducts] = useState([])
  const wallet = useWallet()

  const getProvider = () => {
    if ('solana' in window) {
      const provider = window.solana
      if (provider.isPhantom) {
        return provider
      }
    }
  }

  const getAllNftData = async () => {
    try {
      const connect = createConnectionConfig(clusterApiUrl('mainnet-beta'))
      const provider = getProvider()
      let ownerToken = provider.publicKey
      const result = isValidSolanaAddress(ownerToken)
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        serialization: true,
      })
      return nfts
    } catch (error) {
      console.log(error)
    }
  }

  const getNftTokenData = async () => {
    try {
      let nftData = await getAllNftData()
      var data = Object.keys(nftData).map((key) => nftData[key])
      let arr = []
      let n = data.length
      for (let i = 0; i < n; i++) {
        let val = await axios.get(data[i].data.uri)
        arr.push(val?.data)
      }
      console.log(arr)
      setProducts(arr)
      // return arr
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (products?.length == 0 || !walletAddress) return
    const filteredData = _.filter(products, (element) => {
      return (
        element?.properties?.creators?.length === 2 &&
        element?.properties?.creators[0]?.address ===
          'GJLjwBv871zpPvGKxLmdWfajwRkBk6LehWgubHXR8dtc' &&
        element?.properties?.creators[1]?.address ===
          'F6xYGfaxRQ5oGcC5W6oyLBeg1boPQ4xHZnm9V7Mj58RA'
      )
    })
    setFilteredproducts(filteredData)
  }, [products, walletAddress])

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setWalletAddress(wallet.publicKey.toString())
      getNftTokenData()
    }
  }, [wallet])

  return (
    <>
      {(wallet.connected && <p>Your wallet is {walletAddress}</p>) || (
        <p>Hello! Click the button to connect</p>
      )}

      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </span>
        <div className="flex w-full justify-center mt-4">
          {wallet.connected && <WalletDisconnectButton />}
        </div>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 lg:gap-10 gap-5 mt-4">
        {filteredproducts.length > 0 &&
          filteredproducts.map((element) => <ProductCard data={element} />)}
      </div>
    </>
  )
}

export default MyWallet
