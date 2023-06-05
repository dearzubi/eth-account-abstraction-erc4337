import { BigNumberish, BytesLike, BigNumber } from "ethers";

export interface IGasFee {
  maxFee: BigNumber;
  maxPriorityFee: BigNumber;
}

export type GasFee = IGasFee | BigNumber;

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

export interface IClassUserOP{

  reset(): void;

  setSender(sender: string): void;
  setNonce(nonce: BigNumberish): void;
  setInitCode(initCode: BytesLike): void;
  setCallData(callData: BytesLike): void;
  setCallGasLimit(callGasLimit: BigNumberish): void;
  setVerificationGasLimit(verificationGasLimit: BigNumberish): void;
  setPreVerificationGas(preVerificationGas: BigNumberish): void;
  setMaxFeePerGas(maxFeePerGas: BigNumberish): void;
  setMaxPriorityFeePerGas(maxPriorityFeePerGas: BigNumberish): void;
  setPaymasterAndData(paymasterAndData: BytesLike): void;
  setSignature(signature: BytesLike): void;

  set(userOp: IUserOperation): void;
  
  getSender(): string;
  getNonce(): BigNumber;
  getInitCode(): BytesLike;
  getCallData(): BytesLike;
  getCallGasLimit(): BigNumber;
  getVerificationGasLimit(): BigNumber;
  getPreVerificationGas(): BigNumber;
  getMaxFeePerGas(): BigNumber;
  getMaxPriorityFeePerGas(): BigNumber;
  getPaymasterAndData(): BytesLike;
  getSignature(): BytesLike;

  get(): IUserOperation;
  getDefaults(): IUserOperation;

  toJSON(): IUserOperation;

}

export interface ISenderDepositInfo {
  deposit: BigNumber;
  staked: boolean;
  stake: BigNumber;
  unstakeDelaySec: BigNumber;
  withdrawTime: BigNumber;
}