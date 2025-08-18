import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import store from "../store";
import { useSelector } from "react-redux";
import { clearLogin, saveLoading, saveUserToken } from "../store/reducer";
import { getUser } from "../api/user";
import Avatar from "components/common/avatar";
import useParseSNS from "hooks/useParseSNS";
import publicJs from "../utils/publicJs";
import {useNavigate} from "react-router-dom";
import PublicJs from "../utils/publicJs";
import SbtCatMobile from "../components/profile/sbtCatMobile";
import CopyBox from "../components/common/copy";
import EmailImg from "../assets/Imgs/social/email.svg";
import Twitter from "../assets/Imgs/social/twitter.svg";
import MirrorImg from "../assets/Imgs/social/mirror.svg";
import GithubImg from "../assets/Imgs/social/github.svg"
import {useDisconnect} from "wagmi";
import { clearStorage } from "utils/auth";
import getConfig from "constant/envCofnig";
import VersionBox from "components/version";
import {DEEPSEEK_API_URL, getNewToken} from "../api/chatAI";
import {RefreshCcw,Copy,Send,Download,ChevronRight,DollarSign} from "lucide-react";
import useToast from "../hooks/useToast";
import SendModal from "./profile/send";
import Receive from "./profile/receive";
import dayjs from "dayjs";
import {claimSee} from "../api/see";

const Button = styled.button`
  color: var(--primary-color);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap:2px;
  border: 0;
  cursor: pointer;
`;


const Box = styled.div`
  padding: 20px;
  .bio{
    font-size: 14px;
  }
`;

const LineBox = styled.div`
  margin: 0 20px;
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  dl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  img{
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  dt {
    font-size: 14px;
    font-weight: normal;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: #000000;
    
  }
  dd {
    word-break: break-all;
    padding: 5px 10px;
    font-size: 12px;
    color: #9a9a9a;
    margin-left: 20px;
    text-align: right;
  }
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
  .sns{
    color: #9A9A9A;
    font-size: 13px;
  }
`

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-family: Poppins-Regular;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 22px;
  gap: 5px;
  .iconBtm{
    margin-bottom: -3px;
  }
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
  //margin-bottom: 20px;
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
    //display: flex;
    //align-items: center;
    color: #9a9a9a;
    font-size: 11px;
    &>div:last-child{
      padding-left: 5px;
    }
  }
`

const LevelBox = styled.div`
  text-transform: uppercase;
  padding-right: 10px;
  font-size: 12px;
  font-family: Poppins-SemiBold;
  font-weight: normal;
  font-style: italic;
  flex-shrink: 0;
`;

const SCRBox = styled.div`
  font-size: 12px;
