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
```
## 6. Unit Testing
To execute the unit test suite, run the following command:

```bash
npx hardhat test
```
Our test suite achieves comprehensive coverage of the core logic and failure.

### 6.1 CGOVToken (Token Contract)

Tests validate standard ERC20 functionality and strict access controls:

- Validates token name, symbol, and that the initial supply (1,000,000 CGOV) is correctly assigned to the deployer.
- Verifies standard ERC20 token transfer functionality between accounts.
- Confirms via positive and negative testing that only the contract Owner can mint new tokens, successfully reverting any unauthorized minting attempts.

### 6.2 CampusGov (Governance Contract)

Tests fully cover:

- Tests the normal creation flow and includes strict negative testing to revert invalid inputs (e.g., insufficient token balance, empty description, zero duration).
- Tests "Yes" and "No" votes are recorded accurately. Verifies anti-spam mechanisms by reverting double-voting attempts from the same address, and blocks votes on non-existent proposals.
- Automatically rejects new votes after the deadline, allowing any user to trigger the closure.Includes edge-case defenses to prevent "double-closing" an already settled proposal.
