import { useEffect, useState } from "react";
import { getSeasons } from "api/applications";
import { useTranslation } from "react-i18next";

export default function useSeasons(addAll = true) {
  const { t } = useTranslation();
  const [seasons, setSeasons] = useState();
  useEffect(() => {
    const getSeasonList = async () => {
      try {
        const resp = await getSeasons();
        setSeasons([
          { label: t("Application.AllSeasons") },
          ...resp.data?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        ]);
      } catch (error) {
        logError("getSeasons failed", error);
      }
    };
    getSeasonList();
  }, []);
  return seasons;
}
