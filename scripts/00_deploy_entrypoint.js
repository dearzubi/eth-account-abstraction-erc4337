import hre from "hardhat";

export const deployEntryPoint = async () => {
  
  const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  await entryPoint.deployed();

  console.log(
    "EntryPoint deployed to:", entryPoint.address
  );

  return entryPoint.address;

}
