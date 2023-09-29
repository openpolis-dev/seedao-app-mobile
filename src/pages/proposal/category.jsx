import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Layout from "components/layout/layout";
import ProposalCard from "components/poposal/proposalCard";
import { getProposalsBySubCategory } from "api/proposal";

export default function ProposalCategory() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState([]);
  const [orderType, setOrderType] = useState("new");
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const getProposals = async () => {
    const _id = Number(id);
    if (!_id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getProposalsBySubCategory({
        page,
        per_page: pageSize,
        category_index_id: _id,
        sort: orderType,
      });
      console.log("res:", res);
      setProposals([...proposals, ...res.data.threads]);
      setHasMore(res.data.threads.length >= pageSize);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id && getProposals();
  }, [id, orderType]);
  return (
    <Layout>
      <ProposalBox>
        {proposals.map((p) => (
          <ProposalCard key={p.id} data={p} />
        ))}
        {/* <ProposalCard /> */}
      </ProposalBox>
    </Layout>
  );
}

const ProposalBox = styled.div`
  padding: 15px;
  & > div {
    //margin-inline: 20px;
    /* margin: 20px; */
  }
`;
