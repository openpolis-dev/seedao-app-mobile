import { useTranslation } from "react-i18next";

export default function useAssets() {
  const { t } = useTranslation();
  return [{ label: t("General.All") }, { value: "SCR", label: "SCR" }, { value: "USDT", label: "USDT" }];
}
