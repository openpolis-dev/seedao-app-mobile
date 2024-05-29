import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import CreditModal from "./creditModal";
import { useTranslation } from "react-i18next";
import CreditButton from "./button";
import CalculateLoading from "./calculateLoading";
import { getShortDisplay } from "utils/number";
import { ethers } from "ethers";
import NoItem from "components/noItem";
import getConfig from "constant/envCofnig";
import { CreditRecordStatus } from "constant/credit";
import { getBorrowList } from "api/credit";
import { useCreditContext } from "pages/credit/provider";
import { useSelector } from "react-redux";
import useToast from "hooks/useToast";
import useCreditTransaction, { buildRepayData } from "hooks/useCreditTransaction";
import parseError from "./parseError";

const networkConfig = getConfig().NETWORK;
const lendToken = networkConfig.lend.lendToken;

export default function RepayModal({ handleClose, stepData }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(stepData?.step || 0);
  const [list, setList] = useState([]);
  const [getting, setGetting] = useState(false);

  const selectedList = list.filter((l) => !!l.selected);

  const account = useSelector((state) => state.account);
  const {
    state: { bondNFTContract },
  } = useCreditContext();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { Toast, toast } = useToast();

  const { handleTransaction, approveToken, checkNetwork, checkEnoughBalance } = useCreditTransaction();
  const getData = async () => {
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
        if (idsFromStepData.includes(_id)) {
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

  const selectedTotalAmount = Number(
    ethers.utils.formatUnits(
      selectedList.reduce(
        (acc, item) => acc.add(ethers.utils.parseUnits(String(item.total), lendToken.decimals)),
        ethers.constants.Zero,
      ),
      lendToken.decimals,
    ),
  );

  const checkApprove = async () => {
    // network
    try {
      setLoading(t("Credit.CheckingNetwork"));
      await checkNetwork();
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
    try {
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
      // check if enough
      setChecking(true);
      const enough = await checkEnoughBalance(account, totalApproveAmount);
      if (!enough) {
        setChecking(false);
        throw new Error(t("Credit.InsufficientBalance"));
      }

      setLoading(t("Credit.Approving"));
      await approveToken("usdt", totalApproveAmount, {
        ids: selectedList.map((item) => item.id).join(","),
      });
      toast.success("Approve successfully");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.danger(parseError(error));
    } finally {
      setLoading(false);
    }
  };
  const checkRepay = async () => {
    setLoading(t("Credit.WaitingTx"));
    try {
      await handleTransaction(
        buildRepayData(selectedList.map((item) => Number(item.id))),
        networkConfig.lend.scoreLendContract,
        "credit-repay",
      );
      setStep(3);
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
      title: t("Credit.RepayStepTitle1"),
      button: (
        <CreditButton onClick={() => setStep(1)} disabled={!selectedList.length}>
          {t("Credit.RepayStepButton1", { num: selectedList.length })}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.RepayStepTitle2"),
      button: (
        <CreditButton onClick={checkApprove} disabled={checking}>
          {t("Credit.RepayStepButton2")}
        </CreditButton>
      ),
    },
    {
      title: t("Credit.RepayStepTitle3"),
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

  return (
    <CreditModal handleClose={() => handleClose()}>
      <ContentStyle>
        <ModalTitle>{steps[step].title}</ModalTitle>

        {step === 3 && <FinishContent>{selectedTotalAmount} USDT</FinishContent>}
        {step === 0 && (
          <RepayContent>
            {getting ? (
              <LoadingBox>
                <CalculateLoading />
              </LoadingBox>
            ) : list.length ? (
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
            ) : (
              <NoItem />
            )}
          </RepayContent>
        )}
        {(step === 1 || step === 2) && (
          <RepayContent style={{ gap: "14px" }}>
            <TotalRepay>
              <div className="number">{selectedTotalAmount} USDT</div>
              <div className="label">{t("Credit.ShouldRepay")}</div>
            </TotalRepay>
            <ListBox style={{ maxHeight: "352px", minHeight: "unset" }}>
              {selectedList.map((item) => (
                <SelectedRecord key={item.id} data={item.data} total={item.total} />
              ))}
            </ListBox>
          </RepayContent>
        )}
        <ConfirmBox>
          {step === 1 && <ApproveTip>{t("Credit.ApproveTip")}</ApproveTip>}
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
      <div className="checkbox-wrapper-40">
        <label>
          <input type="checkbox" checked={selected} />
          <span className="checkbox"></span>
        </label>
      </div>
      <RecordRight>
        <li>
          <span>
            {t("Credit.BorrowID")}: {data.lendIdDisplay}
          </span>
          <span> {data.borrowAmount.format(4)} USDT</span>
        </li>
        <li>
          <span>{data.borrowTime}</span>
          <span>
            {t("Credit.TotalInterest")} {data.interestAmount.format(4)} USDT
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
        <span>{total} USDT</span>
      </li>
      <li>
        <span>{t("Credit.BorrowID")}</span>
        <span>{data.lendIdDisplay}</span>
      </li>
      <li>
        <span>{t("Credit.BorrowPrincipal")}</span>
        <span>{data.borrowAmount.format(4)} USDT</span>
      </li>
      <li>
        <span>{t("Credit.BorrowTime")}</span>
        <span>{data.borrowTime}</span>
      </li>
      <li>
        <span>{t("Credit.CurrentBorrowDays")}</span>
        <span>{data.interestDays}</span>
      </li>

      <li>
        <span>{t("Credit.RateAmount3")}</span>
        <span>{data.rate}</span>
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
  .checkbox-wrapper-40 {
    --borderColor: #343c6a;
    --borderWidth: 0.1em;
  }

  .checkbox-wrapper-40 label {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  .checkbox-wrapper-40 input[type="checkbox"] {
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
  .checkbox-wrapper-40 input[type="checkbox"]:before,
  .checkbox-wrapper-40 input[type="checkbox"]:after {
    content: "";
    position: absolute;
    background: var(--borderColor);
    width: calc(var(--borderWidth) * 3);
    height: var(--borderWidth);
    top: 50%;
    left: 10%;
    transform-origin: left center;
  }
  .checkbox-wrapper-40 input[type="checkbox"]:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(0);
    transition: transform 200ms ease-in 200ms;
  }
  .checkbox-wrapper-40 input[type="checkbox"]:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(0);
    transform-origin: left center;
    transition: transform 200ms ease-in;
  }
  .checkbox-wrapper-40 input[type="checkbox"]:checked:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(1);
    transition: transform 200ms ease-in;
  }
  .checkbox-wrapper-40 input[type="checkbox"]:checked:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(1);
    transition: transform 200ms ease-out 200ms;
  }
  .checkbox-wrapper-40 input[type="checkbox"]:focus {
    outline: calc(var(--borderWidth) / 2) dotted rgba(0, 0, 0, 0.25);
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

const ApproveTip = styled.p`
  font-size: 12px;
  color: #718ebf;
  margin-bottom: 18px;
`;
