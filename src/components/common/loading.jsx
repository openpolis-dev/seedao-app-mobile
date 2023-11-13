
import styled from "styled-components";

export default function Loading() {
  return (
    <LoadingBox>
        <div>loading</div>
    </LoadingBox>
  );
}

const LoadingBox = styled.div`
  text-align: center;
  padding-block: 10px;
`;
