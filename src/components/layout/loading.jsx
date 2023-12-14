import { useSelector } from "react-redux";
import LoadingBox from "components/common/loading";

export default function Loading() {
  const loading = useSelector((state) => state.loading);
  return loading ? <LoadingBox /> : <></>;
}
