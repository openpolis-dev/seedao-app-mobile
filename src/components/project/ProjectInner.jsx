import SipTag from "../sipTag";
import ProjectMember from "../../pages/project/info/member";
import {MdPreview} from "md-editor-rt";
import React, {useEffect, useState} from "react";
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import {getProjectById} from "../../api/project";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import DefaultLogo from "assets/Imgs/defaultLogo.png"
import LinkImg from "assets/Imgs/linkHome.svg";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import ReactQuill from 'react-quill';
import { formatCategory } from "components/proposalCom/categoryTag";


const FlexBox = styled.div`
  display: flex;
  align-items: center;
  padding-inline: 20px;
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

    .quill {
        width: 100%;
    }
    .ql-container {
        width: 100% !important;
        border: 0;
    }
    p {
        padding: 0;
    }
    .ql-editor {
        width: 100%;
        padding: 0;
    }
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
    background: rgb(163, 160, 160);
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
    box-sizing: border-box;
    display: flex;
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
    .quill {
        width: 100%;
    }
    .ql-container {
        width: 100% !important;
        border: 0;
    }
    p {
        padding: 0;
    }
    .ql-editor {
        width: 100%;
        padding: 0;
    }
`;
const FlexBoxBg = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


export default function ProjectInner({id}){
    const { t } = useTranslation();
    const [data,setData] = useState();

    useEffect(() => {
        const getProjectData = async () => {
            store.dispatch(saveLoading(true));
            try {
                const data = await getProjectById(id);
                setData(data.data)
            } catch (error) {
                logError(error);
            } finally {
                store.dispatch(saveLoading(false));
            }
        };
        if (id) {
            getProjectData();
            // dispatch({ type: PROJECT_ACTIONS.SET_ID, payload: Number(id) });
        }
    }, [id]);

    const showStatusComponent = () => {
        if (data?.status === 'closed') {
            return <StatusBox className="close">{t("Project.Closed")}</StatusBox>;
        }
        if (data?.status === 'open') {
            // @ts-ignore
            return <StatusBox className="pending">{t('Project.Open')}</StatusBox>;
        }
        if (data?.status === 'pending_close') {
            return <StatusBox>{t('Project.Pending')}</StatusBox>;
        }
    };

    const formatBudget = (str) => {
        if (!str) return;
        let strJson = JSON.parse(str);

        let strArr = [];
        strJson.map((item) => {
            strArr.push({ ...item });
        });
        return strArr ?? [];
    };

    const formatDate = (date) => {
        if (date) {
            let time = Number(date);
            return dayjs(time).format(`YYYY-MM-DD`);
        } else {
            return '';
        }
    };

    return <>
        <FlexBox>
        <ImgBlock><img src={data?.logo || DefaultLogo} alt="" /></ImgBlock>
            <FlexLine>
                <TitleBox>{data?.name}</TitleBox>
                <FlexFirst>

                    {data?.SIP && <SipTagStyle>SIP - {data?.SIP}</SipTagStyle>}
                    {data?.Category && <CategoryTag>{formatCategory(data?.Category)}</CategoryTag>}
                    {/*<StatusBox className={detail?.status}>{t(`Project.Edit`)}</StatusBox>*/}
                    {showStatusComponent()}
                </FlexFirst>
            </FlexLine>

</FlexBox>
    {/*<DescBox>{data?.desc}</DescBox>*/}
    <DescBox>     <ReactQuill theme="snow" value={data?.desc} modules={{ toolbar: false }} readOnly={true} /></DescBox>
        <MainBox>
            {data?.OfficialLink && (
                <a href={data?.OfficialLink} target="_blank" rel="noreferrer">
                    <Abox>{t('Project.viewMore')} &gt;&gt;</Abox>
                </a>
            )}
            <ProjectMember data={data} />

                <BtmBox>
                <FlexBtnBox>
                        {data?.ApprovalLink && (
                            <Link to={data?.ApprovalLink} target="_blank">
                                <BtnBox><span>{t('Project.StartProjectLink')}</span> <img src={LinkImg} alt=""/></BtnBox>
                            </Link>
                        )}
                        {data?.OverLink && (
                            <Link to={data?.OverLink} target="_blank">
                                <BtnBox><span>{t('Project.EndProjectLink')}</span> <img src={LinkImg} alt=""/></BtnBox>
                            </Link>
                        )}                       
                    </FlexBtnBox>
                    <DlBox>
                        <dl>
                            <dt>{t('Project.Budget')}</dt>
                            <dd>
                                {formatBudget(data?.Budgets)?.map((i, index) => (
                                    <FlexBoxBg key={`budget_${index}`}>
                                        <span>{i.name}</span>
                                    </FlexBoxBg>
                                ))}
                            </dd>
                        </dl>
                        <dl>
                            <dt>{t('Project.Deliverables')}</dt>
                            {/*<dd>{data?.Deliverable}</dd>*/}
                            <dd>  <ReactQuill theme="snow" value={data?.Deliverable} modules={{ toolbar: false }} readOnly={true} /></dd>

                        </dl>
                        <dl>
                            <dt>{t('Project.PlanFinishTime')}</dt>
                            <dd>{formatDate(data?.PlanTime)}</dd>
                        </dl>
                    </DlBox>

                </BtmBox>
        </MainBox>

        {/*<ProposalsBox>*/}
        {/*    {data?.proposals?.map((item, index) => (*/}
        {/*        <SipTag key={`proposal_${index}`} slug={item} />*/}
        {/*    ))}*/}
        {/*</ProposalsBox>*/}

        {/*<MBox>*/}
        {/*    <TitleAll>{t("Project.Members")}</TitleAll>*/}

        {/*</MBox>*/}

        {/*<ContentBlock>*/}
        {/*    <TitleAll>{t("Project.Intro")}</TitleAll>*/}
        {/*    <MdPreview modelValue={data?.intro || ""} />*/}
    {/*</ContentBlock>*/}
</>
}
