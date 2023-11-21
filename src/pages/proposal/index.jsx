import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/layout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getCategories } from "api/proposal";
import MsgIcon from "assets/Imgs/msg.png";
import store from "store";
import { saveLoading } from "store/reducer";
import { useSelector } from "react-redux";
import { saveProposalCategories } from "store/reducer";
import { Link } from "react-router-dom";
import ArrowIcon from "assets/Imgs/arrow_top.svg";

export default function Proposal() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const proposalCategories = useSelector((state) => state.proposalCategories);

  useEffect(() => {
    getCategoriesAPi();
  }, []);

  const getCategoriesAPi = async () => {
    try {
      store.dispatch(saveLoading(true));
      const resp = await getCategories();
      console.log(resp?.data.group.categories);
      let arr = resp?.data.group.categories.map((item) => ({ ...item, statusShow: true }));
      store.dispatch(saveProposalCategories(arr));
    } catch (error) {
      console.error("getCategories failed", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const handleShow = (index) => {
    let arr = JSON.parse(JSON.stringify(list));
    console.log(arr[index]);
    arr[index].statusShow = !arr[index].statusShow;
    setList(arr);
  };

  useEffect(() => {
    setList(proposalCategories.map((item) => ({ ...item, statusShow: true })));
  }, [proposalCategories]);

  return (
    <Layout title={t("Proposal.Governance")} headBgColor={`var(--background-color)`} bgColor="var(--background-color)">
      <Content>
        {list.map((category, index) => (
          <CategoryCard key={index}>
            <div className="cate-name" onClick={() => handleShow(index)}>
              <Link to={`/proposal/category/${category.category_id}`} state={category.name}>
                {category.name}
              </Link>
              {!!category.children.length && (
                <img src={ArrowIcon} alt="" className={category.statusShow ? "" : "arrowRht"} />
              )}
            </div>
            {!!category.children.length && category.statusShow && (
              <SubCategoryCard>
                {category.children.map((subCategory) => (
                  <Link
                    to={`/proposal/category/${subCategory.category_id}`}
                    key={subCategory.category_id}
                    state={subCategory.name}
                  >
                    <SubCategoryItem>
                      <ImgBox>
                        <img src={MsgIcon} alt="" width="24px" height="24px" />
                      </ImgBox>

                      <div>
                        <div className="name">{subCategory.name}</div>
                        <div className="tips">
                          <span>
                            {subCategory.thread_count} {t("Proposal.Topics")}
                          </span>
                        </div>
                      </div>
                    </SubCategoryItem>
                  </Link>
                ))}
              </SubCategoryCard>
            )}
          </CategoryCard>
        ))}
      </Content>
    </Layout>
  );
}

const Content = styled.div`
  padding: 15px 20px 14px;
  background: var(--background-color);
`;

const SubCategoryCard = styled.div`
  border-top: 1px solid var(--border-color-1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: stretch;
  padding: 10px 6px;
  a {
    display: block;
    width: 50%;
  }
`;

const SubCategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding-block: 8px;
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
  .tips {
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    color: var(--font-light-color);
  }
`;

const CategoryCard = styled.div`
  border-radius: 16px;
  background: var(--background-color-1);
  padding-inline: 14px;
  margin-bottom: 17px;
  .cate-name {
    line-height: 44px;
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: #000000;
    display: flex;
    justify-content: space-between;
  }
  .arrowRht {
    transform: rotate(180deg);
  }
`;

const ImgBox = styled.div`
  margin-right: 10px;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  background: #5200ff;
  border-radius: 100%;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 14px;
    height: 14px;
  }
`;
