import ProposalCard from "components/proposal/proposalCard";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getProposalDetail } from "api/proposal";
import store from "store";
import { saveLoading } from "store/reducer";
import { useProjectContext } from "./provider";
import NoItem from "components/noItem";

export default function ProjectProposal() {
  const {
    state: { id, data },
  } = useProjectContext();
  const [list, setList] = useState([]);

  useEffect(() => {
    const getProposals = async (ids) => {
      const reqs = ids.map((pid) => getProposalDetail(Number(pid)));
      store.dispatch(saveLoading(true));

      try {
        const resList = await Promise.allSettled(reqs);
        const _list = [];
        resList.forEach((res) => {
          if (res.status === "fulfilled") {
            const thread = res.value.data.thread;
            thread && _list.push(thread);
          }
        });
        setList(_list);
      } catch (error) {
        logError("get proposals error: ", error);
      } finally {
        store.dispatch(saveLoading(false));
      }
    };
    if (data?.proposals) {
      getProposals(data?.proposals);
    }
  }, [id, data]);
  return (
    <ProposalList>
      {list.map((item) => (
        <ProposalCard key={item.id} data={item} />
      ))}
      {!list.length && <NoItem />}
    </ProposalList>
  );
}

const ProposalList = styled.div`
    padding-inline: 20px;
`;
