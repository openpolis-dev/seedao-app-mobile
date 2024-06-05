
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getProposalDetail } from "api/proposalV2";
import store from "../../store";
import {saveLoading} from "../../store/reducer";

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
    const [detail, setDetail] = useState();

    useEffect(()=>{
        if(!id)return;
        getDetail()
    },[id])

    const getDetail = async() =>{
        store.dispatch(saveLoading(true));

        try{
            const  res = await getProposalDetail(
                Number(id)
            );



            const { associated_project_budgets: budgets } = res.data;

            let data = {};

            let total = [];
            let ratio = [];
            let paid = [];
            let remainAmount = [];
            let prepayTotal = [];
            let prepayRemain = [];

            budgets?.map((item) => {
                total.push(`${item.total_amount} ${item.asset_name}`);
                ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
                paid.push(`${item.used_advance_amount} ${item.asset_name}`);
                remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
                prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
                prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
            });

            data.total = total.join(',');
            data.ratio = ratio.join(',');
            data.paid = paid.join(',');
            data.remainAmount = remainAmount.join(',');
            data.prepayTotal = prepayTotal.join(',');
            data.prepayRemain = prepayRemain.join(',');

            setDetail(data);
        }catch (e) {
            console.error(e)
        }finally {
            store.dispatch(saveLoading(false));
        }


    }


    return (
        <Box>

            <LineBox>
                <div className="title">
                    <span>{t('Project.CurrentAvailable')}</span>
                    <span>{detail?.prepayRemain}</span>
                </div>
                <div className="content">
                    <dl>
                        <dt>{t('Project.projectBudget')}</dt>
                        <dd> {detail?.total}</dd>
                    </dl>
                    <dl>
                        <dt>{t('Project.PrepayRatio')}</dt>
                        <dd>{detail?.ratio}</dd>
                    </dl>
                    <dl>
                        <dt>{t('Project.AvailableAmount')}</dt>
                        <dd> {detail?.prepayTotal}</dd>
                    </dl>
                    <dl>
                        <dt>{t('Project.CurrentlyPrepaid')}</dt>
                        <dd>{detail?.paid}</dd>
                    </dl>
                    <dl>
                        <dt>{t('Project.BudgetBalance')}</dt>
                        <dd>{detail?.remainAmount}</dd>
                    </dl>
                    <dl>
                        <dt>{t('Project.AvailableBalance')}</dt>
                        <dd>{detail?.prepayRemain}</dd>
                    </dl>
                </div>
            </LineBox>


        </Box>
    );
}
