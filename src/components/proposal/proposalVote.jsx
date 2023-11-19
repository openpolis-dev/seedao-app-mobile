import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import publicJs from "utils/publicJs";

const VoteType = {
  Open: "open",
  Closed: "close",
};

export default function ProposalVoteProgress({ poll }) {
  const { t } = useTranslation();

  const voteStatusTag = useMemo(() => {
    if (poll.status === VoteType.Closed) {
      return <CloseTag>{t("Proposal.VoteClose")}</CloseTag>;
    } else if (poll.status === VoteType.Open) {
      return <OpenTag>{t("Proposal.VoteEndAt", { leftTime: poll.leftTime })}</OpenTag>;
    } else {
      return <></>;
    }
  }, [poll, t]);

  return (
    <CardStyle>
      <VoteHead>
        <VoteHeadLeft>{poll.title}</VoteHeadLeft>
        {poll.arweave && (
          <ExportButton href={`https://arweave.net/tx/${poll.arweave}/data.csv`}>{t("Proposal.Export")}</ExportButton>
        )}
      </VoteHead>
      <VoteBody>
        <TotalVoters>
          <span>
            {t("Proposal.TotalVotes")}: {poll.totalVotes}
          </span>
          <span className="dot">·</span>
          {voteStatusTag}
        </TotalVoters>
        {poll.options.map((option, index) => (
          <VoteOption key={index}>
            <OptionContent>{option.html}</OptionContent>
            <VoteOptionBottom>
              <ProgressBar percent={option.percent}>
                <div className="inner"></div>
              </ProgressBar>
              <span>{option.percent}%</span>
              <span className="voters">({option.voters})</span>
            </VoteOptionBottom>
          </VoteOption>
        ))}
      </VoteBody>
      <VoteFooter>
        <VoteNFT>
          <span>
            {t("Proposal.PollNFT")}: {publicJs.AddressToShow(poll.address, 6)}
          </span>
          {poll.token_id && <span>Token Id: {poll.token_id}</span>}
        </VoteNFT>
        {poll.alias && <Alias>{poll.alias}</Alias>}
      </VoteFooter>
    </CardStyle>
  );
}

const CardStyle = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
  border-radius: 16px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color-1);
  margin-bottom: 20px;
`;

const VoteHead = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  padding-inline: 20px;
`;

const VoteHeadLeft = styled.div``;

const ExportButton = styled.a`
  color: var(--primary-color);
  font-family: Poppins-SemiBold, Poppins;
`;

const VoteBody = styled.div`
  padding-inline: 20px;
  border-top: 1px solid var(--border-color-1);
  border-bottom: 1px solid var(--border-color-1);
  padding-bottom: 14px;
`;
const VoteFooter = styled.div`
  padding-inline: 20px;
  display: flex;
  justify-content: space-between;
  line-height: 36px;
`;

const VoteNFT = styled.div`
  span {
    margin-right: 20px;
  }
`;

const TotalVoters = styled.div`
  margin-top: 14px;
  margin-bottom: 9px;
  .dot {
    margin-inline: 4px;
  }
`;

const CloseTag = styled.span`
  color: red;
`;
const OpenTag = styled.span`
  color: var(--bs-body-color);
`;

const VoteOption = styled.div`
  margin-top: 12px;
`;

const ProgressBar = styled.div`
  width: 76%;
  height: 8px;
  border-radius: 16px;
  box-sizing: border-box;
  background-color: var(--background-color-1);
  overflow: hidden;
  .inner {
    width: ${(props) => props.percent}%;
    background-color: var(--primary-color);
    height: 8px;
  }
`;

const VoteOptionBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .voters {
    color: var(--primary-color);
  }
`;

const OptionContent = styled.div`
  font-size: 16px;
`;

const Alias = styled.div`
  color: var(--primary-color);
`;
