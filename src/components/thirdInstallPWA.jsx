import { useEffect } from "react";
import styled from "styled-components";

import "@khmyznikov/pwa-install";

export default function InstallCheck() {
  useEffect(() => {
    const tag = document.querySelector("pwa-install");
    if (tag) {
      tag.showDialog();
    }
  }, []);

  return (
    <InstallPage>
      <pwa-install
        manual-apple="true"
        manual-chrome="true"
        disable-install-description="true"
        name="SeeDAO"
        icon="/icon192.png"
      ></pwa-install>
    </InstallPage>
  );
}

const InstallPage = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`
