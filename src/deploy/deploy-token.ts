import {ethers} from "hardhat";
import config from "../config/config";

export const deployToken = async () => {
  
  const ZZKT = await ethers.getContractFactory("ZZKT");
  const zzkt = await ZZKT.deploy(10**6);

  await zzkt.deployed();

  config.update("TOKEN_ADDRESS", zzkt.address);
  config.updateABI("TOKEN", ZZKT.interface.format("json"));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});