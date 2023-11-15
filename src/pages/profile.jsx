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
  margin: 16px 0;
  .rhtTop{
    flex-grow: 1;
  }
  .name{
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;

  }
`

const FlexLine = styled.div`
  display: flex;
  align-items: center;
`

const ProgressBox = styled.div`
  width: 100%;
  height: 6px;
  background: #EEEEF4;
  border-radius: 6px;
  overflow: hidden;
  .inner{
    height: 6px;
    background: var(--primary-color);
    width: ${props => props.width +"%"};
    border-radius:8px;
  }
`

const ProgressOuter = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 16px;
  padding:14px;
  margin-top: 15px;
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
  .rht{
    display: flex;
    align-items: center;
    color: #9a9a9a;
    font-size: 11px;
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
  margin:0 0 24px 24px;
  dt{
    margin-bottom: 10px;
  }
  ul{
    display: flex;
    align-items: center;
  }
  li{

    flex-shrink: 0;
    width: 60px;
    background: #FFFFFF;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.02);
    border-radius: 8px;
    margin-right: 12px;
    text-align: center;
    font-size: 10px;
    font-weight: 400;
    color: #000000;
    padding-bottom: 6px;
    img{
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
      width: 60px;
      height: 60px;
      object-fit: cover;
      object-position: center;
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
  border-radius: 0;
  opacity: 1;
`

const TopFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TagBox = styled.ul`
  font-size: 12px;
  flex-wrap: wrap;
  display: flex;
  font-weight: 400;
  margin-top: 10px;
  li {
    border-radius: 20px;
    padding-inline: 10px;
    line-height: 22px;
    margin: 0 8px 8px 0;
    color: #fff;
    &:nth-child(13n + 1) {
      background: #2DC45E;
    }
    &:nth-child(13n + 2) {
      background: #FFA5BA ;
    }
    &:nth-child(13n + 3) {
      background: #FA9600;
    }
    &:nth-child(13n + 4) {
      background: #DDE106;
    }
    &:nth-child(13n + 5) {
      background: #C972FF;
    }
    &:nth-child(13n + 6) {
      background: #dde106;
    }
    &:nth-child(13n + 7) {
      background: #1f9e14;
    }
    &:nth-child(13n + 8) {
      background: #fa9600;
    }
    &:nth-child(13n + 9) {
      background: #ffa5ba;
    }
    &:nth-child(13n + 10) {
      background: #c972ff;
    }
    &:nth-child(13n + 11) {
      background: #ff5ae5;
    }
    &:nth-child(13n + 12) {
      background: #149e7d;
    }
    &:nth-child(13n) {
      background: #ff3f3f;
    }
  }
`;

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);

  const [roles, setRoles] = useState([]);
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
      setDetail(rt.data);
      setRoles(rt.data.roles);
      let mapArr = new Map();

      rt.data.social_accounts.map((item) => {
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

  const switchRoles = (role) => {
    let str = '';
    switch (role) {
      case 'SGN_HOLDER':
        str = t('roles.SGN_HOLDER');
        break;
      case 'NODE_S1':
        str = t('roles.NODE_S1');
        break;
      case 'NODE_S2':
        str = t('roles.NODE_S2');
        break;
      case 'NODE_S3':
        str = t('roles.NODE_S3');
        break;
      case 'NODE_S4':
        str = t('roles.NODE_S4');
        break;
      case 'CITYHALL_S1':
        str = t('roles.CITYHALL_S1');
        break;
      case 'CITYHALL_S2':
        str = t('roles.CITYHALL_S2');
        break;
      case 'CITYHALL_S3':
        str = t('roles.CITYHALL_S3');
        break;
      case 'CITYHALL_S4':
        str = t('roles.CITYHALL_S4');
        break;
      case 'CONTRIBUTOR_L1':
        str = t('roles.CONTRIBUTOR_L1');
        break;
      case 'CONTRIBUTOR_L2':
        str = t('roles.CONTRIBUTOR_L2');
        break;
      case 'CONTRIBUTOR_L3':
        str = t('roles.CONTRIBUTOR_L3');
        break;
      case 'CONTRIBUTOR_L4':
        str = t('roles.CONTRIBUTOR_L4');
        break;
      case 'CONTRIBUTOR_L5':
        str = t('roles.CONTRIBUTOR_L5');
        break;
      case 'CONTRIBUTOR_L6':
        str = t('roles.CONTRIBUTOR_L6');
        break;
      case 'CONTRIBUTOR_L7':
        str = t('roles.CONTRIBUTOR_L7');
        break;
      case 'CONTRIBUTOR_L8':
        str = t('roles.CONTRIBUTOR_L8');
        break;
      case 'CONTRIBUTOR_L9':
        str = t('roles.CONTRIBUTOR_L9');
        break;
      case 'SEEDAO_MEMBER':
        str = t('roles.SEEDAO_MEMBER');
        break;
      case 'SEEDAO_ONBOARDING':
        str = t('roles.SEEDAO_ONBOARDING');
        break;
      default:
        str = role;
        break;
    }
    return str;
  };

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
              <div className="name">{detail?.nickname}</div>
              <div>{sns}</div>
              <FlexLine>
                <div>{publicJs.AddressToShow(detail?.wallet)}</div>
                {/*<RhtBox>*/}
                {/*  <CopyBox text={detail?.wallet} />*/}
                {/*</RhtBox>*/}
              </FlexLine>
          </div>
        </FlexBox>
        <div>{detail?.bio}</div>


        <TagBox>
          {roles?.map((item, index) => (
              <li key={`tag_${index}`}>{switchRoles(item)}</li>
          ))}
        </TagBox>
        <ProgressOuter>
          <FstLine>
            <div className="lft">
              <LevelBox>
                LV {detail?.level?.current_lv}
              </LevelBox>
              <SCRBox>{detail?.scr?.amount} SCR</SCRBox>
            </div>
              <div className="rht">
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
                    <div><img src={item.image_uri} alt=""/></div>
                    <div>ID {item.token_id}</div>
                  </li>))
                }

              </ul>
            </dd>
          </dl>
      </NftBox>
      <NftBox>
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
