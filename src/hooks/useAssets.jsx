import { useTranslation } from "react-i18next";

export default function useAssets() {
  const { t } = useTranslation();
  return [{ label: t("Application.AllAssets") }, { value: "SCR", label: "SCR" }, { value: "USDT", label: "USDT" }];
}
