import Layout from "../../components/layout/layout";
import useQuerySNS from "../../hooks/useQuerySNS";
import styled from "styled-components";
import React, {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import useToast from "hooks/useToast";

import publicJs from "../../utils/publicJs";
import {getSeeList} from "../../api/see";
import dayjs from "dayjs";
import store from "../../store";
import {saveLoading} from "../../store/reducer";


const CardBox = styled.div`
  min-height: 100%;
  padding: 0 20px;
    .amount{
        color:var( --primary-color)
    }
`;

const UlBox = styled.ul`
    font-size: 12px;
background: var(--background-color-2);
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
  dl {
    display: flex;
    align-items: center;
    justify-content: space-between;
      padding: 5px 0;
    dt {
      color: #9a9a9a;
    }
  }
    .flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
`;

export default function Record() {
    const [pageCur, setPageCur] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(1);
    const [list, setList] = useState([]);
    const { t } = useTranslation();
    const [snsMap, setSnsMap] = useState(new Map());
    const { Toast, toast, showToast } = useToast();


    // const hasMore = useMemo(() => {
    //     console.log(list.length,total,list.length < total)
    //     return list.length < total;
    // }, [total, list]);

    const { getMultiSNS } = useQuerySNS();

    useEffect(() => {
        getList();
    }, [pageCur]);

    const handleSNS = async (wallets) => {
        try{
            const sns_map = await getMultiSNS(wallets);
            setSnsMap(sns_map);
            console.log(sns_map);
        }catch(error){
            toast.danger(`${error?.data?.msg || error?.code || error}`);
        }

    };
    const getList= async() =>{
        try {
              store.dispatch(saveLoading(true));
            const obj = {
                page: pageCur,
                size: pageSize,
            };

            const rt = await getSeeList(obj);
            console.log(rt);


            const { rows, page, size, total } = rt.data;

            const _wallets = new Set();
            rt.data.rows.forEach((r) => {
                _wallets.add(r.from_user?.toLowerCase());
                _wallets.add(r.to_user?.toLowerCase());
            });

            let arr = [...list,...rows];
            handleSNS(Array.from(_wallets));
            setList(arr);
            setPageSize(size);
            setTotal(total);
            if(arr.length <total){
                setPageCur(page + 1);
            }

        } catch(error) {
          console.error(error)
            toast.danger(`${error?.data?.msg || error?.code || error}`);
        }finally {
            store.dispatch(saveLoading(false));
        }

    }




    // const handlePage = (num) => {
    //     setPageCur(num + 1);
    // };

    const fromSns =(wallet) => {
        const name = snsMap[wallet?.toLowerCase()] || wallet;
        return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
    };

    return<Layout
            noTab
            title={t("see.record")}
        >
            <CardBox  id="inner">
                <InfiniteScroll
                    scrollableTarget="inner"
                    dataLength={list.length}
                    next={getList}
                    hasMore={list.length < total}
                    loader={<></>}
                >

                {
                    list.map((item,index) =>( <UlBox key={index}>
                        <div className="flex">
                            <div className="amount">{fromSns(item.amount)} SEE</div>
                            <div>{dayjs(item.transaction_ts * 1000).format(`YYYY-MM-DD HH:mm:ss`)}</div>
                        </div>
                            <dl>
                                <dt>
                                    {t('see.from')}
                                </dt>
                                <dd>{fromSns(item.from_user)}</dd>
                            </dl>
                        <dl>
                            <dt>
                                {t('see.to')}
                            </dt>
                            <dd>{fromSns(item.to_user)}</dd>
                        </dl>



                        <dl>
                            <dd>{item.comment}</dd>
                        </dl>

                        </UlBox>)
                    )
                }
                </InfiniteScroll>
            </CardBox>
            {Toast}
        </Layout>

}


