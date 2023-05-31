import { ethers } from "ethers";
import config from "../config/config";

export const getEntryPoint = (
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): ethers.Contract => {

  return new ethers.Contract(
    config.get("ENTRYPOINT_ADDRESS")!.toString(),
    config.getABI("ENTRYPOINT")!,
    providerOrSigner
  );
  
}