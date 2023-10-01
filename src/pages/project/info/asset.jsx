import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatNumber } from "utils/number";
import { useProjectContext } from "./provider";
import { getProjectApplications } from "api/applications";
import ApplicantCard from "components/applicant";
import store from "store";
import { saveLoading } from "store/reducer";
import NoItem from "components/noItem";
import ProgressBar from "components/projectOrGuild/progressBar";
import Loading from "components/common/loading";

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
    const _token = data?.budgets.find((b) => b.type === "token");
    const _point = data?.budgets.find((b) => b.type === "credit");
    setToken(_token);
    setPoint(_point);
  }, [data]);

  const getRecords = async (useGlobalLoading) => {
    try {
      useGlobalLoading && store.dispatch(saveLoading(true));
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
      useGlobalLoading && store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    id && getRecords(true);
  }, [id]);

  const UsdPercent = useMemo(() => {
    const remain = token?.remain_amount || 0;
    const total = token?.total_amount || 0;
    if (total === 0) {
      return 100;
    }
    return ((total - remain) * 100) / total;
  }, [token]);

  const CreditPercent = useMemo(() => {
    const remain = point?.remain_amount || 0;
    const total = point?.total_amount || 0;
    if (Number(total) === 0) {
      return 100;
    }
    return ((total - remain) * 100) / total;
  }, [point]);

  return (
    <ProjectAssetsPage>
      <InfiniteScroll
        dataLength={list.length}
        next={getRecords}
        hasMore={list.length < total}
        loader={<Loading />}
        height={400}
        style={{ height: "calc(100vh - 120px)" }}
      >
        <AssetsContent>
          <AssetItem>
            <div className="title">{t("Project.USDBudget")}</div>
            <ProgressBar percent={UsdPercent} />
            <div className="line">
              <div>
                <span className="label">{t("Project.Remain")}</span>
                <span className="num">{formatNumber(token?.remain_amount || 0)}</span>
              </div>
              <div>
                <span className="label">{t("Project.Total")}</span>
                <span className="num">{formatNumber(token?.total_amount || 0)}</span>
              </div>
            </div>
          </AssetItem>
          <AssetItem>
            <div className="title">{t("Project.PointsBudget")}</div>
            <ProgressBar percent={CreditPercent} />
            <div className="line">
              <div>
                <span className="label">{t("Project.Remain")}</span>
                <span className="num">{formatNumber(point?.remain_amount || 0)}</span>
              </div>
              <div>
                <span className="label">{t("Project.Total")}</span>
                <span className="num">{formatNumber(point?.total_amount || 0)}</span>
              </div>
            </div>
          </AssetItem>
        </AssetsContent>
        <p className="record-title">{t("Project.Record")}</p>
        <ApplicantList>
          {list.map((item, i) => (
            <ApplicantCard key={i} data={item} />
          ))}
          {!list.length && <NoItem />}
        </ApplicantList>
      </InfiniteScroll>
    </ProjectAssetsPage>
  );
}
const ProjectAssetsPage = styled.div`
  padding-inline: 20px;
  .record-title {
    font-weight: 600;
    margin-block: 15px;
  }
`;

const AssetItem = styled.div`
  margin-bottom: 15px;
  .title {
    font-weight: 600;
    margin-bottom: 10px;
  }
  .line {
    margin-top: 10px;
    display: flex;
    & > div {
      flex: 1;
    }
    .num {
      color: var(--bs-primary);
      font-weight: 600;
      margin-left: 6px;
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
