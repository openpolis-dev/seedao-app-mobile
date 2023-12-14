import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import useQuerySNS from "hooks/useQuerySNS";
import { getGovernanceNodeResult } from "api/cityhall";
import store from "../store";
import { saveLoading } from "../store/reducer";
import { formatNumber, getShortDisplay } from "utils/number";
import publicJs from "utils/publicJs";
import SortDownSvg from "components/svgs/sortDown";
import SortUpSvg from "components/svgs/sortUp";

const RankDirection = {
  default: 0,
  down: 1,
  up: 2,
};

const SortIcons = ({ direction }) => {
  return (
    <SortButton>
      <SortUpSvg isSelected={direction === RankDirection.up} />
      <SortDownSvg isSelected={direction === RankDirection.down} />
    </SortButton>
  );
};
export default function RankingPage() {
  const { t } = useTranslation();

  const [allList, setAllList] = useState([]);
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState(0);
  const [dataMap, setDataMap] = useState({});

  const { getMultiSNS } = useQuerySNS();

  const [rankCurrent, setRankCurrent] = useState(RankDirection.default);
  const [rankTotal, setRankTotal] = useState(RankDirection.down);

  const currentSeason = useMemo(() => {
    return `S${currentSeasonNumber}`;
  }, [currentSeasonNumber]);

  const allSeasons = useMemo(() => {
    if (currentSeasonNumber) {
      return Array.from({ length: currentSeasonNumber + 1 }, (_, i) => i);
    } else {
      return [];
    }
  }, [currentSeasonNumber]);

  const displayList = useMemo(() => {
    const newList = [...allList];
    if (rankTotal !== RankDirection.default) {
      newList.sort((a, b) => {
        const a_total = Number(a.season_total_credit);
        const b_total = Number(b.season_total_credit);

        if (rankTotal === RankDirection.down) {
          return b_total - a_total;
        } else {
          return a_total - b_total;
        }
      });
    }
    if (rankCurrent !== RankDirection.default) {
      newList.sort((a, b) => {
        const a_current = a.seasons_credit.find((item) => item.season_name === currentSeason)?.total || 0;
        const b_current = b.seasons_credit.find((item) => item.season_name === currentSeason)?.total || 0;
        if (rankCurrent === RankDirection.down) {
          return Number(b_current) - Number(a_current);
        } else {
          return Number(a_current) - Number(b_current);
        }
      });
    }

    return newList;
  }, [allList, rankCurrent, rankTotal]);

  const formatSNS = (wallet) => {
    const sns = dataMap[wallet] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns);
  };
  useEffect(() => {
    const getList = () => {
      store.dispatch(saveLoading(true));
      getGovernanceNodeResult()
        .then((res) => {
          const data = res.data;
          setAllList(
            data.records.map((item) => ({
              ...item,
              total_display: Number(item.season_total_credit).format(),
            })),
          );

          setCurrentSeasonNumber(Number(data.season_name.replace("S", "")));

          const _wallets = new Set();
          data.records.forEach((item) => {
            _wallets.add(item.wallet);
          });
          getMultiSNS(Array.from(_wallets)).then((_dataMap) => {
            setDataMap(_dataMap);
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          store.dispatch(saveLoading(false));
        });
    };
    getList();
  }, []);

  const onClickCurrentRank = () => {
    if (rankCurrent === RankDirection.down) {
      setRankCurrent(RankDirection.up);
    } else {
      setRankCurrent(RankDirection.down);
    }
    setRankTotal(RankDirection.default);
  };

  const onClicktotalRank = () => {
    if (rankTotal === RankDirection.down) {
      setRankTotal(RankDirection.up);
    } else {
      setRankTotal(RankDirection.down);
    }
    setRankCurrent(RankDirection.default);
  };

  const getRankNum = (i) => {
    if (rankTotal === RankDirection.down || rankCurrent === RankDirection.down) {
      return i + 1;
    } else if (rankTotal === RankDirection.up || rankCurrent === RankDirection.up) {
      return displayList.length - i;
    }
  };
  const handleExport = () => {
    import("excellentexport").then((ExcellentExport) => {
      ExcellentExport.convert(
        {
          filename: t("GovernanceNodeResult.SCRSeasonRankFilename", { season: currentSeason }),
          format: "xlsx",
          openAsDownload: true,
        },
        [
          {
            name: t("GovernanceNodeResult.SCRSeasonRankFilename", { season: currentSeason }),
            from: {
              array: [
                ["SNS", ...allSeasons.map((s) => `S${s}(SCR)`), t("GovernanceNodeResult.Total") + "(SCR)"],
                ...displayList.map((item) => [
                  dataMap[item.wallet] || item.wallet,
                  item.seasons_credit?.find((s) => s.season_idx === 0)?.total || 0,
                  item.seasons_credit?.find((s) => s.season_idx === 1)?.total || 0,
                  item.seasons_credit?.find((s) => s.season_idx === 2)?.total || 0,
                  item.seasons_credit?.find((s) => s.season_idx === 3)?.total || 0,
                  item.season_total_credit || 0,
                ]),
              ],
            },
            formats: ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K"].map((c) => ({
              range: `${c}2:${c}1000`,
              format: ExcellentExport.formats.NUMBER,
            })),
          },
        ],
      );
    });
   
  };

  return (
    <Layout
      title={t("Vault.ScrRanking")}
      rightOperation={<ExportButton onClick={handleExport}>{t("Vault.Export")}</ExportButton>}
    >
      <SortBox>
        <NumberBox />
        <HeaderItemBox style={{ flex: 3, width: 0 }} />
        <HeaderItemBox style={{ flex: 2 }}>
          <SortCurrentSeason onClick={onClickCurrentRank}>
            <span>
              {currentSeason}
              {"(SCR)"}
            </span>
            <SortIcons direction={rankCurrent} />
          </SortCurrentSeason>
        </HeaderItemBox>
        <HeaderItemBox style={{ flex: 2 }}>
          <SortTotalScr onClick={onClicktotalRank}>
            <span>
              {t("Vault.Total")}
              {"(SCR)"}
            </span>
            <SortIcons direction={rankTotal} />
          </SortTotalScr>
        </HeaderItemBox>
      </SortBox>
      <ListBox>
        {displayList.map((item, idx) => (
          <li key={item.wallet}>
            <NumberBox>{getRankNum(idx)}</NumberBox>
            <ItemBox style={{ flex: 3, width: 0, marginLeft: "4px" }}>{formatSNS(item.wallet)}</ItemBox>
            <ItemBox style={{ flex: 2, textAlign: "right" }}>
              {Number(item.seasons_credit?.find((s) => s.season_name === currentSeason)?.total).format()}
            </ItemBox>
            <ItemBox style={{ flex: 2, textAlign: "right" }}>{item.total_display}</ItemBox>
          </li>
        ))}
      </ListBox>
    </Layout>
  );
}

