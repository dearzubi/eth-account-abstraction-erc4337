
import hre from "hardhat";
import config from "../config/config.js";

export const deployPaymaster = async () => {
  
  const SponsoringPaymaster = await hre.ethers.getContractFactory("SponsoringPaymaster");
  const sponsoringPaymaster = await SponsoringPaymaster.deploy(config.get("ENTRYPOINT_ADDRESS"));
  await sponsoringPaymaster.deployed();
  await sponsoringPaymaster.addStake(
    config.get("PAYMASTER_UNSTAKE_DELAY_SEC"), 
    {value: hre.ethers.utils.parseEther(config.get("PAYMASTER_STAKE").toString())}
  );
  await sponsoringPaymaster.deposit(
    {value: hre.ethers.utils.parseEther(config.get("PAYMASTER_DEPOSIT").toString())}
  );

  let signerRoleHash = "";
  let signers = [];
  let signerRoles = [];

  if(config.get("PAYMASTER_ENABLE_SIGNATURE_VERIFICATION")) {

    await sponsoringPaymaster.setIsSigRequired(true);
    signerRoleHash = (await sponsoringPaymaster.SIGNER_ROLE()).toString();
    signers = config.get("PAYMASTER_SIGNERS").split(',');
    signerRoles = signers.map((address) => signerRoleHash);

  }

  const whitelistHash = (await sponsoringPaymaster.WHITELISTED()).toString();
  const whitelist = config.get("PAYMASTER_WHITELIST").split(',');
  const whiteListRoles = whitelist.map((address) => whitelistHash);

  const roles = [...signerRoles, ...whiteListRoles];
  const addresses = [...signers, ...whitelist];

  const revoke = addresses.map((address) => false);

  await sponsoringPaymaster.setBatchRoles(addresses,roles,revoke);

  config.update("PAYMASTER_ADDRESS", sponsoringPaymaster.address);

}

