import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import publicJs from "utils/publicJs";
import VoteIcon from "assets/Imgs/vote.svg";

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
    <>
      <VoteHead>
        {poll.title}
        {voteStatusTag}
      </VoteHead>
      <CardStyle>
        <VoteBody>
          <TotalVoters>
            <TotalVotersLeft>
              <img src={VoteIcon} alt="" />
              <span>
                {t("Proposal.TotalVotes")}: {poll.totalVotes}
              </span>
            </TotalVotersLeft>
            {poll.arweave && (
              <ExportButton href={`https://arweave.net/tx/${poll.arweave}/data.csv`}>
                {t("Proposal.Export")}
              </ExportButton>
            )}
          </TotalVoters>
          {poll.options.map((option, index) => (
            <VoteOption key={index}>
              <OptionContent>
                <span>{option.html}</span>
                <div>
                  <span>{option.percent}%</span>
                  <span className="voters">({option.voters})</span>
                </div>
              </OptionContent>
              <VoteOptionBottom>
                <ProgressBar percent={option.percent}>
                  <div className="inner"></div>
                </ProgressBar>
              </VoteOptionBottom>
            </VoteOption>
          ))}
        </VoteBody>
        <VoteFooter>
          <VoteNFT>
            <span>
              {t("Proposal.PollNFT")}: {poll.address}
            </span>
            {poll.token_id && <span>Token Id: {poll.token_id}</span>}
          </VoteNFT>
          {poll.alias && <Alias>{poll.alias}</Alias>}
        </VoteFooter>
      </CardStyle>
    </>
  );
}

const CardStyle = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
  border-radius: 16px;
  background-color: var(--background-color-1);
  border: 1px solid var(--border-color-1);
  margin-bottom: 20px;
  overflow: hidden;
`;

const VoteHead = styled.div`
  font-family: Poppins-Medium;
  font-size: 14px;
  line-height: 26px;
  margin-bottom: 15px;
`;

const ExportButton = styled.a`
  line-height: 22px;
  height: 22px;
  border-radius: 28px;
  border: 1px solid #bbbbbb;
  padding-inline: 13px;
  margin-top: 11px;
  font-size: 12px;
`;

const VoteBody = styled.div`
  padding-bottom: 25px;
`;
const VoteFooter = styled.div`
  padding: 10px 10px 12px;
  border-top: 1px solid var(--border-color-1);
`;

const VoteNFT = styled.div`
  font-size: 8px;
  color: var(--font-light-color);
  display: flex;
  justify-content: space-between;
`;

const TotalVoters = styled.div`
  background-color: var(--background-color-2);
  height: 44px;
  display: flex;
  justify-content: space-between;
  line-height: 44px;
  padding-left: 13px;
  padding-right: 11px;
  border-bottom: 1px solid var(--border-color-1);
`;

const TotalVotersLeft = styled.div`
  font-family: Poppins-Medium;
  font-weight: 500;
  color: #000000;
  font-size: 12px;
  img {
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
`;

const StatusTag = styled.span`
  font-size: 10px;
  line-height: 20px;
  padding-inline: 9px;
  border-radius: 6px;
  color: #fff;
  height: 20px;
  display: inline-block;
  margin-left: 8px;
  position: relative;
  bottom: 2px;
`;

const CloseTag = styled(StatusTag)`
  background-color: #ff7193;
`;
const OpenTag = styled.span`
  background-color: #2dc45e;
`;

const VoteOption = styled.div`
  margin-top: 20px;
  padding-inline: 10px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #ececec;
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
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Alias = styled.div`
  font-size: 8px;
  margin-top: 2px;
  line-height: 14px;
  text-decoration: underline;
`;
