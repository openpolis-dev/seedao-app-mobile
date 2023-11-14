import styled from "styled-components";
import { useProjectContext } from "./provider";
import { useTranslation } from "react-i18next";
import SipTag from "components/sipTag";
import { MdPreview } from "md-editor-rt";

export default function ProjectBasic() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useProjectContext();

  return (
    <>
      <ImgBlock>
        <div>{data?.logo && <img src={data.logo} alt="" />}</div>
      </ImgBlock>
      <ContentBlock>
        <div className="content">{data?.desc}</div>
      </ContentBlock>
      <ProposalsBox>
        {data?.proposals?.map((item, index) => (
          <SipTag key={`proposal_${index}`} slug={item} />
        ))}
      </ProposalsBox>
      <ContentBlock>
        <div>{t("Project.Intro")}</div>
        <MdPreview modelValue={data?.intro || ''} />
      </ContentBlock>
    </>
  );
}

const Block = styled.section`
  margin-bottom: 15px;
`;

const ImgBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > div {
    width: 150px;
    height: 150px;
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
`;

const ContentBlock = styled(Block)`
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  margin-inline: 10px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;

  .name {
    padding: 5px;
    background-color: #f0f3f8;
    min-width: 100px;
    text-align: center;
    display: inline-block;
  }
  .content {
    padding: 5px;
    p {
      margin-bottom: 6px;
    }
    .value {
      margin-left: 10px;
    }
    & > div:first-child {
      margin-bottom: 10px;
    }
  }
`;

const ProposalsBox = styled(ContentBlock)`
  display: flex;
`;
