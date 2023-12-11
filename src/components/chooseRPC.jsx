import getConfig from "constant/envCofnig";
import { useEffect } from "react";
import publicJs from "utils/publicJs";
import store from "store";
import { saveRPC } from "store/reducer";

export default function ChooseRPC() {
  useEffect(() => {
    const network = getConfig().NETWORK;
    publicJs
      .checkRPCavailable(network.rpcs, {
        chainId: network.chainId,
        name: network.name,
      })
      .then((r) => {
        store.dispatch(saveRPC(r));
      });
  }, []);
}
