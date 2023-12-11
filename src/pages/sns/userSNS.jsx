import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SwitchModal from "./switchModal";
import sns, { builtin } from "@seedao/sns-js";
import LoadingImg from "assets/Imgs/loading.png";
import NoItem from "components/noItem";
import { ethers } from "ethers";
import Layout from "components/layout/layout";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import store from "store";
import { saveLoading } from "store/reducer";
import getConfig from "constant/envCofnig";
const networkConfig = getConfig().NETWORK;

export default function UserSNS() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  console.log("====state", state);
  const account = useSelector((state) => state.account);
  const globalLoading = useSelector((state) => state.loading);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState();
  const [snsList, setSnsList] = useState([]);
  const [userSNS, setUserSNS] = useState("");
  const [loadingName, setLoadingName] = useState(false);

  const getCurrentName = (showLoading) => {
    if (account) {
      showLoading && setLoadingName(true);
      sns
        .name(account)
        .then((r) => {
          setUserSNS(r);
        })
        .finally(() => {
          showLoading && setLoadingName(false);
        });
    } else {
    }
  };

  useEffect(() => {
    getCurrentName();
  }, [account]);

  useEffect(() => {
    const getSNSList = () => {
      if (!account) {
        return;
      }
      store.dispatch(saveLoading(true));

      fetch(`${builtin.INDEXER_HOST}/sns/list_by_wallet/${ethers.utils.getAddress(account)}`)
        .then((res) => res.json())
        .then((res) => {
          setSnsList(res.map((item) => item.sns));
        })
        .catch((err) => {
          console.error("Can't get sns list", err);
        })
        .finally(() => {
          store.dispatch(saveLoading(false));
        });
    };
    getSNSList();
  }, [account]);
  const list = snsList.filter((item) => item !== userSNS);
  const handleCloseModal = (newSNS) => {
    setShowModal(undefined);
    newSNS && setUserSNS(newSNS);
  };

  useEffect(() => {
    if (!account || !state) {
      return;
    }

    let timer;
    const timerFunc = () => {
      setLoading(true);
      const provider = new ethers.providers.StaticJsonRpcProvider(networkConfig.rpc);
      provider.getTransactionReceipt(state).then((r) => {
        console.log("[tx-status]", r);
        if (r && r.status === 1) {
          // means tx success
          clearInterval(timer);
          setLoading(false);
          getCurrentName(true);
          // refresh data
        } else if (r && (r.status === 2 || r.status === 0)) {
          // means tx failed
          clearInterval(timer);
          setLoading(false);
        }
      });
    };
    timerFunc();
    timer = setInterval(timerFunc, 1500);
    return () => timer && clearInterval(timer);
  }, [state, account]);

  const handleBack = () => {
    navigate("/sns/register");
  };

  return (
    <Layout title={t("SNS.MySNS")} handleBack={handleBack}>
      <ContainerWrapper>
        {!!snsList.length ? (
          <>
            <CurrentUsed>
              {loadingName ? <img className="loading" src={LoadingImg} alt="" style={{ width: "20px" }} /> : userSNS}
            </CurrentUsed>
            <NameList>
              {list.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  {userSNS && (
                    <PrimaryOutlinedButton onClick={() => setShowModal(item)}>{t("SNS.Switch")}</PrimaryOutlinedButton>
                  )}
                </li>
              ))}
            </NameList>
          </>
        ) : (
          !globalLoading && <NoItem />
        )}
        {loading && <Loading text={t("SNS.Switching")} />}
      </ContainerWrapper>
      {showModal && <SwitchModal select={showModal} handleClose={handleCloseModal} />}
    </Layout>
  );
}

const Loading = ({ text }) => {
  return (
    <LoadingStyle>
      <LoadingBox>
        <img src={LoadingImg} alt="" className="loading" />
        <div>{text}</div>
      </LoadingBox>
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    user-select: none;
    width: 40px;
    height: 40px;
    margin-top: 25px;
    margin-bottom: 10px;
  }
`;

const LoadingBox = styled.div`
  width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.75);
  text-align: center;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
`;

const ContainerWrapper = styled.div`
  padding-top: 24px;
  box-sizing: border-box;
  padding-inline: 20px;
  img.loading {
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const CurrentUsed = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--primary-color);
  line-height: 68px;
  border-bottom: 1px solid var(--border-color-1);
`;

const NameList = styled.ul`
  font-size: 14px;
  li {
    line-height: 66px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color-1);
  }
`;

const PrimaryOutlinedButton = styled.span`
  display: inline-block;
  height: 28px;
  padding-inline: 12px;
  border-radius: 29px;
  line-height: 27px;
  text-align: center;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 13px;
`;
