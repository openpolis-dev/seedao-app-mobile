import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import store from "../store";
import { saveLoading } from "../store/reducer";
import { getUser } from "../api/user";
import Avatar from "components/common/avatar";
import CopyBox from "components/common/copy";
import useParseSNS from "hooks/useParseSNS";
import publicJs from "../utils/publicJs";
import {useNavigate} from "react-router-dom";

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
  margin: 0 20px;
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
    background: #ddd;
    float: left;
    width: 21vw;
    margin-right: 1.8vw;
    margin-bottom: 10px;
    &:nth-child(4n){
      margin-right: 0;
    }
  }
`

const TopBtn = styled.div`
  text-align: right;
`

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);

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
              <div>{detail?.name}</div>
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
             level 2
            </LevelBox>
            <SCRBox>50000 SCR</SCRBox>
          </FstLine>
          <ProgressBox width="60">
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
            <dd>{detail?.discord_profile}</dd>
          </dl>
          <dl>
            <dt>{t("My.Twitter")}</dt>
            <dd>{detail?.twitter_profile}</dd>
          </dl>
          <dl>
            <dt>{t("My.WeChat")}</dt>
            <dd>{detail?.wechat}</dd>
          </dl>
          <dl>
            <dt>{t("My.Mirror")}</dt>
            <dd>{detail?.mirror}</dd>
          </dl>
        </LineBox>
      </Box>
      <NftBox>
          <dl>
            <dt>SEED</dt>
            <dd>
              <ul>
                {
                  [...Array(8)].map((item,index)=>(<li key={index}></li>))
                }

              </ul>
            </dd>
          </dl>
        <dl>
            <dt>SBT</dt>
            <dd>
              <ul>
                {
                  [...Array(8)].map((item,index)=>(<li key={index}></li>))
                }

              </ul>
            </dd>
          </dl>
      </NftBox>
    </Layout>
  );
}
