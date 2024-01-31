
import {useEffect, useState} from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useSwitchNetwork } from "wagmi";
import {useEthersSigner } from '../../utils/ethersNew';
import store from "../../store";
import { saveLoading, saveAccount, saveUserToken, saveWalletType, saveThirdPartyToken } from "../../store/reducer";
import {ethers} from "ethers";
import { getNonce, loginWithSeeAuth, loginToMetafo, loginToDeschool } from "../../api/user";
import {createSiweMessage} from "../../utils/publicJs";
import {useNavigate} from "react-router-dom";
import AppConfig from "../../AppConfig";
import ReactGA from "react-ga4";
import usePushPermission from "hooks/usePushPermission";
import MetamaskLogo from "../../assets/Imgs/METAmask.svg";
import ArrImg from "../../assets/Imgs/arrow.svg";
import OneSignal from "react-onesignal";
import { SELECT_WALLET, Wallet, SEE_AUTH } from "utils/constant";
import { METAFORO_TOKEN } from "utils/constant";
import { prepareMetaforo } from "api/proposalV2";
import getConfig from "constant/envCofnig";

// https://github.com/MetaMask/metamask-sdk/issues/381
// https://github.com/MetaMask/metamask-mobile/issues/7165
// https://github.com/WalletConnect/web3modal/issues/1369

export default function  Metamask(){
    const navigate = useNavigate();
    const { open } = useWeb3Modal();
    const { isConnected,address } = useAccount();
    const { disconnect } = useDisconnect();
    const [msg,setMsg] = useState();
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);
    const [connectWallet, setConnectWallet] = useState(false);
    const { switchNetworkAsync } = useSwitchNetwork();


    const handlePermission = usePushPermission();
    const signer = useEthersSigner();
    console.log("signer: ", signer);

    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])

    useEffect(()=>{
        if(!signer || !connectWallet || !address) return;
        sign()
    },[signer,connectWallet])

    const onOpen = async() =>{
        store.dispatch(saveLoading(true));
        await open();

    }

    const onClick = async () => {
        handlePermission(async () => {
            disconnect();
            await onOpen();
            setConnectWallet(true);
        });
    }

    const getMyNonce = async(wallet) =>{
        let rt = await getNonce(wallet);
        return rt.data.nonce;
    }

    const sign = async () => {
      if (!isConnected || !signer.provider) return;
      try{
        const eip55Addr = ethers.utils.getAddress(address);
        try {
          const { chainId } = await signer.provider.getNetwork();
          let nonce = await getMyNonce(address);
          const siweMessage = createSiweMessage(eip55Addr, chainId, nonce, "Welcome to SeeDAO!");
          setMsg(siweMessage);
          let signData = await signer.signMessage(siweMessage);
          setSignInfo(signData);
          setConnectWallet(false);
        } catch (error) {
          // switch
          await switchNetworkAsync(getConfig().NETWORK.chainId);
          return;
        }
          
      }catch (e) {
          setConnectWallet(true);
          disconnect();
          logError("error",JSON.stringify(e))
      }

    }

    useEffect(()=>{
        if(!result)return;
        if (localStorage.getItem(`==sns==`) === "1") {
          localStorage.removeItem(`==sns==`);
          navigate("/sns/register");
        } else {
          navigate("/home");
        }
    },[result])


    const LoginTo = async () =>{


        const { host} = AppConfig;
        try{
          let rt = await loginWithSeeAuth({
            wallet: address,
            message: msg,
            signature: signInfo,
            domain: host,
            walletName: "metamask",
          });
          // login to third party
          const loginResp = await Promise.all([loginToMetafo(rt.data.see_auth), loginToDeschool(rt.data.see_auth)]);
          store.dispatch(
            saveThirdPartyToken({
              metaforo: loginResp[0].data.token,
              deschool: loginResp[1].data.jwtToken,
            }),
          );
          localStorage.setItem(
            METAFORO_TOKEN,
            JSON.stringify({ id: loginResp[0].data.user_id, account: address, token: loginResp[0].data.token }),
          );

          setResult(rt.data);
          const now = Date.now();
          rt.data.token_exp = now + rt.data.token_exp * 1000;
          store.dispatch(saveUserToken(rt.data));
          store.dispatch(saveWalletType(Wallet.METAMASK));
          store.dispatch(saveAccount(address));
          store.dispatch(saveLoading(false));

          localStorage.setItem(SELECT_WALLET, Wallet.METAMASK);

          try {
            await OneSignal.login(address.toLocaleLowerCase());
          } catch (error) {
            logError("OneSignal login error", error);
          }
          prepareMetaforo(loginResp[0].data.user_id);

          ReactGA.event("login_success", {
            type: "metamask",
            account: "account:" + address,
          });
          
        }catch (e){
            logError(e)
            ReactGA.event("login_failed",{type: "metamask"});
        }
    }

    return <dl onClick={()=>onClick()}>
        <dt >
            <div className="logo metamask">
                <img src={MetamaskLogo} alt=""/>
            </div>

            <span>MetaMask</span>
        </dt>
        <img src={ArrImg} alt=""/>
    </dl>
}
