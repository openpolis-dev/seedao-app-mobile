import styled from "styled-components";
import { useProjectContext } from "./provider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { formatNumber } from "utils/number";
import {useNavigate} from "react-router-dom";

export default function ProjectBasic() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useProjectContext();

  const navigate = useNavigate();

  const [token, setToken] = useState();
  const [points, setPoints] = useState();

  useEffect(() => {
    const getdata = () => {
      const _token = data?.budgets?.find((item) => item.name === "USDT");
      setToken(_token);
      const _point = data?.budgets?.find((item) => item.name === "SCR");
      setPoints(_point);
    };
    data && getdata();
  }, [data]);

  const toGo = (item) =>{
    navigate(`/proposal/thread/${item}`)
  }

  return (
    <>
      <ImgBlock>
        <div>{data?.logo && <img src={data.logo} alt="" />}</div>
      </ImgBlock>
      <ContentBlock>
        <div className="name">{t("Project.ProjectName")}</div>
        <div className="content">{data?.name}</div>
      </ContentBlock>
      <ProposalsBox>
        <div>提案</div>
        <div>
          {
            data?.proposals?.map((item,index)=>(<div key={`proposal_${index}`} onClick={()=>toGo(item)}>{`${window.location.origin}/${item}`}</div>))
          }
        </div>


      </ProposalsBox>
      <ContentBlock>
        描述
        描述
        描述
        描述
        描述
        描述
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
  &>div {
    width: 150px;
    height: 150px;
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 10px rgba(0,0,0,0.05);
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
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  margin-inline: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
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
  
`
