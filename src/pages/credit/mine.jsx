import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CreditLogo from "assets/Imgs/credit/credit-logo.jpg";
import SCRIcon from "assets/Imgs/credit/scr.svg";
import QuotaIcon from "assets/Imgs/credit/quota.svg";
import CountIcon from "assets/Imgs/credit/count.svg";
import AmountIcon from "assets/Imgs/credit/amount.svg";
import { BorrowItemsModal, RepayItemsModal } from "components/credit/itemsModal";
import BorrowModal from "components/credit/borrowModal";
import RepayModal from "components/credit/repayModal";
import { useSelector } from "react-redux";
import { amoy } from "utils/chain";
import { useCreditContext, ACTIONS } from "./provider";
import getConfig from "constant/envCofnig";
import { useEffect, useState, useCallback } from "react";
import { erc20ABI } from "wagmi";
import { ethers } from "ethers";
import { getBorrowList } from "api/credit";
import { CreditRecordStatus } from "constant/credit";
import store from "store";
import { saveLoading } from "store/reducer";
import { useLocation, useSearchParams } from "react-router-dom";
import CreditModal from "components/credit/creditModal";
import CreditButton from "components/credit/button";

const networkConfig = getConfig().NETWORK;

const BorrowAndRepay = ({ onUpdate }) => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const {
    state: { scoreLendContract },
  } = useCreditContext();
  const account = useSelector((state) => state.account);

  const [showModal, setShowModal] = useState("");
  const [showItemsModal, setShowItemsModal] = useState("");

  const [stepData, setStepData] = useState();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const action = state?.action;
    if (!action) {
      return;
    }
    const arr = action.split("-");
    if (arr[1] === "borrow") {
      setShowModal("borrow");
      setStepData({ step: arr[2] === "approve" ? 1 : 2, from: state.from, to: state.to });
    } else if (arr[1] === "repay") {
      setShowModal("repay");
      setStepData({ step: arr[2] === "approve" ? 2 : 3, ids: state.ids });
    }
  }, [state]);

  const go2Borrow = () => {
    setShowItemsModal("");
    setShowModal("borrow");
  };
  const go2Repay = () => {
    setShowItemsModal("");
    setShowModal("repay");
  };

  const handleCloseModal = (openMine) => {
    setShowModal("");
    setStepData({});
    if (openMine) {
      onUpdate();
      const evt = new Event("openMine");
      document.dispatchEvent(evt);
    }
  };

  const openBorrow = () => {
    store.dispatch(saveLoading(true));
    scoreLendContract
      .userBorrowCooldownEndTimestamp(account)
      .then((endTime) => {
        if (endTime && endTime.toNumber() * 1000 > Date.now()) {
          setShowAlert(true);
        } else {
          setShowItemsModal("borrow");
        }
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  return (
    <OperateBox>
      <OperateItem className="borrow" onClick={openBorrow}>
        {t("Credit.GoToBorrow")}
      </OperateItem>
      <OperateItem onClick={() => setShowItemsModal("repay")}>{t("Credit.GoToRepay")}</OperateItem>
      {showModal === "borrow" && <BorrowModal handleClose={handleCloseModal} stepData={stepData} />}
      {showModal === "repay" && <RepayModal handleClose={handleCloseModal} stepData={stepData} />}
      {showItemsModal === "borrow" && (
        <BorrowItemsModal onConfirm={go2Borrow} handleClose={() => setShowItemsModal("")} />
      )}
      {showItemsModal === "repay" && <RepayItemsModal onConfirm={go2Repay} handleClose={() => setShowItemsModal("")} />}
      {showAlert && (
        <CreditModal>
          <AlertContent>
            <div className="content">
              <p>{t("Credit.BorrowCooldownMsg")}</p>
            </div>
            <CreditButton onClick={() => setShowAlert(false)}>{t("Credit.Back")}</CreditButton>
          </AlertContent>
        </CreditModal>
      )}
    </OperateBox>
  );
};

export default function MyBorrowings() {
  const { t } = useTranslation();

  const account = useSelector((state) => state.account);
  const userToken = useSelector((state) => state.userToken);

  const {
    dispatch: dispatchCreditEvent,
    state: {
      bondNFTContract,
      scoreLendContract,
      myScore,
      myInUseCount,
      myInuseAmount,
      myAvaliableQuota,
      myOverdueCount,
      myOverdueAmount,
    },
  } = useCreditContext();

  const [earlyDate, setEarlyDate] = useState("");
  const [maxAmount, setMaxAmount] = useState(0);

  const getSCR = () => {
    const _provider = new ethers.providers.StaticJsonRpcProvider(amoy.rpcUrls.public.http[0], amoy.id);
    const scoreContract = new ethers.Contract(networkConfig.SCRContract.address, erc20ABI, _provider);
    scoreContract.balanceOf(account).then((r) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_SCORE,
        payload: Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals)),
      });
    });
  };

  const getLatestDate = () => {
    getBorrowList({
      debtor: account,
      lendStatus: CreditRecordStatus.INUSE,
      sortField: "borrowTimestamp",
      sortOrder: "asc",
      page: 1,
      size: 1,
    }).then((r) => {
      if (r.data.length) {
        const d = r.data[0];
        setEarlyDate(d.overdueTime.slice(0, -5));
      }
    });
  };

  const getDataFromContract = useCallback(() => {
    const decimals = networkConfig.lend.lendToken.decimals;
    bondNFTContract?.userBorrow(account).then((r) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_DATA,
        payload: {
          overdueCount: r.overdueCount.toNumber(),
          overdueAmount: Number(ethers.utils.formatUnits(r.overdueAmount, decimals)),
          inUseCount: r.inUseCount.toNumber(),
          inUseAmount: Number(ethers.utils.formatUnits(r.inUseAmount, decimals)),
        },
      });
    });
    scoreLendContract?.userAvailableBorrowAmount(account).then((r) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_QUOTA,
        payload: Number(ethers.utils.formatUnits(r.availableAmount, decimals)),
      });
    });
    scoreLendContract?.maxTotalBorrowAmount().then((r) => {
      setMaxAmount(Number(ethers.utils.formatUnits(r, decimals)));
    });
  }, [bondNFTContract, scoreLendContract, account, dispatchCreditEvent]);

  useEffect(() => {
    account && userToken && getSCR();
  }, [account, userToken]);

  useEffect(() => {
    if (!account) {
      return;
    }
    getDataFromContract();
  }, [scoreLendContract, account, getDataFromContract]);

  useEffect(() => {
    myInUseCount > 0 && getLatestDate();
  }, [myInUseCount]);

  const handleUpdate = () => {
    getSCR();
    getDataFromContract();
  };

  return (
    <>
      <CardStyle>
        <div className="label">{t("Credit.MyBorrowingQuota")}</div>
        <div className="value">{myAvaliableQuota.format(4, true)}</div>
        <div className="tip">{t("Credit.MyBorrowingTip1")}</div>
        <div className="tip">{t("Credit.MyBorrowingTip2")}</div>
        <div className="tip">{t("Credit.MaxBorrowAmountTip", { amount: maxAmount?.format(0) })}</div>
        <img src={CreditLogo} alt="" />
      </CardStyle>
      <SubCardStyle>
        <div>
          <div className="label">
            <img src={SCRIcon} alt="" />
            <span>{t("Credit.MySCR")}</span>
          </div>
          <div className="value">{myScore.format(4, true)}</div>
        </div>
      </SubCardStyle>
      <BorrowAndRepay onUpdate={handleUpdate} />
      <BlockTitle>{t("Credit.MyBorrowingsState")}</BlockTitle>
      <StateBlock>
        <StateLine>
          <img src={CountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.MyInuseCount", { num: myInUseCount })}</div>
            <div className="value">{myInuseAmount.format(4, true)} USDT</div>
          </div>
        </StateLine>
        <StateLine>
          <img src={AmountIcon} alt="" />
          <div>
            <div className="label">{t("Credit.OverdueCount", { num: myOverdueCount })}</div>
            <div className="value">{myOverdueAmount.format(4, true)} USDT</div>
          </div>
        </StateLine>
        <div className="repay-tip">
          {myInUseCount > 0 ? t("Credit.LatestRepayDate", { date: earlyDate }) : t("Credit.NoDate")}
        </div>
        <div className="repay-tip">{t("Credit.RepayTip")}</div>
      </StateBlock>
    </>
  );
}

