import Layout from "../components/layout/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/common/loading";
import NoItem from "../components/noItem";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import React, {useEffect, useMemo, useState} from "react";
import {saveLoading, saveCache} from "../store/reducer";
import {publicList} from "../api/publicData";
import styled from "styled-components";
import {EventCardSkeleton} from "../components/event/eventCard";
import store from "../store";
import useCurrentPath from "../hooks/useCurrentPath";
import useToast from "../hooks/useToast";


const UlBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 24px;
  .libox {
    width: calc(50% - 7px);
    flex-shrink: 0;
  }
`;

const InnerBox = styled.ul`
  border-radius: 16px;
  box-sizing: border-box;
  height: 100%;

  .imgBox {
    width: 100%;
    height: 23vw;
    border-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }
  .btm {
    padding: 20px 0;
    font-size: 12px;
    box-sizing: border-box;
  }
  li {
    margin-bottom: 10px;
    &.line2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
`;

const Tit = styled.li`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
`;

const TagBox = styled.div`
  background: var(--bs-primary);
  display: inline-block;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;

  &.str1 {
    background: #b0b0b0;
  }
  &.str2 {
    background: var(--bs-primary);
  }
  &.str3 {
    background: #00a92f;
  }
`;

export default function PubList(){

    const navigate = useNavigate();
    const { t } = useTranslation();
    const loading = useSelector((state) => state.loading);

    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);

    const [pageCur, setPageCur] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const prevPath = useCurrentPath();
    const cache = useSelector(state => state.cache);
    const { Toast, toast } = useToast();

    useEffect(()=>{

        if(!prevPath || prevPath?.indexOf("/hubDetail") === -1 || cache?.type!== "hub" )return;

        const { list, pageCur,height} = cache;

        setList(list);
        setPageCur(pageCur);

        setTimeout(()=>{
            const id = prevPath.split("/hubDetail/")[1];
            const element = document.querySelector(`#inner`)
            const targetElement = document.querySelector(`#hub_${id}`);
            if (targetElement) {
                element.scrollTo({
                    top: height,
                    behavior: 'auto',
                });
            }
            store.dispatch(saveCache(null))
        },0)
    },[prevPath])

    const hasMore = useMemo(() => {
        return list.length < total;
    }, [list, total]);

    const getList = async () => {
        const obj = {
            page: pageCur,
            size: pageSize,
        };

        store.dispatch(saveLoading(true));
        try {
            let result = await publicList(obj);

            const { rows, page, size } = result.data;
            setTotal(result.data.total);
            // setList(rows);
            setList([...list, ...rows]);
            setPageSize(size);
            setPageCur(page +1);
        } catch (error) {
            logError(error);
            toast.danger(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`);
        } finally {
            store.dispatch(saveLoading(false));
        }
    };

    useEffect(() => {
        // if(list.length)return;

        if(cache?.type==="hub" && cache?.pageCur>pageCur)return;
        getList();
    }, [cache]);




    const StorageList = (id) =>{
        const element = document.querySelector(`#inner`)
        const height =element.scrollTop;
        let obj={
            type:"hub",
            list,
            pageCur,
            height
        }
        store.dispatch(saveCache(obj))
    }

    const ToGo = (id) => {
        // let obj={
        //     type:"pub",
        //     id,
        //     title:t("Pub.DetailTitle"),
        //     bgColor:"#fff",
        //     headColor:"#1A1323"
        // }
        // store.dispatch(saveDetail(obj));
        StorageList(id);
        navigate(`/hubDetail/${id}`);
    };
    const returnStatus = (str) => {
        let cStr = '';
        switch (str?.trim()) {
            case '已归档':
                cStr = 'str1';
                break;
            case '已认领':
                cStr = 'str2';
                break;
            case '招募中':
            default:
                cStr = 'str3';
                break;
        }
        return cStr;
    };

    return   <Layout title={t("Hub.ListTitle")}>
        <InfiniteScroll
            scrollableTarget="inner"
            dataLength={list.length}
            next={getList}
            hasMore={hasMore}
            loader={<Loading />}

        >
            {!loading && list.length === 0 && <NoItem />}

            <UlBox>
                {
                    loading && list.length === 0 ?<>
                        {
                            [...Array(6)].map((item,index)=>(<li className="libox" key={`list_${index}`} >
                                <EventCardSkeleton />
                            </li>))
                        }
                    </>:
                        list?.map((item, index) => (
                        <li className="libox" key={index} onClick={() => ToGo(item.id)}  id={`hub_${item.id}`}>
                            <InnerBox>
                                <div className="imgBox">
                                    <img src={item?.cover?.file?.url || item?.cover?.external.url} alt="" />
                                </div>
                                <ul className="btm">
                                    <Tit>{item.properties['悬赏名称']?.title[0]?.plain_text}</Tit>
                                    {item.properties['悬赏状态']?.select?.name && (
                                        <li>
                                            <TagBox className={returnStatus(item.properties['悬赏状态']?.select?.name)}>
                                                {item.properties['悬赏状态']?.select?.name}
                                            </TagBox>
                                        </li>
                                    )}
                                    <li>招募截止时间：{item.properties['招募截止时间']?.rich_text[0]?.plain_text}</li>
                                    <li className="line2">{item.properties['贡献报酬']?.rich_text[0]?.plain_text}</li>
                                </ul>
                            </InnerBox>
                        </li>
                    ))
                }
            </UlBox>
        </InfiniteScroll>
        {Toast}
    </Layout>
}
