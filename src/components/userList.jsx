import UserCard from "./userCard";

export default function UserList({ data }) {
  if (!data) {
    return <></>;
  }
  return data.map((user, i) => <UserCard user={user} key={i} />);
}
