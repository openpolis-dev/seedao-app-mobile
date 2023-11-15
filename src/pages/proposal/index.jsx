import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/layout";
import styled from "styled-components";
import { ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { PROPOSAL_CATEGORIES } from "utils/constant";
import { useState, useEffect } from "react";
import ProposalSubNav from "components/poposal/proposalSubNav";
import ProposalCard from "components/poposal/proposalCard";
import { getAllProposals,getCategories } from "api/proposal";
import InfiniteScroll from "react-infinite-scroll-component";
import MsgIcon from "assets/Imgs/msg.png";
import store from "store";
import { saveLoading } from "store/reducer";
import Loading from "components/common/loading";
import { Link } from 'react-router-dom';

export default function Proposal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState([]);
  const [orderType, setOrderType] = useState("latest");
  const [activeTab, setActiveTab] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [proposal_categories,setproposal_categories] = useState([])


  useEffect(() => {
    if (activeTab === 0) {
      getCategoriesAPi();
    }
  }, [activeTab]);


  const getCategoriesAPi = async () => {
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await getCategories();
      setproposal_categories(resp?.data.group.categories)
      // dispatch({
      //   type: AppActionType.SET_PROPOSAL_CATEGORIES,
      //   payload: resp.data.group.categories,
      // });
    } catch (error) {
      console.error('getCategories failed', error);
    } finally {
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  const handleChangeOrder = (index) => {
    setPage(1);
    setProposals([]);
    setOrderType(index === 0 ? "latest" : "old");
  };

  const getProposals = async (useGlobalLoading) => {
    useGlobalLoading && store.dispatch(saveLoading(true));
    try {
      const resp = await getAllProposals({ page, per_page: pageSize, sort: orderType });
      setProposals([...proposals, ...resp.data.threads]);
      setPage(page + 1);
      setHasMore(resp.data.threads.length >= pageSize);
    } catch (error) {
      console.error("getAllProposals failed", error);
    } finally {
      useGlobalLoading && store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      getProposals(true);
    }
  }, [activeTab, orderType]);
  return (
    <Layout title={t("menus.Proposal")} >
      {/*<TabMenu>*/}
      {/*  <li onClick={() => setActiveTab(0)} className={activeTab === 0 ? "selected" : ""}>*/}
      {/*    {t("Proposal.AllCategories")}*/}
      {/*  </li>*/}
      {/*  /!*<li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "selected" : ""}>*!/*/}
      {/*  /!*  {t("Proposal.TheNeweset")}*!/*/}
      {/*  /!*</li>*!/*/}
      {/*</TabMenu>*/}
      <Content>
        {activeTab === 0 && (
            <div>
              {proposal_categories.map((category, index) => (
                  <CategoryCard key={index}>
                    <div className="cate-name">
                      <Link to={`/proposal/category/${category.category_id}`}>{category.name}</Link>
                    </div>
                    {!!category.children.length && (
                        <SubCategoryCard>
                          {category.children.map((subCategory) => (
                              <a href={`/proposal/category/${subCategory.category_id}`} key={subCategory.category_id}>
                                <SubCategoryItem>
                                  <ImgBox>
                                    <img src={MsgIcon} alt="" width="24px" height="24px" />
                                  </ImgBox>

                                  <div>
                                    <div className="name">{subCategory.name}</div>
                                    <div className="tips">
                                      <span>{subCategory.thread_count} topics</span>
                                    </div>
                                  </div>
                                </SubCategoryItem>
                              </a>
                          ))}
                        </SubCategoryCard>
                    )}
                  </CategoryCard>
              ))}
            </div>
        )}
        {activeTab === 1 && (
          <ProposalListContent>
            <ProposalSubNav onSelect={handleChangeOrder} value={orderType === "latest" ? 0 : 1} />
            <InfiniteScroll
              dataLength={proposals.length}
              next={getProposals}
              hasMore={hasMore}
              loader={<Loading />}
              height={400}
              style={{ height: "calc(var(--app-height) - 150px)" }}
            >
              <ProposalBox>
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} data={proposal} />
                ))}
              </ProposalBox>
            </InfiniteScroll>
          </ProposalListContent>
        )}
      </Content>
    </Layout>
  );
}

const TabMenu = styled.ul`
  display: flex;
  height: 40px;
  line-height: 40px;
  li {
    flex: 1;
    text-align: center;
    color: var(--bs-primary);
    &.selected {
      border-bottom: 3px solid var(--bs-primary);
    }
  }
`;

const Content = styled.div`
  padding: 0 24px 30px;
  background: var(--background-color);
`;



const SubCategoryCard = styled.div`
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: stretch;
  padding: 10px;
  a{
    display: block;
    width: 50%;
  }
`;

const SubCategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  .name {
    font-size: 14px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #424242;
    line-height: 26px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tips{
    font-size: 12px;
    font-weight: 400;
    color: #9A9A9A;
  }
`;

const CategoryCard = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  margin-block: 16px;
  background: #fff;
  .cate-name {
    padding-inline: 16px;
    line-height: 40px;
    
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #000000;
  }
`;

const ImgBox = styled.div`
  margin-right: 10px;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  background: #5200FF;
  border-radius: 100%;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 14px;
    height: 14px;
  }
`


const ProposalListContent = styled.div``;

const ProposalBox = styled.div`
  padding: 0 15px;
`;
