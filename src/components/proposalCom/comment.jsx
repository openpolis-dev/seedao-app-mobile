import styled from "styled-components";
import { handleContent } from "./parseContent";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatMsgTime, formatTime } from "utils/time";
import CommentIcon from "assets/Imgs/proposal/commentReply.svg";
import publicJs from "utils/publicJs";
import CityHallImg from "assets/Imgs/proposal/cityhall.png";
import Avatar from "components/common/avatar";
import { useSelector } from "react-redux";
import { MdPreview } from "md-editor-rt";
import LinkIcon from "assets/Imgs/proposal/link.svg";

export const DeletedContent = `[{"insert":"Post deleted\\n"}]`;

const formatSNS = (snsMap, wallet) => {
  const name = snsMap[wallet] || wallet;
  return name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4);
};

const useParseContent = (data, noNeedParse) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const parse = async () => {
      const _content = await handleContent(data);
      setContent(_content);
    };
    !noNeedParse && parse();
  }, [data, noNeedParse]);
  return content;
};

export default function CommentComponent({
  data,
  children,
  isChild,
  parentData,
  onReply,
  onMore,
  hideReply,
  isCurrentUser,
  isSpecial,
  hideVersion,
}) {
  const { t } = useTranslation();
  const [showVersionTip, setShowVersionTip] = useState(false);
  const versionTargetRef = useRef(null);

  const snsMap = useSelector((store) => store.snsMap);

  const content = useParseContent(data?.deleted ? DeletedContent : data?.content, isSpecial);

  const handleReply = () => {
    onReply(data);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setShowVersionTip(false);
    });
  }, []);

  const handleShow = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    setShowVersionTip(true);
  };

  return (
    <CommentStyle padding={isChild ? "64px" : "0"} ischild={isChild}>
      {/* {parentData && <ReplyComment data={parentData} />} */}
      <CommentMain>
        <Avatar src={isSpecial ? CityHallImg : data.avatar} size="32px" />
        <RightBox>
          <RhtBtm>
            <Flextop>
              <NameBox>
                {isSpecial ? t("Governance.CityhallPure") : formatSNS(snsMap, data.wallet?.toLocaleLowerCase())}
              </NameBox>

              <TimeBox>{formatMsgTime(data.created_ts * 1000, t)}</TimeBox>
              {!hideVersion && data.proposal_arweave_hash && (
                <VersionTag>
                  <span className="a" ref={versionTargetRef} onClick={(e) => handleShow(e)}>
                    a
                  </span>
                </VersionTag>
              )}
              {showVersionTip && (
                <Tip
                  onClick={() => {
                    window.open(`https://arweave.net/tx/${data.proposal_arweave_hash}/data.html`);
                    setShowVersionTip(false);
                  }}
                >
                  <div className="titleName">
                    {t("Proposal.VersionTitle")} <img src={LinkIcon} alt="" />
                  </div>
                  <div className="time">
                    {data.proposal_title}
                    {formatTime(data.proposal_ts * 1000)}
                  </div>
                </Tip>
              )}
            </Flextop>
            <div>
              {parentData && (
                <ReplyTag>
                  <span>{t("Proposal.Reply")} </span>
                  {"@"} {parentData?.userName || formatSNS(snsMap, parentData.wallet?.toLocaleLowerCase())}
                </ReplyTag>
              )}
            </div>
            {isSpecial ? (
              <Content>{data.content}</Content>
            ) : data?.content.includes("insert") ? (
              <Content className="content" dangerouslySetInnerHTML={{ __html: content }}></Content>
            ) : (
              <MdPreview modelValue={data?.content || ""} />
            )}
            {!data.deleted && (
              <OpLine>
                {!hideReply && (
                  <FlexReply>
                    <ReplyBtn onClick={handleReply}>
                      <img src={CommentIcon} alt="" />
                      {t("Proposal.Reply")}
                    </ReplyBtn>
                    {isCurrentUser && <span onClick={() => onMore(data)}>...</span>}
                  </FlexReply>
                )}
              </OpLine>
            )}
          </RhtBtm>
        </RightBox>
        {!isChild && <div className="line" />}
      </CommentMain>
      {children}
    </CommentStyle>
  );
}

const CommentStyle = styled.div`
  padding-left: ${(props) => props.padding};
  margin-bottom: 32px;
  position: relative;
  p {
    padding: 0;
    margin: 0;
  }
  .line {
    position: absolute;
    right: 0;
    bottom: -16px;
    width: calc(100% - 40px);
    height: 1px;
    background: var(--border-color-1);
  }
`;

const CommentMain = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 17px;
  width: 100%;
`;

const RightBox = styled.div`
  flex-grow: 1;
`;

const ReplyTag = styled.div`
  color: #2f8fff;
  span {
    color: var(--bs-body-color_active);
  }
`;

const VersionTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  span.a {
    cursor: pointer;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 15px;
    border-radius: 50%;
    font-size: 12px;
    color: #bbb;
    border: 1px solid #bbb;
    text-align: center;
    box-sizing: border-box;
  }
  &:hover {
    color: #2f8fff;
    span.a {
      color: #2f8fff;
      border: 1px solid #2f8fff;
    }
  }
`;

const Tip = styled.div`
  position: absolute;
  left: 20vw;
  top: 20px;
  min-width: 70vw;
  line-height: 34px;
  padding: 8px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #fff;
  box-shadow: 2px 4px 4px 0px var(--bs-border-color_opacity);
  z-index: 1;

  cursor: default;
  font-size: 14px;
  .titleName {
    line-height: 22px;
    height: 22px;
    font-size: 12px;
    font-family: "Poppins-SemiBold";
  }
  .time {
    font-size: 12px;
    line-height: 22px;
  }
  img {
    position: relative;
    top: 2px;
    margin-left: 4px;
  }
`;

const Content = styled.div`
  color: var(--bs-body-color_active);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;
const NameBox = styled.div`
  color: var(--bs-body-color_active);
  font-size: 16px;
  font-style: normal;
  font-family: "Poppins-SemiBold";
  line-height: 22px;
`;
const TimeBox = styled.div`
  color: #bbb;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`;

const OpLine = styled.div`
  display: flex;
`;
const ReplyBtn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  color: #2f8fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-right: 10px;
  img {
    margin-right: 8px;
  }
`;
const FlexReply = styled.div`
  display: flex;
  align-items: center;
  color: #2f8fff;
  span {
    line-height: 12px;
    margin-top: -9px;
  }
`;
const RhtBtm = styled.div`
  flex-grow: 1;
`;
const Flextop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
