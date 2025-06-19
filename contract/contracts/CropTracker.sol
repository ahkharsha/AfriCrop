// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CropTracker is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum CropStage {
        Sown,
        Growing,
        Harvested,
        Stored,
        Traded
    }

    struct CropMetadata {
        CropStage stage;
        string cropType;
        uint256 lastUpdate;
        string[] ipfsEvidenceURIs;
    }

    mapping(uint256 => CropMetadata) public cropDetails;

    event CropMinted(uint256 tokenId, address farmer, string cropType);
    event StageAdvanced(uint256 tokenId, CropStage newStage, string ipfsProof);

    constructor() ERC721("CropNFT", "CROP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintCropNFT(string memory _cropType, string memory metadataURI) external onlyRole(FARMER_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, metadataURI);

        cropDetails[newId] = CropMetadata({
            stage: CropStage.Sown,
            cropType: _cropType,
            lastUpdate: block.timestamp,
            ipfsEvidenceURIs: new string 
        });

        emit CropMinted(newId, msg.sender, _cropType);
        return newId;
    }

    function advanceStage(uint256 tokenId, string memory ipfsProof) external onlyRole(FARMER_ROLE) {
        require(ownerOf(tokenId) == msg.sender, "CropTracker: Not your crop");
        CropMetadata storage data = cropDetails[tokenId];
        require(uint8(data.stage) < uint8(CropStage.Traded), "Already final stage");

        data.stage = CropStage(uint8(data.stage) + 1);
        data.lastUpdate = block.timestamp;
        data.ipfsEvidenceURIs.push(ipfsProof);

        emit StageAdvanced(tokenId, data.stage, ipfsProof);
    }

    function getCrop(uint256 tokenId) external view returns (CropMetadata memory) {
        return cropDetails[tokenId];
    }

    function getStageName(CropStage stage) public pure returns (string memory) {
        if (stage == CropStage.Sown) return "Sown";
        if (stage == CropStage.Growing) return "Growing";
        if (stage == CropStage.Harvested) return "Harvested";
        if (stage == CropStage.Stored) return "Stored";
        return "Traded";
    }
}
