import * as React from "react";
const SvgComponent = ({ isSelected, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={8} height={5} fill="none" {...props}>
    <path
      stroke={isSelected ? "#9A9A9A" : "#D3D3D3"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1 1.167 3 3 3-3"
    />
  </svg>
);
export default SvgComponent;
