import styled from "styled-components";
import { ACTIONS, useSNSContext } from "./snsProvider";
import { useTranslation } from "react-i18next";
import DoneIcon from "assets/Imgs/sns/done.svg";

const Loading = () => {
  return <LoadingBox className="spinner"></LoadingBox>;
};

const STEPS = [
  {
    step: 1,
    value: 1,
    intro: "SNS.Step1Intro",
  },
  {
    step: 2,
    value: 1.5,
    intro: "SNS.StepMiddleIntro",
  },
  {
    step: 3,
    value: 2,
    intro: "SNS.Step2Intro",
  },
];

export default function StepLoading() {
  const {
    state: { step },
    dispatch: dispatchSNS,
  } = useSNSContext();
  const { t } = useTranslation();
  return (
    <Mask>
      <LoadingContainer>
        <div className="title">{t("SNS.StepLoadingTitle")}</div>
        <div className="step-container">
          {STEPS.map((item) => (
            <StepBox className={step >= item.value ? "active" : ""} key={item.value}>
              <StepBoxLeft>
                {step > item.value ? <img src={DoneIcon} alt="" /> : <div className="step">{item.step}</div>}
                <div className="loader">{step === item.value && <Loading />}</div>
              </StepBoxLeft>

              {/* @ts-ignore */}
              <div className="intro">{t(item.intro)}</div>
            </StepBox>
          ))}
        </div>
        <CloseButton onClick={() => dispatchSNS({ type: ACTIONS.CLOSE_LOADING })}>{t("SNS.CloseLoading")}</CloseButton>
      </LoadingContainer>
    </Mask>
  );
}

const Mask = styled.div`
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-inline: 20px;
  .title {
    font-family: "Poppins-Medium";
    line-height: 28px;
    font-size: 24px;
    margin-bottom: 44px;
    color: var(--font-color);
    text-align: center;
  }
  .step-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const StepBox = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 16px;
  background: #fff;
  color: #1a1323;
  box-sizing: border-box;
  padding-left: 17px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  &.active {
    background: var(--primary-color);
    color: #fff;
  }
  .step {
    width: 20px;
    font-family: "Poppins-Medium";
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
  .intro {
    font-size: 14px;
    line-height: 22px;
  }
`;

const StepBoxLeft = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  .loader {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 0;
    top: 0;
  }
  img {
    width: 20px;
  }
`;

const LoadingBox = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom-color: #38e36f;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CloseButton = styled.div`
  font-size: 14px;
  color: var(--font-light-color);
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 30px;
  width: 100px;
`;
