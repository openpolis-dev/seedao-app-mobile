import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import store from "../store";
import {saveAccount, saveLoading, saveUserToken, saveWalletType} from "../store/reducer";
import { getUser } from "../api/user";
import Avatar from "components/common/avatar";
import CopyBox from "components/common/copy";
import useParseSNS from "hooks/useParseSNS";
import publicJs from "../utils/publicJs";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap"
import {useSelector} from "react-redux";
import {useDisconnect} from "wagmi";

const Box = styled.div`
  padding: 20px;
`;

const LineBox = styled.div`
  dl {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  dt {
    background: #fff;
    padding: 5px 10px;
    width: 80px;
    font-size: 14px;
    font-weight: normal;
    flex-shrink: 0;
  }
  dd {
    word-break: break-all;
    padding: 5px 10px;
    font-size: 14px;
  }
`;
const RhtBox = styled.div`
  font-size: 20px;
  padding-top: 7px;
`;

const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;


const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 40px;
  .rhtTop{
    flex-grow: 1;
  }
`

const FlexLine = styled.div`
  display: flex;
  align-items: center;
`

const ProgressBox = styled.div`
  width: 100%;
  height: 10px;
  background: #fff;
  border:2px solid #000;
  border-radius: 10px;
  overflow: hidden;
  .inner{
    height: 8px;
    background: #000;
    width: ${props => props.width +"%"};
    border-radius:8px;
  }
`

const ProgressOuter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0 20px;
`

const FstLine = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const LevelBox = styled.div`
    background: #ff3231;
  color: #fff;
  padding: 2px 10px;
  border-radius: 7px;
  text-transform: uppercase;
  font-size: 12px;
`

const SCRBox = styled.div`
    font-size:15px;
  text-align: right;
  font-weight: 700;
`
const TipsBox = styled.div`
    color: #b5b6c4;
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NftBox = styled.div`
  margin: 0 20px 50px;
  dt{
    margin-bottom: 20px;
  }
  ul{
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }
  li{
    height: 21vw;
    float: left;
    width: 21vw;
    margin-right: 1.8vw;
    margin-bottom: 10px;
    &:nth-child(4n){
      margin-right: 0;
    }
    img{
      width: 100%;
      border-radius: 16px;
    }
  }
`

const TopBtn = styled.div`
  text-align: right;
`

const BtmBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  button{
    width: 70vw;
  }
`

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const userToken = useSelector(state=> state.userToken);
  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);
  const walletType = useSelector(state => state.walletType);
  const { disconnect } = useDisconnect();
  const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wechat, setWechat] = useState('');
  const [mirror, setMirror] = useState('');

  // useEffect(() => {
  //   toGA();
  // }, []);
  //
  // const toGA = async () => {
  //   // await analyticsGoogle("Profile", { account })
  // };

  const ToGo = () =>{
    navigate("/user/edit")
  }

  useEffect(() => {
    getMyDetail();
  }, []);
  const getMyDetail = async () => {
    store.dispatch(saveLoading(true));
    try {
      let rt = await getUser();
      setDetail(rt);

      let mapArr = new Map();

      rt.social_accounts.map((item) => {
        mapArr.set(item.network, item.identity);
      });
      setTwitter(mapArr.get('twitter') ?? '');
      setDiscord(mapArr.get('discord') ?? '');
      setWechat(mapArr.get('wechat') ?? '');
      setMirror(mapArr.get('mirror') ?? '');

    } catch (e) {
      console.error(e);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const formatNumber = (amount) => {
    if (!amount) {
      return "0";
    }
    return Number(amount).toLocaleString("en-US");
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

  return (
    <Layout title={t("My.MyProfile")}>
      <Box>
        <TopBtn onClick={()=>ToGo()}>
          编辑
        </TopBtn>
        <FlexBox>
          <AvatarBox>
            <Avatar size="80px" src={detail?.avatar} />
          </AvatarBox>
          <div className="rhtTop">
              <div>{detail?.nickname}</div>
              <div>{sns}</div>
              <FlexLine>
                <div>{publicJs.AddressToShow(detail?.wallet)}</div>
                <RhtBox>
                  <CopyBox text={detail?.wallet} />
                </RhtBox>
              </FlexLine>
          </div>
        </FlexBox>
        <ProgressOuter>
          <FstLine>
            <LevelBox>
             level {detail?.level?.current_lv}
            </LevelBox>
            <SCRBox>{detail?.scr?.amount} SCR</SCRBox>
          </FstLine>
          <ProgressBox width={detail?.level?.upgrade_percent}>
            <div className="inner" />
          </ProgressBox>
          <TipsBox>
            <div>
              next level:
            </div>
            <div>
              {formatNumber(detail?.level?.scr_to_next_lv)} SCR
            </div>

          </TipsBox>
        </ProgressOuter>
        <LineBox>
          <dl>
            <dt>{t("My.Bio")}</dt>
            <dd>{detail?.bio}</dd>
          </dl>
          <dl>
            <dt>{t("My.Email")}</dt>
            <dd>{detail?.email}</dd>
          </dl>
          <dl>
            <dt>{t("My.Discord")}</dt>
            <dd>{discord}</dd>
          </dl>
          <dl>
            <dt>{t("My.Twitter")}</dt>
            <dd>{twitter}</dd>
          </dl>
          <dl>
            <dt>{t("My.WeChat")}</dt>
            <dd>{wechat}</dd>
          </dl>
          <dl>
            <dt>{t("My.Mirror")}</dt>
            <dd>{mirror}</dd>
          </dl>
        </LineBox>
      </Box>
      <NftBox>
          <dl>
            <dt>SEED</dt>
            <dd>
              <ul>
                {
                  detail?.seed?.map((item,index)=>(<li key={index}>
                    <img src={item.image_uri} alt=""/>
                  </li>))
                }

              </ul>
            </dd>
          </dl>
        <dl>
            <dt>SBT</dt>
            <dd>
              <ul>
                {
                  detail?.sbt?.map((item,index)=>(<li key={index}>
                    <img src={item.image_uri} alt=""/>
                  </li>))
                }

              </ul>
            </dd>
          </dl>
      </NftBox>
      <BtmBox>
        {
            !!userToken?.token && <Button onClick={()=>logout()}>{t('mobile.my.logout')}</Button>
        }
      </BtmBox>

    </Layout>
  );
}
