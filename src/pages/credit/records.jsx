import styled from "styled-components";
import StateTag from "components/credit/stateTag";
import { CreditRecordStatus } from "constant/credit";
import { useTranslation } from "react-i18next";

export default function CreditRecords() {
  const { t } = useTranslation();
  return (
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
