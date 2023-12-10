import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { builtin } from "@seedao/sns-js";
import { useSelector } from "react-redux";
import ABI from "assets/abi/SeeDAORegistrarController.json";
import useTransaction from "hooks/useTransaction";
import getConfig from "constant/envCofnig";
import { useNavigate } from "react-router-dom";

const networkConfig = getConfig().NETWORK;

const buildSwitchData = (sns) => {
  const iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData("setDefaultName", [sns.replace(".seedao", ""), builtin.PUBLIC_RESOLVER_ADDR]);
};

export default function SwitchModal({ select, handleClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);

  const handleTransaction = useTransaction("sns-switch");

  const handleSwitch = async () => {
    try {
      const tx = await handleTransaction(buildSwitchData(select));
      const hash = (tx && tx.hash) || tx;
      if (hash) {
        navigate("/sns/user", { state: hash });
      }
      handleClose(select);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  return (
    <SwitchModalStyle>
      <ModalMask />
      <ModalContent>
        <SelectSNS>{select}</SelectSNS>
        <Content>
          <img src={networkConfig.icon} alt="" />
          <span>{account}</span>
        </Content>
        <Footer>
          <PrimaryButton onClick={handleSwitch}>{t("General.confirm")}</PrimaryButton>
          <CancelButton onClick={() => handleClose()}>{t("General.cancel")}</CancelButton>
        </Footer>
      </ModalContent>
    </SwitchModalStyle>
  );
}

const SwitchModalStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 41px;
  text-align: center;
`;

const SelectSNS = styled.div`
  color: var(--primary-color);
  font-family: "Poppins-Medium";
  font-weight: 500;
  line-height: 28px;
  font-size: 24px;
`;

const Footer = styled.div`
  margin-top: 61px;
  margin-bottom: 30px;
  padding-inline: 20px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 10px;
  margin-top: 24px;
  img {
    width: 24px;
  }
`;

const PrimaryButton = styled.span`
  display: block;
  height: 40px;
  line-height: 40px;
  width: 100%;
  background-color: var(--primary-color);
  border-radius: 16px;
  color: #fff;
  text-align: center;
  font-size: 14px;
`;

const CancelButton = styled.span`
  margin-top: 10px;
  display: block;
  height: 40px;
  line-height: 40px;
  border-radius: 16px;
  text-align: center;
  font-size: 14px;
  color: var(--sns-font-color);
`;
