import { BigNumberish, BytesLike } from "ethers";

export type GasFee = {[key: string]: string} | string;

export enum AccountTypes {
  Simple = 'Simple'
};

export interface GasEstimate {
  preVerificationGas: BigNumberish;
  verificationGas: BigNumberish;
  callGasLimit: BigNumberish;
}

export interface IUserOperation {
  sender: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
}