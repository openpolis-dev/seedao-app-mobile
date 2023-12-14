import styled from "styled-components";
import LoadingIcon from "assets/Imgs/loading.png";

export default function Loading() {
  return (
    <LoadingBox>
      <img src={LoadingIcon} alt="" />
    </LoadingBox>
  );
}

const LoadingBox = styled.div`
  text-align: center;
  img {
    width: 20px;
    user-select: none;
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
