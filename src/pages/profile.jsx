import Layout from "../components/layout/layout";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import store from "../store";
import { saveLoading } from "../store/reducer";
import { getUser } from "../api/user";
import Avatar from "components/common/avatar";
import CopyBox from "components/common/copy";
import useParseSNS from "hooks/useParseSNS";

const Box = styled.div`
  padding: 20px;
`;

const LineBox = styled.div`
  dl {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  dt {
    background: #fff;
    padding: 5px 10px;
    width: 80px;
    font-size: 14px;
    font-weight: normal;
    flex-shrink: 0;
  }
  dd {
    word-break: break-all;
    padding: 5px 10px;
    font-size: 14px;
  }
`;
const RhtBox = styled.div`
  font-size: 20px;
  padding-top: 7px;
`;

const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
`;

export default function Profile() {
  const { t } = useTranslation();

  const [detail, setDetail] = useState();
  const sns = useParseSNS(detail?.wallet);

  useEffect(() => {
    toGA();
  }, []);

  const toGA = async () => {
    // await analyticsGoogle("Profile", { account })
  };

  useEffect(() => {
    getMyDetail();
  }, []);
  const getMyDetail = async () => {
    store.dispatch(saveLoading(true));
    try {
      let rt = await getUser();
      setDetail(rt.data);
    } catch (e) {
      console.error(e);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  return (
    <Layout noTab title={t("My.MyProfile")}>
      <Box>
        <AvatarBox>
          <Avatar size="100px" src={detail?.avatar} />
        </AvatarBox>
        <LineBox>
          <dl>
            <dt>SNS</dt>
            <dd>{sns}</dd>
          </dl>
          <dl>
            <dt>{t("My.Name")}</dt>
            <dd>{detail?.name}</dd>
          </dl>
          <dl>
            <dt>{t("mobile.my.wallet")}</dt>
            <dd>{detail?.wallet}</dd>
            <RhtBox>
              <CopyBox text={detail?.wallet} />
            </RhtBox>
          </dl>
          <dl>
            <dt>{t("My.Email")}</dt>
            <dd>{detail?.email}</dd>
          </dl>
          <dl>
            <dt>{t("My.Discord")}</dt>
            <dd>{detail?.discord_profile}</dd>
          </dl>
          <dl>
            <dt>{t("My.Twitter")}</dt>
            <dd>{detail?.twitter_profile}</dd>
          </dl>
          <dl>
            <dt>{t("My.WeChat")}</dt>
            <dd>{detail?.wechat}</dd>
          </dl>
          <dl>
            <dt>{t("My.Mirror")}</dt>
            <dd>{detail?.mirror}</dd>
          </dl>
        </LineBox>
      </Box>
    </Layout>
  );
}
