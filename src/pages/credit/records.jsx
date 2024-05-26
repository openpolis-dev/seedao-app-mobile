import styled from "styled-components";
import StateTag from "components/credit/stateTag";
import { CreditRecordStatus } from "constant/credit";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { BlockTitle } from "./mine";
import FilterIcon from "assets/Imgs/credit/filters.svg";
import { useNavigate } from "react-router-dom";
import store from "../../store";
import { saveLoading, saveCache } from "../../store/reducer";
import { useSelector } from "react-redux";
import { getBorrowList } from "api/credit";
import InfiniteScroll from "react-infinite-scroll-component";
import useQuerySNS from "hooks/useQuerySNS";
import publicJs from "utils/publicJs";
import CreditModal from "components/credit/creditModal";
import useCurrentPath from "hooks/useCurrentPath";

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
  const cache = useSelector((state) => state.cache);
  const prevPath = useCurrentPath();

  const [init, setInit] = useState(false);

  const { getMultiSNS } = useQuerySNS();

  // filter
  const [selectValue, setSeletValue] = useState(FILTER_OPTIONS[0][0]);
  const handleSelect = (v) => {
    setSeletValue(v);
    if (selectValue?.value !== v.value) {
      getRecords(true, v.value);
      handleCloseModal();
    }
  };

  const storageList = (id) => {
    const element = document.querySelector(`#inner`);
    const height = element.scrollTop;
    let obj = {
      type: "creditRecord",
      id: id,
      list,
      page,
      height,
    };
    store.dispatch(saveCache(obj));
  };
  const go2detail = (data) => {
    storageList(data.lendId);
    navigate(`/credit/record/${data.lendId}`, { state: data });
  };

  const formatSNS = (wallet) => {
    const sns = snsMap[wallet.toLocaleLowerCase()] || wallet;
    return sns.endsWith(".seedao") ? sns : publicJs.AddressToShow(sns);
  };

  const getRecords = (init, initSelectValue) => {
    const _page = init ? 1 : page;
    store.dispatch(saveLoading(true));
    const params = {
      page: _page,
      size: 10,
    };
    const _selectValue = initSelectValue || selectValue?.value;
    if (_selectValue) {
      const [field, v] = _selectValue.split(";");
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
    if (!prevPath || prevPath?.indexOf("/credit") === -1 || cache?.type !== "creditRecord") return;

    const { list, page, height, id } = cache;

    setList(list);
    setPage(page);

    setTimeout(() => {
      const element = document.querySelector(`#inner`);
      // const targetElement = document.querySelector(`#assets_${id}`);
      element.scrollTo({
        top: height,
        behavior: "auto",
      });
    }, 0);
  }, [prevPath]);

  useEffect(() => {
    setSeletValue(FILTER_OPTIONS[0][0]);

    if (init && cache?.type === "creditRecord" && cache?.page >= page) {
      return;
    } else {
      init && setInit(false);
      getRecords(true);
    }
  }, [tab]);

  useEffect(() => {
    const refreshList = () => getRecords(true);
    document.addEventListener("openMine", refreshList);
    return () => document.removeEventListener("openMine", refreshList);
  }, []);

  console.log("selectValue", selectValue);

  return (
    <>
      <RecordTitle>
        <span>{title}</span>
        {selectValue?.value === "all" ? (
          <img src={FilterIcon} alt="" onClick={() => setShowFiltersModal(true)} />
        ) : (
          <SelectedBox onClick={() => setShowFiltersModal(true)}>{t(selectValue.label)}</SelectedBox>
        )}
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
        <CreditModal handleClose={handleCloseModal}>
          <ModalContent>
            {FILTER_OPTIONS.map((grp, idx) => (
              <ListBox key={idx}>
                {grp.map((item, index) => (
                  <li
                    key={`time_${index}`}
                    onClick={() => handleSelect(item)}
                    className={item.value === selectValue?.value ? "selected" : ""}
                  >
                    {t(item.label)}
                  </li>
                ))}
              </ListBox>
            ))}
          </ModalContent>
        </CreditModal>
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
  font-size: 14px;
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

const ModalContent = styled.div`
  margin-top: 18px;
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

const SelectedBox = styled.div`
  line-height: 24px;
  border: 1px solid #343c6a;
  border-radius: 15px;
  font-size: 12px;
  padding-inline: 10px;
  font-family: "Inter-Regular";
  font-weight: 400;
`;
