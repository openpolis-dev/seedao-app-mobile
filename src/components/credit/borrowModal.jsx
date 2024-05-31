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
import { useSelector } from "react-redux";
import getConfig from "constant/envCofnig";
import useToast from "hooks/useToast";
import useCreditTransaction, { buildBorrowData } from "hooks/useCreditTransaction";
import parseError from "./parseError";
import { Wallet } from "utils/constant";
import { formatDeltaDate } from "utils/time";

const networkConfig = getConfig().NETWORK;

export default function BorrowModal({ handleClose, stepData }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(stepData?.step || 0);
  const [inputNum, setInputNum] = useState(stepData?.from || "100");
  const [forfeitNum, setForfeitNum] = useState(Number(stepData?.to) || 0);

  const [calculating, setCalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowanceBN, setAllowanceBN] = useState(ethers.constants.Zero);
  const [leftTime, setLeftTime] = useState("");
  const { Toast, toast } = useToast();

  const wallet = useSelector((state) => state.walletType);
  const account = useSelector((state) => state.account);

  const allowanceEnough = ethers.utils
    .parseUnits(String(forfeitNum), networkConfig.SCRContract.decimals)
    .lte(allowanceBN);

  const {
    state: { scoreLendContract, myAvaliableQuota, myScore },
  } = useCreditContext();

  const scrEnough = Number(inputNum) <= myAvaliableQuota;

  const { handleTransaction, approveToken, checkNetwork, getTokenAllowance } = useCreditTransaction("credit-borrow");

  const getButtonText = () => {
    if (leftTime) {
      return leftTime;
    }
    if (!scrEnough) {
      return t("Credit.InsufficientQuota");
    }
    if (!allowanceEnough) {
      return t("Credit.BorrowStepButton1");
    }
  };

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
    if (wallet === Wallet.METAMASK) {
      try {
        setLoading(t("Credit.CheckingNetwork"));
        await checkNetwork();
      } catch (error) {
        console.error("switch network", error);
        return;
      } finally {
        setLoading(false);
      }
    }
    // approve
    try {
      setLoading(t("Credit.Approving"));
      await approveToken("scr", forfeitNum, {
        from: inputNum,
        to: forfeitNum,
      });
      if (wallet === Wallet.METAMASK) {
        toast.success("Approve successfully");
        setAllowanceBN(ethers.utils.parseUnits(String(inputNum), networkConfig.lend.lendToken.decimals));
        setStep(1);
      }
    } catch (error) {
      console.error(error);
      toast.danger(`Approve failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const checkBorrow = async () => {
    // check network
    if (wallet === Wallet.METAMASK) {
      try {
        setLoading(t("Credit.CheckingNetwork"));
        await checkNetwork();
      } catch (error) {
        console.error("switch network", error);
        return;
      } finally {
        setLoading(false);
      }
    }
    try {
      setLoading(t("Credit.WaitingTx"));
      // send borrow tx
      await handleTransaction(buildBorrowData(inputNum), networkConfig.lend.scoreLendContract, "credit-borrow", {
        from: inputNum,
        to: forfeitNum,
      });
      if (wallet === Wallet.METAMASK) {
        setStep(2);
      }
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

  const btnDisabled =
    calculating || Number(inputNum) < 100 || forfeitNum === 0 || Number(inputNum) > myAvaliableQuota || leftTime;

  const steps = [
    {
      title: t("Credit.Borrow"),
      button: (
        <CreditButton onClick={checkApprove} disabled={btnDisabled}>
          {getButtonText()}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.Borrow"),
      button: (
        <CreditButton onClick={checkBorrow} disabled={btnDisabled}>
          {leftTime || t("Credit.BorrowStepButton2")}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.BorrowStepTitle3"),
      button: <CreditButton onClick={checkMine}>{t("Credit.BorrowStepButton3")}</CreditButton>,
    },
  ];

  const computeAmount = (num) => {
    if (num === 0) {
      setForfeitNum(0);
      setCalculating(false);
      return;
    }
    setCalculating(true);
    const v = ethers.utils.parseUnits(String(num), networkConfig.lend.lendToken.decimals);
    scoreLendContract
      ?.calculateMortgageSCRAmount(v)
      .then((r) => {
        const fval = Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals));
        setForfeitNum(fval);
      })
      .catch((e) => setForfeitNum(0))
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
    const numberRegex = /^\d*$/;
    if (!numberRegex.test(newValue)) {
      return;
    }
    setInputNum(newValue);
    setCalculating(true);
    onChangeVal(Number(newValue));
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputNum);
    if (!isNaN(numericValue)) {
      if (numericValue > myAvaliableQuota) {
        setInputNum(getShortDisplay(myAvaliableQuota, 0));
        setCalculating(true);
        onChangeVal(Number(getShortDisplay(myAvaliableQuota, 0)));
      } else {
        setInputNum(getShortDisplay(numericValue, 0));
      }
    }
  };

  const handleBorrowMax = () => {
    if (myAvaliableQuota === Number(inputNum)) {
      return;
    }
    setInputNum(getShortDisplay(myAvaliableQuota, 0));
    onChangeVal(Number(getShortDisplay(myAvaliableQuota, 0)));
    setCalculating(true);
  };

  useEffect(() => {
    if (account) {
      getTokenAllowance("scr").then((r) => setAllowanceBN(r));
    }
  }, [account]);

  useEffect(() => {
    scoreLendContract?.userBorrowCooldownEndTimestamp(account).then((endTime) => {
      if (endTime && endTime.toNumber() * 1000 > Date.now()) {
        setLeftTime(t("Credit.TimeDisplay", { ...formatDeltaDate(endTime.toNumber() * 1000) }));
        toast.danger(t("Credit.BorrowCooldownMsg"));
      }
    });
  }, [scoreLendContract]);

  useEffect(() => {
    if (!stepData?.from || !stepData?.to) {
      setCalculating(true);
      onChangeVal(100);
    }
  }, []);

  useEffect(() => {
    if (step !== 2) {
      setStep(scrEnough && allowanceEnough ? 1 : 0);
    }
  }, [step, scrEnough, allowanceEnough]);

  const dayIntrestAmount = inputNum ? getShortDisplay((Number(inputNum) * 10000 * Number(0.0001)) / 10000, 4) : 0;

  return (
    <CreditModal handleClose={() => handleClose()}>
      <ContentStyle>
        <ModalTitle>{steps[step].title}</ModalTitle>
        {step === 2 ? (
          <FinishContent>{inputNum} USDT</FinishContent>
        ) : (
          <BorrowContent>
            <LineLabel>
              <span>{t("Credit.BorrowAmount")}</span>
              <span className="max">{t("Credit.MaxBorrowAmount", { amount: myAvaliableQuota.format(0) })}</span>
            </LineLabel>
            <LineBox>
              <div className="left">
                <div className="left-content">
                  <input type="number" autoFocus value={inputNum} onChange={onChangeInput} onBlur={handleBlur} />
                  {step === 0 && <MaxButton onClick={handleBorrowMax}>{t("Credit.MaxBorrow")}</MaxButton>}
                </div>
              </div>
              <span className="right">USDT</span>
            </LineBox>
            {Number(inputNum) > myAvaliableQuota && (
              <NumberCheckLabel>{t("Credit.MaxBorrowAmount", { amount: myAvaliableQuota.format(0) })}</NumberCheckLabel>
            )}
            {Number(inputNum) < 100 && <NumberCheckLabel>{t("Credit.MinBorrow")}</NumberCheckLabel>}
            <LineTip style={{ marginBottom: 0 }}>{t("Credit.RateAmount", { rate: 0.01 })}</LineTip>
            <LineTip style={{ marginTop: 0 }}>{t("Credit.RateAmount2", { amount: dayIntrestAmount })}</LineTip>
            <LineLabel>{t("Credit.NeedForfeit")}</LineLabel>
            <LineBox>
              <div className="left">{calculating ? <CalculateLoading style={{ margin: "20px" }} /> : forfeitNum}</div>
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
          {loading && <TxTip onClick={() => setLoading(false)}>{t("Credit.TxTip")}</TxTip>}
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
  display: flex;
  justify-content: space-between;
  .max {
    color: #1814f3;
    margin-right: 61px;
  }
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

const TxTip = styled.p`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
`;
