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

export default function UserSNS() {
  const { t } = useTranslation();

  const account = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState();
  const [snsList, setSnsList] = useState([]);
  const [userSNS, setUserSNS] = useState("");

  useEffect(() => {
    if (account) {
      sns.name(account).then((r) => {
        setUserSNS(r || account);
      });
    } else {
      setUserSNS(account);
    }
  }, [account]);

  useEffect(() => {
    const getSNSList = () => {
      if (!account) {
        return;
      }
      setLoading(true);
      fetch(`${builtin.INDEXER_HOST}/sns/list_by_wallet/${ethers.utils.getAddress(account)}`)
        .then((res) => res.json())
        .then((res) => {
          setSnsList(res.map((item) => item.sns));
        })
        .catch((err) => {
          console.error("Can't get sns list", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getSNSList();
  }, [account]);
  const list = snsList.filter((item) => item !== userSNS);
  const handleCloseModal = (newSNS) => {
    setShowModal(undefined);
  };
  return (
    <Layout title={t("SNS.MySNS")}>
      <ContainerWrapper>
        <CurrentUsed>{userSNS || account}</CurrentUsed>
        {loading ? (
          <Loading />
        ) : !!snsList.length ? (
          <NameList>
            {list.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <PrimaryOutlinedButton onClick={() => setShowModal(item)}>{t("SNS.Switch")}</PrimaryOutlinedButton>
              </li>
            ))}
          </NameList>
        ) : (
          <NoItem />
        )}
      </ContainerWrapper>
      {showModal && <SwitchModal select={showModal} handleClose={handleCloseModal} />}
    </Layout>
  );
}

const Loading = () => {
  return (
    <LoadingStyle>
      <img src={LoadingImg} alt="" />
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  img {
    user-select: none;
    width: 40px;
    height: 40px;
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

const ContainerWrapper = styled.div`
  padding-top: 24px;
  box-sizing: border-box;
  padding-inline: 20px;
`;

const CurrentUsed = styled.div`
  font-size: 14px;
  font-family: Poppins, Poppins;
  font-weight: 400;
  color: var(--bs-primary);
  line-height: 68px;
  padding-inline: 33px;
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
  border-radius: 29px;
  line-height: 27px;
  text-align: center;
  border: 1px solid var(--primary-color);
`;
