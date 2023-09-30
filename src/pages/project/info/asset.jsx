import styled from "styled-components";
import ApplicantCard from "components/applicant";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "utils/number";
import { useProjectContext } from "./provider";

export default function ProjectAssets() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useProjectContext();
  const [token, setToken] = useState();
  const [point, setPoint] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }
    const _token = data?.budgets.find((b) => b.type === "USDT");
    const _point = data?.budgets.find((b) => b.type === "SCR");
    setToken(_token);
    setPoint(_point);
  }, [data]);
  return (
    <ProjectAssetsPage>
      <AssetsContent>
        <AssetItem>
          <div className="title">Token</div>
          <div className="line">
            <span className="label">{t("Project.RemainingUSDBudget")}</span>
            <span className="num">{formatNumber(token?.remain_amount || 0)}</span>
          </div>
          <div className="line">
            <span className="label">{t("Project.USDBudget")}</span>
            <span className="num">{formatNumber(token?.total_amount || 0)}</span>
          </div>
        </AssetItem>
        <AssetItem>
          <div className="title">{t("Project.Points")}</div>
          <div className="line">
            <span className="label">{t("Project.RemainingPointsBudget")}</span>
            <span className="num">{formatNumber(point?.remain_amount || 0)}</span>
          </div>
          <div className="line">
            <span className="label">{t("Project.PointsBudget")}</span>
            <span className="num">{formatNumber(point?.total_amount || 0)}</span>
          </div>
        </AssetItem>
      </AssetsContent>
      <p className="record-title">{t("Project.Record")}</p>
      <ApplicantList></ApplicantList>
    </ProjectAssetsPage>
  );
}
const ProjectAssetsPage = styled.div`
  padding-inline: 20px;
  font-size: 14px;
  .record-title {
    font-weight: 600;
    margin-block: 15px;
  }
`;

const AssetItem = styled.div`
  margin-bottom: 15px;
  .title {
    font-weight: 600;
  }
  .line {
    display: flex;
    & > span {
      flex: 1;
    }
    .num {
      color: var(--bs-primary);
      font-weight: 600;
    }
  }
`;

const AssetsContent = styled.section`
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const ApplicantList = styled.div``;
