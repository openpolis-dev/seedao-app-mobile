import { useTranslation } from "react-i18next";
import styled from "styled-components";

import VoteImg from "assets/Imgs/proposal/vote.svg";
import ShareImg from "assets/Imgs/proposal/share.svg";
import CommentImg from "assets/Imgs/proposal/comment.svg";
import CopyBox from "components/common/copy";

export default function ThreadTabbar({ showVote, id, openComment, openHistory }) {
  const { t } = useTranslation();
  const go2vote = () => {
    document.querySelector("#vote-block")?.scrollIntoView();
  };

  return (
    <Box>
      <HistoryBlock onClick={openHistory}>{t("Proposal.HistoryRecord")}</HistoryBlock>
      <ThreadToolsBar>
        {showVote && (
          <li onClick={go2vote}>
            <img src={VoteImg} alt="" />
            <span>{t("Proposal.Vote")}</span>
          </li>
        )}
        <li onClick={openComment}>
          <img src={CommentImg} alt="" />
          <span>{t("Proposal.Comment")}</span>
        </li>
        <li>
          <CopyBox dir="left" text={`${window.location.origin}/proposal/thread/${id}`}>
            <img src={ShareImg} alt="" />
            <span>{t("Proposal.Share")}</span>
          </CopyBox>
        </li>
        {/*{isCurrentApplicant && !!moreActions().length && (*/}
        {/*  <li>*/}
        {/*    <MoreSelectAction options={moreActions()} handleClickAction={handleClickMoreAction} />*/}
        {/*  </li>*/}
        {/*)}*/}
      </ThreadToolsBar>
    </Box>
  );
}

const Box = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  height: 70px;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border-color);
  font-size: 14px;
`;

const ThreadToolsBar = styled.ul`
  background-color: var(--bs-box-background);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  display: flex;
  align-items: center;
  gap: 32px;

  li {
    cursor: pointer;
    color: #9a9a9a;
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  img {
    margin-right: 10px;
  }
  .copy-content span {
    position: relative;
    top: -4px;
  }
`;
const HistoryBlock = styled.div`
  color: var(--primary-color);
`;
