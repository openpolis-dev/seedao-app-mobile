
import {
    connectWithRedirect,
    connectCallback,
    signMessageWithRedirect,
    signMessageCallback,
} from "@joyid/evm";
import {useEffect, useState} from "react";
import store from "../../store";
import { saveAccount, saveUserToken, saveWalletType, saveThirdPartyToken } from "../../store/reducer";
import { getNonce, loginWithSeeAuth, loginToMetafo, loginToDeschool } from "../../api/user";
import {ethers} from "ethers";
import {createSiweMessage} from "../../utils/publicJs";
import AppConfig from "../../AppConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactGA from "react-ga4";
import usePushPermission from "hooks/usePushPermission";
import JoyidImg from "../../assets/Imgs/joyid.png";
import ArrImg from "../../assets/Imgs/arrow.svg";
import OneSignal from "react-onesignal";
import getConfig from "constant/envCofnig";
import { SELECT_WALLET, Wallet, METAFORO_TOKEN } from "utils/constant";
import { prepareMetaforo } from "api/proposalV2";

const CONFIG = getConfig();

export default function Joyid(){

    const navigate = useNavigate();
    const [account, setAccount] = useState();
    const [sig, setSig] = useState("");
    const [msg,setMsg] = useState();
    const [result,setResult] = useState(null);
    const handlePermission = usePushPermission();
    const [search] = useSearchParams();
    const action = search.get("action");

    useEffect(() => {
        const redirectHome = () => {
            if (action !== "connect") {
                const _address = localStorage.getItem("joyid-address");
                if (_address) {
                  setAccount(_address);
                  return;
                }
            } 
            let state;
            try {
                state = connectCallback();
                if (state?.address) {
                    setAccount(state.address);
                    store.dispatch(saveAccount(state.address))
                    localStorage.setItem("joyid-address", state.address);
                    return true;
                }
            } catch (error) {
                console.log("callback:", error);
                localStorage.removeItem("joyid-status")
            }
        };

        const redirectSignMessage = () => {
            let state;
            try {
                state = signMessageCallback();
                setSig(state.signature);
                return true;
            } catch (error) {
                console.log("callback sign:", error);
                localStorage.removeItem("joyid-status")
            }
        };
        redirectHome();
        if (action === "sign-message") {
            redirectSignMessage();
        }
    }, []);

    const buildRedirectUrl = (action) => {
        const url = new URL(`${window.location.origin}/login`);
        url.searchParams.set("action", action);
        return url.href;
    }

    useEffect(()=>{
        let action = localStorage.getItem("joyid-status")
        if(!account || action !== "login" ) return;
        onSignMessageRedirect()
    },[account])

    useEffect(()=>{
        if(!sig || !account) return;
        LoginTo()
    },[sig,account])


    const getMyNonce = async(wallet) =>{
        let rt = await getNonce(wallet);
        return rt.data.nonce;
    }

    const onSignMessageRedirect = async() => {
        localStorage.setItem("joyid-status","sign")
        try{
            let nonce = await getMyNonce(account);
            const eip55Addr = ethers.utils.getAddress(account);

            const siweMessage = createSiweMessage(eip55Addr, CONFIG.NETWORK.chainId, nonce, "Welcome to SeeDAO!");
            setMsg(siweMessage)
            localStorage.setItem("joyid-msg",siweMessage)

            const url = buildRedirectUrl("sign-message");
            signMessageWithRedirect(url, siweMessage, account, {
              joyidAppURL: `${CONFIG.JOY_ID_URL}`,
              state: msg,
              network: {
                chainId: CONFIG.NETWORK.chainId,
                name: CONFIG.NETWORK.name,
              },
            });
        }catch (e){
            logError("onSignMessageRedirect",e)
        }

    };


    const onConnectRedirect = () => {
        handlePermission(() => {
            localStorage.setItem("joyid-status", "login");
            const url = buildRedirectUrl("connect");
            connectWithRedirect(url, {
              joyidAppURL: `${CONFIG.JOY_ID_URL}/?prefer=login`,
              network: {
                chainId: CONFIG.NETWORK.chainId,
                name: CONFIG.NETWORK.name,
              },
            });
        });
    };


    const LoginTo = async () =>{
        localStorage.setItem("joyid-status",null)
        const { host} = AppConfig;
        let ms =  localStorage.getItem("joyid-msg")
        try{
            let rt = await loginWithSeeAuth({
              wallet: account,
              message: ms,
              signature: sig,
              domain: host,
              walletName: "joyid",
            });
          // login to third party
          let metaforoUserId = undefined;
          try {
            const loginResp = await Promise.all([
              loginToMetafo(rt.data.see_auth),
              // loginToDeschool(rt.data.see_auth)
            ]);
            store.dispatch(
              saveThirdPartyToken({
                metaforo: loginResp[0].data.token,
                // deschool: loginResp[1].data.jwtToken,
              }),
            );
            if (loginResp[0].data.user_id) {
              metaforoUserId = loginResp[0].data.user_id;
              localStorage.setItem(
                METAFORO_TOKEN,
                JSON.stringify({ id: loginResp[0].data.user_id, account, token: loginResp[0].data.token }),
              );
            }
          } catch (error) {
            console.error("3rd party login error", error);
          }

            const now = Date.now();
            rt.data.token_exp = now + rt.data.token_exp * 1000;
            store.dispatch(saveUserToken(rt.data));
            store.dispatch(saveWalletType(Wallet.JOYID));
            ReactGA.event("login_success",{
                type: "joyid",
                account:"account:"+account
            });
            localStorage.setItem(SELECT_WALLET, Wallet.JOYID);
            setResult(rt.data)
            try {
              await OneSignal.login(account.toLocaleLowerCase());
            } catch (error) {
              logError("OneSignal login error", error);
            }
            metaforoUserId && prepareMetaforo(metaforoUserId);

        }catch (e){
            logError(e)
            ReactGA.event("login_failed",{type: "joyid"});
        }

    }

    useEffect(()=>{
        if (!result) return;
        const beforePath = localStorage.getItem(`before-login`)
        if (beforePath?.startsWith("1_")) {
          localStorage.removeItem(`before-login`);
          navigate(`/sns/register${beforePath?.split("_")[1] || ""}`);
        } else if (beforePath?.startsWith("/")) {
          localStorage.removeItem(`before-login`);
          navigate(beforePath);
        } else {
          navigate("/home");
        }

    },[result])

    return<dl onClick={()=>onConnectRedirect()}>
            <dt >
                <div className="logo">
                    <img src={JoyidImg} alt="" />
                </div>
                <span>JoyID</span>
            </dt>
                <img src={ArrImg} alt=""/>
        </dl>
}


