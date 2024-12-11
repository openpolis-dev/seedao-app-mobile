import sns from "@seedao/sns-js";

import { useEffect, useState } from "react";
import getConfig from "../constant/envCofnig";
import PublicJs from "../utils/publicJs";
import {useSelector} from "react-redux";

export default function useParseSNS(wallet) {
  const [name, setName] = useState();

  useEffect(() => {
    if (wallet) {
      sns.name(wallet,getConfig().NETWORK.rpcs[0]).then((res) => {
        setName(res);
      });
    }
  }, [wallet]);
  return name;
}

export function useParseSNSList(wallets = []) {
  const [nameMap, setNameMap] = useState({});
  const rpc = useSelector((state) => state.rpc);

  const chooseRPC = rpc || getConfig().NETWORK.rpcs[0];

  useEffect(() => {
    getSNS(wallets)
  }, [wallets]);
  const getSNS = async(wallets) =>{

    if(wallets.length){
      // let res = await sns.names(wallets,getConfig().NETWORK.rpcs[0]);
      let res = await PublicJs.splitWallets(wallets,chooseRPC);
      const _name_map = {};
      res.forEach((r, idx) => {
        _name_map[wallets[idx]] = r;
      });
      setNameMap(_name_map);
    }else{
      setNameMap({});
    }

  }

  return nameMap;
}
