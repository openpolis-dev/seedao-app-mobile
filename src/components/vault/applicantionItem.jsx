import { useState } from "react";
import styled from "styled-components";
import ApplicationStatusTag, { ApplicationStatus } from "components/applicationStatusTag";
import { useTranslation } from "react-i18next";
import publicJs from "utils/publicJs";

export default function ApplicationItem({ data, onCheck }) {
  const { t } = useTranslation();
  const [moveStyle, setStyle] = useState({});
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);
  const [width, setWidth] = useState(0);
  const [isShow, setIsShow] = useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX);
    setStartY(e.touches[0].pageY);
  };

  const handleTouchMove = (e) => {
    setCurrentX(e.touches[0].pageX);
    setMoveX(currentX - startX);
    setMoveY(e.touches[0].pageY - startY);
    // 纵向移动时return
    if (Math.abs(moveY) > Math.abs(moveX)) {
      return;
    }
    // 滑动超过一定距离时，才触发
    if (Math.abs(moveX) < 10) {
      return;
    }
    const distance = moveX >= 0 ? 0 : -105;
    setStyle({
      transform: `translateX(${distance}px)`,
    });
    setWidth(Math.abs(distance * 1));
    setIsShow(true);
  };

  return (
    <ItemBox>
      <ContentInnerBox style={moveStyle} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
        <LeftBox>
          <img src="" alt="" />
          <div>
            <div className="wallet">{publicJs.AddressToShow(data.target_user_wallet, 4)}</div>
            <div>
              <ApplicationStatusTag status={ApplicationStatus.Approved} />
            </div>
          </div>
        </LeftBox>
        <RightBox>
          <div className="value">{`${data.asset_display}`}</div>
          <div className="from">{t("Governance.Cityhall", { season: data.season_name })}</div>
        </RightBox>
      </ContentInnerBox>

      <CheckButton
        className={`delete-btn ${width ? "showBtn" : isShow ? "hideBtn" : ""}`}
        style={{ width: width + "px" }}
        onClick={onCheck}
      >
        {t("Application.Check")}
      </CheckButton>
    </ItemBox>
  );
}

const ItemBox = styled.div`
  height: 60px;
  border-bottom: 1px solid #e1e1eb;
  position: relative;
`;

const ContentInnerBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  left: 0;
  top: 0;
  transition: transform 0.3s ease;
`;

const CheckButton = styled.div`
  position: absolute;
  top: 0;
  right: -8px;
  height: 100%;
  background: var(--primary-color);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  &.showBtn {
    animation-name: showBtn;
    animation-duration: 0.5s;
  }
  &.hideBtn {
    animation-name: hideBtn;
    animation-duration: 0.5s;
  }
  /* 动画代码 */
  @keyframes showBtn {
    from {
      width: 0px;
    }
    to {
      width: 105px;
    }
  }
  /* 动画代码 */
  @keyframes hideBtn {
    from {
      width: 105px;
    }
    to {
      width: 0px;
    }
  }
`;

const LeftBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  .wallet {
    font-size: 14px;
  }
`;

const RightBox = styled.div`
  text-align: right;
  .value {
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
  .from {
    font-size: 12px;
    line-height: 14px;
    color: #9ca1b3;
    margin-top: 5px;
  }
`;
