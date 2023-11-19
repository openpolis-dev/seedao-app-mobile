import React from "react";
import CopyBox from "components/common/copy";
import styled from "styled-components";
import TwitterIcon from "assets/images/user/twitter.svg";
import DiscordIcon from "assets/images/user/discord.svg";
import EmailIcon from "assets/images/user/email.svg";
import Avatar from "components/common/avatar";

const EmptyUserCard = () => {
  return (
    <UserCardBox>
      <div className="left">
        <EmptyAvatar />
      </div>
      <UserRight>
          <Rect width="100%" /><Rect />
      </UserRight>
    </UserCardBox>
  );
};

export default function UserCard({ user, sns, onChooseUser }) {
  if (!user) {
    return <EmptyUserCard />;
  }
  return (
    <UserCardBox>
      <div className="left">
        <Avatar src={user.avatar} onClick={onChooseUser} />
      </div>
      <UserRight>{(user.wallet || sns) && <>{sns || user.wallet}</>}</UserRight>
        {
           !! user.title &&  <TagBox>{user.title}</TagBox>
        }

    </UserCardBox>
  );
}

const UserCardBox = styled.div`
  width: 33.3333%;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:last-child {
    margin-right: auto;
  }
`;

const EmptyAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ddd;
`;

const Rect = styled.div`
  width: ${(props) => props.width || "100%"};
  height: 18px;
  border-radius: 18px;
  background-color: #ddd;
`;

const UserRight = styled.div`
  text-align: center;
  margin-top: 4px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
`;

const TagBox = styled.div`
  background: #2DC45E;
  border-radius: 21px;
  padding: 2px 8px;
  color: #fff;
  font-size: 10px;
  margin-top: 6px;
`