const ListBox = styled.ul`
  font-size: 12px;
  padding-inline: 15px;
  line-height: 44px;
  box-sizing: border-box;
  overflow-y: auto;
  li {
    display: flex;
    border-bottom: 1px solid var(--border-color-1);
    &:last-child {
      border-bottom: none;
    }
  }
`;
const ItemBox = styled.div`
  flex: 1;
`;
const HeaderItemBox = styled(ItemBox)`
  margin-left: 8px;
`;

const LightBox = styled.span`
  color: #9ca1b3;
  font-size: 10px;
  &.inline {
    margin-left: 3px;
  }
`;
const NumberBox = styled(LightBox)`
  flex: unset;
  width: 26px;
  text-align: center;
`;

const SortBox = styled.div`
  padding-inline: 15px;
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 11px;
  position: sticky;
  top: 0;
  background-color: var(--background-color-1);
`;

const SortItem = styled.div`
  display: flex;
  justify-content: space-between;
  height: 24px;
  line-height: 24px;
  padding-inline: 6px;
  background: var(--background-color-2);
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  box-sizing: border-box;
`;

const SortCurrentSeason = styled(SortItem)``;

const SortTotalScr = styled(SortItem)``;

const SortButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ExportButton = styled.span`
  display: inline-block;
  line-height: 24px;
  background: var(--primary-color);
  border-radius: 28px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  width: 58px;
`;
