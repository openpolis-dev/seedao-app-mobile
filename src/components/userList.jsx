import UserCard from "./userCard";

export default function UserList({ data }) {
  if (!data) {
    return <></>;
  }
  console.log("list:", data)
  return data.map((user, i) => <UserCard user={user} key={i} />);
}
