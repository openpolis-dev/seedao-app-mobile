import styled from "styled-components";
import { useGuildContext } from "./provider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { formatNumber } from "utils/number";

export default function GuildBasic() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useGuildContext();

  const [token, setToken] = useState();
  const [points, setPoints] = useState();

  useEffect(() => {
    const getdata = () => {
      const _token = data?.budgets?.find((item) => item.name === "USDT");
      setToken(_token);
      const _point = data?.budgets?.find((item) => item.name === "SCR");
      setPoints(_point);
    };
    data && getdata();
  }, [data]);
  return (
    <>
      <ImgBlock>
        <div>{data?.logo && <img src={data.logo} alt="" />}</div>
      </ImgBlock>
      <ContentBlock>
        <div className="name">{t("Guild.ProjectName")}</div>
        <div className="content">{data?.name}</div>
      </ContentBlock>
      <ContentBlock>
        <div>
          <div className="name">{t("Guild.Budget")}</div>
        </div>
        <div className="content">
          <div>
            <p>
              <strong>{t("Guild.Points")}</strong>
              <span className="value">{formatNumber(points?.total_amount)}</span>
            </p>
            <div>
              (
              {t("Guild.HasBeenUsedAndRemains", {
                used: formatNumber(points?.used_amount || 0),
                remain: formatNumber(points?.remain_amount || 0),
              })}
              )
            </div>
          </div>
          <div>
            <p>
              <strong>USDT</strong>
              <span className="value">{formatNumber(token?.total_amount)}</span>
            </p>
            <div>
              (
              {t("Guild.HasBeenUsedAndRemains", {
                used: formatNumber(token?.used_amount || 0),
                remain: formatNumber(token?.remain_amount || 0),
              })}
              )
            </div>
          </div>
        </div>
      </ContentBlock>
    </>
  );
}

const Block = styled.section`
  margin-bottom: 15px;
`;

const ImgBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    width: 150px;
    height: 150px;
    background-color: #fff;
    border-radius: 6px;
    img {
      width: 100%;
    }
  }
`;

const ContentBlock = styled(Block)`
  background-color: #fff;
  margin-inline: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
  font-size: 14px;

  .name {
    padding: 5px;
    background-color: #f0f3f8;
    min-width: 100px;
    text-align: center;
    display: inline-block;
  }
  .content {
    padding: 5px;
    p {
      margin-bottom: 6px;
    }
    .value {
      margin-left: 10px;
    }
    & > div:first-child {
      margin-bottom: 10px;
    }
  }
`;
