import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import {useEthersSigner } from '../../utils/ethersNew';
import store from "../../store";
import {saveLoading,saveAccount,saveSigner,saveUserToken,saveWalletType} from "../../store/reducer";
import {ethers} from "ethers";
import {getNonce,login} from "../../api/user";
import {createSiweMessage} from "../../utils/publicJs";
import {useNavigate} from "react-router-dom";
import AppConfig from "../../AppConfig";

export default function  Metamask(){
    const navigate = useNavigate();
    const { open } = useWeb3Modal();
    const { isConnected,address } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain, chains } = useNetwork();
    const [msg,setMsg] = useState();
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);
    const [connectWallet,setConnectWallet] = useState(false);

    const signer = useEthersSigner({chainId:chain});


    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])

    useEffect(()=>{
        console.log(signer,address)
        if(!signer || !connectWallet || !address) return;
        sign()
    },[signer,connectWallet])

    const onOpen = async() =>{
        store.dispatch(saveLoading(true));
        await open();

    }

    const onClick = async () =>{
        if (!isConnected) {
            disconnect();
            await onOpen();
            setConnectWallet(true);
        }
    }

    const getMyNonce = async(wallet) =>{
        let rt = await getNonce(wallet);
        return rt.data.nonce;
    }

    const sign = async() =>{
        if(!isConnected || !signer.provider)return;
        console.error("===provider=",signer.provider)
        setConnectWallet(false);
        const eip55Addr = ethers.utils.getAddress(address);

        // const chainId = await  signer.getChainId();
        const {chainId} =  await signer.provider.getNetwork();


        let nonce = await getMyNonce(address);
        const siweMessage = createSiweMessage(eip55Addr, chainId, nonce, 'Welcome to SeeDAO!');
        setMsg(siweMessage)
        console.log("{=====siweMessage====",siweMessage)
        try{

            let signData = await signer.signMessage(siweMessage);
            setSignInfo(signData)
            // const signData = await ethereum.request({
            //     method: 'personal_sign',
            //     params: [siweMessage, eip55Addr],
            // });
            console.log("{=====signData====",signData)
            // setSignInfo(signData)
        }catch (e) {
            console.log("=====error",JSON.stringify(e))
        }

    }

    useEffect(()=>{
        if(!result)return;
        console.log("==result==",result)
        navigate('/board');

    },[result])


    const LoginTo = async () =>{


        const { host} = AppConfig;
        let obj = {
            wallet: address,
            message: msg,
            signature: signInfo,
            domain: host,
            wallet_type: 'EOA',
            is_eip191_prefix: true,
        };
        try{
            let rt = await login(obj);
            console.error('RESULT', rt.data);
            setResult(rt.data)
            store.dispatch(saveUserToken(rt.data));
            store.dispatch(saveWalletType("metamask"));
            store.dispatch(saveAccount(address))
            store.dispatch(saveLoading(false));
            // store.dispatch(saveSigner(signer));

        }catch (e){
            console.error(e)
        }
    }

    return <div>
        <Button  onClick={()=>onClick()}>Metamask</Button>

        {/*<Button onClick={()=>sign()}>Sign</Button>*/}
    </div>
}
