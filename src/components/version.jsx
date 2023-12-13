import { useTranslation } from "react-i18next";
import styled from "styled-components";
import getConfig from "constant/envCofnig";

export default function VersionBox({ isShort, ...props }) {
  const { t } = useTranslation();
  return (
    <VersionStyle {...props}>
      {!isShort && t("General.Version")} {getConfig().REACT_APP_APP_VERSION} {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.
      {process.env.REACT_APP_COMMIT_REF?.slice(0, 6)}
    </VersionStyle>
  );
}

const VersionStyle = styled.div`
  text-align: center;
  font-size: 12px;
  color: var(--font-light-color);
  margin-top: 20px;
`;