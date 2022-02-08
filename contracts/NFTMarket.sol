//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { ReentrancyGuard } from '@openzeppelin/contracts/security/ReentrancyGuard.sol';

interface iNFT {
    function createToken(address minter, string memory tokenURI) external returns (uint256); 
}

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _marketItems;
    Counters.Counter private _itemsSold;

    address payable public owner;

    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool for_sale;
    }
    mapping(uint256 => MarketItem) private idMarketItems;

    event ItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool for_sale 
    );

    event ItemSelling(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool for_sale 
    );

    event ItemBuying(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool for_sale 
    );


    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint256 _price) public returns (uint256) {
        require(msg.sender == owner, "Just the owner can make this change");
        listingPrice = _price;
        return listingPrice;
    }

    function itemCreating(address nftContract, string memory tokenURI) public payable nonReentrant {
        
        uint256 tokenId = iNFT(nftContract).createToken(msg.sender, tokenURI); 

        _marketItems.increment();
        uint256 itemId = _marketItems.current();

        idMarketItems[itemId] = MarketItem(
            itemId,
            nftContract, 
            tokenId,
            payable(address(0)),
            payable(msg.sender),
            0,
            false 
            );

        emit ItemCreated(itemId, nftContract, tokenId, address(0), msg.sender, 0, false);
    }

    function itemSelling(address nftContract, uint256 itemId, uint256 price) public payable nonReentrant {
        require(address(this) == IERC721(nftContract).getApproved(itemId), "This contract must be approval first!");
        require(price > 0, "Price must be above zero!");
        require(msg.value == listingPrice, "You must pay the listing price!");


        idMarketItems[itemId].seller = payable(msg.sender);
        idMarketItems[itemId].owner = payable(address(0));
        idMarketItems[itemId].price = price;
        idMarketItems[itemId].for_sale = true;

        IERC721(nftContract).transferFrom(msg.sender, address(this), idMarketItems[itemId].tokenId);

        emit ItemSelling(itemId, nftContract, idMarketItems[itemId].tokenId, msg.sender, address(0), price, true);
    }

    function itemBuying(address nftContract, uint256 itemId) public payable nonReentrant {
        uint256 price = idMarketItems[itemId].price;
        uint256 tokenId = idMarketItems[itemId].tokenId;

        require(msg.value == price, "Please, submit the correct price!");

        idMarketItems[itemId].seller.transfer(msg.value);
        //(bool success, ) = idMarketItem[itemId].seller.call{value: msg.value}("");

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idMarketItems[itemId].owner = payable(msg.sender);
        idMarketItems[itemId].for_sale = false;

        _itemsSold.increment();

        owner.transfer(listingPrice);
        emit ItemBuying(itemId, nftContract, tokenId, idMarketItems[itemId].seller, msg.sender, price, false);
    }

    /// @notice Total number of items unsold on our platform+
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint totalMarketItems = _marketItems.current();

        uint itemsForSale = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalMarketItems; i++) {
            if(idMarketItems[i+1].for_sale == true) {
                itemsForSale += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemsForSale);

        for(uint i = 0; i < totalMarketItems; i++) {
            if(idMarketItems[i+1].for_sale == true) {

                uint currentItemId = idMarketItems[i+1].itemId;
                MarketItem memory currentItem = idMarketItems[currentItemId]; // Youtube use storage
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNotListedNFTs() public view returns (MarketItem[] memory) {
        uint totalMarketItems = _marketItems.current();

        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalMarketItems; i++) {
            if((idMarketItems[i+1].owner == msg.sender) && (idMarketItems[i+1].for_sale == false)) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i = 0; i < totalMarketItems; i++) {
            if((idMarketItems[i+1].owner == msg.sender) && (idMarketItems[i+1].for_sale == false)) {
                uint currentItemId = idMarketItems[i+1].itemId;
                MarketItem memory currentItem = idMarketItems[currentItemId]; // Youtube use storage
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }   

    function fetchMyListedNFTs() public view returns (MarketItem[] memory) {
        uint totalMarketItems = _marketItems.current();

        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalMarketItems; i++) {
            if((idMarketItems[i+1].seller == msg.sender) && (idMarketItems[i+1].for_sale == true)) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i = 0; i < totalMarketItems; i++) {
            if((idMarketItems[i+1].seller == msg.sender) && (idMarketItems[i+1].for_sale == true)) {
                uint currentItemId = idMarketItems[i+1].itemId;
                MarketItem memory currentItem = idMarketItems[currentItemId]; // Youtube use storage
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }  
}







