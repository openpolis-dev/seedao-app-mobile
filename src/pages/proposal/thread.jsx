import React, { useEffect, useState } from "react";
import Layout from "components/layout/layout";
import { useTranslation } from "react-i18next";
import Proposalnner from "../../components/proposal/Proposalnner";

export default function ProposalThread() {
  const { t } = useTranslation();

  const [noHead, setNoHead] = useState(false);
  useEffect(() => {
    const container = document.querySelector("#proInner");
    container && container.addEventListener("scroll", ScrollHeight);
    return () => {
      container.removeEventListener("scroll", ScrollHeight);
    };
  }, []);

  const ScrollHeight = () => {
    const container = document.querySelector("#proInner");
    console.log(container.scrollTop)

    setNoHead(container.scrollTop > 10);
  };
  return (
    <Layout title={t("Proposal.ProposalDetail")} noHeader={noHead}>
      <Proposalnner />
    </Layout>
  );
}

