import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Tab from "components/common/tab";
import {  useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "api/project";
import { useProjectContext, PROJECT_ACTIONS } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import ProjectMember from "./member";
import ProjectProposal from "./proposal";
import ProjectAssets from "./asset";
import SipTag from "../../../components/sipTag";
import {MdPreview} from "md-editor-rt";


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
  padding-left: 15px;
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
`;

const ContentBlock = styled.div`
  border-top: 1px solid rgba(217, 217, 217, 0.5);
  padding-top: 30px;
  margin-inline: 20px;
`;

const TitleAll = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  padding-bottom: 15px;
`;

const MBox = styled.div`
  padding: 30px 24px 0;
`;

export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    state: { data },
    dispatch,
  } = useProjectContext();


  useEffect(() => {
    const getProjectData = async () => {
      store.dispatch(saveLoading(true));
      try {
        const data = await getProjectById(id);
        console.log(`[pro-${id}]`, data);
        dispatch({ type: PROJECT_ACTIONS.SET_DATA, payload: data.data });
      } catch (error) {
        console.error(error);
      } finally {
        store.dispatch(saveLoading(false));
      }
    };
    if (id) {
      getProjectData();
      dispatch({ type: PROJECT_ACTIONS.SET_ID, payload: Number(id) });
    }
  }, [id, dispatch]);
  return (
    // <Layout title={data?.name || t("mobile.projectDetail")}>
    <Layout title={data?.name || t("mobile.projectDetail")}>
      < >
        <FlexBox>
          <ImgBlock>{data?.logo && <img src={data.logo} alt="" />}</ImgBlock>
          <TitleBox>{data?.name}</TitleBox>
        </FlexBox>

        <DescBox>{data?.desc}</DescBox>
        <ProposalsBox>
          {data?.proposals?.map((item, index) => (
              <SipTag key={`proposal_${index}`} slug={item} />
          ))}
        </ProposalsBox>
        <MBox>
          <TitleAll>{t("Project.Members")}</TitleAll>
          <ProjectMember />
        </MBox>


        <ContentBlock>
          <TitleAll>{t("Project.Intro")}</TitleAll>
          <MdPreview modelValue={data?.intro || ''} />
        </ContentBlock>
      </>

    </Layout>
  );
}
