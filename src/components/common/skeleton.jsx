import styled from "styled-components";

const Skeleton = styled.div`
  /* TODO animation */
  background-color: var(--background-color);
`;

export const RectangularSkeleton = styled(Skeleton)`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border-radius: ${(props) => props.radius || "4px"};
`;
