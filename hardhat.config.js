require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    goerli: {
      url:`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,//url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`, //https://hardhat.org/hardhat-runner/docs/guides/verifying
      accounts: ["0x" + process.env.PRIVATE_KEY],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
