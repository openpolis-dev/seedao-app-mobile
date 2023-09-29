import React from "react";
import styled from "styled-components";
import { ChevronRight } from "react-bootstrap-icons";

export default function ProjectOrGuildItem({ data, onClickItem }) {
  return (
    <Item onClick={() => onClickItem(data.id)}>
      <ImageBox>
        {data.logo && <img src={data.logo} alt="" />}
        <span className="title">{data.name}</span>
      </ImageBox>
      <span>
        <ChevronRight />
      </span>
    </Item>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  padding: 10px 20px;
`;
const ImageBox = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .title {
    font-size: 14px;
    line-height: 1.5em;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 15px;
  }
`;
