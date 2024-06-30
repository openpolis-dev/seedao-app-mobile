import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Budget from "../../../components/project/budget";
export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    // <Layout title={data?.name || t("Project.Detail")}>
    <Layout title={t("Project.Detail")}>
      <Budget id={id} />
    </Layout>
  );
}
