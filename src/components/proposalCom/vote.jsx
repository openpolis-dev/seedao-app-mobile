import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { castVote, checkCanVote } from "api/proposalV2";
import useToast from "hooks/useToast";
// import VoterListModal from "components/modals/voterListModal";
import useMetaforoLogin from "hooks/useMetaforoLogin";
import { formatDeltaDate } from "utils/time";
import store from "store";
import { saveLoading } from "store/reducer";
import BaseModal from "components/baseModal";
import VoteRulesModal from "./voteRules";
import VoterListModal from "./voterList";

const VoteType = {
  Waite: "waite",
  Open: "open",
  Closed: "closed",
};

const getPollStatus = (start_t, close_t) => {
  const start_at = new Date(start_t).getTime();
  const close_at = new Date(close_t).getTime();
  if (start_at > Date.now()) {
    return VoteType.Waite;
  }
  if (close_at <= Date.now()) {
    return VoteType.Closed;
  }
  return VoteType.Open;
};

export default function ProposalVote({ id, poll, voteGate, updateStatus }) {
  const { t } = useTranslation();
  const [selectOption, setSelectOption] = useState();
  const [openVoteItem, setOpenVoteItem] = useState();
  const [showConfirmVote, setShowConfirmVote] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showVoteRules, setShowVoteRules] = useState(false);

  const { checkMetaforoLogin, LoginMetafoModal } = useMetaforoLogin();
  const { toast } = useToast();

  const pollStatus = getPollStatus(poll.poll_start_at, poll.close_at);

  const voteStatusTag = useMemo(() => {
    if (pollStatus === VoteType.Closed) {
      return <CloseTag>{t("Proposal.VoteClose")}</CloseTag>;
    } else if (pollStatus === VoteType.Open) {
      return (
        <OpenTag>
          {t("Proposal.VoteEndAt", {
            leftTime: t("Proposal.TimeDisplay", { ...formatDeltaDate(new Date(poll.close_at).getTime()) }),
          })}
        </OpenTag>
      );
    } else {
      return (
        <OpenTag>
          {t("Proposal.VoteStartAt", {
            leftTime: t("Proposal.TimeDisplay", { ...formatDeltaDate(new Date(poll.poll_start_at).getTime()) }),
          })}
        </OpenTag>
      );
    }
  }, [pollStatus, t]);

  const onConfirmVote = async () => {
    const canVote = await checkMetaforoLogin();
    if (!canVote) {
      return;
    }
    store.dispatch(saveLoading(true));
    setShowConfirmVote(false);

    castVote(id, poll.id, selectOption?.id)
      .then(() => {
        updateStatus();
        toast.success(t("Msg.CastVoteSuccess"));
      })
      .catch((error) => {
        logError("cast error failed", error);
        toast.danger(`cast error failed: ${error?.data?.msg || error?.code || error}`);
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  const goVote = async (option) => {
    let canVote = false;
    // const canVote = await checkMetaforoLogin();
    if (!canVote) {
      return;
    }
    setShowConfirmVote(true);
  };

  useEffect(() => {
    const getVotePermission = () => {
      checkCanVote(id).then((r) => {
        setHasPermission(r.data);
      });
    };
    if (pollStatus === VoteType.Open && !poll.is_vote) {
      getVotePermission();
    }
  }, [poll, pollStatus]);

  const showVoteContent = () => {
    if ((pollStatus === VoteType.Open && !!poll.is_vote) || pollStatus === VoteType.Closed) {
      return (
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            {poll.options.map((option, index) => (
              <tr>
                <td>
                  <OptionContent $highlight={option.is_vote}>
                    {option.html}
                    {!!option.is_vote && <HasVote>({t("Proposal.HasVote")})</HasVote>}
                  </OptionContent>
                </td>
                <td>
                  <ProgressBar percent={option.percent}>
                    <div className="inner"></div>
                  </ProgressBar>
                </td>
                <td>
                  <VoteNumber
                    onClick={() => !!option.voters && setOpenVoteItem({ count: option.voters, optionId: option.id })}
                  >
                    <span className={!!option.is_vote ? "active" : ""}>{option.voters}</span>
                    <span className="voters"> ({option.percent}%)</span>
                  </VoteNumber>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <>
          {poll.options.map((option, index) => (
            <VoteOptionSelect key={index}>
              <span>
                <input
                  type="radio"
                  checked={selectOption?.id === option.id}
                  onChange={(e) => setSelectOption(e.target.checked ? option : undefined)}
                  disabled={!hasPermission}
                />
              </span>
              <OptionContentPure>{option.html}</OptionContentPure>
            </VoteOptionSelect>
          ))}
          {hasPermission && (
            <VoteButton onClick={goVote} disabled={selectOption === void 0}>
              {t("Proposal.Vote")}
            </VoteButton>
          )}
        </>
      );
    }
  };

  return (
    <CardStyle id="vote-block">
      <VoteHead>
        <span>
          {" "}
          {t("Proposal.TotalVotes")}: {poll.totalVotes}
        </span>
        <TotalVoters>{voteStatusTag}</TotalVoters>
      </VoteHead>
      <FlexLine>
        <VoteHeadLeft>{poll.title}</VoteHeadLeft>
      </FlexLine>
      <VoteBody>{showVoteContent()}</VoteBody>
      {!!openVoteItem && <VoterListModal {...openVoteItem} onClose={() => setOpenVoteItem(undefined)} />}
      {showConfirmVote && (
        <BaseModal
          msg={t("Proposal.ConfirmVoteOption", { option: selectOption?.html })}
          onConfirm={onConfirmVote}
          onClose={() => setShowConfirmVote(false)}
        />
      )}
      <Bottom>
        {voteGate?.name && <span className="alias">{voteGate.name}</span>}
        <span className="rule" onClick={() => setShowVoteRules(true)}>
          {t("Proposal.VoteRules")}
        </span>
      </Bottom>
      {showVoteRules && <VoteRulesModal voteGate={voteGate} handleClose={() => setShowVoteRules(false)} />}
      {LoginMetafoModal}
    </CardStyle>
  );
}
const FlexLine = styled.div``;

const CardStyle = styled.div`
  margin: 0 20px 32px;
`;

const VoteHead = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--bs-body-color_active);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 24px;
`;

const VoteHeadLeft = styled.div``;

const VoteBody = styled.div`
  border-radius: 8px;
  border: 1px solid #e6dcff;
  background: #fff;
  box-shadow: 2px 4px 4px 0px rgba(211, 206, 221, 0.1);
  padding: 10px 16px 0;
  box-sizing: border-box;
  table {
    width: 100%;
    margin-bottom: 10px;
    font-size: 14px;
    vertical-align: center;
    td {
      height: 36px;
    }
  }
`;

const VoteNFT = styled.div`
  color: var(--bs-body-color);
  margin-top: 16px;
  margin-bottom: 14px;
  span {
    margin-right: 20px;
  }
`;

const TotalVoters = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
`;

const CloseTag = styled.span`
  color: red;
  font-size: 14px;
`;
const OpenTag = styled.span`
  color: var(--primary-color);
  font-size: 14px;
`;

const VoteOptionBlock = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const VoteOptionSelect = styled(VoteOptionBlock)`
  display: flex;
  align-items: center;
  gap: 8px;
  input:disabled {
    background-color: #d9d9d980;
    border-color: rgba(217, 217, 217, 0.5);
  }
`;

const ProgressBar = styled.div`
  min-width: 120px;
  height: 10px;
  border-radius: 16px;
  box-sizing: border-box;
  background: rgba(82, 0, 255, 0.1);
  overflow: hidden;
  margin-right: 16px;
  .inner {
    width: ${(props) => props.percent}%;
    background-color: var(--bs-primary);
    height: 10px;
  }
`;

const VoteNumber = styled.div`
  color: var(--bs-body-color_active);
  .voters {
    color: var(--bs-primary);
    cursor: pointer;
  }
  .active {
    color: var(--bs-primary);
  }
`;

const OptionContentPure = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
`;

const OptionContent = styled.div`
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? "var(--bs-primary)" : "var(--bs-body-color_active)")};
  margin-right: 20px;
  line-height: 20px;
`;

const VoteButton = styled.button`
  margin-bottom: 16px;
  border-radius: 8px;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background: #fff;
  width: 100%;
  height: 36px;
  font-weight: bold;
`;

const HasVote = styled.span`
  color: var(--bs-primary);
`;

const Bottom = styled.div`
  margin-top: 16px;
  font-size: 14px;
  line-height: 20px;
  .alias {
    color: #8c56ff;
    margin-right: 16px;
  }
  .rule {
    color: var(--font-light-color);
  }
`;
