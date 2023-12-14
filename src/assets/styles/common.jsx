import { css } from "styled-components";

export const MultiLineStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.line || 1};
  -webkit-box-orient: vertical;
`;
