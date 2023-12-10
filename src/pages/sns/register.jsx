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
import getConfig from "constant/envCofnig";
import { useSelector } from "react-redux";
import Layout from "components/layout/layout";
import UserIcon from "assets/Imgs/sns/user.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const networkConfig = getConfig().NETWORK;

const RegisterSNSWrapper = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("====state", state);

  const account = useSelector((state) => state.account);

  const {
    state: { step, localData, loading },
    dispatch: dispatchSNS,
  } = useSNSContext();

  console.log("step", step);

  useEffect(() => {
    const initContract = async () => {
      const provider = new ethers.providers.StaticJsonRpcProvider(networkConfig.rpc);
      const _contract = new ethers.Contract(builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR, CONTROLLER_ABI, provider);
      dispatchSNS({ type: ACTIONS.SET_CONTROLLER_CONTRACT, payload: _contract });
      const _register_contract = new ethers.Contract(builtin.SEEDAO_MINTER_ADDR, MINTER_ABI, provider);
      dispatchSNS({ type: ACTIONS.SET_CONTROLLER_CONTRACT, payload: _contract });
    };
    initContract();
  }, []);

  useEffect(() => {
    console.log("account", account);
    console.log("localData", localData);
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
          if (v.stepStatus === "pending") {
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
      rightOperation={
        step === 1 && (
          <Link to="/sns/user">
            <img src={UserIcon} alt="" />
          </Link>
        )
      }
    >
      <Container>
        <StepContainer>
          {step === 1 && <RegisterSNSStep1 sns={state?.sns} />}
          {step === 2 && <RegisterSNSStep2 />}
          {step === 3 && <FinishedComponent />}
        </StepContainer>
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
