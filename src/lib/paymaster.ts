import { ethers } from "ethers";
import config from "../config/config";

export const getPaymaster = (
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): ethers.Contract => {

  return new ethers.Contract(
    config.get("PAYMASTER_ADDRESS")!.toString(),
    config.getABI("PAYMASTER")!,
    providerOrSigner
  );
  
}