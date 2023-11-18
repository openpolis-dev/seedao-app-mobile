import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationStatus } from "constant/application";

export default function useApplicationStatus() {
  const { t } = useTranslation();
  return useMemo(() => {
    return [
      { label: t("Application.ToBeReviewed"), value: ApplicationStatus.Open },
      { label: t("Application.Rejected"), value: ApplicationStatus.Rejected },
      { label: t("Application.ToBeIssued"), value: ApplicationStatus.Approved },
      { label: t("Application.Sended"), value: ApplicationStatus.Completed },
      { label: t("Application.Sending"), value: ApplicationStatus.Processing },
    ];
  }, [t]);
}
