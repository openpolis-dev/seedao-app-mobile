import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";

export default function ProgressBar({ percent }) {
  const { t } = useTranslation();
  return (
    <ProgressBarBox percent={percent} left={percent < 30 ? 1 : 0}>
      <div className="progress">
        <span>
          {t("mobile.used")} {percent?.toFixed(2) || 0}%
        </span>
      </div>
    </ProgressBarBox>
  );
}

const LabelStyle = css`
  span {
    left: calc(100% + 10px);
    right: unset;
    text-align: left;
  }
`;

const ProgressBarBox = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 20px;
  background-color: #e7e7e7;
  position: relative;
  overflow: hidden;
  .progress {
    width: ${(props) => Math.min(props.percent, 100)}%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #ffc107;
    text-align: right;
    overflow: visible;
    span {
      position: absolute;
      right: 10px;
      display: block;
      width: 100px;
    }
  }
  ${(props) => (props.left ? LabelStyle : "")}
`;
