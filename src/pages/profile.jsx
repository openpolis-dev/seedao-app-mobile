import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import store from "../store";
import { saveLoading } from "../store/reducer";
import {getUser} from "../api/user";
import {Clipboard2Check} from "react-bootstrap-icons";
import DefaultImg from "../assets/images/avatar.jpg";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Box = styled.div`
    padding: 20px;
`

const LineBox = styled.div`
    dl{
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
    }
  dt{
    background: #fff;
    padding:5px 10px;
    width: 80px;
    font-size: 14px;
    font-weight: normal;
  }
  dd{
    word-break: break-all;
    padding: 5px 10px;
    font-size: 14px;
  }
`
const RhtBox = styled.div`
    font-size: 20px;
  padding-top: 5px;
`

const Avatar = styled.div`
    display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
  img{
    border-radius: 100%;
    width: 100px;
    height: 100px;
  }
`

const TipsBox = styled.div`
  background: rgba(0,0,0,0.2);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`
const InnerBox = styled.div`
    background: #fff;
  padding: 10px 20px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.08);
`

export default function Profile(){
    const {t,i18n} = useTranslation();

    const [detail,setDetail] = useState();
    const [showCopid,setShowCopid] = useState(false);

    const account = useSelector(state=> state.account);
    useEffect(()=>{
        toGA()
    },[])

    const toGA = async () =>{
        // await analyticsGoogle("Profile", { account })
    }


    useEffect(()=>{
        getMyDetail()
    },[])
    const getMyDetail = async  () =>{
        store.dispatch(saveLoading(true));
        try{
            let rt = await getUser()
            setDetail(rt.data)
        }catch (e) {
            console.error(e)
        }finally {
            store.dispatch(saveLoading(false));
        }
    }

    const copyTo = () =>{
        setShowCopid(true)
        // PublicJs.copyToClipboard(wallet)
        setTimeout(()=>{
            setShowCopid(false)
        },1000)
    }

    return <Layout noTab title={t('My.MyProfile')}>
        {
            showCopid &&  <TipsBox>
                <InnerBox>
                    {t('mobile.my.wallet')} {t('mobile.copied')}
                </InnerBox>
            </TipsBox>
        }


        <Box>
            <Avatar>
                {!!detail?.avatar && (
                    <img src={detail.avatar} alt=""/>
                )}
                {!detail?.avatar && (
                    <img src={DefaultImg} alt=""/>
                )}
            </Avatar>
            <LineBox>
                <dl>
                    <dt>{t('My.Name')}</dt>
                    <dd>{detail?.name}</dd>
                </dl>
                <dl>
                    <dt>{t('mobile.my.wallet')}</dt>
                    <dd>
                        {detail?.wallet}
                    </dd>
                    <RhtBox>
                        <CopyToClipboard text={detail?.wallet}
                                         onCopy={() => copyTo(detail?.wallet)}>
                            <Clipboard2Check />
                        </CopyToClipboard>

                    </RhtBox>
                </dl>
                <dl>
                    <dt>{t('My.Email')}</dt>
                    <dd>{detail?.email}</dd>
                </dl>
                <dl>
                    <dt>{t('My.Discord')}</dt>
                    <dd>{detail?.discord_profile}</dd>
                </dl>
                <dl>
                    <dt>{t('My.Twitter')}</dt>
                    <dd>{detail?.twitter_profile}</dd>
                </dl>
                <dl>
                    <dt>{t('My.WeChat')}</dt>
                    <dd>{detail?.wechat}</dd>
                </dl>
                <dl>
                    <dt>{t('My.Mirror')}</dt>
                    <dd>{detail?.mirror}</dd>
                </dl>
                <dl>
                    <dt>{t('My.Google')}</dt>
                    <dd>{detail?.google_profile}</dd>
                </dl>
            </LineBox>
        </Box>
    </Layout>
}
