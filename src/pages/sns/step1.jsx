import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { debounce } from "utils";
import LoadingImg from "assets/Imgs/loading.png";
import ClearIcon from "assets/Imgs/sns/clear.svg";
import { ethers } from "ethers";
import { useSNSContext, ACTIONS } from "./snsProvider";
import { normalize } from "@seedao/sns-namehash";
import { isAvailable } from "@seedao/sns-safe";
import sns, { builtin } from "@seedao/sns-js";
import { getRandomCode } from "utils/index";
import useToast from "hooks/useToast";
import ABI from "assets/abi/SeeDAORegistrarController.json";
import { useSelector } from "react-redux";
import useTransaction from "hooks/useTransaction";
import useCheckBalance from "./useCheckBalance";
import { useNetwork, useSwitchNetwork } from "wagmi";
import getConfig from "constant/envCofnig";
import { Wallet } from "utils/constant";
import { useSearchParams } from "react-router-dom";
import { inviteBy, getInviteCode } from "api/invite";
import { saveLoading } from "store/reducer";
import store from "store";

const networkConfig = getConfig().NETWORK;
const PAY_TOKEN = networkConfig.tokens[0];
const PAY_NUMBER = PAY_TOKEN.price;

const AvailableStatus = {
  DEFAULT: "default",
  OK: "ok",
  NOT_OK: "not_ok",
};

const buildCommitData = (commitment) => {
  const iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData("commit", [commitment]);
};

