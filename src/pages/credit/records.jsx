import styled from "styled-components";
import StateTag from "components/credit/stateTag";
import { CreditRecordStatus } from "constant/credit";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { BlockTitle } from "./mine";
import FilterIcon from "assets/Imgs/credit/filters.svg";

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

export default function CreditRecords({ title }) {
  const { t } = useTranslation();
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const handleCloseModal = () => setShowFiltersModal(false);
  // filter
  const [selectValue, setSeletValue] = useState(FILTER_OPTIONS[0][0].value);
  const handleSelect = (v) => {
    setSeletValue(v);
  };
  return (
    <>
      <RecordTitle>
        <span>{title}</span>
        <img src={FilterIcon} alt="" onClick={() => setShowFiltersModal(true)} />
      </RecordTitle>
      <RecordsList>
        {Array.from({ length: 10 }).map((_, index) => (
          <RecordItem key={index}>
            <RecordContentLine>
              <div className="values">
                <span>1,000.00 USDT</span>
                <StateTag state={CreditRecordStatus.INUSE} />
              </div>
              <MoreButton>{t("Credit.CheckMore")}</MoreButton>
            </RecordContentLine>
            <RecordContentLine className="content">
              <span>{t("Credit.BorrowId")}: 80001</span>
              <span>2021-09-21 14:00:00</span>
            </RecordContentLine>
            <RecordContentLine className="content">
              <span>{t("Credit.Borrower")}: AA.seedao</span>
            </RecordContentLine>
          </RecordItem>
        ))}
      </RecordsList>
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
