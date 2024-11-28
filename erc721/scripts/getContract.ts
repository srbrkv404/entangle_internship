import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const contractAddress = '0x46e5D833642f046323179c71c1d099601bc55e7D';
    const MyContract = await hre.artifacts.readArtifact("TestNFT");
    const contractABI = MyContract.abi;
    const [deployer] = await ethers.getSigners();
    return await new ethers.Contract(contractAddress, contractABI, deployer);
}

module.exports = getContract;