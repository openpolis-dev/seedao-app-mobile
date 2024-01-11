import styled from "styled-components";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "components/common/loading";
import CommentComponent from "components/proposalCom/comment";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ReplyTabbar from "components/proposalCom/replyTabbar";
import { useEffect, useRef, useState } from "react";
import { getProposalDetail, editCommet, addComment, deleteCommet } from "api/proposalV2";
import useQuerySNS from "hooks/useQuerySNS";
import useToast from "hooks/useToast";
import ActionOfCommet from "components/proposalCom/actionOfComment";
import useMetaforoLogin from "hooks/useMetaforoLogin";
import store from "store";
import { saveLoading } from "store/reducer";
import BaseModal from "components/baseModal";

const hideReply = false;

export const DeletedContent = `[{"insert":"Post deleted\\n"}]`;

export default function ThreadCommentsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [pinId, setPinId] = useState();
  const [commentsArray, setCommentsArray] = useState([]);
  const [currentCommentArrayIdx, setCurrentCommentArrayIdx] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showCommentAction, setShowCommentAction] = useState();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { getMultiSNS } = useQuerySNS();
  const { toast, Toast } = useToast();
  const replyRef = useRef();

  const { checkMetaforoLogin, LoginMetafoModal } = useMetaforoLogin();

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
      setPinId(res.data?.reject_metaforo_comment_id);
    } catch (error) {
      logError("get proposal detail error:", error);
      toast.danger(error?.data?.msg || error?.code || error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    id && requestsComments();
  }, [id]);

  const onReply = (data) => {
    replyRef?.current?.focus("reply", data);
  };
  const onMore = (data) => {
    setShowCommentAction(data);
  };

  const onEdit = async () => {
    replyRef?.current?.focus("edit", showCommentAction);
    setShowCommentAction(undefined);
  };

  const onDeleteComment = (cid, bindIdx) => {
    const _new_arr = [...commentsArray];
    for (const item of _new_arr[bindIdx]) {
      let flag = false;
      if (item.metaforo_post_id === cid) {
        item.content = DeletedContent;
        item.deleted = 1;
        break;
      }
      for (const childItem of item.children || []) {
        if (childItem.metaforo_post_id === cid) {
          childItem.content = DeletedContent;
          childItem.deleted = 1;
          flag = true;
          break;
        }
      }
      if (flag) {
        break;
      }
    }
    setCommentsArray(_new_arr);
  };
  const onDelete = () => {
    setShowConfirmDelete(true);
  };

  const onConfirmDelete = () => {
    store.dispatch(saveLoading(true));
    setShowCommentAction(undefined);

    deleteCommet(id, showCommentAction.metaforo_post_id)
      .then(() => {
        setShowConfirmDelete(false);
        onDeleteComment(showCommentAction.metaforo_post_id, showCommentAction.bindIdx);
        toast.success(t("Msg.ApproveSuccess"));
      })
      .catch((error) => {
        logError(`delete proposal-${id} comment-${showCommentAction.metaforo_post_id} failed`, error);
        toast.danger(error?.data?.msg || error?.code || error);
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  const onEditComment = (idx) => {
    requestsComments(idx);
  };

  const sendComment = async (type, data, content) => {
    const canReply = await checkMetaforoLogin();
    if (!canReply) {
      return;
    }
    store.dispatch(saveLoading(true));
    try {
      if (type === "edit") {
        await editCommet(id, content, data.metaforo_post_id);
        toast.success(t("Msg.ApproveSuccess"));
      } else {
        await addComment(id, content, data?.metaforo_post_id);
        toast.success(t("Msg.CommentSuccess"));
      }
      if (type === "reply" || type === "edit") {
        onEditComment(data.bindIdx);
      } else {
        onEditComment();
      }
      replyRef?.current?.clear();
      toast.success(t("Msg.CommentSuccess"));
      // refresh
    } catch (error) {
      logError("send comment error:", type, error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    checkMetaforoLogin();
  }, []);

  return (
    <Layout
      title={t("Proposal.Comment")}
      headStyle={{ style: { borderBottom: "1px solid var(--border-color-1)" } }}
      customTab={<ReplyTabbar ref={replyRef} sendComment={sendComment} />}
    >
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
              onMore={onMore}
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
                  onMore={onMore}
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
              onMore={onMore}
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
                  onMore={onMore}
                  hideReply={hideReply}
                  isCurrentUser={isCurrentUser(ip?.wallet)}
                  hideVersion
                />
              ))}
            </CommentComponent>
          ))}
        </CommentsList>
      </InfiniteScroll>
      {showCommentAction && (
        <ActionOfCommet
          data={showCommentAction}
          handleClose={() => setShowCommentAction(undefined)}
          onClickEditCommet={onEdit}
          onClickDeleteCommet={onDelete}
        />
      )}
      {showConfirmDelete && (
        <BaseModal
          title={t("Proposal.DeleteComment")}
          msg={t("Proposal.ConfirmDeleteComment")}
          onConfirm={onConfirmDelete}
          onCancel={() => {
            setShowConfirmDelete(false);
            setShowCommentAction(undefined);
          }}
        />
      )}
      {Toast}
      {LoginMetafoModal}
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
