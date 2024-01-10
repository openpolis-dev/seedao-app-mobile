import styled from "styled-components";
import Layout from "components/layout/layout";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatTime } from "utils/time";
import ProposalStateTag from "components/proposalCom/stateTag";
import CategoryTag from "components/proposalCom/categoryTag";
import Avatar from "components/common/avatar";
import store from "store";
import { saveLoading } from "store/reducer";
import { getProposalDetail, getComponents } from "api/proposalV2";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import publicJs from "utils/publicJs";
import useQuerySNS from "hooks/useQuerySNS";
import { Preview } from "@seedao/components";
import { MdPreview } from "md-editor-rt";
import ProposalVote from "components/proposalCom/vote";
import { ProposalState } from "constant/proposal";
import ThreadTabbar from "components/proposalCom/threadTabbar";
import LinkImg from "assets/Imgs/proposal/link.png";

export default function ProposalThread() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const [data, setData] = useState();
  const [applicantAvatar, setApplicantAvatar] = useState();
  const [applicant, setApplicant] = useState("");

  const [applicantSNS, setApplicantSNS] = useState("");

  const [hasMore, setHasMore] = useState(false);
  const [components, setComponents] = useState([]);
  const [commentsArray, setCommentsArray] = useState([]);
  const [currentCommentArrayIdx, setCurrentCommentArrayIdx] = useState(0);
  const [dataSource, setDatasource] = useState();

  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalEditCount, setTotalEditCount] = useState(0);
  const [editHistoryList, setEditHistoryList] = useState([]);
  const [contentBlocks, setContentBlocks] = useState([]);

  const { getMultiSNS } = useQuerySNS();

  const getProposal = async (refreshIdx) => {
    store.dispatch(saveLoading(true));

    try {
      let res;
      if (refreshIdx !== void 0) {
        // refresh the pointed group array
        let start_post_id;
        if (refreshIdx === 0) {
          start_post_id = undefined;
        } else {
          const _arr = commentsArray[refreshIdx - 1];
          start_post_id = _arr[_arr.length - 1].metaforo_post_id;
        }
        res = await getProposalDetail(Number(id), start_post_id);
      } else {
        const _arr = commentsArray[currentCommentArrayIdx];
        res = await getProposalDetail(Number(id), _arr ? _arr[_arr.length - 1]?.metaforo_post_id : undefined);
      }
      setData(res.data);

      setContentBlocks(res.data.content_blocks);
      const comStr = res.data.components || [];
      comStr.map((item) => {
        if (typeof item.data === "string") {
          item.data = JSON.parse(item.data);
        }
        return item;
      });
      setDatasource(comStr ?? []);
      // comment

      if (refreshIdx !== void 0) {
        const _new_arr = [...commentsArray];
        _new_arr[currentCommentArrayIdx] = res.data.comments?.map((c) => ({
          ...c,
          bindIdx: currentCommentArrayIdx,
          children: c.children?.map((c) => ({ ...c, bindIdx: currentCommentArrayIdx })),
        }));
        setCommentsArray(_new_arr);
      } else if (res.data.comments?.length) {
        const new_idx = commentsArray.length;
        setCurrentCommentArrayIdx(new_idx);

        const new_arr = [
          ...commentsArray,
          res.data.comments?.map((c) => ({
            ...c,
            bindIdx: new_idx,
            children: c.children?.map((c) => ({ ...c, bindIdx: currentCommentArrayIdx })),
          })) || [],
        ];
        setCommentsArray(new_arr);
        // check if has more
        const all_comments = new_arr.length ? new_arr.reduce((a, b) => [...a, ...b], []) : [];
        let now_count = all_comments.length;
        all_comments.forEach((item) => (now_count += item.children?.length || 0));
        setHasMore(all_comments.length === 0 ? false : now_count < res.data.comment_count);
        getMultiSNS(Array.from(new Set(all_comments.map((item) => item.wallet))));
      }
      setTotalPostsCount(res.data.comment_count);

      // history
      setTotalEditCount(res.data.histories.total_count ?? 0);
      setEditHistoryList(res.data.histories?.lists ?? []);
      const applicant = res.data.applicant;
      setApplicantSNS(publicJs.AddressToShow(applicant));
      setApplicant(applicant);
      setApplicantAvatar(res.data.applicant_avatar);
      if (applicant) {
        try {
          const snsMap = await getMultiSNS([applicant]);
          const name = snsMap[applicant.toLocaleLowerCase()] || applicant;
          setApplicantSNS(name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4));
        } catch (error) {}
      }
    } catch (error) {
      logError("get proposal detail error:", error);
      //   showToast(error?.data?.msg || error?.code || error, ToastType.Danger, { autoClose: false });
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (state) {
      setData(state);
    }
    getProposal();
    getComponentsList();
  }, [id, state]);

  const getComponentsList = async () => {
    // NOTE: getProposalDetail may use more time, so not show loading here
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await getComponents();
      let components = resp.data;

      components?.map((item) => {
        if (typeof item.schema === "string") {
          item.schema = JSON.parse(item.schema);
        }
        return item;
      });

      setComponents(resp.data);
    } catch (error) {
      logError("getAllProposals failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const showVote = () => {
    if (!data?.votes?.[0]) {
      return false;
    }
    if (
      [ProposalState.Rejected, ProposalState.Withdrawn, ProposalState.PendingSubmit, ProposalState.Draft].includes(
        data?.state,
      )
    ) {
      return false;
    }
    return true;
  };

  return (
    <Layout
      title={t("Proposal.ProposalDetail")}
      customTab={
        <ThreadTabbar
          showVote={showVote()}
          openComment={() => navigate(`/proposal/thread/${id}/comments`)}
          openHistory={() => navigate(`/proposal/thread/${id}/history`, { state: data.histories?.lists ?? [] })}
        />
      }
    >
      <ThreadHead>
        <div className="title">
          {data?.title}{" "}
          {data?.arweave && (
            <a
              href={`https://arweave.net/tx/${data?.arweave}/data.html`}
              target="_blank"
              rel="noreferrer"
              className="linkStyle"
            >
              <img src={LinkImg} alt="" />
            </a>
          )}
        </div>
        <FlexLine>
          {data?.state && <ProposalStateTag state={data.state} />}
          {data?.category_name && <CategoryTag>{data?.category_name}</CategoryTag>}
        </FlexLine>

        <InfoBox>
          <UserBox>
            <Avatar src={applicantAvatar} size="30px" />
            <div>
              <span className="name">{applicantSNS}</span>
              {data?.create_ts && <div className="date">{formatTime(data.create_ts * 1000)}</div>}
            </div>
          </UserBox>
        </InfoBox>
      </ThreadHead>
      {data?.is_rejected && data?.reject_reason && data?.reject_ts && (
        <RejectOuter>
          <RejectBlock>
            <RejectLine>
              <span className="rejectTit">{t("Proposal.CityhallRejected")}</span>
              <span className="time">{formatTime(data.reject_ts * 1000)}</span>
            </RejectLine>
            <div className="desc">{data.reject_reason}</div>
          </RejectBlock>
          <div className="line" />
        </RejectOuter>
      )}
      <ContentOuter>
        <Preview
          DataSource={dataSource}
          language={i18n.language}
          initialItems={components}
          BeforeComponent={
            !!dataSource?.length && (
              <ComponnentBox>
                <div className="title">{t("Proposal.proposalComponents")}</div>
              </ComponnentBox>
            )
          }
          AfterComponent={contentBlocks.map((block, i) => (
            <ProposalContentBlock key={block.title} $radius={i === 0 && !dataSource?.length ? "4px 4px 0 0" : "0"}>
              <div className="title">{block.title}</div>
              <div className="content">
                <MdPreview modelValue={block.content || ""} />
              </div>
            </ProposalContentBlock>
          ))}
        />
      </ContentOuter>
      {showVote() && (
        <ProposalVote voteGate={data?.vote_gate} poll={data.votes[0]} id={Number(id)} updateStatus={getProposal} />
      )}
    </Layout>
  );
}

