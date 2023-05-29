import hre from "hardhat";
import config from "../config/config.js";

export const deploySimpleAccountFactory = async () => {
  
  const SimpleAccountFactory = await hre.ethers.getContractFactory("SimpleAccountFactory");
  const simpleAccountFactory = await SimpleAccountFactory.deploy(config.get("ENTRYPOINT_ADDRESS"));

  await simpleAccountFactory.deployed();

  config.update("ACCOUNT_FACTORY_ADDRESS", simpleAccountFactory.address);
  config.updateABI("ACCOUNT_FACTORY", SimpleAccountFactory.interface.format("json"));

}
