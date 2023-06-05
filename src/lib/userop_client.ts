import { ethers } from "ethers"
import abiEntryPoint from './abi/entry_point.json';
import { IUserOperation, GasEstimate } from "../types";

export default class UserOpClient {

  private erc4337NodeProvider: ethers.providers.JsonRpcProvider;
  private entryPoint: ethers.Contract;

  constructor(
    entryPointAddress: string,
    provider: ethers.providers.JsonRpcProvider,
    erc4337NodeProvider?: ethers.providers.JsonRpcProvider
    
  ) {
    this.entryPoint = new ethers.Contract(
      entryPointAddress,
      abiEntryPoint,
      provider
    );
    this.erc4337NodeProvider = erc4337NodeProvider ?  erc4337NodeProvider : provider;
  }
  
  estimateUserOpGas = async (userOp: IUserOperation): Promise<GasEstimate> => {
  
    const estimate = (await this.erc4337NodeProvider.send(
      "eth_estimateUserOperationGas", 
      [userOp, this.entryPoint.address]
    )) as GasEstimate;
  
    return estimate;
  }

  sendUserOp = async(userOp: IUserOperation): Promise<string> => {
    const userOpHash: string = await this.erc4337NodeProvider.send(
      "eth_sendUserOperation", 
      [userOp, this.entryPoint.address]
    );

    return userOpHash;
  }

  fetchUserOpWithTxContext = async(userOpHash: string) => {

    const userOpWithTxContext= await this.erc4337NodeProvider.send(
      "eth_getUserOperationByHash", 
      [userOpHash]
    );

    return userOpWithTxContext;

  }

  fetchUserOpReceipt = async(userOpHash: string) => {

    const userOpReceipt = await this.erc4337NodeProvider.send(
      "eth_getUserOperationReceipt", 
      [userOpHash]
    );

    return userOpReceipt;

  }

  getUserOpHash = async(userOp: IUserOperation): Promise<string> => {
    return this.entryPoint.callStatic.getUserOpHash(userOp);
  }

  getWalletNonce = async(walletAddress: string, key?: number): Promise<ethers.BigNumber> => {
    return this.entryPoint.callStatic.getNonce(walletAddress, key ? key : 0);
  }

}