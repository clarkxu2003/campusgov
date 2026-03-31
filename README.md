# CampusGov – Assignment 3 Implementation

## 1. Project Overview

CampusGov is a simplified blockchain-based governance system designed for small communities such as campus organizations. The system allows an administrator to create proposals and enables participants to vote in a transparent and verifiable manner.

This implementation represents the MVP described in Assignment 2, focusing on a one-address-one-vote mechanism while maintaining compatibility with future ERC20-based governance extensions.

---

## 2. Smart Contract Design

### 2.1 CampusGov Contract

The `CampusGov.sol` contract implements the core governance logic:

- Create proposals (admin only)
- Vote (Yes / No)
- Prevent double voting
- Close proposals
- Retrieve proposal details

#### Key Features

- Access control using `onlyOwner`
- Vote tracking via `hasVoted` mapping
- Time-based voting period
- Event logging for transparency

---

### 2.2 CGOVToken Contract

The `CGOVToken.sol` contract is a standard ERC20 token implemented using OpenZeppelin.

- Token name: Campus Governance Token
- Symbol: CGOV
- Initial supply minted to contract deployer
- Owner can mint additional tokens

This token is not directly used in the MVP voting logic but represents a future extension toward token-weighted governance.

---

## 3. Alignment with Assignment 2 White Paper

The implementation directly reflects the design proposed in Assignment 2:

- MVP uses one-address-one-vote model
- Governance logic is minimal and transparent
- ERC20 token included as a future extension layer
- Proposal lifecycle and voting flow match the system architecture described in the white paper

---

## 4. Development Environment

- Framework: Hardhat (v2)
- Language: Solidity (0.8.24)
- Testing: Mocha + Chai
- Library: OpenZeppelin Contracts

---

## 5. Installation

Install dependencies:

```bash
npm install
