import { useEffect } from "react";
import { getProposalCategoryList } from "api/proposalV2";
import { saveProposalCategories } from "store/reducer";
import store from "store";
import { useSelector } from "react-redux";

export default function useProposalCategories() {
  const proposalCategories = useSelector((state) => state.proposalCategories);

  useEffect(() => {
    const getProposalCategories = async () => {
      try {
        const resp = await getProposalCategoryList();
        store.dispatch(saveProposalCategories(resp.data));
      } catch (error) {
        logError("getProposalCategories failed", error);
      }
    };
    !proposalCategories.length && getProposalCategories();
  }, [proposalCategories]);

  return proposalCategories;
}
