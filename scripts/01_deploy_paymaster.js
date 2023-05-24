
import hre from "hardhat";

export const deployPaymaster = async (entryPointAddress) => {
  
  const SponsoringPaymaster = await hre.ethers.getContractFactory("SponsoringPaymaster");
  const sponsoringPaymaster = await SponsoringPaymaster.deploy(entryPointAddress);
  await sponsoringPaymaster.deployed();
  await sponsoringPaymaster.addStake(
    parseInt(process.env.PAYMASTER_UNSTAKE_DELAY_SEC), 
    {value: hre.ethers.utils.parseEther(process.env.PAYMASTER_STAKE)}
  );
  await sponsoringPaymaster.deposit(
    {value: hre.ethers.utils.parseEther(process.env.PAYMASTER_DEPOSIT)}
  );

  let signerRoleHash = "";
  let signers = [];
  let signerRoles = [];

  if(process.env.PAYMASTER_ENABLE_SIGNATURE_VERIFICATION == 'true') {

    await sponsoringPaymaster.setIsSigRequired(true);
    signerRoleHash = (await sponsoringPaymaster.SIGNER_ROLE()).toString();
    signers = process.env.PAYMASTER_SIGNERS.split(',');
    signerRoles = signers.map((address) => signerRoleHash);

  }

  const whitelistHash = (await sponsoringPaymaster.WHITELISTED()).toString();
  const whitelist = process.env.PAYMASTER_WHITELIST.split(',');
  const whiteListRoles = whitelist.map((address) => whitelistHash);

  const roles = [...signerRoles, ...whiteListRoles];
  const addresses = [...signers, ...whitelist];

  const revoke = addresses.map((address) => false);

  await sponsoringPaymaster.setBatchRoles(addresses,roles,revoke);

  console.log(
    "SponsoringPaymaster deployed to:", sponsoringPaymaster.address
  );

  return sponsoringPaymaster.address;

}

