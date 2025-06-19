// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SustainabilityTracker is Ownable {
    struct Metrics {
        uint256 co2Sequestered;
        uint256 waterSaved;
        uint256 biodiversityEfforts;
        uint256 lastUpdate;
    }

    mapping(address => Metrics) public farmerMetrics;

    event MetricsUpdated(address indexed farmer, uint256 co2, uint256 water, uint256 biodiversity);

    function updateMetrics(
        address farmer,
        uint256 co2,
        uint256 water,
        uint256 biodiversity
    ) external onlyOwner {
        Metrics storage m = farmerMetrics[farmer];
        m.co2Sequestered += co2;
        m.waterSaved += water;
        m.biodiversityEfforts += biodiversity;
        m.lastUpdate = block.timestamp;

        emit MetricsUpdated(farmer, m.co2Sequestered, m.waterSaved, m.biodiversityEfforts);
    }

    function getMetrics(address farmer) external view returns (Metrics memory) {
        return farmerMetrics[farmer];
    }
}
