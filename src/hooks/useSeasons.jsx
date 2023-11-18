import { useEffect, useState } from 'react';
import { getSeasons } from 'api/applications';

export default function useSeasons() {
  const [seasons, setSeasons] = useState([]);
  useEffect(() => {
    const getSeasonList = async () => {
      try {
        const resp = await getSeasons();
        setSeasons(
          resp.data?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      } catch (error) {
        console.error('getSeasons failed', error);
      }
    };
    getSeasonList();
  }, []);
  return seasons;
}
