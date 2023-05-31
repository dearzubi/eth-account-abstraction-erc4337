// import { Client, Presets } from "userop";
import config from "../config/config";
import { ethers } from "ethers";
import { getEntryPoint } from "../lib/entry_point";
import {getAccountFactory, getInitCode, getAccountAddress} from "../lib/account";
import UserOp from "../lib/user_op";
import { IUserOperation, AccountTypes} from "../types";

const main = async () => {

    const userOp = new UserOp();

    const provider = new ethers.providers.JsonRpcProvider(config.get("RPC")!.toString());
    // const entryPoint = getEntryPoint(provider.getSigner());
    const simpleAccountFactory = getAccountFactory(AccountTypes.Simple, provider.getSigner());

    const initCode = getInitCode(simpleAccountFactory, (await provider.getSigner().getAddress()));

    userOp.setInitCode(initCode);

    const accountAddress = await getAccountAddress(initCode, provider);

    userOp.setSender(accountAddress);


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



// userOp.nonce = (await entryPoint.getNonce(userOp.sender, 0)).toNumber();

// userOp.signature = await provider.getSigner().signMessage(
//     ethers.utils.arrayify(ethers.utils.keccak256("0xdead"))
// ),


// console.log(await eip1559GasPrice(provider))


// process.exit(0)


// console.log(
//     (await provider.getBalance(provider.getSigner().getAddress())).toString()
// )


// const simpleAccount = await Presets.Builder.SimpleAccount.init(
//     provider.getSigner(), // Any object compatible with ethers.Signer
//     config.get("RPC"),
//     config.get("BUNDLER_RPC"),
//     config.get("ENTRYPOINT_ADDRESS"),
//     config.get("ACCOUNT_FACTORY_ADDRESS")
// );


// const client = await Client.init(
//     config.get("BUNDLER_RPC"),
//     config.get("ENTRYPOINT_ADDRESS"),
// );


// const res = await client.sendUserOperation(
//     simpleAccount.execute("0x67d269191c92Caf3cD7723F116c85e6E9bf55933", 1, "0x"),
//     { onBuild: (op) => console.log("Signed UserOperation:", op) }
// );
// console.log(`UserOpHash: ${res.userOpHash}`);

// console.log("Waiting for transaction...");
// const ev = await res.wait();
// console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);


// console.log(
//     (await provider.getBalance(provider.getSigner().getAddress())).toString()
// )