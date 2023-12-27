import styled from "styled-components";
import RegisterSNSStep1 from "./step1";
import RegisterSNSStep2 from "./step2";
import FinishedComponent from "./finished";
import SNSProvider, { ACTIONS, useSNSContext } from "./snsProvider";
import { useEffect } from "react";
import { ethers } from "ethers";
import StepLoading from "./stepLoading";
import CONTROLLER_ABI from "assets/abi/SeeDAORegistrarController.json";
import MINTER_ABI from "assets/abi/SeeDAOMinter.json";
import { builtin } from "@seedao/sns-js";
import { useSelector } from "react-redux";
import Layout from "components/layout/layout";
import UserIcon from "assets/Imgs/sns/user.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import whiteList from "constant/whitelist.json";
import HelperIcon from "assets/Imgs/sns/helper.svg";

const RegisterSNSWrapper = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const account = useSelector((state) => state.account);
  const rpc = useSelector((state) => state.rpc);

  const {
    state: { step, localData, loading, controllerContract, minterContract },
    dispatch: dispatchSNS,
  } = useSNSContext();

  const checkUserStatus = async () => {
    try {
      const hasReached = await controllerContract.maxOwnedNumberReached(account);
      dispatchSNS({ type: ACTIONS.SET_HAS_REACHED, payload: hasReached });
    } catch (error) {
      console.error("query maxOwnedNumberReached failed", error);
    }
  };

  useEffect(() => {
    const checkUserInwhitelist = async () => {
      try {
        const isInWhitelist = whiteList.proofs.find(
          (item) => item.address.toLocaleLowerCase() === account?.toLocaleLowerCase(),
        );
        if (isInWhitelist) {
          dispatchSNS({ type: ACTIONS.SET_USER_PROOF, payload: isInWhitelist.proof });
        }
      } catch (error) {
        console.error("checkUserInwhitelist failed", error);
      }
    };
    const checkMaxOwnedNumber = () => {
      controllerContract
        .maxOwnedNumber()
        .then((n) => {
          dispatchSNS({ type: ACTIONS.SET_MAX_OWNED_NUMBER, payload: n.toNumber() });
        })
        .catch((error) => {
          console.error("checkMaxOwnedNumber failed", error);
        });
    };
    if (account && controllerContract) {
      checkUserStatus();
      checkUserInwhitelist();
      checkMaxOwnedNumber();
    }
  }, [account, controllerContract]);

  useEffect(() => {
    const checkWhitelistOpen = async () => {
      minterContract
        .registrableWithWhitelist()
        .then((r) => {
          dispatchSNS({ type: ACTIONS.SET_WHITELIST_IS_OPEN, payload: r });
        })
        .catch((error) => {
          dispatchSNS({ type: ACTIONS.SET_WHITELIST_IS_OPEN, payload: true });
          console.error('checkWhitelistOpen failed', error);
        });
    };
    const checkHadMintByWhitelist = async () => {
      minterContract
        .registeredWithWhitelist(account)
        .then((r) => {
          dispatchSNS({ type: ACTIONS.SET_HAD_MINT_BY_WHITELIST, payload: r });
        })
        .catch((error) => {
          console.error('checkWhitelistOpen failed', error);
        });
    };
    if (account && minterContract) {
      checkWhitelistOpen();
      checkHadMintByWhitelist();
    }
  }, [account, minterContract]);

  useEffect(() => {
    if (account && controllerContract && step === 3) {
      checkUserStatus();
    }
  }, [account, controllerContract, step]);

  useEffect(() => {
    const initContract = async () => {
      const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
      const _contract = new ethers.Contract(builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR, CONTROLLER_ABI, provider);
      dispatchSNS({ type: ACTIONS.SET_CONTROLLER_CONTRACT, payload: _contract });
      const _register_contract = new ethers.Contract(builtin.SEEDAO_MINTER_ADDR, MINTER_ABI, provider);
      dispatchSNS({ type: ACTIONS.SET_MINTER_CONTRACT, payload: _register_contract });
    };
    rpc && initContract();
  }, [rpc]);

  useEffect(() => {
    if (account && !localData) {
      const localsns = localStorage.getItem("sns") || "";
      let data;
      try {
        data = JSON.parse(localsns);
      } catch (error) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: data });
    }
  }, [account, localData]);

  useEffect(() => {
    const parseLocalData = () => {
      if (!account || !localData) {
        return;
      }
      const v = localData[account];
      if (!v) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_SNS, payload: v.sns });
      // check step

      console.log("v:", v);
      if (v.step === "commit") {
        console.log("timestamp", v.timestamp);
        if (v.timestamp > 0) {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SHOW_LOADING });
        }
      } else if (v.step === "register") {
        if (v.stepStatus === "success") {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 3 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          if (
            v.stepStatus === "pending" ||
            v.stepStatus === "approving" ||
            (v.stepStatus === "approve_success" && !!state)
          ) {
            dispatchSNS({ type: ACTIONS.SHOW_LOADING });
          }
          return;
        }
      }
      dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
    };
    parseLocalData();
  }, [account, localData]);

  return (
    <Layout
      title="SNS"
      handleBack={() => {
        navigate("/home");
      }}
      // rightOperation={
      //   step === 1 && (
      //     <Link to="/sns/user">
      //       <img src={UserIcon} alt="" />
      //     </Link>
      //   )
      // }
    >
      <Container>
        <StepContainer>
          {step === 1 && <RegisterSNSStep1 sns={state?.sns} />}
          {step === 2 && <RegisterSNSStep2 />}
          {step === 3 && <FinishedComponent />}
        </StepContainer>
        <HelperBox href="https://seedao.notion.site/SNS-1a2e97530715430abc115967f219d05b?pvs=4" target="_blank">
          <img src={HelperIcon} alt="" />
        </HelperBox>
        {loading && <StepLoading />}
      </Container>
    </Layout>
  );
};

export default function RegisterSNS() {
  return (
    <SNSProvider>
      <RegisterSNSWrapper />
    </SNSProvider>
  );
}

const Container = styled.div`
  box-sizing: border-box;
  padding-inline: 20px;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


const HelperBox = styled.a`
  display: inline-block;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--primary-color);
  position: absolute;
  bottom: 100px;
  right: 20px;
  box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.1);
  img {
    width: 100%;
  }
`;