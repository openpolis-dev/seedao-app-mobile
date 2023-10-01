import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/layout";
import styled from "styled-components";
import { ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { PROPOSAL_CATEGORIES } from "utils/constant";
import { useState, useEffect } from "react";
import ProposalSubNav from "components/poposal/proposalSubNav";
import ProposalCard from "components/poposal/proposalCard";
import { getAllProposals } from "api/proposal";
import InfiniteScroll from "react-infinite-scroll-component";
import MsgIcon from "assets/images/proposal/message.png";
import store from "store";
import { saveLoading } from "store/reducer";

export default function Proposal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState([]);
  const [orderType, setOrderType] = useState("latest");
  const [activeTab, setActiveTab] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const handleChangeOrder = (index) => {
    setPage(1);
    setProposals([]);
    setOrderType(index === 0 ? "latest" : "old");
  };

  const getProposals = async () => {
    store.dispatch(saveLoading(true));
    try {
      const resp = await getAllProposals({ page, per_page: pageSize, sort: orderType });
      setProposals([...proposals, ...resp.data.threads]);
      setPage(page + 1);
      setHasMore(resp.data.threads.length >= pageSize);
    } catch (error) {
      console.error("getAllProposals failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      getProposals();
    }
  }, [activeTab, orderType]);
  return (
    <Layout title={t("menus.Proposal")} noTab>
      <TabMenu>
        <li onClick={() => setActiveTab(0)} className={activeTab === 0 ? "selected" : ""}>
          {t("Proposal.AllCategories")}
        </li>
        <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "selected" : ""}>
          {t("Proposal.TheNeweset")}
        </li>
      </TabMenu>
      <Content>
        {activeTab === 0 && (
          <CategoryContent>
            {PROPOSAL_CATEGORIES[0].children.map((item) => (
              <li key={item.id} onClick={() => navigate(`/proposal/category/${item.category_id}`)}>
                <div>
                  <img src={MsgIcon} alt="" className="msg" />
                  <span>{item.name}</span>
                </div>
                <span>
                  <ChevronRight />
                </span>
              </li>
            ))}
          </CategoryContent>
        )}
        {activeTab === 1 && (
          <ProposalListContent>
            <ProposalSubNav onSelect={handleChangeOrder} value={orderType === "latest" ? 0 : 1} />
            <InfiniteScroll
              dataLength={proposals.length}
              next={getProposals}
              hasMore={hasMore}
              loader={<></>}
              height={400}
              style={{ height: "calc(100vh - 150px)" }}
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

const Content = styled.div``;

const CategoryContent = styled.ul`
  li {
    padding-inline: 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    height: 60px;
    margin-bottom: 10px;
    line-height: 60px;
    img.msg {
      width: 30px;
      margin-right: 6px;
    }
  }
`;

const ProposalListContent = styled.div``;

const ProposalBox = styled.div`
  padding: 0 15px 15px;
`;
