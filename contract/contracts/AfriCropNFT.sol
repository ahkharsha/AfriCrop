// contracts/src/AfriCropNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AfriCropNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    struct FarmerReputation {
        uint256 sustainabilityScore;
        uint256 knowledgeShared;
        uint256 cropsGrown;
        uint256 carbonCredits;
    }
    
    mapping(uint256 => FarmerReputation) public farmerReputations;
    mapping(address => uint256) public farmerTokenIds;
    
    constructor() ERC721("AfriCrop Reputation", "CROPREP") {}
    
    function mintFarmerNFT(
        address _farmer,
        uint256 _sustainabilityScore,
        uint256 _knowledgeShared,
        uint256 _cropsGrown,
        uint256 _carbonCredits
    ) external onlyOwner {
        require(farmerTokenIds[_farmer] == 0, "Farmer already has NFT");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(_farmer, tokenId);
        farmerTokenIds[_farmer] = tokenId;
        
        farmerReputations[tokenId] = FarmerReputation({
            sustainabilityScore: _sustainabilityScore,
            knowledgeShared: _knowledgeShared,
            cropsGrown: _cropsGrown,
            carbonCredits: _carbonCredits
        });
    }
    
    function updateReputation(
        address _farmer,
        uint256 _sustainabilityScore,
        uint256 _knowledgeShared,
        uint256 _cropsGrown,
        uint256 _carbonCredits
    ) external onlyOwner {
        uint256 tokenId = farmerTokenIds[_farmer];
        require(tokenId != 0, "Farmer has no NFT");
        
        farmerReputations[tokenId] = FarmerReputation({
            sustainabilityScore: _sustainabilityScore,
            knowledgeShared: _knowledgeShared,
            cropsGrown: _cropsGrown,
            carbonCredits: _carbonCredits
        });
    }
    
    function getReputation(address _farmer) external view returns (FarmerReputation memory) {
        uint256 tokenId = farmerTokenIds[_farmer];
        require(tokenId != 0, "Farmer has no NFT");
        return farmerReputations[tokenId];
    }
}