import React, { useEffect, useMemo, useState } from "react";
import ProposalNav from "components/proposal/proposalNav";
import { useTranslation } from "react-i18next";
import { getCategories } from "api/proposal";
import { useSelector } from "react-redux";
import store from "store";
import { saveLoading, saveProposalCategories } from "store/reducer";

export default function useProposalCategory(proposal_category_id) {
  const { t } = useTranslation();
  const proposalCategories = useSelector((state) => state.proposalCategories);

  const [navs, setNavs] = useState([]);

  const HomeNav = useMemo(() => {
    return { name: t("Proposal.AllCategories"), category_id: -1, to: "/proposal" };
  }, [t]);

  const getCategoryList = async () => {
    store.dispatch(saveLoading(true));

    try {
      const resp = await getCategories();
      store.dispatch(saveProposalCategories(resp?.data.group.categories));
    } catch (error) {
      logError("getCategories failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const findCategoryList = (id) => {
    const category = proposalCategories.find((category) => category.category_id === id);
    console.log("proposalCategories", proposalCategories);
    console.log("category", category);
    if (category) {
      return [
        HomeNav,
        { name: category.name, category_id: category.category_id, to: `/proposal/category/${category.category_id}` },
      ];
    }
    for (const category of proposalCategories) {
      const subCategory = category.children.find((child) => child.category_id === id);
      if (subCategory) {
        return [
          HomeNav,
          {
            name: subCategory.name,
            category_id: subCategory.category_id,
            to: `/proposal/category/${subCategory.category_id}`,
          },
        ];
      }
    }
    return [];
  };

  useEffect(() => {
    if (!proposal_category_id) {
      return;
    }
    if (!proposalCategories.length) {
      getCategoryList();
      return;
    }
    setNavs(findCategoryList(proposal_category_id));
  }, [proposal_category_id, proposalCategories, t]);
  console.log("proposal_category_id", proposal_category_id);
  console.log("navs", navs);

  return <ProposalNav navs={navs} />;
}
