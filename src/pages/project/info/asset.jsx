import styled from "styled-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatNumber } from "utils/number";
import { useProjectContext } from "./provider";
import { getProjectApplications } from "api/applications";
import ApplicantCard from "components/applicant";
import store from "store";
import { saveLoading } from "store/reducer";

const PAGE_SIZE = 10;

export default function ProjectAssets() {
  const { t } = useTranslation();
  const {
    state: { id, data },
  } = useProjectContext();
  const [token, setToken] = useState();
  const [point, setPoint] = useState();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }
    const _token = data?.budgets.find((b) => b.type === "USDT");
    const _point = data?.budgets.find((b) => b.type === "SCR");
    setToken(_token);
    setPoint(_point);
  }, [data]);

  const getRecords = async () => {
    try {
      store.dispatch(saveLoading(true));
      const res = await getProjectApplications(
        {
          entity: "project",
          entity_id: id,
          type: "new_reward",
          page,
          size: PAGE_SIZE,
          sort_field: "created_at",
          sort_order: "desc",
        },
        {},
        id,
      );
      setTotal(res.data.total);
      setList([...list, ...res.data.rows]);

      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    id && getRecords();
  }, [id]);
  return (
    <ProjectAssetsPage>
      <InfiniteScroll
        dataLength={list.length}
        next={getRecords}
        hasMore={list.length < total}
        loader={<></>}
        height={400}
        style={{ height: "calc(100vh - 120px)" }}
      >
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
        <ApplicantList>
          {list.map((item) => (
            <ApplicantCard key={item.id} data={item} />
          ))}
        </ApplicantList>
      </InfiniteScroll>
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

const ApplicantList = styled.div`
  & > div {
    margin-bottom: 15px;
  }
`;
