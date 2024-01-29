import { useTranslation } from "react-i18next";
import styled from "styled-components";
import NiceIcon from "assets/Imgs/sns/nice.svg";
import { ACTIONS, useSNSContext } from "./snsProvider";
import { useEffect } from "react";
import Layout from "components/layout/layout";
import { Link } from "react-router-dom";

export default function FinishedComponent() {
  const { t } = useTranslation();

  const {
    state: { sns },
    dispatch: dispatchSNS,
  } = useSNSContext();

  useEffect(() => {
    localStorage.removeItem("sns");
  }, []);

  const goStep1 = () => {
    localStorage.removeItem("sns");
    dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
    dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: undefined });
  };

  return (
    <Layout title="SNS" handleBack={goStep1}>
      <Container>
        <ContainerTop bg={"light"}>
          <img src={NiceIcon} alt="" />
        </ContainerTop>
        <ContainerBottom>
          <div className="title">{t("SNS.FinishSucess", { sns: `${sns}.seedao` })}</div>
          <div>
            <HomeLink to="/home">
              <LinkBox>{t("SNS.Polis")}</LinkBox>
            </HomeLink>
            <ContributeLink
              href="https://seedao.notion.site/SeeDAO-2024-9d22f5f6222e448d8dc161d3dfa92c2d?pvs=4"
              target="_blank"
            >
              <LinkBox>{t("SNS.PolisContribute")}</LinkBox>
            </ContributeLink>
          </div>
        </ContainerBottom>
      </Container>
    </Layout>
  );
}
const Container = styled.div`
  padding-top: 50px;
`;

const ContainerTop = styled.div`
  text-align: center;
`;
const ContainerBottom = styled.div`
  text-align: center;
  padding-top: 34px;

  .title {
    font-family: "Poppins-Medium";
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1;
    width: 70%;
    margin: 0 auto;
    margin-bottom: 30px;
  }
`;

const LinkBox = styled.div`
  width: 70%;
  height: 50px;
  color: #000;
  border-radius: 8px;
  line-height: 50px;
  text-align: center;
  margin: 20px auto;
  background: linear-gradient(207deg, #f7e1ed 10%, #f8fff8 58%, #e9deff 100%);
`;

const HomeLink = styled(Link)``;

const ContributeLink = styled.a``;
