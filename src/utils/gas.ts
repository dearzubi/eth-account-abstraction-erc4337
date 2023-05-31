import { ethers } from "ethers";
import {GasFee, GasEstimate, IUserOperation} from "../types";

export const gasFee = async (
  provider: ethers.providers.JsonRpcProvider, 
  eip1559: boolean = true
): Promise<GasFee> => {

    let [gasFee, block] = await Promise.all([
      provider.send("eth_gasPrice", []),
      provider.getBlock("latest"),
    ]);

    gasFee = ethers.BigNumber.from(gasFee);

    if(block?.baseFeePerGas && eip1559){
      block.baseFeePerGas = ethers.BigNumber.from(block.baseFeePerGas);
      const maxPriorityFee = gasFee.sub(block.baseFeePerGas);
      const maxFee = block.baseFeePerGas.mul(2).add(maxPriorityFee);
      return { maxFee: maxFee.toHexString(), maxPriorityFee: maxPriorityFee.toHexString() };
    }

    return gasFee.toHexString();
    
};

export const estimateWalletCreationGas = async (
  provider: ethers.providers.JsonRpcProvider,
  initCode: ethers.BytesLike
): Promise<ethers.BigNumber> => {
  
  const initCodeHex = ethers.utils.hexlify(initCode);
  return await provider.estimateGas({
    to: initCodeHex.substring(0, 42),
    data: "0x" + initCodeHex.substring(42),
  });

};

export const estimateUserOpGas = async (
  //provider should be connected to a node supporting ERC4337 eth methods
  erc4337NodeProvider: ethers.providers.JsonRpcProvider,
  userOp: IUserOperation,
  entryPoint: string
): Promise<IUserOperation> => {

  const estimate = (await erc4337NodeProvider.send("eth_estimateUserOperationGas", [userOp, entryPoint]
  )) as GasEstimate;

  userOp.preVerificationGas = estimate.preVerificationGas;
  userOp.verificationGasLimit = estimate.verificationGas;
  userOp.callGasLimit = estimate.callGasLimit;

  return userOp;
}
