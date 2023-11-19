import styled from "styled-components";
import { useTranslation } from "react-i18next";
import EmptyIcon from "assets/Imgs/empty.svg";

const Box = styled.div`
  flex: 1;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .sizeTop {
    font-size: 30px;
    margin-bottom: 12px;
  }
`;
export default function NoItem() {
  const { t } = useTranslation();
  return (
    <Box>
      <div>
        <img src={EmptyIcon} alt="" className="sizeTop" />
      </div>
      <div>{t("General.Empty")}</div>
    </Box>
  );
}
