import styled from "styled-components";
import apps from "../../constant/apps";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "utils/constant";
import useToast from "hooks/useToast";
import { useSelector } from "react-redux";
import getConfig from "constant/envCofnig";

const Box = styled.div`
  background: #fff;
  margin: 24px 20px;
  border-radius: 16px;
  padding: 16px 3px 0;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
`;

const TitleBox = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1em;
  padding-left: 13px;
`;

const TipsBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #9a9a9a;
  padding-left: 13px;
`;

const UlBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 22px;
  dl {
    width: 25%;
    box-sizing: border-box;
    padding: 0 13px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 62px;
    height: 62px;
    object-fit: cover;
    object-position: center;
    background: #fff;
    border-radius: 10px;
  }
  dd {
    margin-bottom: 20px;
    font-size: 12px;
    font-family: Poppins-Medium;
    font-weight: 500;
    color: #1a1323;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
`;

const DefaultLogo = styled.div`
  width: 62px;
  height: 62px;
  background-color: var(--primary-color);
  border-radius: 10px;
  text-align: center;
  line-height: 62px;
  color: #fff;
  overflow: hidden;
`;

const ChatData = {
  id: "module-chat",
  name: "Chat",
  link: "/chat",
  desc: "apps.SNSDesc",
};

export default function AppList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { Toast, toast } = useToast();
  const wallet = useSelector((state) => state.walletType);
  const userToken = useSelector(state=> state.userToken);
  const events = useMemo(() => {
    return apps.map((item) => ({ ...item, name: t(item.name) }));
  }, [t]);

  const handleClickEvent = (data) => {
    const { link } = data;
    if (data.id.startsWith("module-")) {
      navigate(link);
    } else {
      window.open(link, "_blank");
    }
  };

  const handleClickChat = () => {
    if(!userToken){
      navigate("/login")
      return;
    }

    if (wallet !== Wallet.METAMASK) {
      toast.danger("please switch to metamask");
      return;
    }
    navigate(ChatData.link);
  };

  return (
    <Box>
      <div>
        <TitleBox>{t("home.apps")}</TitleBox>
        <TipsBox>{t("home.appTips")}</TipsBox>
      </div>
      <UlBox>
        {events.map((item, index) => (
          <dl key={index} onClick={() => handleClickEvent(item)}>
            <dt>{item.icon ? <img src={item.icon} alt="" /> : <DefaultLogo>{item.name}</DefaultLogo>}</dt>
            <dd>{item.name}</dd>
          </dl>
        ))}
        {getConfig().SENDINGME_ENABLE && (
          <dl onClick={() => handleClickChat()}>
            <dt>{ChatData.icon ? <img src={ChatData.icon} alt="" /> : <DefaultLogo>{ChatData.name}</DefaultLogo>}</dt>
            <dd>{ChatData.name}</dd>
          </dl>
        )}
      </UlBox>
      {Toast}
    </Box>
  );
}