const RejectBlock = styled.div`
  border-radius: 8px;
  background: rgba(251, 78, 78, 0.1);
  padding: 8px 16px;
  margin-bottom: 16px;
  .desc {
    color: var(--bs-body-color_active);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`;

const RejectOuter = styled.div`
  margin: 0 20px 16px;
  .line {
    width: 100%;
    height: 1px;
    background: var(--border-color-1);
  }
`;

const RejectLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .rejectTit {
    color: #fb4e4e;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
  .time {
    color: #bbb;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
`;

const ThreadHead = styled.div`
  border-top: 1px solid var(--border-color-1);
  padding: 16px 20px;
  .title {
    font-size: 16px;
    font-family: "Poppins-Bold";
    color: var(--bs-body-color_active);
    line-height: 30px;
  }
  .linkStyle {
    width: 16px;
    height: 16px;
    img {
      width: 16px;
      height: 16px;
      margin-bottom: -3px;
    }
  }
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  gap: 16px;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const UserBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }

  .name {
    font-size: 12px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
    cursor: default;
  }
  .date {
    color: #bbb;
    font-size: 12px;
  }
`;

const ContentOuter = styled.div`
  margin: 0 20px;
`;

const ProposalContentBlock = styled.div`
  margin-bottom: 16px;
  .title {
    background: rgba(82, 0, 255, 0.08);
    line-height: 40px;
    border-radius: 4px;
    color: var(--bs-body-color_active);
    padding-inline: 8px;
    font-size: 16px;
    font-family: "Poppins-SemiBold";
  }
  .content .md-editor-preview-wrapper {
    padding-inline: 12px;
    font-size: 14px;
  }
`;

const ComponnentBox = styled(ProposalContentBlock)`
  margin-bottom: 0;
`;
