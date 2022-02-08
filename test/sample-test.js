const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    // Accounts managament
    const [creator, minter1, minter2, buyer, fourth ] = await ethers.getSigners();


    // Deploy contracts
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.connect(creator).deploy();
    await market.deployed(); //deploy the NFTMarket contract
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.connect(creator).deploy(marketAddress);
    await nft.deployed(); //deploy the NFT contract
    const nftContractAddress = nft.address;

    // Contract interaction
    let contract_owner = await market.owner();
    let other_contract_address = await nft.contractAddress();
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    console.log('-----------------------------------------------------------');
    console.log("Deploy contracts!");
    console.log(`Market address: ${marketAddress}`);
    console.log(`Owner: ${contract_owner}`);
    console.log('-----------------');
    console.log(`NFT address: ${nftContractAddress}`);
    console.log(`NFT other address: ${other_contract_address}`);


    // Set an auction price
    const auctionPrice1 = ethers.utils.parseUnits("100", "ether");
    const auctionPrice2 = ethers.utils.parseUnits("80", "ether");
    const auctionPrice3 = ethers.utils.parseUnits("200", "ether");


    console.log('----------------------------------------------------------- MARKET-PLACE');
    // Fetch market items
    let items0 = await market.fetchMarketItems();

    items0 = await Promise.all(items0.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" a:");
    console.log('Market place items: ', items0);

    let my_items0 = await market.connect(minter1).fetchMyNotListedNFTs();

    my_items0 = await Promise.all(my_items0.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" b:");
    console.log('My fucking items: ', my_items0);

    let for_sale_items0 = await market.connect(minter1).fetchMyListedNFTs();

    for_sale_items0 = await Promise.all(for_sale_items0.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" c:");
    console.log('Items for sale: ', for_sale_items0);

   

    console.log('----------------------------------------------------------- Create item');
    await market.connect(minter1).itemCreating(nftContractAddress, "https://www.mytokenlocation.com");
    await market.connect(minter2).itemCreating(nftContractAddress, "https://www.mytokenlocation2/yeahbaby.com");
    await market.connect(minter1).itemCreating(nftContractAddress, "https://www.mytokenlocation/3corazon.com");

    console.log('----------------------------------------------------------- MARKET-PLACE');
    // Fetch market items
    let items1 = await market.fetchMarketItems();

    items1 = await Promise.all(items1.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" a:");
    console.log('Market place items: ', items1);

    let my_items1 = await market.connect(minter1).fetchMyNotListedNFTs();

    my_items1 = await Promise.all(my_items1.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" b:");
    console.log('My fucking items: ', my_items1);

    let for_sale_items1 = await market.connect(minter1).fetchMyListedNFTs();

    for_sale_items1 = await Promise.all(for_sale_items1.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" c:");
    console.log('Items for sale: ', for_sale_items1);

    console.log('----------------------------------------------------------- Approve and Sell NFT');
    await nft.connect(minter1).approve(marketAddress, 1);
    await market.connect(minter1).itemSelling(nftContractAddress, 1, auctionPrice1, {value: listingPrice} );
    await nft.connect(minter2).approve(marketAddress, 2);
    await market.connect(minter2).itemSelling(nftContractAddress, 2, auctionPrice2, {value: listingPrice} );

    console.log('----------------------------------------------------------- MARKET-PLACE');
    // Fetch market items
    let items2 = await market.fetchMarketItems();

    items2 = await Promise.all(items2.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" a:");
    console.log('Market place items: ', items2);

    let my_items2 = await market.connect(minter1).fetchMyNotListedNFTs();

    my_items2 = await Promise.all(my_items2.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" b:");
    console.log('My fucking items: ', my_items2);

    let for_sale_items2 = await market.connect(minter1).fetchMyListedNFTs();

    for_sale_items2 = await Promise.all(for_sale_items2.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" c:");
    console.log('Items for sale: ', for_sale_items2);

    console.log('----------------------------------------------------------- Buy, Approve and Sell NFT');
    await market.connect(buyer).itemBuying(nftContractAddress, 1,  {value: auctionPrice1});
    await nft.connect(buyer).approve(marketAddress, 1);
    await market.connect(buyer).itemSelling(nftContractAddress, 1, auctionPrice3, {value: listingPrice} );

    console.log('----------------------------------------------------------- MARKET-PLACE');
    // Fetch market items
    let items3 = await market.fetchMarketItems();

    items3 = await Promise.all(items3.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" a:");
    console.log('Market place items: ', items3);

    let my_items3 = await market.connect(minter1).fetchMyNotListedNFTs();

    my_items3 = await Promise.all(my_items3.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" b:");
    console.log('My fucking items: ', my_items3);

    let for_sale_items3 = await market.connect(minter1).fetchMyListedNFTs();

    for_sale_items3 = await Promise.all(for_sale_items3.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);

      let item = {
        tokenItem: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        price: i.price.toString()
      }
      return item;
    }));
    console.log(" c:");
    console.log('Items for sale: ', for_sale_items3);
    

  });
});
