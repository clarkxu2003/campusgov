import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CampusGovABI from "./abi/CampusGov.json";
import CGOVTokenABI from "./abi/CGOVToken.json";
import { CAMPUS_GOV_ADDRESS, CGOV_TOKEN_ADDRESS } from "./config";

const RPC_URL = "http://127.0.0.1:8545";

export default function App() {
  const [account, setAccount] = useState("");
  const [proposalCount, setProposalCount] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [status, setStatus] = useState("Not connected");
  const [tokenBalance, setTokenBalance] = useState("0");

  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  function getReadContracts() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const gov = new ethers.Contract(
      CAMPUS_GOV_ADDRESS,
      CampusGovABI.abi,
      provider
    );

    const token = new ethers.Contract(
      CGOV_TOKEN_ADDRESS,
      CGOVTokenABI.abi,
      provider
    );

    return { provider, gov, token };
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask first.");
        return;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setStatus("Wallet connected");

      await refreshData(address);
    } catch (err) {
      console.error("connectWallet error:", err);
      setStatus(err?.reason || err?.shortMessage || "Failed to connect wallet");
    }
  }

  async function loadTokenBalance(address) {
    try {
      if (!address) {
        setTokenBalance("0");
        return;
      }

      const { token } = getReadContracts();
      const balance = await token.balanceOf(address);
      setTokenBalance(ethers.formatUnits(balance, 18));
    } catch (err) {
      console.error("loadTokenBalance error:", err);
      setTokenBalance("0");
    }
  }

  async function loadProposals() {
    try {
      const { gov } = getReadContracts();

      const count = await gov.proposalCount();
      const countNum = Number(count);
      setProposalCount(countNum);

      if (countNum === 0) {
        setProposals([]);
        return;
      }

      const temp = [];

      for (let i = 1; i <= countNum; i++) {
        const p = await gov.getProposal(i);

        temp.push({
          id: Number(p[0]),
          description: p[1],
          startTime: Number(p[2]),
          endTime: Number(p[3]),
          yesVotes: Number(p[4]),
          noVotes: Number(p[5]),
          isClosed: p[6],
          creator: p[7],
        });
      }

      temp.reverse();
      setProposals(temp);
    } catch (err) {
      console.error("loadProposals error:", err);
      setStatus("Failed to load proposals");
    }
  }

  async function refreshData(addr = account) {
    await loadProposals();
    if (addr) {
      await loadTokenBalance(addr);
    }
  }

  function formatTime(ts) {
    return new Date(ts * 1000).toLocaleString();
  }

  function isExpired(endTime) {
    return Math.floor(Date.now() / 1000) >= endTime;
  }

  useEffect(() => {
    refreshData();

    const timer = setInterval(() => {
      refreshData();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>CampusGov dApp</h1>
      <p>DAO-style voting demo on localhost</p>

      <div style={cardStyle}>
        <button onClick={connectWallet} style={primaryBtn}>
          Connect Wallet
        </button>
        <button onClick={() => refreshData()} style={{ ...secondaryBtn, marginLeft: "10px" }}>
          Refresh Data
        </button>

        <p><strong>Status:</strong> {status}</p>
        <p><strong>Account:</strong> {account || "Not connected"}</p>
        <p><strong>CGOV Balance:</strong> {tokenBalance}</p>
      </div>

      <div style={cardStyle}>
        <h2>Create Proposal</h2>
        <p style={{ color: "#666", marginTop: "-8px" }}>
          Use Hardhat console for create / vote / close. This page is for display only.
        </p>

        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <textarea
            rows="4"
            placeholder="Enter proposal description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min="1"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={inputStyle}
          />
          <button type="button" style={{ ...primaryBtn, opacity: 0.6, cursor: "not-allowed" }}>
            Create Proposal
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2>All Proposals ({proposalCount})</h2>

        {proposals.length === 0 ? (
          <p>No proposals yet.</p>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} style={proposalStyle}>
              <h3>Proposal #{proposal.id}</h3>
              <p><strong>Description:</strong> {proposal.description}</p>
              <p><strong>Creator:</strong> {proposal.creator}</p>
              <p><strong>Start:</strong> {formatTime(proposal.startTime)}</p>
              <p><strong>End:</strong> {formatTime(proposal.endTime)}</p>
              <p><strong>Yes Votes:</strong> {proposal.yesVotes}</p>
              <p><strong>No Votes:</strong> {proposal.noVotes}</p>
              <p>
                <strong>Status:</strong>{" "}
                {proposal.isClosed
                  ? "Closed"
                  : isExpired(proposal.endTime)
                  ? "Expired (can be closed)"
                  : "Active"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const proposalStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  marginTop: "16px",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
};

const btnBase = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "14px",
};

const primaryBtn = {
  ...btnBase,
  background: "#2f6fed",
  color: "white",
};

const secondaryBtn = {
  ...btnBase,
  background: "#666",
  color: "white",
};