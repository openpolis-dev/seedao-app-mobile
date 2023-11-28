import { useTranslation } from "react-i18next";
import styled from "styled-components";
import NiceIcon from "assets/Imgs/sns/nice.svg";
import { useSNSContext } from "./snsProvider";
import { useEffect } from "react";
import Layout from "components/layout/layout";

export default function FinishedComponent() {
  const { t } = useTranslation();

  const {
    state: { sns },
  } = useSNSContext();

  useEffect(() => {
    localStorage.removeItem("sns");
    // TODO set global sns
    // dispatch({ type: AppActionType.SET_SNS, payload: `${sns}.seedao` });
  }, []);
    return (
      <Layout title="SNS">
        <Container>
          <ContainerTop bg={"light"}>
            <img src={NiceIcon} alt="" />
          </ContainerTop>
          <ContainerBottom>
            <div className="title">{sns}.seedao</div>
            <div className="success">{t("SNS.FinishSucess")}</div>
          </ContainerBottom>
        </Container>
      </Layout>
    );
}
const Container = styled.div`
    padding-top: 65px;
`;

const ContainerTop = styled.div`
  text-align: center;
`;
const ContainerBottom = styled.div`
  text-align: center;
  padding-top: 34px;

  .title {
    font-family: "Poppins-SemiBold";
    font-size: 34px;
    font-weight: 600;
    line-height: 42px;
    letter-spacing: 1;
  }
  .success {
    font-family: "Poppins-Medium";
    font-size: 14px;
    font-weight: 500;
    color: var(--sns-font-color);
    margin-top: 16px;
  }
`;
