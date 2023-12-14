const fs = require("fs");
const config = require("dotenv").config;
config();

const DEFAULT = {
  short_name: "SeeDAO",
  name: "SeeDAO",
  icons: [
    {
      src: "icon76.png",
      sizes: "76x76",
      type: "image/png",
    },
    {
      src: "icon192.png",
      sizes: "192x192",
      type: "image/png",
    },
  ],
  start_url: ".",
  display: "standalone",
  permissions: ["clipboard-write"],
  theme_color: "#ffffff",
  background_color: "#ffffff",
};

const PREVIEW = {
  short_name: "SeeDAO",
  name: "SeeDAO",
  icons: [
    {
      src: "icon76_preview.png",
      sizes: "76x76",
      type: "image/png",
    },
    {
      src: "icon192_preview.png",
      sizes: "192x192",
      type: "image/png",
    },
  ],
  start_url: ".",
  display: "standalone",
  permissions: ["clipboard-write"],
  theme_color: "#ffffff",
  background_color: "#ffffff",
};

const getManifest = () => {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case "preview":
      return PREVIEW;
    default:
      return DEFAULT;
  }
};

const manifest = getManifest();

fs.writeFileSync("./public/manifest.json", JSON.stringify(manifest));
