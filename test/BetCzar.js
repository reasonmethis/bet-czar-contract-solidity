const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("BetCzar", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployAndCreateOneBetFixture() {
      // Contracts are deployed using the first signer/account by default
      const [owner, acc1, acc2, acc3, acc4] = await ethers.getSigners();
  
      const BetCzar = await ethers.getContractFactory("BetCzar");
      const betCzar = await BetCzar.deploy();

      const res = await betCzar.createBet()
  
      return { betCzar, owner, acc1, acc2, acc3, acc4 };
    }
  
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        const { betCzar, owner, acc1, acc2, acc3, acc4 } = await loadFixture(deployAndCreateOneBetFixture);
  
        expect(await betCzar.owner()).to.equal(owner.address);
      });
  
    });
  
    describe("Deposits", function () {
      describe("Receiving funds", function () {
        it("deposit1() should accept a deposit in the right amount", async function () {

        });
      })
      describe("Validations", function () {
        it("recall1() should revert if caller is not bettor 1", async function () {
            const { betCzar, owner, acc1, acc2, acc3, acc4 } = await loadFixture(deployAndCreateOneBetFixture);
  
          await expect(betCzar.recall1()).to.be.revertedWith(
            "not bettor 1"
          );
        });
  
        it("Should revert with the right error if called from another account", async function () {
          const { lock, unlockTime, otherAccount } = await loadFixture(
            deployOneYearLockFixture
          );
  
          // We can increase the time in Hardhat Network
          await time.increaseTo(unlockTime);
  
          // We use lock.connect() to send a transaction from another account
          await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
            "You aren't the owner"
          );
        });
  
        it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
          const { lock, unlockTime } = await loadFixture(
            deployOneYearLockFixture
          );
  
          // Transactions are sent using the first signer by default
          await time.increaseTo(unlockTime);
  
          await expect(lock.withdraw()).not.to.be.reverted;
        });
      });
  
      describe("Events", function () {
        it("Should emit an event on withdrawals", async function () {
          const { lock, unlockTime, lockedAmount } = await loadFixture(
            deployOneYearLockFixture
          );
  
          await time.increaseTo(unlockTime);
  
          await expect(lock.withdraw())
            .to.emit(lock, "Withdrawal")
            .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
        });
      });
  
      describe("Transfers", function () {
        it("Should transfer the funds to the owner", async function () {
          const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
            deployOneYearLockFixture
          );
  
          await time.increaseTo(unlockTime);
  
          await expect(lock.withdraw()).to.changeEtherBalances(
            [owner, lock],
            [lockedAmount, -lockedAmount]
          );
        });
      });
    });
  });
  