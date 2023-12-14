import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GuildInner from "../../../components/guild/GuildInner";



export default function GuildInfo() {
  const { t } = useTranslation();
  const { id } = useParams();


  return (
    // <Layout title={data?.name || t("Guild.Detail")}>
    <Layout title={t("Guild.Detail")}>
      <GuildInner id={id} />
    </Layout>
  );
}
