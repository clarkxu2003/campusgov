# CampusGov – 571G Project Implementation

## Overview

CampusGov is a simple DAO-style voting dApp built with Solidity, Hardhat, React, MetaMask, and `ethers.js`.

Current implementation:

- proposal creation is gated by CGOV token balance
- voting is one-address-one-vote
- users can vote Yes / No
- proposals can be closed after the voting period ends
- frontend supports wallet connection and governance state display

---

## Backend Setup

Install dependencies in the project root:

```bash
npm install
```

Compile contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

---

## Local Deployment

Start a local Hardhat network:

```bash
npx hardhat node
```

Keep this terminal open.

In a second terminal, deploy the contracts:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, save the two contract addresses printed in the terminal:

- `CGOVToken deployed to: 0x...`
- `CampusGov deployed to: 0x...`

You will need these addresses for the frontend.

---

## Frontend Setup

Go to the frontend folder and install dependencies:

```bash
cd frontend
npm install
npm install ethers
```

Create this folder if needed:

```bash
mkdir -p src/abi
```

Copy ABI files from the backend build output into the frontend:

```bash
cp ../artifacts/contracts/CampusGov.sol/CampusGov.json src/abi/CampusGov.json
cp ../artifacts/contracts/CGOVToken.sol/CGOVToken.json src/abi/CGOVToken.json
```

Edit:

```bash
src/config.js
```

Set the deployed contract addresses:

```javascript
export const CGOV_TOKEN_ADDRESS = "YOUR_CGOVTOKEN_ADDRESS";
export const CAMPUS_GOV_ADDRESS = "YOUR_CAMPUSGOV_ADDRESS";
```

Start the frontend:

```bash
npm run dev
```

The app usually runs at:

```bash
http://localhost:5173
```

---

## MetaMask Configuration

Add the local Hardhat network in MetaMask:

- **Network Name**: `Hardhat Localhost`
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: `ETH`

Then import a Hardhat test account from the `npx hardhat node` output.

Recommended: use a Hardhat test account for frontend display only.

---

## How to Use (IMPORTANT)

For this localhost demo, the frontend is used mainly to **display blockchain state**, while **Hardhat console is used for all write actions**.

This workflow is used because MetaMask may block localhost contract transactions during testing.

### Step 1 – Start all services

Terminal 1:

```bash
npx hardhat node
```

Terminal 2:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Terminal 3:

```bash
cd frontend
npm run dev
```

### Step 2 – Update frontend config

After deployment, update `frontend/src/config.js` with the latest contract addresses.

### Step 3 – Open the frontend

Open the frontend in the browser and click **Connect Wallet**.

The frontend should show:

- connected account
- CGOV balance
- total number of proposals
- proposal descriptions
- creator addresses
- start and end time
- yes / no votes
- current proposal status

### Step 4 – Important localhost demo note

For this localhost demo setup:

- **frontend = display only**
- **Hardhat console = create / vote / close**

Do **not** rely on the frontend buttons for create / vote / close during the localhost demo.

### Step 5 – Open Hardhat console

In a new terminal from the project root:

```bash
npx hardhat console --network localhost
```

### Step 6 – Load signers and contracts

Run these commands one line at a time:

```javascript
const [s0, s1, s2] = await ethers.getSigners()
const token = await ethers.getContractAt("CGOVToken", "YOUR_CGOVTOKEN_ADDRESS", s0)
const gov0 = await ethers.getContractAt("CampusGov", "YOUR_CAMPUSGOV_ADDRESS", s0)
const gov1 = await ethers.getContractAt("CampusGov", "YOUR_CAMPUSGOV_ADDRESS", s1)
const gov2 = await ethers.getContractAt("CampusGov", "YOUR_CAMPUSGOV_ADDRESS", s2)
```

### Step 7 – Transfer CGOV to demo accounts

Transfer some CGOV from the deployer to other accounts for testing proposal creation and voting:

```javascript
let tx = await token.transfer(s1.address, ethers.parseUnits("200", 18))
await tx.wait()

tx = await token.transfer(s2.address, ethers.parseUnits("200", 18))
await tx.wait()
```

Optional balance check:

```javascript
await token.balanceOf(s1.address)
await token.balanceOf(s2.address)
```

### Step 8 – Create a proposal in Hardhat console

Use account `s1` to create a proposal:

```javascript
tx = await gov1.createProposal("Demo proposal for frontend verification", 5)
await tx.wait()
```

Then check the proposal count:

```javascript
await gov1.proposalCount()
```

### Step 9 – Refresh the frontend

Go back to the frontend and click **Refresh Data** or wait for the automatic refresh.

The new proposal should now appear in the proposal list.

### Step 10 – Vote in Hardhat console

Example: account `s2` votes **Yes** on proposal `3`:

```javascript
tx = await gov2.vote(3, true)
await tx.wait()
```

Example: account `s0` votes **No** on proposal `3`:

```javascript
tx = await gov0.vote(3, false)
await tx.wait()
```

### Step 11 – Refresh the frontend again

After voting, refresh the frontend and verify that the vote counts are updated.

### Step 12 – Close the proposal after expiration

Once the voting period ends, close the proposal:

```javascript
tx = await gov1.closeProposal(3)
await tx.wait()
```

Refresh the frontend again and verify that the proposal status changes to **Closed**.

---

## Important Notes

- If you redeploy contracts, the contract addresses will change
- After every redeploy, update `frontend/src/config.js`
- If contract interaction fails, make sure:
  - `hardhat node` is still running
  - ABI files were copied from the latest compilation output
  - `config.js` contains the latest deployed addresses
- In this localhost demo setup:
  - **frontend = display only**
  - **Hardhat console = create / vote / close**
- This avoids MetaMask localhost transaction issues while still demonstrating the full governance workflow


## Summary

For this project localhost demo:

- **Hardhat node** runs the blockchain
- **Hardhat console** performs all write actions
- **Frontend** displays live governance state

This gives a stable and clear demo workflow for local testing and presentation.
