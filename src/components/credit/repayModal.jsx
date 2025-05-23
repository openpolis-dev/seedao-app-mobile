import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import CreditModal from "./creditModal";
import { useTranslation } from "react-i18next";
import CreditButton from "./button";
import CalculateLoading from "./calculateLoading";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import NoItem from "components/noItem";
import getConfig from "constant/envCofnig";
import { CreditRecordStatus } from "constant/credit";
import { getBorrowList } from "api/credit";
import { useCreditContext } from "pages/credit/provider";
import useToast from "hooks/useToast";
import useCreditTransaction, { buildRepayData } from "hooks/useCreditTransaction";
import parseError from "./parseError";
import { Wallet } from "utils/constant";

const networkConfig = getConfig().NETWORK;
const lendToken = networkConfig.lend.lendToken;

export default function RepayModal({ handleClose, stepData }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(stepData?.step || 0);
  const [list, setList] = useState([]);
  const [getting, setGetting] = useState(false);

  const [allowanceBN, setAllowanceBN] = useState(ethers.constants.Zero);
  const [tokenBN, setTokenBN] = useState(ethers.constants.Zero);
  const [allowanceGetting, setAllownceGetting] = useState(false);
  const [tokenBalanceGetting, setTokenBalanceGetting] = useState(false);

  const [totalRepayAmount, setTotalRepayAmount] = useState(0);

  const selectedList = list.filter((l) => !!l.selected);

  const account = useSelector((state) => state.account);
  const wallet = useSelector((state) => state.walletType);

  const {
    state: { bondNFTContract, scoreLendContract },
  } = useCreditContext();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { Toast, toast } = useToast();

  const { handleTransaction, approveToken, checkNetwork, checkEnoughBalance, getTokenBalance, getTokenAllowance } =
    useCreditTransaction();
  const getData = async () => {
    if (stepData?.step === 3) {
      return;
    }
    try {
      setGetting(true);
      const r = await getBorrowList({
        debtor: account,
        lendStatus: CreditRecordStatus.INUSE,
        sortField: "borrowTimestamp",
        sortOrder: "desc",
        page: 1,
        size: 100,
      });
      const idsFromStepData = stepData?.ids?.split(",") || [];
      const ids = r.data.map((d) => Number(d.lendId));
      const _list = r.data.map((item) => ({ id: item.lendId, data: item, selected: false, total: 0 }));
      const result = await bondNFTContract?.calculateLendsInterest(ids);
      ids.forEach((_id, idx) => {
        _list[idx].data.interestAmount = Number(
          ethers.utils.formatUnits(result.interestAmounts[idx], lendToken.decimals),
        );
        _list[idx].data.interestDays = result.interestDays[idx].toNumber();
        _list[idx].total = Number(
          ethers.utils.formatUnits(
            result.interestAmounts[idx].add(
              ethers.utils.parseUnits(String(_list[idx].data.borrowAmount), lendToken.decimals),
            ),
            lendToken.decimals,
          ),
        );
        if (idsFromStepData.includes(String(_id))) {
          _list[idx].selected = true;
        }
      });
      if (idsFromStepData && idsFromStepData.length) {
        setList(_list.filter((d) => idsFromStepData.includes(d.id)));
      } else {
        setList(_list);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetting(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const selectedAll = !!list.length && list.every((item) => item.selected);
  const handleSelectAll = () => {
    setList(list.map((item) => ({ ...item, selected: !selectedAll })));
  };

  const selectedTotalAmount = Number(
    ethers.utils.formatUnits(
      selectedList.reduce(
        (acc, item) => acc.add(ethers.utils.parseUnits(String(item.total), lendToken.decimals)),
        ethers.constants.Zero,
      ),
      lendToken.decimals,
    ),
  );

  // add one more day interest
  const totalApproveBN = selectedList.reduce(
    (acc, item) =>
      acc.add(
        ethers.utils
          .parseUnits(String(item.data.interestAmount), lendToken.decimals)
          .div(ethers.BigNumber.from(item.data.interestDays)),
      ),
    ethers.utils.parseUnits(String(selectedTotalAmount), lendToken.decimals),
  );
  const totalApproveAmount = Number(ethers.utils.formatUnits(totalApproveBN, lendToken.decimals));

  const tokenEnough = tokenBN.gte(totalApproveBN);
  const allowanceEnough = allowanceBN.gte(totalApproveBN);

  const getButtonText = () => {
    if (tokenBalanceGetting || tokenBalanceGetting || allowanceGetting) {
      return (
        <LoadingWrapper>
          <CalculateLoading />
        </LoadingWrapper>
      );
    }
    if (!tokenEnough) {
      return t("Credit.InsufficientBalance", { token: lendToken.symbol });
    }
    if (!allowanceEnough) {
      return t("Credit.RepayStepButton2", { token: lendToken.symbol });
    }
  };

  const checkApprove = async () => {
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
      // check if enough
      setChecking(true);
      const enough = await checkEnoughBalance(account, totalApproveAmount);
      if (!enough) {
        setChecking(false);
        throw new Error(t("Credit.InsufficientBalance"));
      }

      setLoading(t("Credit.Approving"));
      await approveToken(lendToken.symbol, totalApproveAmount, {
        ids: selectedList.map((item) => item.id).join(","),
      });
      if (wallet === Wallet.METAMASK) {
        toast.success(t("Credit.ApproveSuccessful"));
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      toast.danger(parseError(error));
    } finally {
      setLoading(false);
    }
  };
  const checkRepay = async () => {
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

    setLoading(t("Credit.WaitingTx"));
    try {
      const totalPrincipal = ethers.utils.formatUnits(
        selectedList.reduce(
          (acc, item) => acc.add(ethers.utils.parseUnits(String(item.data.borrowAmount), lendToken.decimals)),
          ethers.constants.Zero,
        ),
        lendToken.decimals,
      );
      await handleTransaction(
        buildRepayData(selectedList.map((item) => Number(item.id))),
        networkConfig.lend.scoreLendContract,
        "credit-repay",
        { ids: selectedList.map((item) => item.id).join(","), total: totalPrincipal },
      );
      if (wallet === Wallet.METAMASK) {
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      toast.danger(parseError(error));
    } finally {
      setLoading(false);
    }
  };
  const checkMine = () => {
    handleClose(true);
  };

  const steps = [
    {
      title: t("Credit.Repay"),
      button: (
        <CreditButton onClick={() => setStep(1)} disabled={!selectedList.length}>
          {t("Credit.RepayStepButton1", { num: selectedList.length })}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.Repay"),
      button: (
        <CreditButton
          onClick={checkApprove}
          disabled={checking || !tokenEnough || tokenBalanceGetting || allowanceGetting}
        >
          {getButtonText()}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.Repay"),
      button: <CreditButton onClick={checkRepay}>{t("Credit.RepayStepButton3")}</CreditButton>,
    },
    {
      title: t("Credit.RepayStepTitle4"),
      button: <CreditButton onClick={checkMine}>{t("Credit.RepayStepButton4")}</CreditButton>,
    },
  ];

  const onSelect = (id, selected) => {
    const newList = list.map((item) => (item.id === id ? { ...item, selected } : item));
    setList(newList);
  };

  useEffect(() => {
    if (account && step > 0 && step !== 3 && !stepData?.ids) {
      setAllownceGetting(true);
      getTokenAllowance(lendToken.symbol)
        .then((r) => {
          setAllowanceBN(r);
        })
        .catch((e) => {
          toast.danger(`${t("Credit.GetAllowanceFailed")}: ${e}`);
        })
        .finally(() => {
          setAllownceGetting(false);
        });
    }
  }, [account, step]);

  useEffect(() => {
    if (account && step > 0 && step !== 3) {
      setTokenBalanceGetting(true);
      getTokenBalance(lendToken.symbol)
        .then((r) => {
          setTokenBN(r);
        })
        .catch((e) => {
          toast.danger(`${t("Credit.GetBalanceFailed", { token: lendToken.symbol })}: ${e}`);
        })
        .finally(() => {
          setTokenBalanceGetting(false);
        });
    }
  }, [account, step]);

  useEffect(() => {
    if (step === 1 || step === 2) {
      setStep(tokenEnough && allowanceEnough ? 2 : 1);
    }
  }, [tokenEnough, allowanceEnough]);

  useEffect(() => {
    if (stepData?.ids && totalApproveBN.gt(ethers.constants.Zero) && !totalApproveBN.eq(allowanceBN)) {
      setAllowanceBN(totalApproveBN);
    }
  }, [stepData, totalApproveBN]);

  const getRepayAmountByEvent = async (ids, totalPrincipal) => {
    setGetting(true);
    try {
      const r = await scoreLendContract.queryFilter("Payback");
      const events = r.filter((item) => ids.includes(item.args.id.toNumber()));
      const interestAmount = events.reduce((acc, item) => acc.add(item.args.interestAmount), ethers.constants.Zero);
      const total = totalPrincipal.add(interestAmount);
      setTotalRepayAmount(ethers.utils.formatUnits(total, lendToken.decimals));
    } catch (error) {
      console.error(error);
      toast.danger(t("Credit.GetRealRepayAmountFailed"));
    } finally {
      setGetting(false);
    }
  };
  useEffect(() => {
    if (bondNFTContract && step === 3) {
      if (stepData?.ids && stepData?.total) {
        // joyid
        const idsFromStepData = stepData?.ids?.split(",") || [];
        const ids = idsFromStepData.map((d) => Number(d));
        getRepayAmountByEvent(ids, ethers.utils.parseUnits(stepData.total, lendToken.decimals));
      } else if (selectedList.length) {
        const totalPrincipal = selectedList.reduce(
          (acc, item) => acc.add(ethers.utils.parseUnits(String(item.data.borrowAmount), lendToken.decimals)),
          ethers.constants.Zero,
        );
        getRepayAmountByEvent(
          selectedList.map((item) => Number(item.id)),
          totalPrincipal,
        );
      }
    }
  }, [bondNFTContract, step]);

  return (
    <CreditModal handleClose={() => handleClose(step === 3)}>
      <ContentStyle>
        <ModalTitle>{steps[step].title}</ModalTitle>
        {step === 3 &&
          (getting ? (
            <GettingBox>
              <CalculateLoading />
            </GettingBox>
          ) : (
            <FinishContent>
              {totalRepayAmount} {lendToken.symbol}
            </FinishContent>
          ))}
        {step === 0 && (
          <RepayContent>
            {getting ? (
              <LoadingBox>
                <CalculateLoading />
              </LoadingBox>
            ) : list.length ? (
              <div>
                <SubTitle>{t("Credit.RepayStepTitle1")}</SubTitle>
                <SelectAllLine>
                  <CheckboxStyle className="checkbox-wrapper-40" onClick={handleSelectAll}>
                    <label>
                      <input type="checkbox" checked={selectedAll} />
                      <span className="checkbox"></span>
                    </label>
                  </CheckboxStyle>
                  <span>{t("Credit.SelectAll")}</span>
                </SelectAllLine>
                <ListBox>
                  {list.map((item) => (
                    <RecordCheckbox
                      key={item.id}
                      id={item.id}
                      data={item.data}
                      selected={item.selected}
                      onSelect={onSelect}
                    />
                  ))}
                </ListBox>
              </div>
            ) : (
              <NoItem />
            )}
          </RepayContent>
        )}
        {(step === 1 || step === 2) &&
          (getting ? (
            <GettingBox>
              <CalculateLoading />
            </GettingBox>
          ) : (
            <RepayContent style={{ gap: "14px" }}>
              <TotalRepay>
                <div className="number">
                  {totalApproveAmount.format(4)} {lendToken.symbol}
                </div>
                <div className="label">
                  {t("Credit.ShouldRepayAll", { amount: selectedTotalAmount.format(4), token: lendToken.symbol })}
                </div>
                <RepayTip>{t("Credit.ApproveTip")}</RepayTip>
              </TotalRepay>
              <ListBox style={{ maxHeight: "352px", minHeight: "unset" }}>
                {selectedList.map((item) => (
                  <SelectedRecord key={item.id} data={item.data} total={item.total} />
                ))}
              </ListBox>
            </RepayContent>
          ))}
        <ConfirmBox>
          {loading ? <CreditButton>{loading}</CreditButton> : steps[step].button}
          {loading && <TxTip onClick={() => setLoading(false)}>{t("Credit.TxTip")}</TxTip>}
        </ConfirmBox>
        {Toast}
      </ContentStyle>
    </CreditModal>
  );
}

const RecordCheckbox = ({ id, selected, data, onSelect }) => {
  const { t } = useTranslation();
  return (
    <RecordStyle onClick={() => onSelect(id, !selected)} className={selected ? "selected" : ""}>
      <CheckboxStyle className="checkbox-wrapper-40">
        <label>
          <input type="checkbox" checked={selected} />
          <span className="checkbox"></span>
        </label>
      </CheckboxStyle>
      <RecordRight>
        <li>
          <span>
            {t("Credit.BorrowID")}: {data.lendIdDisplay}
          </span>
          <span> {data.borrowAmount.format(4)} {lendToken.symbol}</span>
        </li>
        <li>
          <span>{data.borrowTime}</span>
          <span>
            {t("Credit.TotalInterest")} {data.interestAmount.format(4)} {lendToken.symbol}
          </span>
        </li>
      </RecordRight>
    </RecordStyle>
  );
};

const SelectedRecord = ({ data, total }) => {
  const { t } = useTranslation();
  return (
    <SelectRecordStyle>
      <li>
        <span> {t("Credit.ShouldRepay")}</span>
        <span>{total} {lendToken.symbol}</span>
      </li>
      <li>
        <span>{t("Credit.BorrowID")}</span>
        <span>{data.lendIdDisplay}</span>
      </li>
      <li>
        <span>{t("Credit.BorrowPrincipal")}</span>
        <span>{data.borrowAmount.format(4)} {lendToken.symbol}</span>
      </li>
      <li>
        <span>{t("Credit.BorrowTime")}</span>
        <span>{data.borrowTime}</span>
      </li>
      <li>
        <span>{t("Credit.CurrentBorrowDays")}</span>
        <span>{t("Credit.Days", { days: data.interestDays })}</span>
      </li>

      <li>
        <span>{t("Credit.RateAmount3")}</span>
        <span>{data.rate}%</span>
      </li>
      <li>
        <span>{t("Credit.Interest")}</span>
        <span>{data.interestAmount.format(4)}</span>
      </li>

      <li>
        <span>{t("Credit.ReturnForfeit")}</span>
        <span>{data.mortgageSCRAmount.format(4)} SCR</span>
      </li>
    </SelectRecordStyle>
  );
};

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

const FinishContent = styled.div`
  text-align: center;
  line-height: 160px;
  font-size: 24px;
  font-family: Inter-SemiBold;
  font-weight: 600;
  color: #1814f3;
`;

const RepayContent = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxStyle = styled.div`
  &.checkbox-wrapper-40 {
    --borderColor: #343c6a;
    --borderWidth: 0.1em;
  }

  &.checkbox-wrapper-40 label {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  &.checkbox-wrapper-40 input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    vertical-align: middle;
    background: #fff;
    font-size: 1em;
    border-radius: 0.125em;
    display: inline-block;
    border: var(--borderWidth) solid var(--borderColor);
    width: 1em;
    height: 1em;
    position: relative;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:before,
  &.checkbox-wrapper-40 input[type="checkbox"]:after {
    content: "";
    position: absolute;
    background: var(--borderColor);
    width: calc(var(--borderWidth) * 3);
    height: var(--borderWidth);
    top: 50%;
    left: 18%;
    transform-origin: left center;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(0);
    transition: transform 200ms ease-in 200ms;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(0);
    transform-origin: left center;
    transition: transform 200ms ease-in;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:checked:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(1);
    transition: transform 200ms ease-in;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:checked:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(1);
    transition: transform 200ms ease-out 200ms;
  }
  &.checkbox-wrapper-40 input[type="checkbox"]:focus {
    outline: calc(var(--borderWidth) / 2) dotted rgba(0, 0, 0, 0.25);
  }
`;

const RecordStyle = styled.div`
  height: 62px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  padding: 12px 10px;
  box-sizing: border-box;
  border: 1px solid #718ebf;
  cursor: pointer;
  &.selected {
    background-color: #1814f3;
    color: #fff;
    ul {
      color: rgba(255, 255, 255, 0.7);
      li:first-child {
        color: #fff;
      }
    }
  }
`;

const RecordRight = styled.ul`
  font-size: 10px;
  flex: 1;
  color: #718ebf;
  li {
    display: flex;
    justify-content: space-between;
    &:first-child {
      font-size: 14px;
      color: #343c6a;
      margin-bottom: 4px;
    }
  }
`;

const SelectRecordStyle = styled.ul`
  border: 1px solid #718ebf;
  border-radius: 8px;
  padding: 14px;
  color: #718ebf;
  font-size: 12px;
  li {
    display: flex;
    justify-content: space-between;
    line-height: 18px;
    &:first-child {
      font-size: 14px;
      font-weight: 500;
      font-family: "Inter-Medium";
      color: #343c6a;
      line-height: 24px;
    }
  }
`;

// const BorrowTip1 = styled.p`
//   color: #1814f3;
//   font-size: 14px;
//   text-align: center;
//   margin-bottom: 22px;
// `;

// const RepayTip = styled.p`
//   color: #718ebf;
//   font-size: 12px;
//   margin-top: 18px;
// `;

const TotalRepay = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  .number {
    color: #1814f3;
    font-size: 24px;
    font-family: Inter-SemiBold;
    font-weight: 600;
  }
  .label {
    font-size: 14px;
  }
`;

const LoadingBox = styled.div`
  height: 321px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListBox = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 321px;
`;

const TxTip = styled.p`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
`;

const LineLabel = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
  color: #343c6a;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #343c6a;
  margin-bottom: 10px;
`;

const SelectAllLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 24px;
  span {
    font-size: 14px;
  }
`;

const RepayTip = styled.p`
  color: #1814f3;
  font-size: 14px;
  margin-top: 10px;
  text-align: left;
`;

const GettingBox = styled(LoadingBox)`
  height: 160px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
