import dotenv from "dotenv";
dotenv.config();

import {deployEntryPoint} from "./00_deploy_entrypoint.js";
import {deployPaymaster} from "./01_deploy_paymaster.js";

const main = async () => {
  const entryPointAddress = await deployEntryPoint()
  await deployPaymaster(entryPointAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  