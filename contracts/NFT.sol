//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { ERC721URIStorage } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';

interface iNFT {
    function createToken(address minter, string memory tokenURI) external returns (uint256); 
}

contract NFT is iNFT, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public contractAddress;

    constructor(address marketplaceAddress) ERC721("Partnerverse Tokens", "PNTV") {
        contractAddress = marketplaceAddress;
    }

    function createToken(address minter, string memory tokenURI) public override returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(minter, newItemId);
        _setTokenURI(newItemId, tokenURI);
        //setApprovalForAll(contractAddress, true);
        //approve(contractAddress, newItemId);

        return newItemId;
    }
}


