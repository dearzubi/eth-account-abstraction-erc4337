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
  solidity: "0.8.18",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    }
  },
};

export default config;

