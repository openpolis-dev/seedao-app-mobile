import styled from "styled-components";
import {useSelector} from "react-redux";
import ProjectProvider from "../pages/project/info/provider";
import GuildProvider, {useGuildContext} from "../pages/guild/info/provider";
import BackSVG from "./svgs/back";
import Loading from "./layout/loading";
import store from "../store";
import {saveDetail} from "../store/reducer";

import PubInner from "./pub/PubInner";
import EventInner from "./event/EventInner";
import ProjectInner from "./project/ProjectInner";
import GuildInner from "./guild/GuildInner";
import {useTranslation} from "react-i18next";


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
  padding-bottom: 80px;
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
  margin-top: 50px;
`
export default function DetailModal(){
    const { t } = useTranslation();
    const detailShow = useSelector((state) => state.detail);
    // const {
    //     state: { data },
    // } = useGuildContext();
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
                <InnerBox $bgColor={detailShow.bgColor}>
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
                {
                    detailShow?.type === 'pub' && <PubInner id={detailShow?.id} />
                }
                {
                    detailShow?.type === 'event' && <EventInner id={detailShow?.id} />
                }
                {
                    detailShow?.type === 'project' && <ProTop><ProjectInner id={detailShow?.id} /></ProTop>
                }
                {
                    detailShow?.type === 'guild' && <ProTop><GuildInner id={detailShow?.id}  /></ProTop>
                }
    </Box>
    }
</>
}
