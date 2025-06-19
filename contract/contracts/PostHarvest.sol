// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PostHarvest is Ownable {
    struct HarvestLog {
        uint256 totalHarvestedKg;
        uint256 spoiledKg;
        uint256 storageDays;
        string methodUsed; // e.g., "Sun drying", "Silo storage"
        string ipfsProofURI;
        uint256 timestamp;
    }

    mapping(address => HarvestLog[]) public logs;

    event HarvestLogged(address indexed farmer, uint256 total, uint256 spoiled, string method, string proof);

    function logHarvest(
        uint256 harvested,
        uint256 spoiled,
        uint256 storageDays,
        string memory methodUsed,
        string memory ipfsProofURI
    ) external {
        require(harvested > 0, "Must harvest some amount");
        require(spoiled <= harvested, "Spoilage exceeds harvest");

        logs[msg.sender].push(HarvestLog({
            totalHarvestedKg: harvested,
            spoiledKg: spoiled,
            storageDays: storageDays,
            methodUsed: methodUsed,
            ipfsProofURI: ipfsProofURI,
            timestamp: block.timestamp
        }));

        emit HarvestLogged(msg.sender, harvested, spoiled, methodUsed, ipfsProofURI);
    }

    function getLogs(address farmer) external view returns (HarvestLog[] memory) {
        return logs[farmer];
    }
}
