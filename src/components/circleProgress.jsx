import * as React from "react";
import styled from "styled-components";

const CircleSVG = (props) => (
  <svg
    className="circle-container"
    // viewBox="2 -2 28 36"
    width={160}
    height={160}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle className="circle-container__background" r={74} cx={80} cy={80} />
    <circle className="circle-container__progress" r={74} cx={80} cy={80} />
  </svg>
);

export default function CircleProgress({ color, progress }) {
  return (
    <CircleProgressStyled color={color} progress={(465 * (100 - progress)) / 100}>
      <CircleSVG />
    </CircleProgressStyled>
  );
}

const CircleProgressStyled = styled.div`
  .circle-container {
    transform: rotate(-90deg);
  }

  .circle-container__background {
    fill: none;
    stroke: rgba(218, 211, 255, 0.9);
    stroke-width: 12px;
  }

  .circle-container__progress {
    fill: none;
    stroke-linecap: round;
    stroke: ${(props) => (props.progress === 465 ? "unset" : props.color || "var(--bs-primary)")};
    stroke-dasharray: 465; // means circle total length pi * 2 * r
    stroke-linecap: round;
    stroke-width: 12px;
    stroke-dashoffset: ${(props) => props.progress || 0};
  }
`;
