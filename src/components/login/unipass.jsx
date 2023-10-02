import {Button} from "react-bootstrap";
import { UniPassProvider } from "@unipasswallet/ethereum-provider";
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import store from "../../store";
import { createSiweMessage } from "../../utils/publicJs";
import {saveAccount,saveUserToken,saveWalletType} from "../../store/reducer";
import {useNavigate} from "react-router-dom";
import { getNonce, login } from "../../api/user";
import AppConfig from "../../AppConfig";

const upProvider = new UniPassProvider({
    chainId: 1,
    returnEmail: false,
    appSetting: {
        appName: 'test dapp',
        appIcon: 'your icon url',
    },
    rpcUrls: {
        mainnet: "https://eth.llamarpc.com",
        // polygon: "https://polygon.llamarpc.com",
        // bscTestnet:"https://data-seed-prebsc-1-s1.binance.org:8545"
    },
});

export default function Unipass(){
    const navigate = useNavigate();
    const [addr,setAddr] = useState();
    const [provider,setProvider] = useState();
    const [msg,setMsg] = useState(null);
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);



    const getP = async() =>{
        try{

            await upProvider.connect();
            const provider = new ethers.providers.Web3Provider(upProvider, "any");
            setProvider(provider);
        }catch (e){
            console.error(e)
        }


    }

    useEffect(()=>{
        if(!provider)return;
        connect();
    },[provider])

    const connect = async() =>{

        try{
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAddr(address)
            store.dispatch(saveAccount(address))
        }catch (e) {
            console.error(e)
        }
    }


    useEffect(()=>{

        if(!addr) return;
        signMessage()
    },[addr])


    const getMyNonce = async(wallet) =>{
        let rt = await getNonce(wallet);
        return rt.data.nonce;
    }

    const signMessage = async() =>{
        try{
            let nonce = await getMyNonce(addr);
            const eip55Addr = ethers.utils.getAddress(addr);

            const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
            setMsg(siweMessage)
            const signer = provider.getSigner();
            let res = await signer.signMessage(siweMessage);
            setSignInfo(res)


        }catch (e) {
            console.error(e)
            store.dispatch(saveAccount(null))
            setAddr(null)
            await upProvider.disconnect();
        }

    }

    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])


    const LoginTo = async () =>{


        const { host} = AppConfig;
        let obj = {
            wallet: addr,
            message: msg,
            signature: signInfo,
            domain: host,
            wallet_type: 'AA',
            is_eip191_prefix: true
        };
        try{
            let rt = await login(obj);
            store.dispatch(saveUserToken(rt.data));
            store.dispatch(saveWalletType("unipass"));
            setResult(rt.data)
        }catch (e){
            console.error(e)
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/board');

    },[result])

    return <div>
        <Button  onClick={()=>getP()}>Unipass</Button>
    </div>
}
