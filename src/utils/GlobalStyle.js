import { createGlobalStyle } from "styled-components";
import "../assets/styles/font.css";

const GlobalStyle = createGlobalStyle`
  body,html{
    background: #f0f3f8;
    color: #000;
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

  }
`;

export default GlobalStyle;