export default function RegisterSNSStep1({ sns: _sns }) {
  const { t } = useTranslation();
  const [search] = useSearchParams();

  const [val, setVal] = useState(_sns || "");
  const [searchVal, setSearchVal] = useState(_sns || "");
  const [isPending, setPending] = useState(false);
  const [availableStatus, setAvailable] = useState(AvailableStatus.DEFAULT);
  const [randomSecret, setRandomSecret] = useState("");
  const [hadSNS, setHadSNS] = useState(false);
  const { handleTransaction } = useTransaction("sns-commit");

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const account = useSelector((state) => state.account);
  const rpc = useSelector((state) => state.rpc);
  const wallet = useSelector((state) => state.walletType);
  const checkBalance = useCheckBalance();

  const {
    dispatch: dispatchSNS,
    state: { controllerContract, localData, hasReached, userProof, hadMintByWhitelist, whitelistIsOpen },
  } = useSNSContext();

  const { toast, Toast } = useToast();

  // const isLogin = useCheckLogin(account);

  const requestBindInvite = () => {
    const inviteCode = search.get("invite");
    if (!inviteCode) {
      return;
    }
    inviteBy(inviteCode)
      .then((r) => {
        console.log("inviteBy called");
      })
      .catch((e) => {
        logError(`use ${inviteCode} to invite ${account} failed`, e);
      });
  };

  const getInviteLink = () => {
    store.dispatch(saveLoading(true));
    getInviteCode()
      .then((r) => {
        toast.success(t("SNS.InviteLinkCopied"));
        navigator.clipboard.writeText(`${window.location.origin}/sns?invite=${r.data.invite_code}`);
      })
      .catch((e) => {
        logError("get invite code failed", e);
        toast.danger("get invite code failed, please try again");
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  const handleSearchAvailable = async (v) => {
    setSearchVal(v);
    try {
      // offchain check
      const res = await isAvailable(v, builtin.SAFE_HOST);
      console.log("offline check", v, res);
      if (!res) {
        setAvailable(AvailableStatus.NOT_OK);
        setPending(false);
        return;
      }
      // onchain check
      const res1 = await controllerContract.available(v);
      console.log("online check", v, res1);

      if (!res1) {
        setAvailable(AvailableStatus.NOT_OK);
        setPending(false);
        return;
      }
      setAvailable(AvailableStatus.OK);
    } catch (error) {
      logError("check available error", error);
      setAvailable(AvailableStatus.DEFAULT);
    } finally {
      setPending(false);
    }
  };
  const onChangeVal = useCallback(debounce(handleSearchAvailable, 1000), [controllerContract]);

  const handleInput = (v) => {
    // check login status
    // TODO
    // if (!account || !isLogin) {
    //   dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
    //   return;
    // }
    if (v?.length > 15) {
      return;
    }
    if (!controllerContract) {
      // TODO check login status?
      return;
    }
    if (!v) {
      setVal("");
      setSearchVal("");
      setAvailable(AvailableStatus.DEFAULT);
      return;
    }
    const v_lower = v.toLocaleLowerCase();
    const [ok, v_normalized] = normalize(v_lower);
    setVal(v_normalized);
    if (!ok) {
      setAvailable(AvailableStatus.NOT_OK);
      return;
    } else {
      setPending(true);
      onChangeVal(v_normalized);
    }
  };

  const handleClearInput = () => {
    setVal("");
    setSearchVal("");
    setAvailable(AvailableStatus.DEFAULT);
  };

  const handleMint = async () => {
    if (!account) {
      return;
    }
    // check network
    if (wallet === Wallet.METAMASK && chain.id !== networkConfig.chainId) {
      switchNetwork(networkConfig.chainId);
      return;
    }

    // mint
    try {
      dispatchSNS({ type: ACTIONS.SHOW_LOADING });
      // check balance
      const token = await checkBalance(true, !(userProof && !hadMintByWhitelist));
      if (token) {
        toast.danger(t("SNS.NotEnoughBalance", { token }));
        dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
        return;
      }
      const _s = getRandomCode();
      setRandomSecret(_s);
      // get commitment
      const _commitment = await controllerContract.makeCommitment(
        searchVal,
        account,
        builtin.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(_s),
      );

      const tx = await handleTransaction(
        builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
        buildCommitData(_commitment),
        _s,
        searchVal,
      );
      console.log("tx:", tx);
      const hash = (tx && tx.hash) || tx; // tx means hash if using unipass
      if (hash) {
        // record to localstorage
        const data = { ...localData };
        data[account] = {
          sns: searchVal,
          step: "commit",
          commitHash: hash,
          stepStatus: "pending",
          timestamp: 0,
          secret: _s,
          registerHash: "",
        };
        dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(data) });
      }
    } catch (error) {
      logError("mint failed", error);
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      toast.danger(error?.reason || error?.data?.message || "error");
    }
  };

  useEffect(() => {
    if (!account || !localData || !rpc) {
      return;
    }
    const hash = localData[account]?.commitHash;
    if (!hash || localData[account]?.stepStatus === "failed") {
      return;
    }
    let timer;
    const timerFunc = () => {
      if (!account || !localData || !rpc) {
        return;
      }

      if (!hash) {
        return;
      }
      let hasResult = false;
      const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
      provider.getTransactionReceipt(hash).then((r) => {
        if (hasResult) {
          clearInterval(timer);
          return;
        }
        console.log("check tx status:", r);
        const _d = { ...localData };
        if (r && r.status === 1) {
          hasResult = true;
          // means tx success
          _d[account].stepStatus = "success";
          requestBindInvite();
          provider.getBlock(r.blockNumber).then((block) => {
            _d[account].timestamp = block.timestamp;
            dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(_d) });
            dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
            clearInterval(timer);
          });
        } else if (r && (r.status === 2 || r.status === 0)) {
          hasResult = true;
          // means tx failed
          _d[account].stepStatus = "failed";
          dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(_d) });
          dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
          clearInterval(timer);
        }
      });
    };
    timerFunc();
    timer = setInterval(timerFunc, 2000);
    return () => timer && clearInterval(timer);
  }, [localData, account, rpc]);

  useEffect(() => {
    if (account) {
      sns.name(account).then((r) => {
        if (r) setHadSNS(true);
      });
    }
  }, [account]);

  const showButton = () => {
    if (hasReached) {
      return (
        <MintButton variant="primary" disabled={true}>
          {t("SNS.HadSNS")}
        </MintButton>
      );
    }
    // free mint
    if (userProof && !hadMintByWhitelist && whitelistIsOpen) {
      return (
        <MintButton
          variant="primary"
          disabled={isPending || availableStatus !== AvailableStatus.OK}
          onClick={handleMint}
        >
          {t("SNS.FreeMint")}
        </MintButton>
      );
    }
    // mint by token
    return (
      <MintButton variant="primary" disabled={isPending || availableStatus !== AvailableStatus.OK} onClick={handleMint}>
        {t("SNS.SpentMint", { money: `${PAY_NUMBER} USDT(${networkConfig.name})` })}
      </MintButton>
    );
  };
  return (
    <Container>
      <ContainerWrapper>
        <StepTitle>{t("SNS.Step1Title")}</StepTitle>
        <StepDesc>{t("SNS.Step1Desc")}</StepDesc>
        <SearchBox>
          <InputBox>
            <InputStyled autoFocus value={val} onChange={(e) => handleInput(e.target.value)} />
            <span className="endfill">.seedao</span>
          </InputBox>
          <SearchRight>
            {!isPending && availableStatus === AvailableStatus.OK && <OkTag>{t("SNS.Available")}</OkTag>}
            {!isPending && availableStatus === AvailableStatus.NOT_OK && <NotOkTag>{t("SNS.Uavailable")}</NotOkTag>}
            {isPending && <Loading src={LoadingImg} alt="" />}
            {searchVal && <img className="btn-clear" src={ClearIcon} alt="" onClick={handleClearInput} />}
          </SearchRight>
        </SearchBox>
        <Tip>{t("SNS.InputTip")}</Tip>
        <OperateBox>{showButton()}</OperateBox>
        {hadSNS && <ShareButton onClick={getInviteLink}>{t("SNS.ShareInviteLink")}</ShareButton>}
      </ContainerWrapper>
      {Toast}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  position: relative;
`;

const ContainerWrapper = styled.div`
  width: 100%;
  display: inline-block;
`;

const StepTitle = styled.div`
  font-family: "Poppins-Medium";
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  color: var(--font-color);
  margin-top: 60px;
`;

const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 43px;
  color: var(--sns-font-color);
`;

const SearchBox = styled.div`
  /* width: 394px; */
  height: 54px;
  box-sizing: border-box;
  border: 1px solid var(--border-color-1);
  margin: 0 auto;
  border-radius: 8px;
  padding-left: 13px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  color: var(--font-color);
  gap: 4px;
`;

const InputBox = styled.div`
  line-height: 53px;
  display: flex;
  align-items: center;
  font-size: 14px;
  flex: 1;
  .endfill {
    width: 56px;
  }
`;

const InputStyled = styled.input`
  height: 100%;
  border: none;
  padding: 0;
  background-color: transparent;
  flex: 1;
  &:focus-visible {
    outline: none;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  border-radius: 3px;
  line-height: 20px;
  padding-inline: 8px;
  font-size: 9px;
  font-weight: 400;
  text-align: center;
`;

const OkTag = styled(StatusTag)`
  color: #1f9e14;
  background: #eefbeb;
`;

const NotOkTag = styled(StatusTag)`
  color: var(--bs-primary);
  background: rgba(236, 233, 255, 0.9);
`;

const SearchRight = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  .btn-clear {
    cursor: pointer;
  }
`;

const OperateBox = styled.div`
  margin-top: 32px;
  width: 100%;
  margin-bottom: 24px;
`;

const MintButton = styled.button`
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: var(--primary-color);
  border-radius: 16px;
  color: #fff;
  font-size: 14px;
  border-width: 0;
  &:disabled {
    background: var(--primary-color);
    border-color: transparent;
    opacity: 0.4;
  }
`;

const Loading = styled.img`
  user-select: none;
  width: 18px;
  height: 18px;
  animation: rotate 1s infinite linear;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Tip = styled.div`
  font-size: 9px;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
  margin: 0 auto;
  margin-top: 8px;
  text-align: left;
`;

const ShareButton = styled.span`
  text-align: center;
  color: var(--primary-color);
  font-size: 14px;
`;
