import hre from "hardhat";

export const deployToken = async () => {
  
  const ZZKT = await hre.ethers.getContractFactory("ZZKT");
  const zzkt = await ZZKT.deploy(10**6);

  await zzkt.deployed();

  console.log(
    "Token ZZKT deployed to:", zzkt.address
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});