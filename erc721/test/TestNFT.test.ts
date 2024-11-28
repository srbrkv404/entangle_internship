import { loadFixture, ethers, expect } from "./setup";

const tokenURI = "/ipfs/QmTMo6DFrfzKGGbkYsyMZRe16jBJcCcV72ZJHcM3a3Z2w7";

describe("Token", function() {
    async function deploy() {
        const [acc1, acc2] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("TestNFT");
        const nft = await Factory.deploy(tokenURI);
        await nft.waitForDeployment();
        
        return { acc1, acc2, nft }
    }

    describe("Deployment", function () {

        it("Should have the correct name and symbol", async function () {
            const { acc1, nft } = await loadFixture(deploy);

            expect(await nft.name()).to.equal("srbrkv_test_nft");
            expect(await nft.symbol()).to.equal("STN");
        });
    });

    describe("ERC165", async function() {

        it("Should supports interface", async function () {
            const { acc1, nft } = await loadFixture(deploy);

            expect(await nft.supportsInterface("0x01ffc9a7")).to.equal(true);
        });
    });

    describe("Mint and burn", async function() {

        it("Should set the right owner and balance during minting", async function () {
            const { acc1, nft } = await loadFixture(deploy);

            await nft.connect(acc1).mintNFT(acc1.address, 1);

            expect(await nft.ownerOf(1)).to.equal(acc1.address);
            expect(await nft.balanceOf(acc1.address)).to.equal(1);
        });
    });

    describe("Transfer", function () {

        it("Should change owners and balances", async function () {
            const { acc1, acc2, nft } = await loadFixture(deploy);

            await nft.connect(acc1).mintNFT(acc1.address, 1);

            expect(await nft.ownerOf(1)).to.equal(acc1.address);

            await nft.transferFrom(acc1.address, acc2.address, 1);

            expect(await nft.balanceOf(acc1.address)).to.equal(0);
            expect(await nft.balanceOf(acc2.address)).to.equal(1);
        });

        it("Should have the correct name and symbol", async function () {
            const { acc1, nft } = await loadFixture(deploy);

            expect(await nft.name()).to.equal("srbrkv_test_nft");
            expect(await nft.symbol()).to.equal("STN");
        });
    });

    describe("Approve", function () {

        it("Should change token approvals", async function () {
            const { acc1, acc2, nft } = await loadFixture(deploy);

            await nft.connect(acc1).mintNFT(acc1.address, 1);
            await nft.connect(acc1).approve(acc2.address, 1);

            expect(await nft.getApproved(1)).to.equal(acc2.address);
        });

        it("Should change operator approvals", async function () {
            const { acc1, acc2, nft } = await loadFixture(deploy);

            await nft.connect(acc1).mintNFT(acc1.address, 1);
            await nft.connect(acc1).setApprovalForAll(acc2.address, true);

            expect(await nft.isApprovedForAll(acc1.address, acc2.address)).to.equal(true);
        });

    });


    describe("Requirements", function() {

        it("Should revert if zero address", async function() {
            const { acc1, nft } = await loadFixture(deploy);

            const addressZero = "0x0000000000000000000000000000000000000000";

            expect(nft.balanceOf(addressZero)).to.be.revertedWith("Zero address");
            expect(nft.mintNFT(addressZero, 1)).to.be.revertedWith("To cannot be zero");
            expect(nft.transferFrom(acc1.address, addressZero, 1)).to.be.revertedWith("To cannot be zero");
        });

        it("Should revert if tokenId does not exist", async function() {
            const { acc1, nft } = await loadFixture(deploy);

            expect(nft.ownerOf(2)).to.be.revertedWith("Not minted");
        });

        it("Should revert if sender not an owner or approved", async function() {
            const { acc1, acc2, nft } = await loadFixture(deploy);

            await nft.connect(acc1).mintNFT(acc1.address, 1);

            expect(nft.connect(acc2).transferFrom(acc1.address, acc2.address, 1)).to.be.revertedWith("Not an owner or approved");
            expect(nft.connect(acc2).safeTransferFrom(acc1.address, acc2.address, 1)).to.be.revertedWith("Not an owner or approved");
            expect(nft.connect(acc2).approve(acc2.address, 1)).to.be.revertedWith("Not an owner or approved");
            expect(nft.connect(acc1).approve(acc1.address, 1)).to.be.revertedWith("Can not approve to self");
        });

        it("Should revert if address can not receive ERC721", async function() {
            const { acc1, acc2, nft } = await loadFixture(deploy);

            const addressNotERC721Receiver = "0xffffffffffffffffffffffffffffffffffffffff";

            expect(nft.mintNFT(addressNotERC721Receiver, 1)).to.be.revertedWith("Not ERC721 receiver");
        });
    });
});