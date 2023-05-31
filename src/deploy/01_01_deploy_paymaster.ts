
import {ethers} from "hardhat";
import config from "../config/config";
import {setPaymasterWhiteList} from "./01_00_whitelist";

export const deployPaymaster = async () => {

  setPaymasterWhiteList();
  
  const SponsoringPaymaster = await ethers.getContractFactory("SponsoringPaymaster");
  const sponsoringPaymaster = await SponsoringPaymaster.deploy(config.get("ENTRYPOINT_ADDRESS"));
  await sponsoringPaymaster.deployed();
  await sponsoringPaymaster.addStake(
    config.get("PAYMASTER_UNSTAKE_DELAY_SEC"), 
    {value: ethers.utils.parseEther(config.get("PAYMASTER_STAKE")!.toString())}
  );
  await sponsoringPaymaster.deposit(
    {value: ethers.utils.parseEther(config.get("PAYMASTER_DEPOSIT")!.toString())}
  );

  let signerRoleHash = "";
  let signers: string[] = [];
  let signerRoles: string[] = [];

  if(config.get("PAYMASTER_ENABLE_SIGNATURE_VERIFICATION")) {

    await sponsoringPaymaster.setIsSigRequired(true);
    signerRoleHash = (await sponsoringPaymaster.SIGNER_ROLE()).toString();
    signers = config.get("PAYMASTER_SIGNERS")!.toString().split(',');
    signerRoles = signers.map((address) => signerRoleHash);

  }

  const whitelistHash = (await sponsoringPaymaster.WHITELISTED()).toString();
  const whitelist = config.get("PAYMASTER_WHITELIST")!.toString().split(',');
  const whiteListRoles = whitelist.map((address) => whitelistHash);

  const roles = [...signerRoles, ...whiteListRoles];
  const addresses = [...signers, ...whitelist];

  const revoke = addresses.map((address) => false);

  await sponsoringPaymaster.setBatchRoles(addresses,roles,revoke);

  config.update("PAYMASTER_ADDRESS", sponsoringPaymaster.address);
  config.updateABI("PAYMASTER", SponsoringPaymaster.interface.format("json"));

}

