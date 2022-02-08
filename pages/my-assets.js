import { ethers } from 'ethers'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


//import Popup from "reactjs-popup";

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [nfts_sale, setNfts_sale] = useState([]);
  const [priceNFT, updatePriceNFT] = useState({ price: '' })
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNotListedNFTs()
    const data_sale = await marketContract.fetchMyListedNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let token_address_approved = await tokenContract.getApproved(i.tokenId)

      let item = {
        itemId: i.itemId.toNumber(),
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        address_approved: token_address_approved
      }
      return item
    }))

    const items_sale = await Promise.all(data_sale.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        itemId: i.itemId.toNumber(),
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))

    setNfts(items)
    setNfts_sale(items_sale)
    setLoadingState('loaded')
  }

  async function approveAddress(tokenId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);


    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)


    const transaction = await nftContract.approve(nftmarketaddress, tokenId);
    await transaction.wait();
    loadNFTs();
  }

  async function sellItem(itemId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const price = ethers.utils.parseUnits(priceNFT.price, 'ether')

    //sign the transaction
    const signer = provider.getSigner();
    let market = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await market.itemSelling(nftaddress, itemId, price, { value: listingPrice });
    await transaction.wait()
    loadNFTs();
  }




  if (loadingState === 'loaded' && !nfts.length && !nfts_sale.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned.</h1>)

  return (
    <div>
      <div className="p-4">
        {Boolean(nfts.length) && (
          <div>
            <h2 className="text-2xl py-2">NFTs Owned</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="border-2 shadow rounded-sm overflow-hidden">
                    <Image
                      src={nft.image}
                      alt="Picture of the author"
                      className="rounded"
                      width={350}
                      height={400}
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                    />
                    <div className='p-4'>
                      <p style={{ height: '32' }} className='text-2xl font-semibold'>
                        {nft.name}
                      </p>
                      <div style={{ height: '35px', overflow: 'hidden' }}>
                        <p className='text-gray-400'>{nft.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black">
                      <Popup trigger={
                        <button className="w-full h-12 px-6 text-white transition-colors duration-150 bg-pink-500 rounded-lg focus:shadow-outline hover:bg-pink-300">
                          SELLING
                        </button>
                      }
                        position="top center">

                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                          <div className="flex justify-end p-2">
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                          </div>

                          <Image
                            src={nft.image}
                            alt="Picture of the author"
                            className="rounded"
                            width={350}
                            height={400}
                          // blurDataURL="data:..." automatically provided
                          // placeholder="blur" // Optional blur-up while loading
                          />

                          <div className="p-6 pt-0 text-center">



                            {Boolean(nft.address_approved != nftmarketaddress) ?
                              <div>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Last price: {nft.price} ETH</h3>
                                <button onClick={() => approveAddress(nft.tokenId)} className="w-full h-12 px-6 text-white transition-colors duration-150 bg-pink-500 rounded-lg focus:shadow-outline hover:bg-pink-300">
                                  APPROVE
                                </button>
                              </div>
                              :
                              <div className="flex flex-col pb-12">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Last price: {nft.price} ETH</h3>
                                <input
                                  placeholder="Price in Eth"
                                  className="mt-8 border rounded p-4"
                                  type="number"
                                  onChange={e => updatePriceNFT({ price: e.target.value })}
                                />
                                <button onClick={() => sellItem(nft.itemId)} className="w-full h-12 px-6 text-white transition-colors duration-150 bg-pink-500 rounded-lg focus:shadow-outline hover:bg-pink-300">
                                  SELLING
                                </button>
                              </div>
                            }
                          </div>
                        </div>

                      </Popup>
                    </div>
                  </div>
                ))

              }
            </div>
          </div>
        )
        }
      </div>
      <div className="p-4">
        {Boolean(nfts_sale.length) && (
          <div>
            <h2 className="text-2xl py-2">NFTs For Sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                nfts_sale.map((nft, i) => (
                  <div key={i} className="border-2 shadow rounded-sm overflow-hidden">
                    <Image
                      src={nft.image}
                      alt="Picture of the author"
                      className="rounded"
                      width={200}
                      height={250}
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                    />
                    <div className='p-4'>
                      <p style={{ height: '64px' }} className='text-2xl font-semibold'>
                        {nft.name}
                      </p>
                      <div style={{ height: '70px', overflow: 'hidden' }}>
                        <p className='text-gray-400'>{nft.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black">
                      <h3 className="text-2xl font-bold text-white">Price: {nft.price} ETH</h3>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )
        }
      </div>

    </div>
  )
}