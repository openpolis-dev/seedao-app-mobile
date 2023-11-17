import * as React from "react";
const SvgComponent = ({ color, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <path
      stroke={color || "var(--font-color)"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m15.044 18.5-6-6 6-6"
    />
  </svg>
);
export default SvgComponent;
