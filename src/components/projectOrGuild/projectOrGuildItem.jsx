import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { RectangularSkeleton } from "components/common/skeleton";

export default function ProjectOrGuildItem({ data, onClickItem }) {
  const { t } = useTranslation();
  return (
    <Item onClick={() => onClickItem(data.id)}>
      <ImageBox>{data.logo && <img src={data.logo} alt="" />}</ImageBox>
      <RightBox className="_right">
        <div>
          <Title>{data.name}</Title>
          <DescBox>{data.desc}</DescBox>
        </div>
        <div>
          <LookButton>{t("Buttons.Check")}</LookButton>
        </div>
      </RightBox>
    </Item>
  );
}

export const ProjectOrGuildItemSkeleton = () => {
  return (
    <Item>
      <RectangularSkeleton width="62px" height="62px" radius="15px" />
      <RightBox>
        <div>
          <RectangularSkeleton width="100px" height="22px" />
          <RectangularSkeleton width="200px" height="34px" style={{ marginTop: "6px" }} />
        </div>
      </RightBox>
    </Item>
  );
};

const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: start;
  background-color: #fff;
`;

const RightBox = styled.div`
  height: 70px;
  flex: 1;
  display: flex;
  border-bottom: 1px solid var(--border-color-1);
  gap: 24px;
  justify-content: space-between;
`;

const DescBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 12px;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 18px;
  margin-top: 3px;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--font-color);
`;

const LookButton = styled.span`
  display: inline-block;
  min-width: 72px;
  line-height: 29px;
  background-color: var(--background-color);
  font-size: 13px;
  color: var(--primary-color);
  font-family: Poppins-SemiBold, Poppins;
  border-radius: 22px;
  cursor: pointer;
  text-align: center;
  margin-top: 18px;
`;

const ImageBox = styled.div`
  border-radius: 15px;
  overflow: hidden;
  width: 62px;
  height: 62px;
  img {
    width: 100%;
    height: 100%;
  }
`;
