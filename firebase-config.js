// import fs from 'fs';
// import { config } from 'dotenv';
const fs = require("fs");
const config = require("dotenv").config;
config();

const firebaseConfigDevelopment = {
  apiKey: "AIzaSyCuXK4qOcVPZHwen8YJ_xiBNYzM5K8VgtY",
  authDomain: "test-pwa-12448.firebaseapp.com",
  projectId: "test-pwa-12448",
  storageBucket: "test-pwa-12448.appspot.com",
  messagingSenderId: "134621359161",
  appId: "1:134621359161:web:5ef9ef4afa8e3aafcb71e8",
};

const firebaseConfigProduction = {
  apiKey: "AIzaSyCYOyrZygGOS4UYTpfYi87CQFWvO_V123U",
  authDomain: "seedao-os-superapp.firebaseapp.com",
  projectId: "seedao-os-superapp",
  storageBucket: "seedao-os-superapp.appspot.com",
  messagingSenderId: "411381765654",
  appId: "1:411381765654:web:7e5f52d3c303937d948737",
};

const firebaseConfig =
  process.env.REACT_APP_ENV_VERSION === "prod" ? firebaseConfigProduction : firebaseConfigDevelopment;

fs.writeFileSync("./public/firebase-env.js", `const firebaseConfig = ${JSON.stringify(firebaseConfig)}`);
fs.writeFileSync("./src/firebase-env.js", `export const firebaseConfig = ${JSON.stringify(firebaseConfig)}`);
