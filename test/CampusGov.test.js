const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampusGov", function () {
  let campusGov;
  let owner;
  let voter1;
  let voter2;
  let other;

  beforeEach(async function () {
    [owner, voter1, voter2, other] = await ethers.getSigners();

    const CampusGov = await ethers.getContractFactory("CampusGov");
    campusGov = await CampusGov.deploy();
    await campusGov.waitForDeployment();
  });

  it("should set the deployer as owner", async function () {
    expect(await campusGov.owner()).to.equal(owner.address);
  });

  it("should allow owner to create a proposal", async function () {
    await campusGov.createProposal("Launch Campus Vote", 10);

    expect(await campusGov.proposalCount()).to.equal(1);

    const proposal = await campusGov.getProposal(1);
    expect(proposal[0]).to.equal(1); // id
    expect(proposal[1]).to.equal("Launch Campus Vote"); // description
    expect(proposal[4]).to.equal(0); // yesVotes
    expect(proposal[5]).to.equal(0); // noVotes
    expect(proposal[6]).to.equal(false); // isClosed
    expect(proposal[7]).to.equal(owner.address); // creator
  });

  it("should not allow non-owner to create a proposal", async function () {
    await expect(
      campusGov.connect(voter1).createProposal("Unauthorized Proposal", 10)
    ).to.be.revertedWith("Only owner can perform this action");
  });

  it("should allow a user to vote yes", async function () {
    await campusGov.createProposal("Proposal A", 10);

    await campusGov.connect(voter1).vote(1, true);

    const proposal = await campusGov.getProposal(1);
    expect(proposal[4]).to.equal(1); // yesVotes
    expect(proposal[5]).to.equal(0); // noVotes
    expect(await campusGov.hasVoted(1, voter1.address)).to.equal(true);
  });

  it("should allow a user to vote no", async function () {
    await campusGov.createProposal("Proposal B", 10);

    await campusGov.connect(voter1).vote(1, false);

    const proposal = await campusGov.getProposal(1);
    expect(proposal[4]).to.equal(0); // yesVotes
    expect(proposal[5]).to.equal(1); // noVotes
    expect(await campusGov.hasVoted(1, voter1.address)).to.equal(true);
  });

  it("should not allow double voting", async function () {
    await campusGov.createProposal("Proposal C", 10);

    await campusGov.connect(voter1).vote(1, true);

    await expect(
      campusGov.connect(voter1).vote(1, false)
    ).to.be.revertedWith("You have already voted");
  });

  it("should allow multiple different users to vote", async function () {
    await campusGov.createProposal("Proposal D", 10);

    await campusGov.connect(voter1).vote(1, true);
    await campusGov.connect(voter2).vote(1, false);

    const proposal = await campusGov.getProposal(1);
    expect(proposal[4]).to.equal(1); // yesVotes
    expect(proposal[5]).to.equal(1); // noVotes
  });

  it("should allow owner to close a proposal", async function () {
    await campusGov.createProposal("Proposal E", 10);

    await campusGov.closeProposal(1);

    const proposal = await campusGov.getProposal(1);
    expect(proposal[6]).to.equal(true); // isClosed
  });

  it("should not allow non-owner to close a proposal", async function () {
    await campusGov.createProposal("Proposal F", 10);

    await expect(
      campusGov.connect(voter1).closeProposal(1)
    ).to.be.revertedWith("Only owner can perform this action");
  });

  it("should not allow voting on a closed proposal", async function () {
    await campusGov.createProposal("Proposal G", 10);
    await campusGov.closeProposal(1);

    await expect(
      campusGov.connect(voter1).vote(1, true)
    ).to.be.revertedWith("Proposal is already closed");
  });

  it("should not allow voting on a non-existent proposal", async function () {
    await expect(
      campusGov.connect(voter1).vote(999, true)
    ).to.be.revertedWith("Proposal does not exist");
  });

  it("should not allow creating a proposal with empty description", async function () {
    await expect(
      campusGov.createProposal("", 10)
    ).to.be.revertedWith("Description cannot be empty");
  });

  it("should not allow creating a proposal with zero duration", async function () {
    await expect(
      campusGov.createProposal("Bad Proposal", 0)
    ).to.be.revertedWith("Duration must be greater than zero");
  });
});