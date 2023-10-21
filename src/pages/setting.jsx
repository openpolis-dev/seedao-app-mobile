import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {ChevronRight} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import store from "../store";
import {saveAccount,saveUserToken,saveWalletType} from "../store/reducer";
import {useDisconnect} from "wagmi";
import SwitchLan from "../components/common/switchLan";
import AppConfig from "../AppConfig";

const Box = styled.div`
    padding: 0 20px;
`

const Item = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-block: 15px;
  font-size: 14px;
`


export default function Setting() {
    const navigate = useNavigate();
    const userToken = useSelector(state=> state.userToken);
    const walletType = useSelector(state => state.walletType);
    const { disconnect } = useDisconnect();
    const toGo = (url) =>{
        navigate(url)
    }
    const {t,i18n} = useTranslation();
    const[show,setShow]= useState(false);
    const returnLan = () =>{
        const arr = AppConfig.Lan.filter(item=>item.value === i18n.language )
        return arr[0].name
    };


    const showBtm = () =>{
        setShow(true)
    }
    const handleClose = () =>{
        setShow(false)
    }

    const logout = () =>{
        store.dispatch(saveAccount(null));
        store.dispatch(saveUserToken(null));
        store.dispatch(saveWalletType(null));
        if(walletType ==="metamask"){
            disconnect();
        }
        // store.dispatch(saveLogout(true));
        navigate("/login");
    }
    const upgradeSW = () => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (const registration of registrations) {
              registration.update();
            }
          });
        }
    }

    return <Layout noTab title={t('mobile.my.setting')}>
        <Box>
            <SwitchLan show={show} handleClose={handleClose} />

            <Item onClick={()=>showBtm()}>
                <div>
                    {t('mobile.my.language')}
                </div>
                <div>
                    <span>{returnLan()}</span>
                    <ChevronRight />
                </div>
            </Item>
            <Item onClick={()=>toGo("/privacy")}>
                <div>{t('mobile.my.privacy')}</div>
                <ChevronRight />
            </Item>
            <Item onClick={()=>toGo()}>
                <div>{t('mobile.my.version')}</div>
                <div>
                    <span>  {process.env.REACT_APP_APP_VERSION} Build {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.
                        {process.env.REACT_APP_COMMIT_RE?.slice(0, 6)}</span>
                    <ChevronRight />
                </div>

            </Item>
            {
                !!userToken?.token &&  <Item onClick={()=>logout()}>
                    <div>{t('mobile.my.logout')}</div>
                    <ChevronRight />
                </Item>
            }
            <Item onClick={upgradeSW}>
                <div>upgrade</div>
                <ChevronRight />
            </Item>
        </Box>
    </Layout>
};
