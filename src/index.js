import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import VConsole from "vconsole";
import { unregister, register } from "utils/serviceWorkerRegistration";
import "utils/tracing";

process.env.NODE_ENV === "development" && new VConsole();

const appHeight = () => document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
window.addEventListener("resize", appHeight);
appHeight();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

unregister(register);
