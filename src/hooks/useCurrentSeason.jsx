import { useEffect } from 'react';
import { getCurrentSeason } from 'api/cityhall';
import store from 'store';
import { useSelector } from 'react-redux';
import { saveCurrentSeason } from "store/reducer";

export default function useCurrentSeason() {
  const currentSeason = useSelector((state) => state.currentSeason);

  useEffect(() => {
    if (!currentSeason) {
      getCurrentSeason().then((r) => {
        store.dispatch(saveCurrentSeason(r?.data?.name));
      });
    }
  }, [currentSeason]);

  return currentSeason;
}
