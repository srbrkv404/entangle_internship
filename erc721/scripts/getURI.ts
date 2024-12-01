import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_token = require('./getContract.ts');

config();

async function getURI() {
    const contract = await getContract_token();

    try {
        const [acc1, acc2] = await ethers.getSigners();

        const tx = await contract.tokenURI(1);

        console.log(`Transaction finished: ${tx}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

getURI()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });