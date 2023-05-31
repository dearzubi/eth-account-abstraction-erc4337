import { ethers } from "ethers";
import { IUserOperation, AccountTypes} from "../types";

export default class UserOp {

  userOp: IUserOperation = {
    sender: "",
    nonce: 0,
    initCode: "",
    callData: "",
    callGasLimit: 0,
    verificationGasLimit: 0,
    preVerificationGas: 0,
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
    paymasterAndData: "",
    signature: "",
  }

  constructor(){}

  resetUserOp = () => {
    this.userOp = {
      sender: "",
      nonce: 0,
      initCode: "",
      callData: "",
      callGasLimit: 0,
      verificationGasLimit: 0,
      preVerificationGas: 0,
      maxFeePerGas: 0,
      maxPriorityFeePerGas: 0,
      paymasterAndData: "",
      signature: "",
    }
  }

  setInitCode = async (initCode: string) => {
    
    this.userOp.initCode = initCode;

  }

  setSender = async (sender: string) => {
      
      this.userOp.sender = sender;
  
  }

  getUserOp = (): IUserOperation => this.userOp;

}

