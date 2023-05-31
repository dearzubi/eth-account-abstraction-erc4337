import {deployEntryPoint} from "./00_deploy_entrypoint";
import {deployPaymaster} from "./01_01_deploy_paymaster";
import {deploySimpleAccountFactory} from "./02_deploy_simple_account_factory";

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
  