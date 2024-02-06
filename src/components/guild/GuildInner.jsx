import SipTag from "../sipTag";
import GuildMember from "../../pages/guild/info/member";
import {MdPreview} from "md-editor-rt";
import React, {useEffect, useState} from "react";
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import {getGuildById} from "../../api/guild";
import styled from "styled-components";
import {t} from "i18next";
import DefaultLogo from "assets/Imgs/defaultLogo.png";
import ProjectMember from "../../pages/project/info/member";
import {Link} from "react-router-dom";
import LinkImg from "../../assets/Imgs/linkHome.svg";
import {useTranslation} from "react-i18next";

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  padding-inline: 20px;
    gap: 10px;
  margin-top: 24px;
`;

const ImgBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    object-position: center;
    border-radius: 15px;
  }
`;
const TitleBox = styled.div`
  font-size: 16px;
  font-family: "Poppins-SemiBold";
  font-weight: 600;
  line-height: 24px;
  flex-grow: 1;
`;

const ProposalsBox = styled.div`
  display: flex;
  margin-inline: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(217, 217, 217, 0.5);
`;

const DescBox = styled.div`
  padding: 15px 20px 10px;
  color: #9a9a9a;
  font-size: 14px;
`;

const ContentBlock = styled.div`
  border-top: 1px solid rgba(217, 217, 217, 0.5);
  padding-top: 20px;
  margin: 0 20px 20px;
`;

const TitleAll = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  padding-bottom: 15px;
`;

const MBox = styled.div`
  padding: 20px 20px 0;
`;

const StatusBox = styled.div`
    font-size: 12px;
    color: #fff;
    background: var(--primary-color);
    padding: 4px 12px;
    border-radius: 4px;

    &.pending_close {
        background: #f9b617;
    }
    &.close {
        background: #ff7193;
    }
`;

const SipTagStyle = styled.a`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #0085ff;
  font-size: 12px;
  padding: 2px 12px;

  color: #0085ff;
  &:hover {
    color: #0085ff;
  }
`;

const FlexFirst = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
    flex-wrap: wrap;
`;

const CategoryTag = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--proposal-tag-border);
  color: var(--bs-body-color_active);
  font-size: 12px;
  background: var(--line-home);
  padding: 2px 16px;
  text-align: center;
`;

const FlexLine = styled.div`
    padding-left: 15px;
`

const BorderBox = styled.div`
    border: 1px solid var(--border-color-1);
    display: flex ;
    align-items: stretch;
    border-radius: 8px;
    margin-bottom: 20px;
`
const MemberBox = styled.dl`
    width: 50%;
    text-align: center;
    padding: 10px;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    &:first-child{
        border-right: 1px  solid var(--border-color-1);
    }
    dt{
        font-size: 12px;
        opacity: 0.8;
    }
    .dd{
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        line-height: 40px;
    }
`
const BtmBox = styled.div`
    border: 1px solid var(--border-color-1);
    padding: 20px;
    border-radius: 8px;
`
const MainBox = styled.div`
    padding: 0 20px;
`

const Abox = styled.div`
    font-size: 12px;
    color: var(--primary-color);
    margin-bottom: 10px;
`
const FlexBtnBox = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
`

const BtnBox = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    padding: 2px 12px;
    border-radius: 4px;
    gap:6px;
    img{
        width: 14px;
    }
`

const DlBox = styled.div`
  margin-top: 40px;
  dl {
    margin-bottom: 20px;
  }
  dt {
    margin-bottom: 10px;
    font-size: 12px;
    opacity: 0.6;
  }
  dd {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
const FlexBoxBg = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function GuildInner({id}){
    const [data,setData] = useState();
    const { t } = useTranslation();

    const returnSNS = (str) =>{

    }


    useEffect(() => {
        const getProjectData = async () => {
            store.dispatch(saveLoading(true));
            try {
                const data = await getGuildById(id);
                console.log(`[pro-${id}]`, data);
                setData(data.data)
                // dispatch({ type: GUILD_ACTIONS.SET_DATA, payload: data.data });
            } catch (error) {
                logError(error);
            } finally {
                store.dispatch(saveLoading(false));
            }
        };
        if (id) {
            getProjectData();
            // dispatch({ type: GUILD_ACTIONS.SET_ID, payload: Number(id) });
        }
    }, [id]);

    return    <>
        <FlexBox>
            <ImgBlock><img src={data?.logo || DefaultLogo} alt="" /></ImgBlock>
            <TitleBox>{data?.name}</TitleBox>
        </FlexBox>

        <DescBox>{data?.desc}</DescBox>

        <MainBox>
            <a href={data?.OfficialLink} target="_blank" rel="noreferrer">
                <Abox>{t('Guild.viewMore')} &gt;&gt;</Abox>
            </a>
            <ProjectMember data={data}/>


        </MainBox>
        {/*<ProposalsBox>*/}
        {/*    {data?.proposals?.map((item, index) => (*/}
        {/*        <SipTag key={`proposal_${index}`} slug={item} />*/}
        {/*    ))}*/}
        {/*</ProposalsBox>*/}
        {/*<MBox>*/}
        {/*    <TitleAll>{t("Guild.Members")}</TitleAll>*/}
        {/*    <GuildMember data={data} />*/}
        {/*</MBox>*/}

        {/*<ContentBlock>*/}
        {/*    <TitleAll>{t("Guild.Intro")}</TitleAll>*/}
        {/*    <MdPreview modelValue={data?.intro || ""} />*/}
        {/*</ContentBlock>*/}
    </>
}
