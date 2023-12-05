import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { publicList } from '../../api/publicData';
import ExploreSection from "components/exploreSection";
import {EventCardSkeleton} from "../event/eventCard";
import PublicJs from "../../utils/publicJs";
import useCurrentPath from "../../hooks/useCurrentPath";
import {useSelector} from "react-redux";
import store from "../../store";
import {saveCache} from "../../store/reducer";

const Box = styled.div`
    padding-top: 20px;
`;

const UlBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
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

const TypeBox = styled(TagBox)`
  padding: 3px 10px;
  opacity: 1;
  margin: 5px 10px 10px 0;
  color: #000;
  &.type1 {
    background: rgb(250, 222, 201);
  }
  &.type2 {
    background: rgb(253, 236, 200);
  }
  &.type3 {
    background: rgb(255, 226, 221);
  }

  &.type4 {
    background: rgb(219, 237, 219);
  }
  &.type5 {
    background: rgb(227, 226, 224);
  }
  &.type6 {
    background: rgb(211, 229, 239);
  }
  &.type7 {
    background: rgb(238, 224, 218);
  }
`;


export default function Hub() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    const prevPath = useCurrentPath();
    const cache = useSelector(state => state.cache);


    useEffect(()=>{

        if(!prevPath || prevPath?.indexOf("/hubDetail") === -1 || cache?.type!== "explore_hub" )return;

        const { list, height} = cache;
        setList(list);
        setLoading(false);
        setTimeout(()=>{
            const element = document.querySelector(`#inner`)
            element.scrollTo({
                top: height,
                behavior: 'auto',
            });
            store.dispatch(saveCache(null))
        },0)
    },[prevPath])

    useEffect(() => {
        if(cache?.type === "explore_hub") return;
        getList();
    }, []);



    const getList = async () => {
        const obj = {
            page: 1,
            size: 6,
        };

        setLoading(true);
        try {
            let result = await publicList(obj);

            const { rows } = result.data;

            setList(rows);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    const ToGo = (id) => {
        PublicJs.StorageList("explore_hub",list)
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

    return (<Box>
                <ExploreSection title={t("Explore.HubTitle")} desc={t("Explore.HubDesc")} moreLink="/hubList">
                <UlBox>
                    {
                        loading? (
                            <>
                                <li className="libox">
                                    <EventCardSkeleton />
                                </li>
                                <li className="libox">
                                    <EventCardSkeleton />
                                </li>
                            </>
                        ):
                            list?.map((item, index) => (
                            <li className="libox" key={index} onClick={() => ToGo(item.id)}>
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
            </ExploreSection>
        </Box>
);
}
