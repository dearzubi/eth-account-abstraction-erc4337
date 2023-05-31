import { BigNumberish, BytesLike } from "ethers";

export interface IGasFee {
  maxFee: string;
  maxPriorityFee: string;
}

export type GasFee = IGasFee | string;

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