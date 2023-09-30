import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { useEthersProvider,useEthersSigner } from '../../utils/ethersNew';
import store from "../../store";
import {saveLoading} from "../../store/reducer";


export default function  Metamask(){

    const { open } = useWeb3Modal();
    const { isConnected,address } = useAccount();
    const { disconnect } = useDisconnect();

    async function onOpen() {
        store.dispatch(saveLoading(true));
        await open();
        store.dispatch(saveLoading(false));
    }

    function onClick() {
        if (isConnected) {
            disconnect();
        } else {
            onOpen();
        }
    }

    return <div>
        <Button  onClick={()=>onClick()}>Metamask</Button>
    </div>
}
