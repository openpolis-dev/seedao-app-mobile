import Layout from "components/layout/layout";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import sns from "@seedao/sns-js";
import getConfig from "constant/envCofnig";
import {getPublicityDetail} from "../../api/publicity";
import {formatTime} from "../../utils/time";
import {MdPreview} from "md-editor-rt";
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import DefaultAvatarIcon from "../../assets/Imgs/avatar.svg";
import useToast from "../../hooks/useToast";

const ThreadHead = styled.div`
  padding: 16px 0;
    margin: 0 15px;
    border-bottom: 1px solid var(--border-color-1);
  .title {
    font-size: 16px;
    font-family: "Poppins-Bold";
    color: var(--bs-body-color_active);
    line-height: 30px;
  }
  .linkStyle {
    width: 16px;
    height: 16px;
    img {
      width: 16px;
      height: 16px;
      margin-bottom: -3px;
    }
  }
`;

const InfoBox = styled.div`
  gap: 16px;
  .date {
    font-size: 12px;
      color: var(--font-light-color);
  }
`;

const UserBox = styled.div`
  display: flex;
  gap: 8px;
    margin-top: 10px;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }

  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
    cursor: default;
  }
`;


const ContentOuter = styled.div`
  margin-bottom: 24px;
    padding: 10px 16px;
`;


export const PushItemContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-block: 8px;
  &.clip {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
`;


export default function PublicityDetail(){
    const { t } = useTranslation();
    const [detail, setDetail] = useState({});
    const [snsName,setSnsName] = useState();
    const { id } = useParams();
    const { Toast, toast } = useToast();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if(!id)return;
        getEdit()
    }, [id]);

    const getSnS = async(account) =>{
        try{
            let rt = await sns.name(account,getConfig().NETWORK.rpcs[0])
            setSnsName(rt)
        }catch(error){
            toast.danger(`${error?.data?.msg || error?.code || error}`);
        }

    }


    const getEdit = async()=>{
        store.dispatch(saveLoading(true));
        try{
            let rt = await getPublicityDetail(id);
            setDetail(rt.data.Detail)
            getSnS(rt.data.Detail.creator.toLowerCase())
        }catch(error){
            console.error(error)
        }finally {
            store.dispatch(saveLoading(false));
        }

    }

    const handleProfile = () => {
        setShowModal(true);
    };

    return  <Layout
        title={t("publicity.detail")}
        headStyle={{ style: { borderBottom: "1px solid var(--border-color-1)" } }}
        customTab={<div></div>}

        headerProps={{ backPath: "/publicity" }}
    >
        <ThreadHead>
            <div className="title">
                {detail?.title}
            </div>
            <InfoBox>
                <UserBox onClick={() => handleProfile()}>
                    <img src={detail?.avatar || DefaultAvatarIcon} alt=""/>
                    <span className="name">{snsName}</span>
                </UserBox>
                {detail?.updateAt && <div className="date">{formatTime(detail?.updateAt * 1000)}</div>}
            </InfoBox>
        </ThreadHead>

        <ContentOuter>
            <PushItemContent>
                <MdPreview theme="light" modelValue={detail.content || ''} />
            </PushItemContent>
        </ContentOuter>
        {Toast}
    </Layout>
}
