import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// import "tsconfig-paths/register";

const config: HardhatUserConfig = {
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    geth: {
      url: "http://localhost:8545",
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    }
  },
};

export default config;

