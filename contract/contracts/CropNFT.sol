// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CropNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant FARM_MANAGER_ROLE = keccak256("FARM_MANAGER_ROLE");

    enum CropStage { Sowed, Growing, Harvested, Stored, Traded }

    struct CropMetadata {
        uint256 tokenId;
        CropStage stage;
        string metadataURI;
        uint256 timestamp;
    }

    Counters.Counter private _tokenIds;
    mapping(uint256 => CropMetadata) public cropInfo;

    event CropMinted(uint256 tokenId, address to, string metadataURI);
    event StageUpdated(uint256 tokenId, CropStage newStage, string newURI);

    constructor() ERC721("AfriCropNFT", "ACNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(FARM_MANAGER_ROLE, msg.sender);
    }

    function mintCrop(address to, string calldata uri) external onlyRole(FARM_MANAGER_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        cropInfo[tokenId] = CropMetadata(tokenId, CropStage.Sowed, uri, block.timestamp);
        emit CropMinted(tokenId, to, uri);

        return tokenId;
    }

    function updateCropStage(uint256 tokenId, CropStage newStage, string calldata newURI)
        external
        onlyRole(FARM_MANAGER_ROLE)
    {
        require(_exists(tokenId), "Invalid token");
        cropInfo[tokenId].stage = newStage;
        cropInfo[tokenId].metadataURI = newURI;
        cropInfo[tokenId].timestamp = block.timestamp;
        _setTokenURI(tokenId, newURI);
        emit StageUpdated(tokenId, newStage, newURI);
    }

    function getCropData(uint256 tokenId) external view returns (CropMetadata memory) {
        return cropInfo[tokenId];
    }
}
