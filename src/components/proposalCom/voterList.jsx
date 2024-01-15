import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState, useEffect } from "react";
import useToast from "hooks/useToast";
import useQuerySNS from "hooks/useQuerySNS";
import { getVotersOfOption } from "api/proposalV2";
import InfiniteScroll from "react-infinite-scroll-component";
import store from "store";
import { saveLoading } from "store/reducer";
import { useSelector } from "react-redux";
import publicJs from "utils/publicJs";
import Avatar from "components/common/avatar";

const UserBox = ({ name, avatar }) => {
  return (
    <UserBoxStyle>
      <Avatar src={avatar} alt="" size="30px" />
      <span className="name">{name}</span>
    </UserBoxStyle>
  );
};

export default function VoterListModal({ optionId, count, onClose }) {
  const { t } = useTranslation();
  const snsMap = useSelector((state) => state.snsMap);

  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);

  const hasMore = list.length < 20;
  const { toast } = useToast();
  const { getMultiSNS } = useQuerySNS();

  const getList = () => {
    store.dispatch(saveLoading(true));
    getVotersOfOption(optionId, page)
      .then((res) => {
        setList([...list, ...res.data]);
        setPage((p) => p + 1);
        getMultiSNS(Array.from(new Set(res.data.map((item) => item.wallet))));
      })
      .catch((err) => {
        toast.danger(err);
      })
      .finally(() => {
        store.dispatch(saveLoading(false));
      });
  };

  useEffect(() => {
    getList();
  }, [optionId]);

  const formatSNS = (wallet) => {
    const name = snsMap[wallet] || wallet;
    return name?.endsWith(".seedao") ? name : publicJs.AddressToShow(name, 4);
  };

  return (
    <Modal>
      <ModalMask onClick={onClose} />
      <ModalContent>
        <Title>{t("Proposal.TotalVoteCount", { count })}</Title>
        <List id="voter-modal">
          <InfiniteScroll
            scrollableTarget="voter-modal"
            dataLength={list.length}
            next={getList}
            hasMore={hasMore}
            loader={<></>}
          >
            {list.map((item, index) => (
              <li key={index}>
                <UserBox name={formatSNS(item.wallet?.toLocaleLowerCase())} avatar={item.os_avatar} />
                <span>1</span>
              </li>
            ))}
          </InfiniteScroll>
        </List>
      </ModalContent>
    </Modal>
  );
}

const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
`;

const ModalMask = styled.div`
  position: absolute;
  background: rgba(244, 244, 248, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const ModalContent = styled.div`
  background-color: var(--background-color-1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 24px;
  padding-inline: 32px;
  padding-bottom: 29px;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-family: "Poppins-SemiBold";
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
`;

const List = styled.ul`
  height: 30vh;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
`;

const UserBoxStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  .name {
    font-size: 14px;
    font-family: "Poppins-SemiBold";
  }
`;
