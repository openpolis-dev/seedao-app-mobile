import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import CreditModal from "./creditModal";
import { useTranslation } from "react-i18next";
import CreditButton from "./button";
import { debounce } from "utils";
import CalculateLoading from "./calculateLoading";
import { getShortDisplay } from "utils/number";
import { useCreditContext } from "pages/credit/provider";
import { ethers } from "ethers";
import getConfig from "constant/envCofnig";
import useToast from "hooks/useToast";
import useCreditTransaction, { buildBorrowData } from "hooks/useCreditTransaction";
import parseError from "pages/sns/parseError";
const networkConfig = getConfig().NETWORK;

export default function BorrowModal({ handleClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [inputNum, setInputNum] = useState("100.00");
  const [forfeitNum, setForfeitNum] = useState(0);

  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { Toast, toast } = useToast();

  const {
    state: { scoreLendContract, myAvaliableQuota, myScore },
  } = useCreditContext();

  const { handleTransaction, approveToken, checkNetwork } = useCreditTransaction("credit-borrow");

  const checkApprove = async () => {
    if (calculating || Number(inputNum) < 100) {
      return;
    }
    // check if scr enough
    if (forfeitNum === 0 || myScore < forfeitNum) {
      toast.danger(t("Credit.InsufficientQuota"));
      return;
    }
    // check network
    try {
      setLoading(t("Credit.CheckingNetwork"));
      await checkNetwork();
    } catch (error) {
      console.error("switch network", error);
      return;
    } finally {
      setLoading(false);
    }
    // approve
    try {
      setLoading(t("Credit.Approving"));
      await approveToken("scr", forfeitNum);
      toast.success("Approve successfully");
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.danger("Approve failed");
    } finally {
      setLoading(false);
    }
  };
  const checkBorrow = async () => {
    try {
      setLoading(t("Credit.WaitingTx"));
      // send borrow tx
      await handleTransaction(buildBorrowData(inputNum), networkConfig.lend.scoreLendContract, "");
      setStep(2);
    } catch (error) {
      logError("[borrow]", error);
      let errorMsg = `${parseError(error)}`;
      if (errorMsg === "BorrowCooldownTimeTooShort") {
        errorMsg = t("Credit.BorrowCooldownMsg");
      }
      toast.danger(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const checkMine = () => {
    handleClose(true);
  };

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
    setCalculating(true);
    const v = ethers.utils.parseUnits(String(num), networkConfig.lend.lendToken.decimals);
    scoreLendContract
      ?.calculateMortgageSCRAmount(v)
      .then((r) => {
        setForfeitNum(Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals)));
      })
      .finally(() => {
        setCalculating(false);
      });
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
    const numericValue = parseFloat(inputNum);
    if (!isNaN(numericValue)) {
      if (numericValue > myAvaliableQuota) {
        setInputNum(getShortDisplay(myAvaliableQuota));
        onChangeVal(myAvaliableQuota);
      } else {
        setInputNum(getShortDisplay(numericValue));
      }
    }
  };

  const handleBorrowMax = () => {
    setInputNum(String(myAvaliableQuota));
    onChangeVal(myAvaliableQuota);
  };

  useEffect(() => {
    onChangeVal(100);
  }, []);

  const dayIntrestAmount = inputNum ? getShortDisplay((Number(inputNum) * 10000 * Number(0.0001)) / 10000, 5) : 0;

  return (
    <CreditModal handleClose={() => handleClose()}>
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
                  {step === 0 && <MaxButton onClick={handleBorrowMax}>{t("Credit.MaxBorrow")}</MaxButton>}
                </div>
              </div>
              <span className="right">USDT</span>
            </LineBox>
            {Number(inputNum) < 100 && <NumberCheckLabel>{t("Credit.MinBorrow")}</NumberCheckLabel>}
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
              <p style={{ color: "#1814f3" }}>{t("Credit.BorrowTip2")}</p>
            </BorrowTips>
          </BorrowContent>
        )}
        <ConfirmBox>
          <p style={{ visibility: step === 0 ? "visible" : "hidden" }}>{t("Credit.BorrowTip3")}</p>
          {loading ? <CreditButton>{loading}</CreditButton> : steps[step].button}
        </ConfirmBox>
        {Toast}
      </ContentStyle>
    </CreditModal>
  );
}
const ContentStyle = styled.div`
  color: #718ebf;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  text-align: center;
  font-family: Inter-SemiBold;
  font-weight: 600;
  line-height: 54px;
  color: #343c6a;
`;

const ConfirmBox = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 26px;
  p {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const BorrowContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const LineLabel = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
  color: #343c6a;
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
  color: #343c6a;
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

const NumberCheckLabel = styled.p`
  font-size: 14px;
  color: #ff7193;
  margin-bottom: 10px;
  margin-top: 4px;
`;
