import { ethers } from "ethers";
import { GasFee } from "../types";

export const gasFee = async (
  provider: ethers.providers.JsonRpcProvider, 
  eip1559: boolean = true
): Promise<GasFee> => {

  const [fee, block] = await Promise.all<[Promise<ethers.BigNumber>, Promise<ethers.providers.Block>]>
  ([
    provider.send("eth_gasPrice", []),
    provider.getBlock("latest"),
  ]);

  if(block?.baseFeePerGas && eip1559){
    let maxPriorityFee = ethers.BigNumber.from(fee).sub(block.baseFeePerGas);
    maxPriorityFee = maxPriorityFee.add(maxPriorityFee.div(100).mul(13))
    const maxFee = block.baseFeePerGas.mul(2).add(maxPriorityFee);
    return { maxFee: maxFee, maxPriorityFee: maxPriorityFee };
  }

  return ethers.BigNumber.from(fee);
    
};