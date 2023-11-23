import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import QuillViewer from "components/proposal/quillViewer";
import useLoadQuill from "hooks/useLoadQuill";
import { getProposalDetail } from "api/proposal";
import { formatTime } from "utils/time";
import store from "store";
import { saveLoading } from "store/reducer";
import ProposalVoteProgress from "components/proposal/proposalVote";

export default function ProposalThread() {
  const { t } = useTranslation();
  const { id: qid } = useParams();
  const enableQuill = useLoadQuill();

  const [data, setData] = useState();
  const [noHead, setNoHead] = useState(false);
  console.log("noHead:", noHead);

  useEffect(() => {
    const getProposalInfo = async () => {
      const id = Number(qid);
      if (!id) {
        return;
      }
      store.dispatch(saveLoading(true));
      try {
        const res = await getProposalDetail(id);
        setData(res.data.thread);
      } catch (error) {
        console.error("get proposal detail error:", error);
      } finally {
        store.dispatch(saveLoading(false));
      }
    };
    qid && getProposalInfo();
  }, [qid]);

  useEffect(() => {
    const container = document.querySelector("#inner");
    container && container.addEventListener("scroll", ScrollHeight);
    return () => {
      container.removeEventListener("scroll", ScrollHeight);
    };
  }, []);

  const ScrollHeight = () => {
    const container = document.querySelector("#inner");
    setNoHead(container.scrollTop > 10);
  };

  return (
    <Layout title={t("Proposal.ProposalDetail")} noHeader={noHead}>
      <ProposalContainer>
        {data && (
          <>
            <ThreadHeader>
              <ProposalTitle>{data?.title}</ProposalTitle>

              <User>
                <div className="left">
                  <UserAvatar src={data?.user.photo_url} alt="" />
                  <div className="name">{data?.user.username}</div>
                  {data.user_title?.name && <UserTag bg={data.user_title.background}>{data.user_title?.name}</UserTag>}
                </div>
                <div className="right">
                  <span className="date">{formatTime(new Date(data?.updated_at || ""), "-")}</span>
                </div>
              </User>
            </ThreadHeader>

            <BtmBox>
              {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
            </BtmBox>

            {data.polls[0] && <ProposalVoteProgress poll={data.polls[0]} />}
          </>
        )}
      </ProposalContainer>
    </Layout>
  );
}

const BtmBox = styled.div`
  padding: 16px 20px;
`;

const ProposalContainer = styled.div`
  min-height: 100%;
  position: relative;
`;
const ThreadHeader = styled.div`
  position: sticky;
  left: 0;
  top: 0;
  z-index: 99999;
  background: #fff;
  padding-top: 17px;
`;

const ProposalTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  font-family: "Poppins-SemiBold";
`;
const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  padding-top: 0;
  border-bottom: 1px solid rgba(217, 217, 217, 0.5);
  .left {
    display: flex;
    align-items: center;
  }
  .name {
    font-size: 12px;
    font-weight: 400;
    margin-left: 10px;
    line-height: 16px;
  }
  .date {
    font-size: 12px;
    color: var(--font-light-color);
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const UserTag = styled.span`
  padding-inline: 8px;
  height: 18px;
  line-height: 18px;
  display: inline-block;
  font-size: 10px;
  background-color: ${(props) => props.bg};
  border-radius: 20px;
  margin-left: 8px;
  color: #fff;
  flex-shrink: 0;
`;
