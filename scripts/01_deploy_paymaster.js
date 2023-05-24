
import hre from "hardhat";

export const deployPaymaster = async (entryPointAddress) => {
  
  const SponsoringPaymaster = await hre.ethers.getContractFactory("SponsoringPaymaster");
  const sponsoringPaymaster = await SponsoringPaymaster.deploy(entryPointAddress);
  await sponsoringPaymaster.deployed();
  await sponsoringPaymaster.addStake(5, {value: hre.ethers.utils.parseEther(process.env.PAYMASTER_STAKE)})
  await sponsoringPaymaster.deposit({value: hre.ethers.utils.parseEther(process.env.PAYMASTER_DEPOSIT)})

  console.log(
    "SponsoringPaymaster deployed to:", sponsoringPaymaster.address
  );

  return sponsoringPaymaster.address;

}

