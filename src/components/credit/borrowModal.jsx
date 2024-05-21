import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import CreditModal from "./creditModal";
import { useTranslation } from "react-i18next";
import CreditButton from "./button";
import { debounce } from "utils";
import CalculateLoading from "./calculateLoading";
import { getShortDisplay } from "utils/number";

export default function BorrowModal() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [inputNum, setInputNum] = useState("100.00");
  const [forfeitNum, setForfeitNum] = useState(0);

  const [calculating, setCalculating] = useState(false);

  const checkApprove = () => {
    setStep((s) => s + 1);
  };
  const checkBorrow = () => {
    setStep((s) => s + 1);
  };
  const checkMine = () => {};

  const steps = [
    {
      title: t("Credit.BorrowStepTitle1"),
      button: <CreditButton onClick={checkApprove}>{t("Credit.BorrowStepButton1")}</CreditButton>,
    },
    {
      title: t("Credit.BorrowStepTitle2"),
      button: <CreditButton onClick={checkBorrow}>{t("Credit.BorrowStepButton2")}</CreditButton>,
    },
    {
      title: t("Credit.BorrowStepTitle3"),
      button: <CreditButton onClick={checkMine}>{t("Credit.BorrowStepButton3")}</CreditButton>,
    },
  ];

  const computeAmount = (num) => {
    if (num === 0) {
      setForfeitNum(0);
      return;
    }
    //   setCalculating(true);
    //   const v = ethers.utils.parseUnits(String(num), networkConfig.lend.lendToken.decimals);
    //   scoreLendContract
    //     ?.calculateMortgageSCRAmount(v)
    //     .then((r: ethers.BigNumber) => {
    //       setForfeitNum(Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals)));
    //     })
    //     .finally(() => {
    //       setCalculating(false);
    //     });
  };

  const onChangeVal = useCallback(debounce(computeAmount, 1500), []);

  const onChangeInput = (e) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setInputNum("");
      onChangeVal(0);
      return;
    }
    const numberRegex = /^\d*\.?\d{0,2}$/;
    if (!numberRegex.test(newValue)) {
      return;
    }
    setInputNum(newValue);
    onChangeVal(Number(newValue));
  };

  const handleBlur = () => {
    // const numericValue = parseFloat(inputNum);
    // if (!isNaN(numericValue)) {
    //   if (numericValue < 100) {
    //     setInputNum("100.00");
    //     onChangeVal(100);
    //   } else if (numericValue > myAvaliableQuota) {
    //     setInputNum(getShortDisplay(myAvaliableQuota));
    //     onChangeVal(myAvaliableQuota);
    //   } else {
    //     setInputNum(getShortDisplay(numericValue));
    //   }
    // }
  };

  const handleBorrowMax = () => {
    // setInputNum(String(myAvaliableQuota));
    // onChangeVal(myAvaliableQuota);
  };

  useEffect(() => {
    onChangeVal(100);
  }, []);

  const dayIntrestAmount = inputNum ? getShortDisplay((Number(inputNum) * 10000 * Number(0.0001)) / 10000, 5) : 0;

  return (
    <CreditModal>
      <ContentStyle>
        <ModalTitle>{steps[step].title}</ModalTitle>
        {step === 2 ? (
          <FinishContent>{inputNum} USDT</FinishContent>
        ) : (
          <BorrowContent>
            <LineLabel>{t("Credit.BorrowAmount")}</LineLabel>
            <LineBox>
              <div className="left">
                <div className="left-content">
                  <input
                    type="number"
                    autoFocus
                    disabled={step === 1}
                    value={inputNum}
                    onChange={onChangeInput}
                    onBlur={handleBlur}
                  />
                  <MaxButton onClick={handleBorrowMax}>{t("Credit.MaxBorrow")}</MaxButton>
                </div>
              </div>
              <span className="right">USDT</span>
            </LineBox>
            <LineTip style={{ marginBottom: 0 }}>{t("Credit.RateAmount", { rate: 0.1 })}</LineTip>
            <LineTip style={{ marginTop: 0 }}>{t("Credit.RateAmount2", { amount: dayIntrestAmount })}</LineTip>
            <LineLabel>{t("Credit.NeedForfeit")}</LineLabel>
            <LineBox>
              <div className="left">
                {calculating ? <CalculateLoading style={{ margin: "20px" }} /> : forfeitNum.format()}
              </div>
              <span className="right">SCR</span>
            </LineBox>
            <LineTip>{t("Credit.ForfeitTip")}</LineTip>
            <BorrowTips>
              <p>{t("Credit.BorrowTip1")}</p>
              <p>{t("Credit.BorrowTip2")}</p>
            </BorrowTips>
          </BorrowContent>
        )}
        <ConfirmBox>
          <LineTip style={{ visibility: step === 0 ? "visible" : "hidden" }}>{t("Credit.BorrowTip3")}</LineTip>
          {steps[step].button}
        </ConfirmBox>
      </ContentStyle>
    </CreditModal>
  );
}
const ContentStyle = styled.div`
  color: #343c6a;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  text-align: center;
  font-family: Inter-SemiBold;
  font-weight: 600;
  line-height: 54px;
`;

const ConfirmBox = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 26px;
`;

const BorrowContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const LineLabel = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const MaxButton = styled.span`
  color: #1814f3;
  font-size: 14px;
  line-height: 50px;
  cursor: pointer;
  position: absolute;
  right: 10px;
`;

const LineBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  .left {
    background-color: #e6eff5;
    border-radius: 8px;
    border: 1px splid #dfeaf2;
    height: 50px;
    line-height: 50px;
    flex: 1;
    padding-inline: 10px;
    font-size: 20px;
    font-family: Inter-SemiBold;
    font-weight: 600;
    width: 0;
    box-sizing: border-box;
    position: relative;
  }
  .left-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .right {
    font-size: 20px;
    font-family: Inter-Medium;
    font-weight: 500;
    width: 55px;
  }
  input {
    border: none;
    height: 50px;
    padding: 0;
    background-color: transparent;
    font-size: 20px;
    font-family: Inter-SemiBold;
    font-weight: 600;
    color: #343c6a;
    width: 100%;
    &:focus-visible {
      outline: none;
    }
  }
`;

const LineTip = styled.div`
  color: #1814f3;
  font-size: 14px;
  margin-bottom: 16px;
  margin-top: 4px;
`;

const BorrowTips = styled.div`
  font-size: 14px;
  margin-top: 26px;
  p {
    margin-bottom: 24px;
  }
`;

const FinishContent = styled.div`
  text-align: center;
  line-height: 160px;
  font-size: 24px;
  font-family: Inter-SemiBold;
  font-weight: 600;
  color: #1814f3;
`;
