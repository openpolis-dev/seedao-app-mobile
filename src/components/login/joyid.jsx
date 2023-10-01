import {Button} from "react-bootstrap";
import {
    connectWithRedirect,
    connectCallback,
    signMessageWithRedirect,
    signMessageCallback,
} from "@joyid/evm";
import {useEffect, useState} from "react";
import store from "../../store";
import {saveAccount, saveUserToken, saveWalletType} from "../../store/reducer";
import {getNonce, login} from "../../api/user";
import {ethers} from "ethers";
import {createSiweMessage} from "../../utils/publicJs";
import AppConfig from "../../AppConfig";
import {useNavigate} from "react-router-dom";

export default function Joyid(){

    const navigate = useNavigate();
    const [account, setAccount] = useState();
    const [sig, setSig] = useState("");
    const [msg,setMsg] = useState();
    const [result,setResult] = useState(null);

    useEffect(() => {
        const redirectHome = () => {
            const _address = localStorage.getItem("joyid-address");
            if (_address) {
                setAccount(_address);
                return;
            }
            let state;
            try {
                state = connectCallback();
                console.log("-------state:", state);
                if (state?.address) {
                    setAccount(state.address);
                    store.dispatch(saveAccount(state.address))
                    // localStorage.setItem("joyid-address", state.address);
                    return true;
                }
            } catch (error) {
                console.error("-------callback:", error);
            }
        };

        const redirectSignMessage = () => {
            let state;
            try {
                state = signMessageCallback();
                setSig(state.signature);
                console.log("-------state sign:", state);
                return true;
            } catch (error) {
                console.error("-------callback sign:", error);
            }
        };
        redirectHome();
        redirectSignMessage();
    }, []);

    const buildRedirectUrl = (action) => {
        const url = new URL(`${window.location.origin}/login`);
        url.searchParams.set("action", action);
        return url.href;
    }

    useEffect(()=>{
        if(!account) return;
        onSignMessageRedirect()
    },[account])

    useEffect(()=>{
        if(!sig) return;
        LoginTo()
    },[sig])


    const getMyNonce = async(wallet) =>{
        let rt = await getNonce(wallet);
        return rt.data.nonce;
    }

    const onSignMessageRedirect = async() => {


        let nonce = await getMyNonce(account);
        console.log('nonce: ', nonce)

        const eip55Addr = ethers.utils.getAddress(account);
        console.log('eip55Addr: ', eip55Addr)


        const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
        setMsg(siweMessage)
        console.log("===siweMessage==",siweMessage)

        const url = buildRedirectUrl("sign-message");
        signMessageWithRedirect(url, siweMessage, account, {
            state: msg,
        });
    };


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


    const LoginTo = async () =>{


        const { host} = AppConfig;
        let obj = {
            wallet: account,
            message: msg,
            signature: sig,
            domain: host,
            wallet_type: 'AA',
            is_eip191_prefix: false
        };
        try{
            let rt = await login(obj);
            console.log('RESULT', rt.data);
            store.dispatch(saveUserToken(rt.data));
            store.dispatch(saveWalletType("unipass"));

            setResult(rt.data)
        }catch (e){
            console.error(e)
        }

    }

    useEffect(()=>{
        if(!result)return;
        console.log("==result==",result)
        navigate('/board');

    },[result])

    return <div>
        <Button onClick={onConnectRedirect}>Joyid</Button>
    </div>
}