const CardStyle = styled.div`
  background: linear-gradient(107.38deg, #4c49ed 2.61%, #2926f1 51.9%, #0a06f4 101.2%);
  width: 100%;
  border-radius: 15px;
  padding: 30px 20px 15px 20px;
  color: #fff;
  box-sizing: border-box;
  position: relative;
  img {
    position: absolute;
    right: 16px;
    top: 18px;
    width: 35px;
  }
  .label {
    color: #f2f4f7ad;
    font-size: 14px;
  }
  .value {
    font-size: 32px;
    font-family: "Inter-SemiBold";
    font-weight: 600;
    margin-block: 20px;
  }
  .tip {
    font-size: 14px;
    color: #fff;
    &:last-of-type {
      margin-bottom: 20px;
    }
  }
`;

const SubCardStyle = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  > div {
    flex: 1;
    background-color: #fff;
    border-radius: 15px;
    padding: 16px;

    .label {
      font-size: 12px;
      color: #718ebf;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .value {
      font-size: 16px;
      font-family: "Inter-SemiBold";
      font-weight: 600;
      margin-top: 6px;
    }
  }
`;

const OperateBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const OperateItem = styled.div`
  flex: 1;
  background-color: #fff;
  color: #343c6a;
  font-size: 15px;
  font-weight: 500;
  font-family: "Inter-Medium";
  line-height: 48px;
  border-radius: 10px;
  text-align: center;
  &.borrow {
    background-color: #1814f3;
    color: #fff;
  }
`;

export const BlockTitle = styled.div`
  font-family: "Inter-SemiBold";
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin-top: 20px;
  margin-bottom: 14px;
  color: #343c6a;
`;

const StateBlock = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px 20px 16px;
  .repay-tip {
    font-size: 12px;
    color: #ff7193;
    img {
      position: relative;
      top: 1px;
    }
  }
`;

export const StateLine = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 25px;
  .label {
    color: #718ebf;
    font-size: 12px;
  }
  .value {
    color: #232323;
    font-size: 16px;
    font-family: "Inter-SemiBold";
    font-weight: 600;
  }
`;

const AlertContent = styled.div`
  .content {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  p {
    font-size: 14px;
    color: #1814f3;
    text-align: center;
  }
`;
