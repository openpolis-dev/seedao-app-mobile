import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useProjectContext } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import { useEffect, useMemo, useState } from "react";
import { getUsers } from "api/user";
import UserList from "components/userList";
import { useParseSNSList } from "hooks/useParseSNS";
import UserModal from "components/userModal";

export default function ProjectMember() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useProjectContext();
  const [userMap, setUserMap] = useState({});
  const [members, setMembers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [user, setUser] = useState();

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set([...members, ...sponsors]));
  }, [members, sponsors]);

  const nameMap = useParseSNSList(uniqueUsers);

  const getUsersInfo = async (wallets) => {
    if (!wallets.length) {
      return;
    }
    store.dispatch(saveLoading(true));

    try {
      const res = await getUsers(wallets);
      const userData = {};
      res.data.forEach((r) => {
        userData[r.wallet || ""] = r;
      });
      sponsors.map((item)=>{
        userData[item].title= t("Guild.Moderator");
      })
      setUserMap(userData);
    } catch (error) {
      console.error("getUsersInfo error:", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };
  const { memberUsers, sponsorUsers } = useMemo(() => {
    return {
      memberUsers: members.map((m) => userMap[m]),
      sponsorUsers: sponsors.map((s) => userMap[s]),
    };
  }, [userMap, members, sponsors]);

  useEffect(() => {
    const members = data?.members || [];
    const sponsors = data?.sponsors || [];
    setMembers(members.map((m) => m.toLowerCase()));
    setSponsors(sponsors.map((m) => m.toLowerCase()));
    getUsersInfo(Array.from(new Set([...members, ...sponsors])));
  }, [data]);
  const showUser = (u) => {
    setUser(u);
  };
  return (
    <MemberContent>
      {user && <UserModal user={{ ...user, sns: nameMap[user?.wallet] }} handleClose={() => setUser(undefined)} />}
      <UserList data={[...sponsorUsers, ...memberUsers]} nameMap={nameMap} onChooseUser={showUser} />
    </MemberContent>
  );
}

const MemberContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
`;
