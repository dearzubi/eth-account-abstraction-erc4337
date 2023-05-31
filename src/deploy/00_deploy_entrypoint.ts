import {ethers} from "hardhat";
import config from "../config/config";

export const deployEntryPoint = async () => {
  
  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  await entryPoint.deployed();

  config.update("ENTRYPOINT_ADDRESS", entryPoint.address);
  config.updateABI("ENTRYPOINT", EntryPoint.interface.format("json"));

}
