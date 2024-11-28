import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_token = require('./getContract.ts');

config();

async function mint() {
    const contract = await getContract_token();

    try {
        const [acc1, acc2] = await ethers.getSigners();

        const tokenId = 1;

        console.log(`Transfer nft ${tokenId} from ${acc1.address} to ${acc2.address}...`);

        const tx = await contract.transferFrom(acc2.address, acc1.address, tokenId);

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);

        const acc1Balance = await contract.balanceOf(acc1.address);
        const acc2Balance = await contract.balanceOf(acc2.address);

        const owner = await contract.ownerOf(tokenId);

        console.log(`Owner of nft ${tokenId}: ${owner}`);
        console.log(`Balance1: ${acc1Balance}`);
        console.log(`Balance2: ${acc2Balance}`);

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