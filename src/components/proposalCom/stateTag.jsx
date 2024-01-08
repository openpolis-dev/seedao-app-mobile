import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ProposalState } from "constant/proposal";
import { useSelector } from "react-redux";

export default function ProposalStateTag({ state }) {
  const { t } = useTranslation();
  const language = useSelector((state) => state.language);

  let color;
  let text;
  switch (state) {
    case ProposalState.Approved:
      color = "#1F9E14";
      text = t("Proposal.Approve");
      break;
    case ProposalState.Rejected:
      color = "#FB4E4E";
      text = t("Proposal.Rejected");
      break;
    case ProposalState.Draft:
      color = "#2F8FFF";
      text = t("Proposal.Draft");
      break;
    case ProposalState.PendingSubmit:
      color = "rgba(9, 171, 207, 0.90)";
      text = t("Proposal.PendingCommit");
      break;
    case ProposalState.Withdrawn:
      color = "#B0B0B0";
      text = t("Proposal.WithDrawn");
      break;
    case ProposalState.VotingPassed:
      color = "#1F9E14";
      text = t("Proposal.Passed");
      break;
    case ProposalState.VotingFailed:
      color = "#FB4E4E";
      text = t("Proposal.Failed");
      break;
    case ProposalState.Voting:
      color = "#F9B617";
      text = t("Proposal.Voting");
      break;
    default:
      text = "";
      color = "#ddd";
  }
  return (
    <StatusTag $color={color} $width={language === "en" ? "90px" : "70px"}>
      {text}
    </StatusTag>
  );
}

const StatusTag = styled.div`
  background-color: ${(props) => props.$color};
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
  width: ${(props) => props.$width};
`;
