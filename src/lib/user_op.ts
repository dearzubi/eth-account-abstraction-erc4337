import { ethers } from "ethers";
import { IUserOperation } from "../types";

export default class UserOp {

  private DEFAULT_VERIFICATION_GAS_LIMIT = ethers.BigNumber.from(70000);
  private DEFAULT_CALL_GAS_LIMIT = ethers.BigNumber.from(35000);
  private DEFAULT_PRE_VERIFICATION_GAS = ethers.BigNumber.from(21000);

  private userOp: IUserOperation = {
    sender: ethers.constants.AddressZero,
    nonce: ethers.constants.Zero,
    initCode: ethers.utils.hexlify("0x"),
    callData: ethers.utils.hexlify("0x"),
    callGasLimit: this.DEFAULT_CALL_GAS_LIMIT,
    verificationGasLimit: this.DEFAULT_VERIFICATION_GAS_LIMIT,
    preVerificationGas: this.DEFAULT_PRE_VERIFICATION_GAS,
    maxFeePerGas: ethers.constants.Zero,
    maxPriorityFeePerGas: ethers.constants.Zero,
    paymasterAndData: ethers.utils.hexlify("0x"),
    signature: ethers.utils.hexlify("0x"),
  }

  constructor(){}

  reset = () => {

    this.userOp = {
      sender: ethers.constants.AddressZero,
      nonce: ethers.constants.Zero,
      initCode: ethers.utils.hexlify("0x"),
      callData: ethers.utils.hexlify("0x"),
      callGasLimit: this.DEFAULT_CALL_GAS_LIMIT,
      verificationGasLimit: this.DEFAULT_VERIFICATION_GAS_LIMIT,
      preVerificationGas: this.DEFAULT_PRE_VERIFICATION_GAS,
      maxFeePerGas: ethers.constants.Zero,
      maxPriorityFeePerGas: ethers.constants.Zero,
      paymasterAndData: ethers.utils.hexlify("0x"),
      signature: ethers.utils.hexlify("0x"),
    }
  }

  copy = (userOp: IUserOperation) => this.userOp = JSON.parse(JSON.stringify(userOp)) as IUserOperation;

  setSender = (sender: string) => this.userOp.sender = sender;
  setNonce = (nonce: ethers.BigNumberish) => this.userOp.nonce = ethers.BigNumber.from(nonce);
  setInitCode = (initCode: ethers.BytesLike) => this.userOp.initCode = initCode;
  setCallData = (callData: ethers.BytesLike) => this.userOp.callData = callData;
  setCallGasLimit = (callGasLimit: ethers.BigNumberish) => this.userOp.callGasLimit = ethers.BigNumber.from(callGasLimit);
  incVerificationGasLimit = (amount: ethers.BigNumberish) => this.userOp.verificationGasLimit = ethers.BigNumber.from(this.userOp.verificationGasLimit).add(ethers.BigNumber.from(amount));
  setVerificationGasLimit = (verificationGasLimit: ethers.BigNumberish) => this.userOp.verificationGasLimit = ethers.BigNumber.from(verificationGasLimit);
  setPreVerificationGas = (preVerificationGas: ethers.BigNumberish) => this.userOp.preVerificationGas = ethers.BigNumber.from(preVerificationGas);
  setMaxFeePerGas = (maxFeePerGas: ethers.BigNumberish) => this.userOp.maxFeePerGas = ethers.BigNumber.from(maxFeePerGas);
  setMaxPriorityFeePerGas = (maxPriorityFeePerGas: ethers.BigNumberish) => this.userOp.maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGas);
  setPaymasterAndData = (paymasterAndData: ethers.BytesLike) => this.userOp.paymasterAndData = paymasterAndData;
  setSignature = (signature: ethers.BytesLike) => this.userOp.signature = signature;

  get = (): IUserOperation => this.userOp;

  toJSON = () => {

    const userOp = JSON.parse(JSON.stringify(this.userOp));

    // console.log(userOp);

    userOp.nonce = userOp.nonce.hex;
    userOp.callGasLimit = userOp.callGasLimit.hex;
    userOp.verificationGasLimit = userOp.verificationGasLimit.hex;
    userOp.preVerificationGas = userOp.preVerificationGas.hex;
    userOp.maxFeePerGas = userOp.maxFeePerGas.hex;
    userOp.maxPriorityFeePerGas = userOp.maxPriorityFeePerGas.hex;

    return userOp;

  }

}

