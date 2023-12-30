import { ethers } from "ethers";
import { useSelector } from "react-redux";
import useTransaction from "hooks/useTransaction";
import getConfig from "constant/envCofnig";
import { erc20ABI } from "wagmi";

const networkConfig = getConfig().NETWORK;
const PAY_TOKEN = networkConfig.tokens[0];
const PAY_NUMBER = PAY_TOKEN.price;

export default function useCheckBalance() {
  const account = useSelector((state) => state.account);
  const rpc = useSelector((state) => state.rpc);

  return async function checkBalance(checkNative, checkERC20) {
    console.log("checkBalance", checkNative, checkERC20);
    if (!checkNative && !checkERC20) {
      return;
    }
    try {
      const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
      if (checkNative) {
        const nativeBalance = await provider.getBalance(account);
        if (nativeBalance.lte(ethers.BigNumber.from(0))) {
          return networkConfig.nativeToken;
        }
      }
      if (checkERC20) {
        const tokenContract = new ethers.Contract(PAY_TOKEN.address, erc20ABI, provider);
        const balance = await tokenContract.balanceOf(account);
        if (balance.lt(ethers.utils.parseUnits(String(PAY_NUMBER), PAY_TOKEN.decimals))) {
          return PAY_TOKEN.name;
        }
      }
    } catch (error) {
      logError("check balance error", error);
    }
  };
}
