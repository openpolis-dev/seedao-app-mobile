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
    <Layout title={t("Proposal.proposalDetail")} noTab>
      <ProposalContainer>
        {data && (
          <>
            <ProposalTitle>{data?.title}</ProposalTitle>

              <User>
                <div className="left">
                  <UserAvatar src={data?.user.photo_url} alt="" />
                  <div className="name">{data?.user.username}</div>
                </div>
                <div className="right">
                  <div className="date">{formatTime(new Date(data?.updated_at || ""))}</div>
                </div>
              </User>
            <BtmBox>
              {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
            </BtmBox>

          </>
        )}
      </ProposalContainer>
    </Layout>
  );
}

const BtmBox = styled.div`
  padding: 0 24px;
`

const ProposalContainer = styled.div`
  //background: #fff;
  padding: 20px 0;
  min-height: 100%;
  position: relative;
`;

const ProposalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  position: sticky;
  background: #fff;
  padding: 10px 20px;
  left: 0;
  top: 0;
  z-index: 99999;
  
`;
const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(217,217,217,0.5);
  .left{
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
    font-size: 13px;
    color: #999;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
