import React from "react";
import styled from "styled-components";
import { RectangularSkeleton } from "components/common/skeleton";
import DefaultLogo from "assets/Imgs/defaultLogo.png";
import {useTranslation} from "react-i18next";
import PublicJs from "../../utils/publicJs";
import DefaultAvatar from "assets/Imgs/avatar.svg";

export default function ProjectOrGuildItemDetail({ data, onClickItem,noTag }) {
    const { t } = useTranslation();
const showStatusComponent = () => {
    if (data?.status === 'closed') {
        return <StatusBox className="close">{t('Project.Closed')}</StatusBox>;
    }
    if (data?.status === 'open') {
        // @ts-ignore
        return <StatusBox className="pending">{t('Project.Open')}</StatusBox>;
    }
    if (data?.status === 'pending_close') {
        return <StatusBox>{t('Project.Pending')}</StatusBox>;
    }
};
  return (
    <Item onClick={() => onClickItem(data.id)}>
      <ImageBox>
        <img src={data.logo || DefaultLogo} alt="" />
      </ImageBox>
      <RightBox className="_right">

          <Title>{data.name}</Title>
          <FlexBox>
              {!noTag && showStatusComponent()}
              {!!data.user &&  <MemBox>
                  <Avatar>
                      <img src={data.user?.avatar? data.user?.avatar : DefaultAvatar} alt="" />
                  </Avatar>
                  <span>{data.sns?.endsWith('.seedao') ? data.sns : PublicJs.AddressToShow(data.user?.wallet)}</span>
                  {/*<span>{(data?.members?.length || 0) + (data?.sponsors?.length || 0)}</span> {t('Project.Members')}*/}
              </MemBox>
              }

          </FlexBox>

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

const MemBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
    margin:0 0 -6px 10px;
    
    
  //span {
  //  margin-right: 5px;
  //}
`;

const Avatar = styled.div`
    padding-right: 10px;
  img {
    width: 20px;
    height: 20px;
    object-fit: cover;
    object-position: center;
    border-radius: 100%;
  }
`;

const FlexBox = styled.div`
    display: flex;
    align-items: center;
`

const StatusBox = styled.div`
  font-size: 12px;
  color: #fff;
  background: var(--primary-color);
  padding: 2px 8px;
  border-radius: 4px;

  &.pending_close {
    background: #f9b617;
  }
  &.close {
    background: rgb(163, 160, 160);
  }
`;


const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: start;
  background-color: #fff;
`;

const RightBox = styled.div`
  flex: 1;
  display: flex;
  border-bottom: 1px solid var(--border-color-1);
  justify-content: space-between;
  padding-bottom: 10px;
    flex-direction: column;
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
  min-height: 36px;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  color: var(--font-color);
    min-height: 26px;
    width: 100%;
    overflow:hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-bottom: 5px;
`;


const ImageBox = styled.div`
  border-radius: 15px;
  overflow: hidden;
  width: 62px;
  height: 62px;
    flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
  }
`;
