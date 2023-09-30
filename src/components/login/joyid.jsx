import {Button} from "react-bootstrap";
import {connectCallback, connectWithRedirect, signMessageCallback} from "@joyid/evm";
import {useEffect, useState} from "react";

export default function Joyid(){
    const [account, setAccount] = useState();


    useEffect(() => {
        const redirectHome = () => {
            // const _address = localStorage.getItem("joyid-address");
            // if (_address) {
            //     setAccount(_address);
            //     return;
            // }
            let state;
            try {
                state = connectCallback();
                console.log("-------state:", state);
                if (state?.address) {
                    setAccount(state.address);
                    // localStorage.setItem("joyid-address", state.address);
                    return true;
                }
            } catch (error) {
                console.error("-------callback:", error);
            }
        };
        // const redirectSignMessage = () => {
        //     let state;
        //     try {
        //         state = signMessageCallback();
        //         setSig(state.signature);
        //         console.log("-------state sign:", state);
        //         return true;
        //     } catch (error) {
        //         console.error("-------callback sign:", error);
        //     }
        // };
        redirectHome();
        // redirectSignMessage();
    }, []);

    const buildRedirectUrl = (action) => {
        const url = new URL(`${window.location.origin}/login`);
        url.searchParams.set("action", action);
        return url.href;
    }


    const onConnectRedirect = () => {
        const url = buildRedirectUrl("connect");
        connectWithRedirect(url, {
            rpcURL: "https://eth.llamarpc.com",
            network: {
                chainId: 1,
                name: "Ethereum Mainnet",
            },
        });
    };

    return <div>
        <Button onClick={onConnectRedirect}>Joyid</Button>
    </div>
}
