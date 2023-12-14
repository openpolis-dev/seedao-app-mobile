import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ProjectInner from "../../../components/project/ProjectInner";
export default function ProjectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    // <Layout title={data?.name || t("Project.Detail")}>
    <Layout title={t("Project.Detail")}>
      <ProjectInner id={id} />
    </Layout>
  );
}
