import { ethers } from "ethers";
import config from "../config/config";
import abiSimpleAccountFactory from "./abi/accounts/simple_account_factory.json";
import abiSimpleAccount from "./abi/accounts/simple_account.json";
import {AccountTypes} from "../types";

export const getWalletAddress = async (
  accountFactory: ethers.Contract, 
  ownerAddress: string,
  salt?: ethers.BigNumber
): Promise<string> => {

  return accountFactory.callStatic.getAddress(
    ownerAddress,
    salt ? salt: ethers.BigNumber.from(0),
  );
  
}

export const getAccountFactory = (
  type: AccountTypes,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): ethers.Contract => {

  switch(type){

    case AccountTypes.Simple:
      return new ethers.Contract(
        config.get("SIMPLE_ACCOUNT_FACTORY_ADDRESS")!.toString(),
        abiSimpleAccountFactory,
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
        abiSimpleAccount,
        providerOrSigner
    );
    
    default:
      throw new Error("Invalid account type");
  }

}

export const getInitCode = (
  accountFactory: ethers.Contract, 
  ownerAddress: string,
  salt?: ethers.BigNumber
): string => {

  return ethers.utils.hexConcat([
    accountFactory.address,
    accountFactory.interface.encodeFunctionData("createAccount", [
      ownerAddress,
      salt ? salt: ethers.BigNumber.from(0),
    ]),
  ]);

}