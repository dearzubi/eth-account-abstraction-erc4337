import { ethers } from "ethers";
import config from "../config/config";
import {getEntryPoint} from "./entry_point";
import {AccountTypes} from "../types";

export const getAccountAddress = async (
  initCode: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {

  const entryPointContract = getEntryPoint(provider);

  try{
    await entryPointContract.callStatic.getSenderAddress(initCode);
  }
  catch (error: any){
    return error?.errorArgs?.sender;
  }
  return "";

}

export const getAccountFactory = (
  type: AccountTypes,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): ethers.Contract => {

  switch(type){

    case AccountTypes.Simple:
      return new ethers.Contract(
        config.get("SIMPLE_ACCOUNT_FACTORY_ADDRESS")!.toString(),
        config.getABI("SIMPLE_ACCOUNT_FACTORY")!,
        providerOrSigner
    );

    default:
      throw new Error("Invalid account factory type");
  }

}

export const getAccount = (
  type: AccountTypes,
  address: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): ethers.Contract => {

  switch(type){

    case AccountTypes.Simple:
      return new ethers.Contract(
        address,
        config.getABI("SIMPLE_ACCOUNT")!,
        providerOrSigner
    );
    
    default:
      throw new Error("Invalid account type");
  }

}

export const getInitCode = (accountFactory: ethers.Contract, ownerAddress: string): string => {

  return ethers.utils.hexConcat([
    accountFactory.address,
    accountFactory.interface.encodeFunctionData("createAccount", [
      ownerAddress,
      ethers.BigNumber.from(0),
    ]),
  ]);

}