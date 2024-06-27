import { erc20ABI, useSendTransaction, useSwitchNetwork, useNetwork } from "wagmi";
import { useSelector } from "react-redux";
import { Wallet } from "utils/constant";
import { sendTransactionWithRedirect } from "@joyid/evm";
import getConfig from "constant/envCofnig";
import { uniWallet } from "components/login/unipassPopup";
import { ethers } from "ethers";
import { readContract, prepareSendTransaction } from "wagmi/actions";
import ScoreLendABI from "assets/abi/ScoreLend.json";

const CONFIG = getConfig();
const lendChain = CONFIG.NETWORK.lend.chain;

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
  return ids.length > 1
    ? iface.encodeFunctionData("paybackBatch", [ids])
    : iface.encodeFunctionData("payback", [ids[0]]);
};

const checkTransaction = (hash) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(lendChain.rpcUrls.default.http[0]);
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

const getTokenData = (token) => {
  return token === CONFIG.NETWORK.lend.lendToken.symbol
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
};

export default function useCreditTransaction(action) {
  const account = useSelector((state) => state.account);
  const wallet = useSelector((state) => state.walletType);
  const rpc = useSelector((state) => state.rpc);

  const { sendTransactionAsync } = useSendTransaction();

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const checkNetwork = async () => {
    if (chain && switchNetworkAsync && chain?.id !== lendChain.id) {
      await switchNetworkAsync(lendChain.id);
      return;
    }
  };

  const handleJoyID = (params, action, queryData) => {
    const buildRedirectUrl = () => {
      const url = new URL(`${window.location.origin}/redirect`);
      url.searchParams.set("action", action);
      for (const key in queryData) {
        url.searchParams.set(key, queryData[key]);
      }
      return url.href;
    };
    const url = buildRedirectUrl();
    sendTransactionWithRedirect(url, params, account, {
      joyidAppURL: `${CONFIG.JOY_ID_URL}`,
      // rpcURL: rpc || CONFIG.NETWORK.rpcs[0],
      rpcURL: lendChain.rpcUrls.default.http[0],
      network: {
        name: lendChain.name,
        chainId: lendChain.id,
      },
    });
  };

  const handleTransaction = async (data, contractAddress, action, queryData, moreGas = true) => {
    // const contractAddress = CONFIG.NETWORK.lend.scoreLendContract;
    const params = {
      to: contractAddress,
      from: account,
      value: "0",
      data,
    };
    console.log("use wallet:", wallet);
    if (wallet === Wallet.METAMASK) {
      const r = await prepareSendTransaction({
        to: contractAddress,
        account,
        data,
      });
      const gas = moreGas && r.gas ? BigInt(Math.ceil(Number(r.gas) * 1.2)) : undefined;
      if (gas) {
        console.log(`estimate gas: ${r.gas}, use more gas: ${gas}`);
      }
      const tx = await sendTransactionAsync({ ...params, gas });
      return checkTransaction(tx.hash);
    } else if (wallet === Wallet.JOYID) {
      return handleJoyID(params, action, queryData);
    } else if (wallet === Wallet.UNIPASS) {
      return uniWallet.sendTransaction(params);
    }
  };

  const approveToken = async (token, amount, queryData) => {
    const t =
      token === CONFIG.NETWORK.lend.lendToken.symbol
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
    const provider = new ethers.providers.StaticJsonRpcProvider(lendChain.rpcUrls.default.http[0]);
    const tokenContract = new ethers.Contract(t.address, erc20ABI, provider);
    // check approve balance
    const approve_balance = await tokenContract.allowance(account, CONFIG.NETWORK.lend.scoreLendContract);
    console.log("=======approveToken allowance=======", approve_balance.toString());
    if (approve_balance.lt(ethers.utils.parseUnits(String(amount), t.decimals))) {
      return handleTransaction(
        buildApproveTokenData(CONFIG.NETWORK.lend.scoreLendContract, t.decimals, amount),
        t.address,
        t.action,
        queryData,
        false,
      );
    }
  };
  const checkEnoughBalance = async (account, amount) => {
    const address = CONFIG.NETWORK.lend.lendToken.address;
    const bn = ethers.utils.parseUnits(String(amount), CONFIG.NETWORK.lend.lendToken.decimals);
    const provider = new ethers.providers.StaticJsonRpcProvider(lendChain.rpcUrls.default.http[0]);
    const tokenContract = new ethers.Contract(address, erc20ABI, provider);
    const balance = await tokenContract.balanceOf(account);
    return balance.gte(bn);
  };
  const getTokenBalance = (token) => {
    const t = getTokenData(token);
    const provider = new ethers.providers.StaticJsonRpcProvider(lendChain.rpcUrls.default.http[0]);
    const tokenContract = new ethers.Contract(t.address, erc20ABI, provider);
    return tokenContract.balanceOf(account);
  };
  const getTokenAllowance = async (token) => {
    const t = getTokenData(token);
    const provider = new ethers.providers.StaticJsonRpcProvider(lendChain.rpcUrls.default.http[0]);
    const tokenContract = new ethers.Contract(t.address, erc20ABI, provider);
    // check approve balance
    const allowanceResultBN = await tokenContract.allowance(account, CONFIG.NETWORK.lend.scoreLendContract);
    console.log("=======approveToken allowance=======", allowanceResultBN);
    return allowanceResultBN;
  };
  return { handleTransaction, approveToken, checkNetwork, checkEnoughBalance, getTokenBalance, getTokenAllowance };
}
