import { DeSchoolProvider, CourseContextProvider, Learn } from "@deschool-protocol/react";
import "@deschool-protocol/react/dist/styles/index.css";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const TOPIC_ID = "62f0adc68b90ee1aa913a965";

export default function CoursePage() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dtoken = "";
  return (
    <Layout title={state || t("apps.Newcomer")}>
      <DeSchoolProvider
        config={{
          baseUrl: "https://deschool.app/goapiProduction",
          token: dtoken,
        }}
      >
        <CourseContextProvider>
          <Learn topicId={TOPIC_ID} sectionClassName="see-section" wrapClassName="see-learn"></Learn>
        </CourseContextProvider>
      </DeSchoolProvider>
    </Layout>
  );
}
