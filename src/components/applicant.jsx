import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { formatNumber } from "utils/number";
import { formatTime } from "utils/time";
import publicJs from "utils/publicJs";

const ApplicationStatus = {
  All: "",
  Open: "open",
  Approved: "approved",
  Rejected: "rejected",
  Processing: "processing",
  Completed: "completed",
};

const formatApplicationStatus = (status) => {
  switch (status) {
    case ApplicationStatus.Open:
      return "Project.ToBeReviewed";
    case ApplicationStatus.Approved:
      return "Project.ToBeIssued";
    case ApplicationStatus.Rejected:
      return "Project.Rejected";
    case ApplicationStatus.Processing:
      return "Project.Sending";
    case ApplicationStatus.Completed:
      return "Project.Sended";
    default:
      return "";
  }
};

export default function ApplicantCard({ data }) {
  const { t } = useTranslation();
  return (
    <ApplicantCardBox>
      <Line>
        <span>{publicJs.AddressToShow(data.target_user_wallet)}</span>
        <div className="token">
          {!!data.token_amount && data.token_amount !== "0" && <span>USDT {formatNumber(data.token_amount)}</span>}
          {!!data.credit_amount && data.credit_amount !== "0" && (
            <span>
              {t("Project.Points")} {formatNumber(data.credit_amount)}
            </span>
          )}
        </div>
      </Line>
      <Line>
        <span>{formatTime(data.created_at)}</span>
        <span className="status">{t(formatApplicationStatus(data.status))}</span>
      </Line>
    </ApplicantCardBox>
  );
}

const ApplicantCardBox = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  padding: 15px;
  font-size: 14px;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;

  &:first-child {
    margin-bottom: 8px;
  }
  .status {
    color: var(--bs-primary);
    font-weight: 600;
  }
  .token span {
    margin-left: 6px;
    &:first-child {
      margin-left: 0;
    }
  }
`;
