import React from 'react';
import styled, { css } from 'styled-components';


export default function CreditButton({ children, ...props }) {
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
}

const BasicButtonStyle = css`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
`;

const ButtonStyle = styled.button`
  ${BasicButtonStyle};
  background: #1814f3;
  font-family: "Inter-Medium";
  font-weight: 500;
  color: #fff;
  &:disabled {
    background: #7c7c96;
    cursor: not-allowed;
  }
`;
