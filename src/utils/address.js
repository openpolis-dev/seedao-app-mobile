import { ethers } from "ethers";
import publicJs from "./publicJs";

export const formatAddress = (wallet, num) => {
  return wallet ? publicJs.AddressToShow(ethers.utils.getAddress(wallet), num) : "";
};
