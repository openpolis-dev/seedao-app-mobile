import styled from "styled-components";
import LearnDashboard from "components/newcomer/learn";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import sns from "@seedao/sns-js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "store";
import { saveLoading } from "store/reducer";
import Layout from "components/layout/layout";

export default function Newcomer() {
  const { t } = useTranslation();

  const account = useSelector((state) => state.account);

  const [userSNS, setUserSNS] = useState();

  useEffect(() => {
    // check SNS
    const checkSNS = async () => {
      store.dispatch(saveLoading(true));

      account &&
        sns
          ?.name(account)
          .then((r) => {
            if (r) {
              setUserSNS(r);
            }
          })
          .finally(() => {
            store.dispatch(saveLoading(false));
          });
    };
    if (account) {
      checkSNS();
    }
  }, [account]);

  return (
    <Layout title={t("apps.Newcomer")}>
      {userSNS ? (
        <Container>
          <LearnDashboard />
        </Container>
      ) : (
        <Container>
          <Tip>{t("Onboarding.UnlockTip")}</Tip>
          <Link to="/sns/register">
            <Button>{t("Onboarding.AquireSNS")}</Button>
          </Link>
        </Container>
      )}
    </Layout>
  );
}

const Container = styled.div`
  background-image: linear-gradient(to left bottom, #b48ae7, #c4a1ea, #d3b8ee, #e1cff1, #eee7f4);
  width: calc(100% - 40px);
  margin: 0 auto;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  text-align: center;
  position: relative;
  padding-block: 40px;
`;

const Tip = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 30px;
  background-image: linear-gradient(to left bottom, #7619e8, #8227e8, #8c33e8, #963ee8, #9f49e8);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  margin-bottom: 20px;
`;

const Button = styled.button`
  outline: none;
  border: none;
  height: 36px;
  border-radius: 8px;
  padding-inline: 10px;
  font-size: 14px;
  background-color: var(--primary-color);
  color: #fff;
`;
