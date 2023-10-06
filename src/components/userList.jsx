import UserCard from "./userCard";

export default function UserList({ data, nameMap }) {
  if (!data) {
    return <></>;
  }
  return data.map((user, i) => <UserCard user={user} key={i} sns={nameMap[user?.wallet]} />);
}
