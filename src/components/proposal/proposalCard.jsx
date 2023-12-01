import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { formatDate } from "utils/time";
import { MultiLineStyle } from "assets/styles/common";
import PublicJs from "../../utils/publicJs";
import store from "../../store";
import {saveCache, saveDetail} from "../../store/reducer";
import {useTranslation} from "react-i18next";

export default function ProposalCard({ data,StorageList }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { t } = useTranslation();

  const handleContent = async () => {
    let delta = [];
    try {
      delta = JSON.parse(data.first_post.content);
    } catch (e) {
      console.info("illegal json:" + data.first_post.content);
    }

    const text = [];
    let totalTextLength = 0;

    for (let i = 0; i < delta.length; i++) {
      // for videos and images
      if (delta[i] && delta[i].insert && typeof delta[i].insert === "object") {
        // delta.splice(i, 1)
        // for text
      } else if (delta[i] && delta[i].insert && typeof delta[i].insert === "string") {
        // if we already have 6 lines or 200 characters. that's enough for preview
        if (text.length >= 6 || totalTextLength > 200) {
          continue;
        }

        // it's just newline and space.
        if (delta[i].insert.match(/^[\n\s]+$/)) {
          // if the previous line doesn't end with newline mark, we can add one newline mark
          // otherwise just ignore it
          if (!text[i - 1] || (typeof text[i - 1].insert === "string" && !text[i - 1].insert.match(/\n$/))) {
            text.push({ insert: "\n" });
          }
        } else {
          // if text end with multiple newline mark, leave only one
          if (delta[i].insert.match(/\n+$/)) {
            delta[i].insert = delta[i].insert.replace(/\n+$/, "\n");
          }
          text.push(delta[i]);
          totalTextLength = totalTextLength + delta[i].insert.length;
        }
      }
    }
    // post content is always a json string of Delta, we need to convert it html
    const QuillDeltaToHtmlConverter = await require("quill-delta-to-html");
    const converter = new QuillDeltaToHtmlConverter.QuillDeltaToHtmlConverter(text, {});
    let textContent = converter.convert();
    if (textContent === "<p><br/></p>") {
      textContent = "";
    }
    setContent(textContent);
  };

  useEffect(() => {
    data?.first_post.content && handleContent();
  }, [data?.first_post.content]);

  const openProposal = () => {
    StorageList(data.id)
    navigate(`/proposal/thread/${data.id}`);
  };



  return (
    <CardBox key={data.id}>
      <div onClick={openProposal}>
        <Title line={2}>{data.title}</Title>
        {/*<ProposalContent line={2} dangerouslySetInnerHTML={{ __html: content }}></ProposalContent>*/}
        <ProposalContent line={2}>{PublicJs.filterTags(content)}</ProposalContent>

        <CardFooter>
          <div className="left">
            <UserAvatar src={data.user.photo_url} alt="" />
            <div className={data.user?.user_title?.name ? "name" : "nameAll"}>{data.user.username}</div>
            {data.user?.user_title?.name && (
              <UserTag bg={data.user.user_title.background}>{data.user.user_title?.name}</UserTag>
            )}
          </div>
          <div className="right">
            <span>{`#${data.category_name}`}</span>
            <span className="date">{formatDate(new Date(data.updated_at))}</span>
          </div>
        </CardFooter>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const CardFooter = styled.div`
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .name {
      margin-left: 4px;
      width: 10vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 24px;
      line-height: 24px;
    }
    .nameAll {
      margin-left: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 30vw;
    }
  }
  .right {
    font-size: 10px;
    color: var(--font-light-color);
    flex-shrink: 0;
    span:first-of-type {
      margin-right: 4px;
    }
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: "Poppins-SemiBold";
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 8px;
  ${MultiLineStyle}
`;

const ProposalContent = styled.div`
  ${MultiLineStyle}
  font-size: 14px;
  color: #3a373e;
  line-height: 24px;
  .ql-editor p {
    line-height: 24px;
  }
  strong, span {
    background-color: transparent !important;
    color: var(--font-color) !important;
  }
`;

const UserTag = styled.span`
  padding-inline: 8px;
  line-height: 18px;
  display: inline-block;
  font-size: 10px;
  background-color: ${(props) => props.bg};
  border-radius: 20px;
  margin-left: 8px;
  color: #fff;
  flex-shrink: 0;
`;
