import { useEffect } from "react";

import "@khmyznikov/pwa-install";

export default function InstallCheck() {
  useEffect(() => {
    const tag = document.querySelector("pwa-install");
    if (tag) {
      tag.showDialog(true);
    }
  }, []);

  return (
    <pwa-install
      manual-apple="true"
      manual-chrome="true"
      disable-install-description="true"
      name="SeeDAO"
      icon="/icon192.png"
    ></pwa-install>
  );
}
