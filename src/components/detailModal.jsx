import styled from "styled-components";
import {useSelector} from "react-redux";
import BackSVG from "./svgs/back";
import Loading from "./layout/loading";
import store from "../store";
import {saveDetail} from "../store/reducer";

import PubInner from "./pub/PubInner";
import EventInner from "./event/EventInner";
import ProjectInner from "./project/ProjectInner";
import GuildInner from "./guild/GuildInner";
import {useTranslation} from "react-i18next";
import Proposalnner from "./proposal/Proposalnner";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const Box = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  box-sizing: border-box;
  background-color: #fff;
  overflow-y: auto;
  padding-top: env(safe-area-inset-top);
`

const Back = styled.div`
  position: absolute;
  left: 20px;
  top: calc(7px + env(safe-area-inset-top));
`;
const HeaderBox = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 47px;
  line-height: 47px;
  color: ${(props) => props.$headColor || "var(--font-color)"};
`;
const InnerBox = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: calc(47px + env(safe-area-inset-top));
  z-index: 9;
  background: ${(props) => props.$bgColor || "var(--background-color-1)"};
  box-sizing: border-box;
  width: 100vw;
  padding-inline: 20px;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;

const Mid = styled.div`
  position: relative;
  font-family: "Poppins-SemiBold";
  font-size: 17px;
  font-weight: 600;
`;
const LoadingBox = styled.div`
  position: absolute;
  right: -24px;
  top: 3px;
`;
const OperateBox = styled.div`
  position: absolute;
  right: 20px;
  top: env(safe-area-inset-top);
  padding-top: 10px;
`;

const ProTop = styled.div`
  //margin-top: 50px;
  padding: 30px 0 80px;
`
export default function DetailModal(){
    const { t } = useTranslation();
    const detailShow = useSelector((state) => state.detail);
    const [noHead, setNoHead] = useState(true);

    useEffect(() => {
        const container = document.querySelector("#proInner");
        container && container.addEventListener("scroll", ScrollHeight);
        return () => {
            container && container.removeEventListener("scroll", ScrollHeight);
        };
    }, [detailShow]);

    // useEffect(() => {
    //     window.addEventListener('popstate', function(event) {
    //         // 处理回退事件的逻辑
    //         console.log('回退事件触发---');
    //          event.preventDefault();
    //          event.stopPropagation();
    //          event.stopImmediatePropagation();
    //          console.log(window.history)
    //         navigate(1)
    //         // window.history.pushState(null, null, document.URL);
    //         store.dispatch(saveDetail(null));
    //     });
    // }, []);


    const ScrollHeight = () => {
        const container = document.querySelector("#proInner");
        setNoHead(container?.scrollTop > 10);
    };

    const backTop = () =>{
        store.dispatch(saveDetail(null));
    }

    // const formatTitle = () =>{
    //
    //
    //     if(detailShow?.type === 'guild'){
    //         return data?.name || t("Project.Detail")
    //     }else{
    //         return detailShow.title;
    //     }
    //
    // }

    return <>
        {
        detailShow != null &&<Box>
                {
                    (  detailShow?.type !== 'proposal' || (detailShow?.type === 'proposal' && noHead) )&&  <InnerBox $bgColor={detailShow.bgColor}>
                        <Back onClick={() => backTop()}>
                            <BackSVG color={detailShow.headColor} />
                        </Back>
                        <HeaderBox $headColor={detailShow.headColor}>
                            <Mid>
                                <span>{detailShow.title}</span>
                                <LoadingBox>
                                    <Loading />
                                </LoadingBox>
                            </Mid>
                        </HeaderBox>
                        <OperateBox></OperateBox>
                    </InnerBox>
                }
                <ProTop>
                {
                    detailShow?.type === 'pub' && <PubInner id={detailShow?.id} />
                }
                {
                    detailShow?.type === 'event' && <EventInner id={detailShow?.id} />
                }
                {
                    detailShow?.type === 'project' && <ProjectInner id={detailShow?.id} />
                }
                {
                    detailShow?.type === 'guild' && <GuildInner id={detailShow?.id}  />
                }
                {
                    detailShow?.type === 'proposal' && <Proposalnner id={detailShow?.id}  />
                }
                </ProTop>
    </Box>
    }
</>
}
