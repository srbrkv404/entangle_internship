import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const address = "0x7236E78Cc1F6B9b0739a7094f133e08c702b6BA3";
    return await ethers.getContractAt("TestNFT", address);
}

module.exports = getContract;