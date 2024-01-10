import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "components/common/loading";
import CommentComponent from "components/proposalCom/comment";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ReplyTabbar from "components/proposalCom/replyTabbar";
import { useEffect, useState } from "react";
import { getProposalDetail } from "api/proposalV2";
import useQuerySNS from "hooks/useQuerySNS";
import useToast from "hooks/useToast";

const hideReply = false;

export default function ThreadCommentsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { state } = useLocation();

  const [pinId, setPinId] = useState();
  const [commentsArray, setCommentsArray] = useState([]);
  const [currentCommentArrayIdx, setCurrentCommentArrayIdx] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const { getMultiSNS } = useQuerySNS();
  const { toast, Toast } = useToast();

  const posts = commentsArray.length ? commentsArray.reduce((a, b) => [...a, ...b], []) : [];

  const account = useSelector((store) => store.account);
  const pinPost = posts.find((p) => p.metaforo_post_id === pinId);
  const filterPosts = posts.filter((p) => p.metaforo_post_id !== pinId);

  const isCurrentUser = (address) => {
    return account?.toLocaleLowerCase() === address?.toLocaleLowerCase();
  };

  const findReplyData = (reply_pid) => {
    if (!reply_pid) {
      return undefined;
    }
    let d = undefined;
    posts.forEach((p) => {
      if (p.metaforo_post_id === reply_pid) {
        d = p;
      } else {
        const child = p.children?.find((ip) => ip.metaforo_post_id === reply_pid);
        if (child) {
          d = child;
        }
      }
    });
    return d;
  };

  const findPinPostChildrenParent = (id) => {
    const data = findReplyData(id);
    if (data) {
      if (data.metaforo_post_id === pinId) {
        return { ...data, userName: t("Governance.CityhallPure") };
      }
    }
    return data;
  };

  const requestsComments = async (refreshIdx) => {
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
      setPinId(res.data?.reject_metaforo_comment_id);
    } catch (error) {
      logError("get proposal detail error:", error);
      toast.danger(error?.data?.msg || error?.code || error);
    } finally {
    }
  };

  useEffect(() => {
    id && requestsComments();
  }, [id]);

  const onReply = () => {};
  const onEdit = () => {};
  const onDelete = () => {};

  return (
    <Layout title={t("Proposal.Comment")} customTab={<ReplyTabbar />}>
      <InfiniteScroll
        scrollableTarget="inner"
        dataLength={posts.length}
        next={requestsComments}
        hasMore={hasMore}
        loader={<Loading />}
      >
        {posts.length === 0 && <NoItem>{t("Proposal.EmptyComment")}</NoItem>}
        <CommentsList>
          {!!pinPost && (
            <CommentComponent
              data={pinPost}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              hideReply={hideReply}
              isCurrentUser={false}
              isSpecial
            >
              {pinPost.children?.map((ip) => (
                <CommentComponent
                  data={ip}
                  isChild={true}
                  key={ip.metaforo_post_id}
                  parentData={findPinPostChildrenParent(ip.reply_metaforo_post_id)}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  hideReply={hideReply}
                  isCurrentUser={isCurrentUser(ip?.wallet)}
                  hideVersion
                />
              ))}
            </CommentComponent>
          )}
          {filterPosts.map((p) => (
            <CommentComponent
              data={p}
              key={p.metaforo_post_id}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              hideReply={hideReply}
              isCurrentUser={isCurrentUser(p.wallet)}
            >
              {p.children?.map((ip) => (
                <CommentComponent
                  data={ip}
                  isChild={true}
                  key={ip.metaforo_post_id}
                  parentData={findReplyData(ip.reply_metaforo_post_id)}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  hideReply={hideReply}
                  isCurrentUser={isCurrentUser(ip?.wallet)}
                  hideVersion
                />
              ))}
            </CommentComponent>
          ))}
        </CommentsList>
      </InfiniteScroll>
      {Toast}
    </Layout>
  );
}

const CommentsList = styled.div`
  padding-inline: 20px;
`;

const NoItem = styled.div`
  text-align: center;
  margin-top: 120px;
  color: var(--font-light-color);
  font-size: 14px;
`;