import {ethers} from "hardhat";
import config from "../config/config";

export const deploySimpleAccountFactory = async () => {
  
  const SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
  const simpleAccountFactory = await SimpleAccountFactory.deploy(config.get("ENTRYPOINT_ADDRESS"));

  await simpleAccountFactory.deployed();

  config.update("SIMPLE_ACCOUNT_FACTORY_ADDRESS", simpleAccountFactory.address);
  config.updateABI("SIMPLE_ACCOUNT_FACTORY", SimpleAccountFactory.interface.format("json"));

}
