
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Box = styled.div`
    border-top: 1px solid rgba(217, 217, 217, 0.5);
`



const LineBox = styled.div`
  margin:40px 20px;
  padding:24px;
    background: #f2f4f5;
    border-radius: 20px;
    box-sizing: border-box;
  
  .title{

    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
  .content{
    &>dl{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 10px;
      &>dt{
        color: rgba(156, 164, 171, 0.80);

        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .colLine{
      flex-direction: column;
      align-items: flex-start;
      &>dt{
        padding-bottom: 10px;
      }
    }
  }
  a{
    color: var(--primary-color);
  }
  .contentBtm{
    border-bottom: 0;
    font-size: 14px;
    color: rgba(156, 164, 171, 0.80);
  }
  .intro{
    width: 100%;
  }

`

export default function Budget({ id }) {
    const { t } = useTranslation();
    const [data, setData] = useState();



    return (
        <Box>

            <LineBox>
                <div className="title">
                    <span>当前可申请资产</span>
                    <span>10000 SCR, 1000 USDT</span>
                </div>
                <div className="content">
                    <dl>
                        <dt>项目预算</dt>
                        <dd>10000 SCR, 1000 USDT</dd>
                    </dl>
                    <dl>
                        <dt>预付比例</dt>
                        <dd>50%</dd>
                    </dl>
                    <dl>
                        <dt>可预支数额</dt>
                        <dd>10000 SCR, 1000 USDT</dd>
                    </dl>
                    <dl>
                        <dt>当前已预支</dt>
                        <dd>10000 SCR, 1000 USDT</dd>
                    </dl>
                    <dl>
                        <dt>预算余额</dt>
                        <dd>10000 SCR, 1000 USDT</dd>
                    </dl>
                    <dl>
                        <dt>可预支余额</dt>
                        <dd>10000 SCR, 1000 USDT</dd>
                    </dl>
                </div>
            </LineBox>


        </Box>
    );
}
