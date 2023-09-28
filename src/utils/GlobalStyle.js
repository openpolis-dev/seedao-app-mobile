import { createGlobalStyle } from "styled-components";
import "../assets/styles/font.css";

const GlobalStyle = createGlobalStyle`
  body,html{
    background: #f0f3f8;
    color: #000;
    padding: 0;
    margin: 0;
  }
  dl,dt,ul,li{
    padding: 0;
    margin: 0;
    
  }
  * {
    font-family: "Inter-Regular",-apple-system,BlinkMacSystemFont,
    "Segoe UI",Roboto,"Helvetica Neue",
    Arial,sans-serif,"Apple Color Emoji",
    "Segoe UI Emoji","Segoe UI Symbol" ;
    padding: 0;
    margin: 0;
  }
  a{
    text-decoration: none;
    color: #000;
  }
  .btn-primary{
    color:#fff;
    &:hover, &:focus-visible, &:active {
      color:#fff !important;
    }
    &:disabled{
      background-color: rgb(230, 228, 235);
      border-color: transparent;
      color: rgba(143, 155, 179, 0.48);
    }
  }
`;

export default GlobalStyle;
