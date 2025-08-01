import { useTranslation } from "react-i18next";

export default function useAssets() {
  const { t } = useTranslation();
  return [{ label: t("Application.AllAssets") }, { value: "SEE", label: "SEE" }, { value: "WANG", label: "WANG" }, { value: "USDT", label: "USDT" }];
}
