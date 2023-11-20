import sns from "@seedao/sns-js";
import { updateSNSmap } from "store/reducer";
import { useSelector } from "react-redux";
import store from "store";
import getConfig from "constant/envCofnig";

export default function useQuerySNS() {
  const snsMap = useSelector((state) => state.snsMap);

  const querySNS = async (wallet) => {
    try {
      const data = await sns.name(wallet);
      return data;
    } catch (error) {
      return "";
    }
  };

  const getSNS = async (wallet) => {
    const _wallet = wallet.toLocaleLowerCase();
    if (snsMap[_wallet]) {
      return snsMap[_wallet];
    }
    const res = await querySNS(_wallet);
    if (res) {
      const _snsMap = { ...snsMap };
      _snsMap[_wallet] = res;
      store.dispatch(updateSNSmap(_snsMap));
    }

    return res || _wallet;
  };

  const getMultiSNS = async (wallets) => {
    const wallet_sns_map = {};
    const _wallets = wallets.map((w) => w?.toLocaleLowerCase());
    const _to_be_queried = _wallets.filter((w) => !snsMap[w]);

    const _snsMap = { ...snsMap };
    if (_to_be_queried.length) {
      try {
        const data = await sns.names(_to_be_queried, getConfig().SNS_RPC_URL);
        data.forEach((d, idx) => {
          _snsMap[_to_be_queried[idx]] = d || _to_be_queried[idx];
        });
      } catch (error) {
        console.log(error);
      }
    }

    store.dispatch(updateSNSmap(_snsMap));

    _wallets.forEach((w) => {
      wallet_sns_map[w] = _snsMap[w] || w;
    });
    return wallet_sns_map;
  };

  return { getSNS, getMultiSNS };
}
