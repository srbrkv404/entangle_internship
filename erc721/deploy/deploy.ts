const hre = require("hardhat");

async function main_() {
    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTMo6DFrfzKGGbkYsyMZRe16jBJcCcV72ZJHcM3a3Z2w7/";

    const Nft = await hre.ethers.getContractFactory("TestNFT");
    const nft = await Nft.deploy(tokenURI);
    await nft.waitForDeployment();

    console.log("TestNFT:", nft.address);
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});