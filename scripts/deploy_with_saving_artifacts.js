//from Hardhat boilerplate
// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { network } = require("hardhat");
const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  } else {
    console.warn(`Will deploy the contract to the ${network.name} network`)
  }
/*console.log("blocknumber: ", await ethers.provider.getBlockNumber());
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());*/

  console.log("Getting contract factory for BetCzar...");
  const BetCzar = await ethers.getContractFactory("BetCzar");
  console.log("Deployng...");
  const mycontract = await BetCzar.deploy();
  await mycontract.deployed();

  console.log("Deployed. BetCzar address:", mycontract.address);

  // We also save the contract's artifacts and address in the frontend directory
  console.log(
    `Saving the contract's artifacts and address in directory frontend/src/contracts/${network.name}`
  );
  saveFrontendFiles(mycontract, network.name);
}

function saveFrontendFiles(contract, subdir) {
  const fs = require("fs");
  const contractsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts",
    subdir
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ BetCzar: contract.address }, undefined, 2)
  );

  const BetCzarArtifact = artifacts.readArtifactSync("BetCzar");

  fs.writeFileSync(
    path.join(contractsDir, "BetCzar.json"),
    JSON.stringify(BetCzarArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
