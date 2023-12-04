import Layout from "components/layout/layout";
import LogoImg from "../assets/Imgs/loginLogo.png";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Metamask from "../components/login/metamask";
import Joyid from "../components/login/joyid";
import Unipass from "../components/login/unipassPopup";
import {useState} from "react";
import SwitchLan from "../components/common/switchLan";
import AppConfig from "../AppConfig";

const Box = styled.div`
  width: 100%;
  height: var(--app-height);
  box-sizing: border-box;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 11vh;
  img {
    //width: 70%;
    height: 29vh;
    margin: 0 auto;
  }
`;

const Tips = styled.div`
  font-size: 24px;
  font-family: 'Poppins-SemiBold';
  margin: 10% 24px 5%;
`;
const BtnList = styled.ul`
  margin: 0 24px;
  li {
    margin-bottom: 20px;
    background: #f7f7f9;
    border-radius: 16px;
    padding: 1vh 10px;

    dl {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px;
    }
    .logo {
      margin-right: 12px;
      background: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 56px;
      height: 56px;
      img {
        //width: 56px;
        height: 6vh;
      }
      &.metamask {
        img {
          height: 4vh;
          //width: 42px;
          
        }
      }
    }
    dt {
      display: flex;
      align-items: center;
      span {
        font-size: 15px;
        font-family: Poppins-SemiBold;
        font-weight: 600;
        line-height: 22px;
      }
    }
  }
`;


export default function Login() {
  const { t,i18n } = useTranslation();

  return (
    <Layout noHeader noTab>
      <Box>
        <LogoBox>
          <img src={LogoImg} alt="" />
        </LogoBox>
        <Tips>{t("General.connect")}</Tips>
        <BtnList>
          <li>
            <Metamask />
          </li>

          <li>
            <Joyid />
          </li>
          <li>
            <Unipass />
          </li>
        </BtnList>
      </Box>
    </Layout>
  );
}
