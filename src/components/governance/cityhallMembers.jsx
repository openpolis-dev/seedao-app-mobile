import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { MultiLineStyle } from "assets/styles/common";
import { getCityHallDetail } from "api/cityhall";
import { getUsers } from "api/user";
import publicJs from "utils/publicJs";
import useQuerySNS from "hooks/useQuerySNS";
import { useSelector } from "react-redux";
import UserModal from "components/userModal";
import Avatar from "components/common/avatar";

const MemberAvatar = ({ user, onSelect }) => {
  return (
    <MemberAvatarStyle line={1}>
      <AvatarBox onClick={onSelect}>
        <Avatar src={user.avatar}/>
      </AvatarBox>
      <div className="sns">{user.sns}</div>
      <div className="name">{user.name}</div>
    </MemberAvatarStyle>
  );
};

const GroupItem = ({ name, members }) => {
  const [user, setUser] = useState();
  return (
    <GroupItemStyle>
      {user && <UserModal user={user} handleClose={() => setUser(undefined)} />}
      <GroupName>{name}</GroupName>
      <GroupMembers>
        {members.map((item, i) => (
          <MemberAvatar key={i} user={item} onSelect={() => setUser(item)} />
        ))}
      </GroupMembers>
    </GroupItemStyle>
  );
};

export default function CityhallMembers() {
  const { t } = useTranslation();
  const [cityhallMembers, setCityhallMembers] = useState({});

  const [userMap, setUserMap] = useState({});
  const snsMap = useSelector((state) => state.snsMap);

  const { getMultiSNS } = useQuerySNS();

  const handleMembers = (members) => {
    return members.map((w) => {
      const user = userMap[w.toLowerCase()];
      if (user) {
        return {
          ...user,
          sns: snsMap[w.toLowerCase()] || w.toLowerCase(),
        };
      } else {
        return { sns: w.toLowerCase() };
      }
    });
  };

  const [govMembers, brandMembers, techMembers] = useMemo(() => {
    return [
      handleMembers(cityhallMembers.G_GOVERNANCE || []),
      handleMembers(cityhallMembers.G_BRANDING || []),
      handleMembers(cityhallMembers.G_TECH || []),
    ];
  }, [cityhallMembers, userMap, snsMap]);

  const getUsersInfo = async (wallets) => {
    try {
      const res = await getUsers(wallets);
      const userData = {};
      res.data.forEach((r) => {
        userData[(r.wallet || "").toLowerCase()] = r;
      });
      setUserMap(userData);
    } catch (error) {
      console.error("getUsersInfo error:", error);
    }
  };

  useEffect(() => {
    const getCityhallMembers = async () => {
      try {
        const res = await getCityHallDetail();
        setCityhallMembers(res.data.grouped_sponsors);

        const _wallets = [];
        Object.keys(res.data.grouped_sponsors).forEach((key) => {
          _wallets.push(...res.data.grouped_sponsors[key]);
        });
        const wallets = Array.from(new Set(_wallets));
        getUsersInfo(wallets);
        getMultiSNS(wallets);
      } catch (error) {
        console.error(error);
      }
    };
    getCityhallMembers();
  }, []);
  return (
    <>
      <CityhallTitle>{t("Governance.Cityhall", { season: "S4" })}</CityhallTitle>
      <GroupItem name={t("Governance.CityhallGovernance")} members={govMembers} />
      <GroupItem name={t("Governance.CityhallBranding")} members={brandMembers} />
      <GroupItem name={t("Governance.CityhallTech")} members={techMembers} />
    </>
  );
}

const CityhallTitle = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  line-height: 22px;
`;

const GroupItemStyle = styled.div`
  margin-top: 16px;
`;

const GroupName = styled.div`
  font-size: 13px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--font-light-color);
  line-height: 17px;
  margin-bottom: 10px;
`;

const GroupMembers = styled.div`
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  display: flex;
  padding-block: 15px;
  gap: 10px;
  flex-wrap: wrap;
  & > div {
    width: 30%;
  }
`;

const MemberAvatarStyle = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  align-items: center;
  text-align: center;

  .sns {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 4px;
    line-height: 21px;
    color: var(--font-color-1);
    box-sizing: border-box;
    padding: 0 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .name {
    width: 100%;
    box-sizing: border-box;
    color: #9a9a9a;
    padding: 0 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AvatarBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`;
