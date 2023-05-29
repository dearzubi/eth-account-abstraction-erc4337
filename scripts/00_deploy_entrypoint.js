import hre from "hardhat";
import config from "../config/config.js";

export const deployEntryPoint = async () => {
  
  const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  await entryPoint.deployed();

  config.update("ENTRYPOINT_ADDRESS", entryPoint.address);
  config.updateABI("ENTRYPOINT", EntryPoint.interface.format("json"));

}
