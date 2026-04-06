# CampusGov – Assignment 3 Implementation

## 1. Project Overview

CampusGov is a simplified blockchain-based governance system designed for small communities such as campus organizations. The system allows token holders to create proposals and enables participants to vote in a transparent and verifiable manner.

This implementation represents the MVP described in Assignment 2, focusing on a one-address-one-vote mechanism while introducing an ERC20 token threshold to prevent spam proposals, aligning with the project's decentralization goals.

---

## 2. Smart Contract Design

### 2.1 CampusGov Contract

The `CampusGov.sol` contract implements the core governance logic:

- Create proposals (requires holding at least 100 CGOV tokens)
- Vote (Yes / No)
- Prevent double voting
- Close proposals (anyone can close a proposal after its time duration ends)
- Retrieve proposal details

#### Key Features

- Token-gated proposal creation
- Vote tracking via `hasVoted` mapping
- Strict time-based voting period enforcement
- Event logging for transparency

---

### 2.2 CGOVToken Contract

The `CGOVToken.sol` contract is a standard ERC20 token implemented using OpenZeppelin.

- Token name: Campus Governance Token
- Symbol: CGOV
- Initial supply minted to contract deployer
- Owner can mint additional tokens

This token is integrated into the MVP to simulate stake-based engagement. Users must hold a minimum threshold of CGOV to submit a proposal.
---

## 3. Alignment with Assignment 2 White Paper

The implementation directly reflects and improves upon the design proposed in Assignment 2:

- Removed centralized admin and introduced decentralization. Any user with sufficient CGOV balance can propose, and anyone can trigger the closure of an expired proposal.
- Uses a one-address-one-vote model for the voting logic to maintain usability for small communities(Implemented via the hasVoted mapping in CampusGov.sol).
- ERC20 token is actively used as an proposal threshold, successfully linking the token model with the governance workflow.It's enforced by the proposalThreshold variable. Users must hold at least 100 CGOV to call createProposal().
- Proposal lifecycle and voting flow match the system architecture described in the white paper.

---

## 4. Development Environment

- Framework: Hardhat (v2)
- Language: Solidity (0.8.24)
- Testing: Mocha + Chai
- Library: OpenZeppelin Contracts

---

## 5. Installation & Setup

Install dependencies:

```bash
npm install
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers
npm install @openzeppelin/contracts
