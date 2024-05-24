import { erc20ABI, useSendTransaction, useSwitchNetwork, useNetwork } from "wagmi";
import { useSelector } from "react-redux";
import { Wallet } from "utils/constant";
import { sendTransactionWithRedirect } from "@joyid/evm";
import getConfig from "constant/envCofnig";
import { uniWallet } from "components/login/unipassPopup";
import { amoy } from "utils/chain";
import { ethers } from "ethers";
import { readContract, prepareSendTransaction } from "wagmi/actions";
import ScoreLendABI from "assets/abi/ScoreLend.json";

const CONFIG = getConfig();

const buildApproveTokenData = (contractAddress, decimals, num) => {
  const iface = new ethers.utils.Interface(erc20ABI);
  return iface.encodeFunctionData("approve", [contractAddress, ethers.utils.parseUnits(String(num), decimals)]);
};

export const buildBorrowData = (amount) => {
  const iface = new ethers.utils.Interface(ScoreLendABI);
  const amountNB = ethers.utils.parseUnits(String(amount), CONFIG.NETWORK.lend.lendToken.decimals);
  return iface.encodeFunctionData("borrow", [amountNB]);
};

export const buildRepayData = (ids) => {
  const iface = new ethers.utils.Interface(ScoreLendABI);
  return iface.encodeFunctionData("paybackBatch", [ids]);
};

const checkTransaction = (hash) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(amoy.rpcUrls.default.http[0]);
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      provider.getTransactionReceipt?.(hash).then((r) => {
        console.log("check tx result", r);
        if (r) {
          clearInterval(timer);
          resolve(r);
        }
      });
    }, 5000);
  });
};

export default function useCreditTransaction(action) {
  const account = useSelector((state) => state.account);
  const wallet = useSelector((state) => state.walletType);
  const rpc = useSelector((state) => state.rpc);

  const { sendTransactionAsync } = useSendTransaction();

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const checkNetwork = async () => {
    if (chain && switchNetworkAsync && chain?.id !== amoy.id) {
      await switchNetworkAsync(amoy.id);
      return;
    }
  };

  const handleJoyID = (params, action) => {
    const buildRedirectUrl = () => {
      const url = new URL(`${window.location.origin}/redirect`);
      url.searchParams.set("action", action);
      return url.href;
    };
    const url = buildRedirectUrl();
    sendTransactionWithRedirect(url, params, account, {
      joyidAppURL: `${CONFIG.JOY_ID_URL}`,
      rpcURL: rpc || CONFIG.NETWORK.rpcs[0],
      network: {
        name: amoy.name,
        chainId: amoy.id,
      },
    });
  };

  const handleTransaction = async (data, contractAddress, action) => {
    // const contractAddress = CONFIG.NETWORK.lend.scoreLendContract;
    const params = {
      to: contractAddress,
      from: account,
      value: "0",
      data,
    };
    console.log("use wallet:", wallet);
    if (wallet === Wallet.METAMASK) {
      await prepareSendTransaction({
        to: contractAddress,
        account,
        data,
      });
      const tx = await sendTransactionAsync(params);
      return checkTransaction(tx.hash);
    } else if (wallet === Wallet.JOYID) {
      return handleJoyID(params, action);
    } else if (wallet === Wallet.UNIPASS) {
      return uniWallet.sendTransaction(params);
    }
  };

  const approveToken = async (token, amount) => {
    const t =
      token === "usdt"
        ? {
            decimals: CONFIG.NETWORK.lend.lendToken.decimals,
            address: CONFIG.NETWORK.lend.lendToken.address,
            action: "credit-repay-approve",
          }
        : {
            decimals: CONFIG.NETWORK.SCRContract.decimals,
            address: CONFIG.NETWORK.SCRContract.address,
            action: "credit-borrow-approve",
          };
    const allowanceResult = await readContract({
      address: t.address,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account, CONFIG.NETWORK.lend.scoreLendContract],
    });
    console.log("=======approveToken allowance=======", allowanceResult);
    if (
      !allowanceResult ||
      ethers.BigNumber.from(allowanceResult.toString()).lt(ethers.utils.parseUnits(String(amount), t.decimals))
    ) {
      return handleTransaction(
        buildApproveTokenData(CONFIG.NETWORK.lend.scoreLendContract, t.decimals, amount),
        t.address,
        t.action,
      );
    }
  };
  const checkEnoughBalance = async (account, amount) => {
    const address = CONFIG.NETWORK.lend.lendToken.address;
    const balance = await readContract({
      address: address,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [account],
    });
    return ethers.BigNumber.from(balance.toString()).gte(
      ethers.utils.parseUnits(String(amount), CONFIG.NETWORK.lend.lendToken.decimals),
    );
  };
  return { handleTransaction, approveToken, checkNetwork, checkEnoughBalance };
}
