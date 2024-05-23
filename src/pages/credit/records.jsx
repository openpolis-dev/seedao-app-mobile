import styled from "styled-components";
import StateTag from "components/credit/stateTag";
import { CreditRecordStatus } from "constant/credit";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { BlockTitle } from "./mine";
import FilterIcon from "assets/Imgs/credit/filters.svg";
import { useNavigate } from "react-router-dom";
import store from "../../store";
import { saveLoading } from "../../store/reducer";
import { useSelector } from "react-redux";
import { getBorrowList } from "api/credit";
import InfiniteScroll from "react-infinite-scroll-component";
import useQuerySNS from "hooks/useQuerySNS";
import publicJs from "utils/publicJs";

const FILTER_OPTIONS = [
  [
    { label: "Credit.FilterAll", value: `all` },
    { label: "Credit.FilterTimeLatest", value: `borrowTimestamp;desc` },
    { label: "Credit.FilterTimeEarliest", value: `borrowTimestamp;asc` },
  ],
  [
    { label: "Credit.FilterStatusInUse", value: `lendStatus;${CreditRecordStatus.INUSE}` },
    { label: "Credit.FilterStatusClear", value: `lendStatus;${CreditRecordStatus.CLEAR}` },
    { label: "Credit.FilterStatusOverdue", value: `lendStatus;${CreditRecordStatus.OVERDUE}` },
  ],
  [
    { label: "Credit.FilterAmountFromLarge", value: `borrowAmount;desc` },
    { label: "Credit.FilterAmountFromSmall", value: `borrowAmount;asc` },
  ],
];

export default function CreditRecords({ tab }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = tab === "all" ? t("Credit.AllBorrowingsRecord") : t("Credit.MyBorrowingsRecord");

  const account = useSelector((state) => state.account);
  const snsMap = useSelector((state) => state.snsMap);

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const handleCloseModal = () => setShowFiltersModal(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);

  const { getMultiSNS } = useQuerySNS();

  // filter
  const [selectValue, setSeletValue] = useState(FILTER_OPTIONS[0][0].value);
  const handleSelect = (v) => {
    setSeletValue(v);
  };
  const go2detail = (data) => {
    navigate(`/credit/record/${data.lendId}`, { state: data });
  };

  const formatSNS = (wallet) => {
    const sns = snsMap[wallet.toLocaleLowerCase()] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns);
  };

  const getRecords = (init) => {
    const _page = init ? 1 : page;
    store.dispatch(saveLoading(true));
    const params = {
      page: _page,
      size: 10,
    };
    if (selectValue) {
      const [field, v] = selectValue.split(";");
      if (field === "lendStatus") {
        params.lendStatus = Number(v);
      } else if (field !== "all") {
        params.sortField = field;
        params.sortOrder = v;
      }
    }
    if (tab === "mine" && account) {
      params.debtor = account;
    }
    getBorrowList(params)
      .then((r) => {
        setTotal(r.total);
        setList(init ? r.data : [...list, ...r.data]);

        const _wallets = r.data.map((item) => item.debtor);
        getMultiSNS(Array.from(_wallets));

        // handleSNS(Array.from(_wallets));
        setPage(_page + 1);
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  const hasMore = useMemo(() => {
    return list.length < total;
  }, [total, list]);

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <>
      <RecordTitle>
        <span>{title}</span>
        <img src={FilterIcon} alt="" onClick={() => setShowFiltersModal(true)} />
      </RecordTitle>
      <InfiniteScroll scrollableTarget="inner" dataLength={list.length} next={getRecords} hasMore={hasMore}>
        <RecordsList>
          {list.map((item, index) => (
            <RecordItem key={index} onClick={() => go2detail(item)}>
              <RecordContentLine>
                <div className="values">
                  <span>{item.borrowAmount.format()} USDT</span>
                  <StateTag state={item.status} />
                </div>
                <MoreButton>{t("Credit.CheckMore")}</MoreButton>
              </RecordContentLine>
              <RecordContentLine className="content">
                <span>
                  {t("Credit.BorrowID")}: {item.lendIdDisplay}
                </span>
                <span>{item.borrowTime}</span>
              </RecordContentLine>
              {tab !== "mine" && (
                <RecordContentLine className="content">
                  <span>
                    {t("Credit.Borrower")}: {formatSNS(item.debtor)}
                  </span>
                </RecordContentLine>
              )}
            </RecordItem>
          ))}
        </RecordsList>
      </InfiniteScroll>

      {showFiltersModal && (
        <Modal onClick={handleCloseModal}>
          <FilterMask>
            <ModalContent>
              {FILTER_OPTIONS.map((grp, idx) => (
                <ListBox key={idx}>
                  {grp.map((item, index) => (
                    <li
                      key={`time_${index}`}
                      onClick={() => handleSelect(item.value)}
                      className={item.value === selectValue ? "selected" : ""}
                    >
                      {t(item.label)}
                    </li>
                  ))}
                </ListBox>
              ))}
            </ModalContent>
          </FilterMask>
        </Modal>
      )}
    </>
  );
}

const RecordsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RecordItem = styled.li`
  border-radius: 10px;
  background-color: #fff;
  padding: 12px;
`;

const MoreButton = styled.span`
  font-size: 11px;
  color: #1814f3;
  font-weight: 500;
  font-family: "Inter-Medium";
`;

const RecordContentLine = styled.div`
  display: flex;
  justify-content: space-between;
  .values {
    display: flex;
    gap: 5px;
    align-items: center;
    margin-bottom: 6px;
    span {
      font-size: 14px;
      font-weight: 500;
      font-family: "Inter-Medium";
    }
  }
  &.content {
    color: #718ebf;
    font-size: 12px;
    line-height: 22px;
  }
`;

const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 46px;
  padding-inline: 24px;
  padding-bottom: 29px;
  box-sizing: border-box;
`;

const FilterMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ListBox = styled.ul`
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  li {
    flex: 1;
    &.selected {
      background-color: #1814f3;
      color: #fff;
      border: none;
    }
    padding-inline: 16px;
    line-height: 36px;
    color: #343c6a;
    border: 1px solid #343c6a;
    border-radius: 20px;
    box-sizing: border-box;
    text-align: center;
    &:last-child {
      margin-right: auto;
    }
    &.w50 {
      width: 48%;
      &:last-child {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
`;

const RecordTitle = styled(BlockTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
