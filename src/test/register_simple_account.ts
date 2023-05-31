// import { Client, Presets } from "userop";
import config from "../config/config";
import { ethers } from "ethers";
import { getEntryPoint } from "../lib/entry_point";
import {getPaymaster} from "../lib/paymaster";
import {getAccountFactory, getInitCode, getAccountAddress} from "../lib/account";
import UserOp from "../lib/user_op";
import {gasFee, estimateWalletCreationGas, estimateUserOpGas} from "../utils/gas";
import { AccountTypes, IGasFee, GasEstimate} from "../types";

const main = async () => {

    const userOp = new UserOp();

    const provider = new ethers.providers.JsonRpcProvider(config.get("RPC")!.toString());
    const erc4337NodeProvider = new ethers.providers.JsonRpcProvider(config.get("BUNDLER_RPC")!.toString());
    const entryPoint = getEntryPoint(provider.getSigner());
    // const paymaster = getPaymaster(provider.getSigner());
    const simpleAccountFactory = getAccountFactory(AccountTypes.Simple, provider.getSigner());

    const initCode = getInitCode(simpleAccountFactory, (await provider.getSigner().getAddress()));

    userOp.setInitCode(initCode);

    const walletAddress = await getAccountAddress(initCode, provider);

    userOp.setSender(walletAddress);

    entryPoint.depositTo(walletAddress, {value: ethers.utils.parseEther("0.5")});

    userOp.setNonce((await entryPoint.callStatic.getNonce(walletAddress, 0)).toNumber());

    userOp.setSignature(
        (await provider.getSigner().signMessage(
                ethers.utils.arrayify(ethers.utils.keccak256("0xdead"))
        ))
    );

    const gF = await gasFee(provider) as IGasFee;

    userOp.setMaxFeePerGas(gF.maxFee);
    userOp.setMaxPriorityFeePerGas(gF.maxPriorityFee);

    userOp.incVerificationGasLimit((await estimateWalletCreationGas(provider, initCode)));

    const est = await estimateUserOpGas(erc4337NodeProvider, userOp.toJSON(), entryPoint.address) as GasEstimate;

    userOp.setVerificationGasLimit(est.verificationGas);
    userOp.setCallGasLimit(est.callGasLimit);
    userOp.setPreVerificationGas(est.preVerificationGas);

    const userOpHash = await entryPoint.callStatic.getUserOpHash(userOp.toJSON());

    userOp.setSignature(
        (await provider.getSigner().signMessage(
                ethers.utils.arrayify(userOpHash)
        ))
    );

    console.log(userOp.get());

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


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