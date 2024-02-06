import React from "react";
import styled from "styled-components";
import Avatar from "components/common/avatar";
import PublicJs from "../utils/publicJs";

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
        <Avatar src={user.avatar|| user.sp?.avatar} size="30px" onClick={onChooseUser} />
      </div>
      <UserRight>{(user.wallet || sns) && <>{sns || PublicJs.AddressToShow(user.wallet)}</>}</UserRight>
        {/*{*/}
        {/*   !! user.title &&  <TagBox>{user.title}</TagBox>*/}
        {/*}*/}

    </UserCardBox>
  );
}

const UserCardBox = styled.div`
  box-sizing: border-box;
  display: flex;
margin: 5px 0;
  align-items: center;
  justify-content: center;
    width: 100%;
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
