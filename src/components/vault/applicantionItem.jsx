import styled from "styled-components";
import ApplicationStatusTag from "components/applicationStatusTag";
import { useTranslation } from "react-i18next";
import publicJs from "utils/publicJs";
import { SwipeableListItem, SwipeAction, TrailingActions } from "react-swipeable-list";

export default function ApplicationItem({ data, onCheck }) {
  const { t } = useTranslation();

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => console.info("swipe action triggered")}>
        <CheckButton onClick={onCheck}>{t("Application.Check")}</CheckButton>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableListItem trailingActions={trailingActions()}>
      <ItemBox>
        <ContentInnerBox>
          <LeftBox>
            <img src="" alt="" />
            <div>
              <div className="wallet">{publicJs.AddressToShow(data.target_user_wallet)}</div>
              <div>
                <ApplicationStatusTag status={data.status} />
              </div>
            </div>
          </LeftBox>
          <RightBox>
            <div className="value">{`${data.asset_display}`}</div>
            <div className="from">{t("Governance.Cityhall", { season: data.season_name })}</div>
          </RightBox>
        </ContentInnerBox>
      </ItemBox>
    </SwipeableListItem>
  );
}

const ItemBox = styled.div`
  min-width: 100%;
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
  line-height: 60px;
  background: var(--primary-color);
  text-align: center;
  font-size: 13px;
  color: #ffffff;
  white-space: nowrap;
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
