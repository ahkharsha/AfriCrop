// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MentorshipDAO is AccessControl {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");

    struct MentorProfile {
        address mentor;
        string expertise;
        uint256 totalSessions;
        uint256 ratingSum;
        uint256 menteesHelped;
    }

    struct Relationship {
        address mentor;
        address mentee;
        uint256 sessionCount;
        bool active;
    }

    mapping(address => MentorProfile) public mentors;
    mapping(address => Relationship) public relationships;

    event MentorRegistered(address mentor, string expertise);
    event MenteeMatched(address mentee, address mentor);
    event SessionCompleted(address mentee, uint8 rating);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COORDINATOR_ROLE, msg.sender);
    }

    function registerMentor(string calldata expertise) external {
        require(mentors[msg.sender].mentor == address(0), "Already mentor");
        mentors[msg.sender] = MentorProfile(msg.sender, expertise, 0, 0, 0);
        emit MentorRegistered(msg.sender, expertise);
    }

    function matchMentee(address mentor) external {
        require(mentors[mentor].mentor != address(0), "Invalid mentor");
        require(!relationships[msg.sender].active, "Already in session");
        relationships[msg.sender] = Relationship(mentor, msg.sender, 0, true);
        emit MenteeMatched(msg.sender, mentor);
    }

    function completeSession(uint8 rating) external {
        Relationship storage rel = relationships[msg.sender];
        require(rel.active, "No active mentorship");
        require(rating <= 5, "Rating max 5");

        rel.sessionCount++;
        mentors[rel.mentor].totalSessions++;
        mentors[rel.mentor].ratingSum += rating;
        mentors[rel.mentor].menteesHelped++;

        emit SessionCompleted(msg.sender, rating);
    }

    function endMentorship() external {
        relationships[msg.sender].active = false;
    }

    function getMentorStats(address mentor) external view returns (
        string memory expertise,
        uint256 totalSessions,
        uint256 avgRating,
        uint256 mentees
    ) {
        MentorProfile memory m = mentors[mentor];
        expertise = m.expertise;
        totalSessions = m.totalSessions;
        avgRating = m.totalSessions > 0 ? m.ratingSum / m.totalSessions : 0;
        mentees = m.menteesHelped;
    }
}
