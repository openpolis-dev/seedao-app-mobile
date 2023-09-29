import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/layout";
import styled from "styled-components";
import { ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const PROPOSAL_CATEGORIES = [
  {
    category_id: 19,
    id: 2785,
    group_id: 4649,
    name: "3 层提案专区",
    thread_count: 0,
    post_count: 0,
    can_see: 1,
    children: [
      { category_id: 12, id: 2483, group_id: 4649, name: "P3 提案", thread_count: 0, post_count: 0, can_see: 1 },
      { category_id: 9, id: 2272, group_id: 4649, name: "P2 提案", thread_count: 0, post_count: 0, can_see: 1 },
      { category_id: 14, id: 2485, group_id: 4649, name: "P1 提案", thread_count: 0, post_count: 0, can_see: 1 },
    ],
  },
];

export default function Proposal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Layout title="Proposal">
      <TabMenu>
        <li>{t("Proposal.AllCategories")}</li>
        <li>{t("Proposal.TheNeweset")}</li>
      </TabMenu>
      <Content>
        {PROPOSAL_CATEGORIES[0].children.map((item) => (
          <li key={item.id} onClick={() => navigate(`/proposal/category/${item.category_id}`)}>
            <span>{item.name}</span>
            <span>
              <ChevronRight />
            </span>
          </li>
        ))}
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
  }
`;

const Content = styled.ul`
  li {
    padding-inline: 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    height: 60px;
    margin-bottom: 10px;
    line-height: 60px;
  }
`;
