import dotenv from "dotenv";
dotenv.config();

import {deployEntryPoint} from "./00_deploy_entrypoint.js";
import {deployPaymaster} from "./01_deploy_paymaster.js";
import {deploySimpleAccountFactory} from "./02_deploy_simple_account_factory.js";

const main = async () => {
  await deployEntryPoint()
  await deployPaymaster();
  await deploySimpleAccountFactory();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  