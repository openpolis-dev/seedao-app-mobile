import sns from "@seedao/sns-js";
import { useEffect, useState } from "react";

export default function useParseSNS(wallet) {
  const [name, setName] = useState();

  useEffect(() => {
    if (wallet) {
      sns.name(wallet).then((res) => {
        setName(res);
      });
    }
  }, [wallet]);
  return name;
}

export function useParseSNSList(wallets = []) {
  const [nameMap, setNameMap] = useState({});

  useEffect(() => {
    if (wallets.length) {
      sns.names(wallets).then((res) => {
        const _name_map = {};
        res.forEach((r, idx) => {
          _name_map[wallets[idx]] = r;
        });
        setNameMap(_name_map);
      });
    } else {
      setNameMap({});
    }
  }, [wallets]);

  return nameMap;
}
