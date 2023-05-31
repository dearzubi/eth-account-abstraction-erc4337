import config from "../config/config";

export const setPaymasterWhiteList = () => { 

  const currentWhiteList = config.get("PAYMASTER_WHITELIST")!.toString().split(',').filter((address) => address !== "");
  const tokenAddress = config.get("TOKEN_ADDRESS")!.toString();
  currentWhiteList.push(tokenAddress);
  config.update("PAYMASTER_WHITELIST", currentWhiteList.join(','));

};