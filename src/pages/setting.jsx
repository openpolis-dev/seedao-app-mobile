import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {ChevronRight} from "react-bootstrap-icons";
import {Offcanvas} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import store from "../store";
import {saveAccount,saveUserToken,saveWalletType} from "../store/reducer";

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

const LanBox = styled(Offcanvas)`
  display: flex;
  --bs-offcanvas-height:auto;
`

const LastBox = styled.ul`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  li{
    border-bottom: 1px solid #eee;
    padding:10px;
    &:last-child{
      border-bottom: 0;
    }
  }
`
export default function Setting() {
    const navigate = useNavigate();
    const userToken = useSelector(state=> state.userToken);


    const toGo = (url) =>{
        navigate(url)
    }
    const {t,i18n} = useTranslation();
    const[show,setShow]= useState(false);
    const [list] = useState([
        {
            name: "中文",
            value: "zh"
        },
        {
            name: "English",
            value: "en"
        }
    ])
    const returnLan = () =>{
        const arr = list.filter(item=>item.value === i18n.language )
        return arr[0].name
    };

    const changeLan = (index) =>{
        i18n.changeLanguage(list[index].value);
        setShow(false);

        // let str = list[index].value === "zh"? "zh-Hans":list[index].value
    }
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
        // store.dispatch(saveLogout(true));
        navigate("/login");
    }

    return <Layout noTab title={t('mobile.my.setting')}>
        <Box>
            <LanBox show={show} onHide={handleClose} placement="bottom">
                <LastBox>
                    {list.map((l, i) => (
                        <li key={i} onClick={()=>changeLan(i)}>
                            <div>{l.name}</div>
                        </li>
                    ))}
                </LastBox>

            </LanBox>

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


        </Box>
    </Layout>
};
