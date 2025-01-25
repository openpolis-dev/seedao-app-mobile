import styled from "styled-components";

import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { formatTime } from "utils/time";
import useQuerySNS from "hooks/useQuerySNS";
import { useSelector } from "react-redux";
import publicJs from "utils/publicJs";
import { useLocation, useParams } from "react-router-dom";

export default function ThreadEditHistoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { state: data } = useLocation();
  const snsMap = useSelector((store) => store.snsMap);
  const [list, setList] = useState([]);

  const { getMultiSNS } = useQuerySNS();

  const formatSNS = (wallet) => {
    const name = snsMap[wallet] || wallet;
    return name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4);
  };

  useEffect(() => {
    if (data) {
      setList(
        data.map((item, idx) => {
          return {
            isCreate: idx === data.length - 1,
            title: item.title,
            time: formatTime(item.create_ts * 1000),
            wallet: item.wallet,
            link: `https://arweave.net/tx/${item.arweave}/data.html`,
          };
        }),
      );
      getMultiSNS(Array.from(new Set(data.map((item) => item.wallet))));
    } else {
      // TODO: request
    }
  }, [data]);

  return (
    <Layout
      title={t("Proposal.History")}
      noTab
      headStyle={{ style: { borderBottom: "1px solid var(--border-color-1)" } }}
    >
      <HistoryList>
        {list.map((item, idx) => (
          <HistoryItem key={idx}>
            <TopLine>
              <TopLineLeft>
                <span className="sns">{formatSNS(item.wallet?.toLocaleLowerCase())}</span>
                <span>{item.isCreate ? t("Proposal.HistoryCreate") : t("Proposal.HistoryEdit")}</span>
              </TopLineLeft>

              <span className="date">{item.time}</span>
            </TopLine>
            <Title>{item.title}</Title>
          </HistoryItem>
        ))}
      </HistoryList>
    </Layout>
  );
}

const HistoryList = styled.ul`
  padding-inline: 20px;
  font-size: 14px;
`;

const HistoryItem = styled.li`
  padding-block: 16px;
  border-bottom: 1px solid var(--border-color-1);
`;

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  .date {
    font-size: 12px;
    line-height: 20px;
    color: var(--font-light-color);
  }
`;

const TopLineLeft = styled.div`
  display: flex;
  gap: 4px;
  line-height: 20px;
  .sns {
    color: #8c56ff;
  }
`;

const Title = styled.div`
  font-family: "Poppins-SemiBold";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.07px;
  margin-top: 8px;
`;
