import config from "../config/config";
import { ethers } from "ethers";
import UserOpClient from "../lib/userop_client";
import {getAccountFactory, getInitCode, getWalletAddress} from "../lib/account";
import UserOp from "../lib/user_op";
import {gasFee} from "../utils/gas";
import { AccountTypes, IGasFee, GasEstimate} from "../types";
import dotennv from "dotenv";
dotennv.config();

const main = async () => {
    
    const eoaWallet = ethers.Wallet.fromMnemonic(process.env.PHRASE!);

    const provider = new ethers.providers.JsonRpcProvider(config.get("RPC")!.toString());
    const erc4337NodeProvider = new ethers.providers.JsonRpcProvider(config.get("BUNDLER_RPC")!.toString());

    const userOp = new UserOp();
    const client = new UserOpClient(
        config.get("ENTRYPOINT_ADDRESS")!.toString(), 
        provider, 
        erc4337NodeProvider
    );    

    const simpleAccountFactory = getAccountFactory(AccountTypes.Simple, provider);

    //increment the salt to generate more wallets per EOA address
    const walletSalt = ethers.BigNumber.from(4);

    userOp.setInitCode(getInitCode(simpleAccountFactory, eoaWallet.address, walletSalt));

    const walletAddress = await getWalletAddress(
        simpleAccountFactory,
        eoaWallet.address,
        walletSalt
    );

    userOp.setSender(walletAddress);

    userOp.setNonce((await client.getWalletNonce(walletAddress)));

    userOp.setPaymasterAndData(
        config.get("PAYMASTER_ADDRESS")!.toString(),
    )

    userOp.setSignature(
        (
            await eoaWallet.signMessage(ethers.utils.arrayify(ethers.utils.keccak256("0xdead")))
        )
    );
    const gFee = await gasFee(provider) as IGasFee;
    userOp.setMaxFeePerGas(gFee.maxFee);
    userOp.setMaxPriorityFeePerGas(gFee.maxPriorityFee);

    const gasEstimates = await client.estimateUserOpGas(userOp.toJSON()) as GasEstimate;

    userOp.setVerificationGasLimit( ethers.BigNumber.from(gasEstimates.verificationGas).add(30000));
    userOp.setCallGasLimit(gasEstimates.callGasLimit !== "0x" ? gasEstimates.callGasLimit : "0x0");
    userOp.setPreVerificationGas(ethers.BigNumber.from(gasEstimates.preVerificationGas));

    userOp.setSignature(
        (
            await eoaWallet.signMessage(ethers.utils.arrayify(
                (await client.getUserOpHash(userOp.toJSON()))
            ))
        )
    );

    console.log(userOp.get());

    const userOpHash = await client.sendUserOp(userOp.toJSON());

    console.log(userOpHash);
    
}

main().catch((error) => {

    if(error?.body){
        console.error(JSON.parse(error?.body).error.message);
        process.exitCode = 1;
        return;
    }
    console.error(error);
    process.exitCode = 1;
});