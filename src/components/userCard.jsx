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
      <UserRight className="right">
        <div className="user-container">
          <Rect width="100px" />
          <Rect width="150px" />
          <Rect />
        </div>
      </UserRight>
    </UserCardBox>
  );
};

export default function UserCard({ user }) {
  if (!user) {
    return <EmptyUserCard />;
  }
  return (
    <UserCardBox>
      <div className="left">
        <Avatar src={user.avatar} />
      </div>
      <UserRight className="right">
        <div className="user-container">
          {/* name */}
          {user.name && <div className="name">{user.name}</div>}
          {/* social */}
          <SocialBox>
            {user.twitter_profile && (
              <a href={user.twitter_profile} target="_blank" rel="noreferrer">
                <img src={TwitterIcon} alt="" className="icon" />
              </a>
            )}
            {user.discord_profile && (
              <CopyBox text={user.discord_profile || ""} dir="right">
                <img src={DiscordIcon} alt="" className="icon" />
              </CopyBox>
            )}
            {user.email && (
              <CopyBox text={user.email || ""}>
                <img src={EmailIcon} alt="" className="icon" />
              </CopyBox>
            )}
          </SocialBox>
          {/* wallet */}
          <WalletBox>
            <div className="wallet">{user.wallet}</div>
            <CopyBox text={user.wallet || ""} dir="left" />
          </WalletBox>
        </div>
      </UserRight>
    </UserCardBox>
  );
}

const UserCardBox = styled.div`
  width: 100%;
  height: 140px;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  
`;

const EmptyAvatar = styled.div`
  width: 58px;
  height: 58px;
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
  width: calc(100% - 108px);
  flex: 1;
  .user-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .name {
      font-weight: 600;
    }
    .icon {
      width: 30px;
    }
  }
`;

const SocialBox = styled.div`
  display: flex;
  gap: 6px;
`;
const WalletBox = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  .wallet {
    width: calc(100% - 40px);
    word-wrap: break-word;
    line-height: 20px;
  }
 
`;
