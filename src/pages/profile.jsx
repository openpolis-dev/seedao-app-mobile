import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import store from "../store";
import {saveLoading} from "../store/reducer";
import { getUser } from "../api/user";
import Avatar from "components/common/avatar";
import CopyBox from "components/common/copy";
import useParseSNS from "hooks/useParseSNS";
import publicJs from "../utils/publicJs";
import {useNavigate} from "react-router-dom";
import {ChevronLeft} from "react-bootstrap-icons";
const Box = styled.div`
  padding: 20px;
`;

const LineBox = styled.div`
  margin: 0 24px;
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  dl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  dt {
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
  height: 6px;
  background: #fff;
  border:1px solid #000;
  border-radius: 6px;
  overflow: hidden;
  .inner{
    height: 6px;
    background: #000;
    width: ${props => props.width +"%"};
    border-radius:8px;
  }
`

const ProgressOuter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0 20px;
  background: #fff;
  border-radius: 16px;
  padding:14px;
`

const FstLine = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .lft{
    display: flex;
    align-items: center;
  }
`

const LevelBox = styled.div`
  text-transform: uppercase;
  padding-right: 10px;
  font-size: 12px;
  font-family: Poppins-ExtraBold;
  font-weight: normal;
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

const OuterBox = styled.div`

  background: linear-gradient(182deg, #EEE6FF 1%, rgba(225,242,249,0.72) 50%, rgba(255,255,255,0) 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
`

const TopFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);


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

  const backTop = () =>{
    navigate(-1)
  }

  return (
      <OuterBox>


    <Layout noHeader noTab>
      <Box>
        <TopFlex>
          <div xs={2} onClick={()=>backTop()}><ChevronLeft /></div>
          <TopBtn onClick={()=>ToGo()}>
            编辑
          </TopBtn>
        </TopFlex>

        <FlexBox>
          <AvatarBox>
            <Avatar size="56px" src={detail?.avatar} />
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
            <div className="lft">
              <LevelBox>
                LV {detail?.level?.current_lv}
              </LevelBox>
              <SCRBox>{detail?.scr?.amount} SCR</SCRBox>
            </div>
              <div>
                <div>
                  next level:
                </div>
                <div>
                  {formatNumber(detail?.level?.scr_to_next_lv)} SCR
                </div>
              </div>
          </FstLine>
          <ProgressBox width={detail?.level?.upgrade_percent}>
            <div className="inner" />
          </ProgressBox>
        </ProgressOuter>

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

      <LineBox>
        <div>{detail?.bio}</div>
        <dl>
          <dt>{t("My.Email")}</dt>
          <dd>{detail?.email}</dd>
        </dl>
        {/*<dl>*/}
        {/*  <dt>{t("My.Discord")}</dt>*/}
        {/*  <dd>{discord}</dd>*/}
        {/*</dl>*/}
        <dl>
          <dt>{t("My.Twitter")}</dt>
          <dd>{twitter}</dd>
        </dl>
        {/*<dl>*/}
        {/*  <dt>{t("My.WeChat")}</dt>*/}
        {/*  <dd>{wechat}</dd>*/}
        {/*</dl>*/}
        <dl>
          <dt>{t("My.Mirror")}</dt>
          <dd>{mirror}</dd>
        </dl>
      </LineBox>

    </Layout>
      </OuterBox>
  );
}
