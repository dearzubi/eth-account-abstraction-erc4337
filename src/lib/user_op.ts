import { ethers } from "ethers";
import { IClassUserOP, IUserOperation } from "../types";

export default class UserOp implements IClassUserOP {

  private DEFAULT_USER_OP: IUserOperation = {
    sender: ethers.constants.AddressZero,
    nonce: ethers.constants.Zero,
    initCode: ethers.utils.hexlify("0x"),
    callData: ethers.utils.hexlify("0x"),
    callGasLimit: ethers.BigNumber.from(0),
    verificationGasLimit: ethers.BigNumber.from(0),
    preVerificationGas: ethers.BigNumber.from(0),
    maxFeePerGas: ethers.constants.Zero,
    maxPriorityFeePerGas: ethers.constants.Zero,
    paymasterAndData: ethers.utils.hexlify("0x"),
    signature: ethers.utils.hexlify("0x"),
  }

  private userOp: IUserOperation;

  constructor(){
    this.userOp = {...this.DEFAULT_USER_OP};
  }

  reset = () => {
    this.userOp = {...this.DEFAULT_USER_OP};
  }

  setSender = (sender: string) => this.userOp.sender = sender;
  setNonce = (nonce: ethers.BigNumberish) => this.userOp.nonce = ethers.BigNumber.from(nonce);
  
  setInitCode = (initCode: ethers.BytesLike) => this.userOp.initCode = initCode;
  setCallData = (callData: ethers.BytesLike) => this.userOp.callData = callData;
  
  setCallGasLimit = (callGasLimit: ethers.BigNumberish) => this.userOp.callGasLimit = ethers.BigNumber.from(callGasLimit);
  setVerificationGasLimit = (verificationGasLimit: ethers.BigNumberish) => this.userOp.verificationGasLimit = ethers.BigNumber.from(verificationGasLimit);
  setPreVerificationGas = (preVerificationGas: ethers.BigNumberish) => this.userOp.preVerificationGas = ethers.BigNumber.from(preVerificationGas);
  
  setMaxFeePerGas = (maxFeePerGas: ethers.BigNumberish) => this.userOp.maxFeePerGas = ethers.BigNumber.from(maxFeePerGas);
  setMaxPriorityFeePerGas = (maxPriorityFeePerGas: ethers.BigNumberish) => this.userOp.maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGas);
  
  setPaymasterAndData = (paymasterAndData: ethers.BytesLike) => this.userOp.paymasterAndData = paymasterAndData;
  setSignature = (signature: ethers.BytesLike) => this.userOp.signature = signature;

  set = (userOp: IUserOperation) => this.userOp = {...userOp};

  getSender = (): string => this.userOp.sender;
  getNonce = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.nonce);

  getInitCode = (): ethers.BytesLike => this.userOp.initCode;
  getCallData = (): ethers.BytesLike => this.userOp.callData;

  getCallGasLimit = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.callGasLimit);
  getVerificationGasLimit = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.verificationGasLimit);
  getPreVerificationGas = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.preVerificationGas);

  getMaxFeePerGas = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.maxFeePerGas);
  getMaxPriorityFeePerGas = (): ethers.BigNumber => ethers.BigNumber.from(this.userOp.maxPriorityFeePerGas);

  getPaymasterAndData = (): ethers.BytesLike => this.userOp.paymasterAndData;
  getSignature = (): ethers.BytesLike => this.userOp.signature;
  
  get = (): IUserOperation => this.userOp;
  getDefaults = (): IUserOperation => this.DEFAULT_USER_OP;

  toJSON = (): IUserOperation => {

    const userOp = JSON.parse(JSON.stringify(this.userOp));

    userOp.nonce = userOp.nonce.hex;
    userOp.callGasLimit = userOp.callGasLimit.hex;
    userOp.verificationGasLimit = userOp.verificationGasLimit.hex;
    userOp.preVerificationGas = userOp.preVerificationGas.hex;
    userOp.maxFeePerGas = userOp.maxFeePerGas.hex;
    userOp.maxPriorityFeePerGas = userOp.maxPriorityFeePerGas.hex;

    return userOp as IUserOperation;

  }

}

