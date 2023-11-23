import { createGlobalStyle } from "styled-components";
import "../assets/styles/font.css";
import "../assets/styles/custom_variable.scss";

const GlobalStyle = createGlobalStyle`
  body,html{
    color: var(--font-color);
    padding: 0;
    margin: 0;
    overscroll-behavior: none;
    
  }
  body.over-hidden {
    overflow: hidden;
  }
  #root {
    height: var(--app-height);
  }
  dl,dt,ul,li{
    padding: 0;
    margin: 0;
    
  }
  li {
    list-style: none;
  }
  * {
    font-family: "Poppins-Regular",-apple-system,BlinkMacSystemFont,
    "Segoe UI",Roboto,"Helvetica Neue",
    Arial,sans-serif,"Apple Color Emoji",
    "Segoe UI Emoji","Segoe UI Symbol" ;
    padding: 0;
    margin: 0;
    &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
    &:focus{
      outline: none;
    }
    &:focus-visible{
      outline: none!important;
    }
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
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;

export default GlobalStyle;
