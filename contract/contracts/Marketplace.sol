// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    IERC20 public stableToken;
    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 id, address seller, address nft, uint256 tokenId, uint256 price);
    event Purchased(uint256 id, address buyer);
    event Canceled(uint256 id);

    constructor(address _stableToken) {
        stableToken = IERC20(_stableToken);
    }

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        nft.transferFrom(msg.sender, address(this), tokenId);

        listings[listingCounter] = Listing(nftContract, tokenId, msg.sender, price, true);
        emit Listed(listingCounter, msg.sender, nftContract, tokenId, price);
        listingCounter++;
    }

    function purchase(uint256 listingId) external {
        Listing storage l = listings[listingId];
        require(l.active, "Inactive listing");

        stableToken.transferFrom(msg.sender, l.seller, l.price);
        IERC721(l.nftContract).transferFrom(address(this), msg.sender, l.tokenId);

        l.active = false;
        emit Purchased(listingId, msg.sender);
    }

    function cancel(uint256 listingId) external {
        Listing storage l = listings[listingId];
        require(msg.sender == l.seller, "Not seller");
        require(l.active, "Already sold/canceled");

        IERC721(l.nftContract).transferFrom(address(this), l.seller, l.tokenId);
        l.active = false;
        emit Canceled(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
}