`

const NftBox = styled.div`
  margin:0 0 24px 0;
  dt{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    span{
      font-size: 16px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
    .more{
      font-size: 13px;
      font-weight: 400;
      color: var(--primary-color);
      line-height: 17px;
    }
  }
  ul{
    display: flex;
    align-items: center;
    overflow-x: auto;
    padding:0 10px 0 24px;
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
  background: linear-gradient(181deg, #ebe8fe 1%, rgba(225, 242, 249, 0.72) 44%, #eeeef4 99%);
  border-radius: 0;
  min-height: 100vh;
`;
const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  button {
    width: 89%;
    height: 44px;
    background: #fff;
    border-radius: 16px;
    border: 0;
    font-size: 14px;
    color: #000;
  }
`;


const TagBox = styled.ul`
  font-size: 10px;
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

const ApiBox = styled.div`
  display: flex;
  flex-direction: column;
  //margin-bottom: 20px;


  margin-top: 15px;
  dt{
    margin-bottom: 10px;

    
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: #000000;
    font-size: 16px;
    font-family: Poppins-SemiBold!important;
    font-weight: 600;
  }
  dd{
    background: #fff;

    padding:14px;
    font-size: 12px;
    border-radius: 16px;
  }
  .flexLine{
    display: flex;
    align-items: center;
    gap:10px;
  }
  .gap0{
    gap:0;
    cursor: pointer;
  }
  .flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .gap20{
    gap: 20px;
  }
  .iconBtm{
    margin-bottom: -3px;
  }

  .btm{
    margin-top: 10px;
  }
  .claimBtn{
    background: var(--primary-color);
    padding: 5px 8px;
    color: #fff;
    border-radius: 6px;
    margin-bottom: 5px;
    width: 100%;
    &:disabled{
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .btmCenter{
    width: 100%;
    text-align: center;
  }
  
`

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const userToken = useSelector((state) => state.userToken);

  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);
  const { disconnect } = useDisconnect();
  const walletType = useSelector((state) => state.walletType);

  const [roles, setRoles] = useState([]);
  // const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  // const [wechat, setWechat] = useState('');
  const [mirror, setMirror] = useState('');
  const [github, setGithub] = useState('');
  const [seed, setSeed] = useState([]);
  const [list, setList] = useState([]);
  const [sbt, setSbt] = useState([]);
  const [sbtList,setSbtList] =useState([]);
  const [apiKey, setApiKey] = useState("");
  const[showTransfer, setShowTransfer] = useState(false);
  const[showReceive, setShowReceive] = useState(false);

  const [claimed, setClaimed] = useState(false);
  const[claimAmount, setClaimAmount] = useState("");

  const { Toast, toast } = useToast();

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
    if(!userToken)return;
    getMyDetail();
  }, []);
  const getMyDetail = async () => {
    store.dispatch(saveLoading(true));
    try {
      let rt = await getUser();
      store.dispatch(
        saveUserToken({
          ...userToken,
          user: {
            ...userToken.user,
            avatar: rt.data.avatar,
            bio: rt.data.bio,
            name: rt.data.nickname,
            discord_profile: rt.data.social_accounts?.find((r) => r.network === "discord")?.identity,
            twitter_profile: rt.data.social_accounts?.find((r) => r.network === "twitter")?.identity,
            mirror_profile: rt.data.social_accounts?.find((r) => r.network === "mirror")?.identity,
            github_profile: rt.data.social_accounts?.find((r) => r.network === "github")?.identity,
            email: rt.data.email,
          },
        }),
      );
      setDetail(rt.data);
      setRoles(rt.data.roles);
      setApiKey(rt.data.ds_api_key);
      let mapArr = new Map();


      setClaimAmount(Number(rt.data?.see?.amount_can_be_claimed).toFixed(2) ?? "0");
      setClaimed(rt.data?.see?.claimed ?? false);

      rt.data.social_accounts?.map((item) => {
        mapArr.set(item.network, item.identity);
      });
      setTwitter(mapArr.get('twitter') ?? '');
      // setDiscord(mapArr.get('discord') ?? '');
      // setWechat(mapArr.get('wechat') ?? '');
      setMirror(mapArr.get('mirror') ?? '');
      setGithub(mapArr.get('github') ?? '');
      setSeed(rt.data.seed || []);

      let sbtArr = rt.data.sbt;
      sbtArr?.map( async (seedItem)=>{
        let url= await publicJs.getImage(seedItem.image_uri);
        setSbtList((list)=>[...list,{...seedItem,url}])

      });


    } catch (e) {
      logError(e);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (!seed.length) return;
    setList([]);
    // setSbtList([]);
    seed?.map(async (seedItem) => {
      let url = await PublicJs.getSeedUrl(seedItem.image_uri);
      setList((list) => [...list, { ...seedItem, url }]);
    });

  }, [seed]);


  useEffect(() => {
    if(!sbtList?.length)return;

    setSbt([]);
    const sbtFor = sbtList.filter((item)=>item.name && item.image_uri);

    const groupedData = sbtFor.reduce((result, item) => {
      const key = item?.metadata?.properties?.category? item?.metadata?.properties?.category:"others";
      const group = result?.find((group) => group.category === key);

      if (group) {
        group.tokens.push(item);
      } else {
        result.push({ category: key, tokens: [item] });
      }
      return result;
    }, []);
    setSbt(groupedData)
  }, [sbtList]);


  const formatNumber = (amount) => {
    if (!amount) {
      return "0";
    }
    return Number(amount).toLocaleString("en-US");
  }

  const switchRoles = (role) => {
    let str = '';
    switch (role) {
      case 'SEED_HOLDER':
        str = t('roles.SEED_HOLDER');
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

    if(role.indexOf('CONTRIBUTOR_') > -1){
      const level = role.split("_")[1]
      str = t('roles.CONTRIBUTOR', { level });
    }

    if(role.indexOf('CITYHALL_') > -1){
      const period = role.split("_")[1]
      str = t('roles.CITYHALL', { period });
    }
    if (role.indexOf('NODE_S') > -1) {
      let num = role.split('NODE_S')[1];
      str = `${t('roles.NODE_S')} S${num}`;
    }
    return str;
  };

  const logout = () => {
    store.dispatch(clearLogin());
    if (walletType === "metamask") {
      disconnect();
    }
    clearStorage();
    // store.dispatch(saveLogout(true));
    navigate("/");
  };

  const refreshToken = async() => {
    try {

      let rt = await getNewToken()
      setApiKey(rt.data.apiKey)

    }catch(error) {
      console.error(error);
      toast.danger(`${error.response?.data?.msg||error?.data?.msg || error?.code || error}`);

    }


  }

  const handleClaim = async() =>{
    try {
      await claimSee()
      toast.success(`领取成功`);
      await getMyDetail()
    } catch(error) {
      console.error(error)
      toast.danger(`${error?.data?.msg ||  error?.response?.data?.msg || error}`);
    }
  }

  return (
    <OuterBox>
      {Toast}
      <Layout
        headBgColor="transparent"
        bgColor="#EBE8FE"
        isUserProfle
        rightOperation={<TopBtn onClick={() => ToGo()}>{t("General.Edit")}</TopBtn>}
      >
        <Box>
          <FlexBox>
            <AvatarBox>
              <Avatar size="56px" src={detail?.avatar} />
            </AvatarBox>
            <div className="rhtTop">
              <div className="name">{detail?.nickname}</div>
              <div className="sns">{sns}</div>
              <FlexLine>
                <CopyBox text={detail?.wallet}>
                  <div>{publicJs.AddressToShow(detail?.wallet)}</div>

                </CopyBox>
                <CopyBox text={detail?.wallet}>
                  <Copy size={16} className="iconBtm"></Copy>

                </CopyBox>

                {/*<RhtBox>*/}
                {/*  <CopyBox text={detail?.wallet} />*/}
                {/*</RhtBox>*/}
              </FlexLine>
            </div>
          </FlexBox>
          <div className="bio">{detail?.bio}</div>

          <TagBox>
            {roles?.map((item, index) => (
              <li key={`tag_${index}`}>{switchRoles(item)}</li>
            ))}
          </TagBox>
          <ProgressOuter>
            <FstLine>
              <div className="lft">
                <LevelBox>LV {detail?.level?.current_lv}</LevelBox>
                <SCRBox>
                  {t("My.current")} {Number(detail?.scr?.amount).toFixed(2)} WANG
                </SCRBox>
              </div>
              <div className="rht">
                <div>{t("My.levelTips", { level: Number(detail?.level?.current_lv) + 1 })}</div>
                <div>{formatNumber(detail?.level?.scr_to_next_lv)} WANG</div>
              </div>
            </FstLine>
            <ProgressBox width={detail?.level?.upgrade_percent}>
              <div className="inner" />
            </ProgressBox>
          </ProgressOuter>
          {
              showTransfer &&<SendModal handleClose={()=>setShowTransfer(false)} />
          }
          {
              showReceive &&  <Receive handleClose={()=>setShowReceive(false)} />
          }

          <ApiBox>
            <dt>SEE</dt>


            {
                !claimed &&   <dd>
                  <Button onClick={()=>handleClaim()} className="claimBtn" disabled={!Number(claimAmount)} >
                    <DollarSign size={16} /> <span>{t('see.claim')} {claimAmount} SEE</span></Button>
                  <div className="btmCenter" > {t('see.timeBefore',{time:dayjs('2026.1.11 00:00:00 UTC+8').format("YYYY-MM-DD HH:mm:ss")})}</div>
                </dd>
            }

            {
                claimed &&   <dd>
                  <div className="flex">
                    <div className="flexLine gap20">
                      <span>{Number(detail?.see?.amount ??0 ).toFixed(2)} SEE</span>
                      <Button onClick={()=>setShowTransfer(true)} ><Send size={16} />{t('see.transfer')}</Button>
                      <Button onClick={()=>setShowReceive(true)}><Download size={16} />{t('see.receive')}</Button>
                    </div>
                    <div className="flexLine gap0" onClick={()=>navigate("/user/record")} >
                      {t('see.record')} <ChevronRight size={16} />
                    </div>

                  </div>
                </dd>
            }
          </ApiBox>
          <ApiBox>
            <dt>SeeChat</dt>
            <dd>
              <div className="flexLine">
                <div className="lft">
                 API Key
                </div>
                <CopyBox text={apiKey}>
                  <div>{publicJs.AddressToShow(apiKey)}</div>
                </CopyBox>
                <CopyBox text={apiKey}>
                  <Copy size={16} className="iconBtm"></Copy>
                </CopyBox>
                <div onClick={()=>refreshToken()} className="iconBtm">
                  <RefreshCcw size={16} />
                </div>

              </div>
              <div className="flexLine btm">
                <div className="lft">
                  Endpoint
                </div>

                <CopyBox text={DEEPSEEK_API_URL}>
                  <div>{DEEPSEEK_API_URL}</div>
                </CopyBox>
                <CopyBox text={DEEPSEEK_API_URL}>
                  <Copy size={16} className="iconBtm"></Copy>
                </CopyBox>
              </div>
            </dd>
          </ApiBox>
        </Box>
        {!!list.length && (
          <NftBox>
            <dl>
              <dt>
                <span>SEED</span>
                {!!sns && (
                  <a href={`https://${sns}.id`} target="_blank" className="more" rel="noopener noreferrer">
                    {t("My.more")}
                  </a>
                )}
              </dt>
              <dd>
                <ul>
                  {list?.map((item, index) => (
                    <li key={index}>
                      <div>
                        <img src={item.url} alt="" />
                      </div>
                      <div>ID {item.token_id}</div>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </NftBox>
        )}
        {!!sbt.length && (
          <NftBox>
            <dl>
              <dt>
                <span>SBT</span>
                {!!sns && (
                  <a href={`https://${sns}.id`} target="_blank" className="more" rel="noopener noreferrer">
                    {t("My.more")}
                  </a>
                )}
              </dt>
              <dd>
                <ul>
                  {sbt?.map((item, index) => (
                    <SbtCatMobile key={`sbt_${index}`} item={item} />
                  ))}
                </ul>
              </dd>
            </dl>
          </NftBox>
        )}
        <LineBox>
          <dl>
            <dt>
              <img src={EmailImg} alt="" />
              {t("My.Email")}
            </dt>
            <dd>{detail?.email}</dd>
          </dl>
          {/*<dl>*/}
          {/*  <dt>{t("My.Discord")}</dt>*/}
          {/*  <dd>{discord}</dd>*/}
          {/*</dl>*/}
          <dl>
            <dt>
              <img src={Twitter} alt="" />
              {t("My.Twitter")}
            </dt>
            <dd>{twitter}</dd>
          </dl>
          {/*<dl>*/}
          {/*  <dt>{t("My.WeChat")}</dt>*/}
          {/*  <dd>{wechat}</dd>*/}
          {/*</dl>*/}
          <dl>
            <dt>
              <img src={MirrorImg} alt="" />
              {t("My.Mirror")}
            </dt>
            <dd>{mirror}</dd>
          </dl>
          <dl>
            <dt>
              <img src={GithubImg} alt="" />
              {t("My.Github")}
            </dt>
            <dd>{github}</dd>
          </dl>
        </LineBox>
        <ButtonBox>
          <button onClick={() => logout()}>{t("My.logout")}</button>
        </ButtonBox>
        <VersionBox />
      </Layout>
    </OuterBox>
  );
}
