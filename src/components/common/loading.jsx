import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";

export default function Loading() {
  return (
    <LoadingBox>
      <Spinner animation="border" variant="primary" size="sm" />
    </LoadingBox>
  );
}

const LoadingBox = styled.div`
  text-align: center;
  padding-block: 10px;
`;
