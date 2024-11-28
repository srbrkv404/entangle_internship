import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_token = require('./getContract.ts');

config();

async function mint() {
    const contract = await getContract_token();

    try {
        const [acc1, acc2] = await ethers.getSigners();

        const tokenId = 1;

        console.log(`Minting ${tokenId} nft to ${acc1.address}...`);

        const tx = await contract.mintNFT(acc1.address, tokenId);

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });