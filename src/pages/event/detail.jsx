import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import EventInner from "../../components/event/EventInner";

export default function EventInfoPage() {
  const { t } = useTranslation();

  const { search } = window.location;
  const id = new URLSearchParams(search).get("id");

  return (
    <Layout title={t("Event.DetailTitle")}>
      <EventInner id={id} />
    </Layout>
  );
}
