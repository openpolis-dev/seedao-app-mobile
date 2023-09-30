import { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import QuillViewer from "components/poposal/quillViewer";
import useLoadQuill from "hooks/useLoadQuill";
import { getProposalDetail } from "api/proposal";
import { formatTime } from "utils/time";
import store from "store";
import { saveLoading } from "store/reducer";

export default function ProposalThread() {
  const { t } = useTranslation();
  const { id: qid } = useParams();
  const enableQuill = useLoadQuill();

  const [data, setData] = useState();

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

  return (
    <Layout title={t("mobile.proposalDetail")}>
      <ProposalContainer>
        <ProposalTitle>{data?.title}</ProposalTitle>
        <User>
          <div className="left">
            <UserAvatar src={data?.user.photo_url} alt="" />
          </div>
          <div className="right">
            <div className="name">{data?.user.username}</div>
            <div className="date">{formatTime(new Date(data?.updated_at || ""))}</div>
          </div>
        </User>
        {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
      </ProposalContainer>
    </Layout>
  );
}

const ProposalContainer = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
  position: relative;
`;

const ProposalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;
const User = styled.div`
  display: flex;
  gap: 10px;
  margin-block: 16px;
  .name {
    font-weight: 500;
  }
  .date {
    font-size: 13px;
    color: #999;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
