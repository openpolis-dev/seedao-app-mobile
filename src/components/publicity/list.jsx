import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/time";

import { useTranslation } from "react-i18next";
import { getPublicity } from "../../api/publicity";
// import Pagination from "../../components/pagination";
import NoItem from "../../components/noItem";
import publicJs from "../../utils/publicJs";
import useQuerySNS from "../../hooks/useQuerySNS";
import Layout from "components/layout/layout";
import store from "../../store";
import {saveLoading} from "../../store/reducer";
import useToast from "../../hooks/useToast";


const Box = styled.div`
    margin: 0 15px;
`

const Button = styled.button`
  outline: none;
  border: none;
  height: 36px;
  border-radius: 8px;
  padding-inline: 10px;
  font-size: 14px;
    background-color: var(--primary-color);
    color: #fff;
`;



const CardBox = styled.div`
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  //cursor: pointer;
  //background: var(--bs-box-background);
  background: transparent;
  padding: 16px 24px;
  border-radius: 16px;
    display: flex;
    flex-direction: column;
    //align-items: center;
    //justify-content: space-between;

  .name {
    font-size: 16px;
    color: var(--bs-body-color_active);
    line-height: 1em;
  }

  .date {
    font-size: 12px;
    color: var(--font-light-color);
  }
`;

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
`;

const LinkBox = styled.div`
    background: #fff;
    display: inline-block;
    width: 100%;
    margin-bottom: 16px;
    border-radius: 16px;
    &:hover {
        background-color: #F8F5FF;
    }
`

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 16px;
    margin-top: -40px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;

const ExportButton = styled(Button)`
  font-size: 14px;
  font-family: Poppins-Regular;
    min-width: 120px;
`;

const CardBody = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 16px;
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`;

const AvaBox = styled.div`
  display: flex;
  align-items: center;
  .left {
    margin-right: 10px;
  }

  .right {
      display: flex;
      align-items: center;
      gap: 10px;
    .name {
      font-size: 14px;
    }
    .date {
      line-height: 18px;
      margin-top: 4px;
    }
  }
`;

const TagsBox = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
    & >div{
        cursor: pointer;
    }
`;

export default function PublicityList(){
    const { getMultiSNS } = useQuerySNS();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [page,setPage] = useState(1);
    const [size] = useState(10);
    const [total,setTotal] = useState(10);
    const [list,setList] = useState([]);
    const { Toast, toast } = useToast();

    // const [detailId, setDetailId] = useState<number>();

    // const { dispatch} = useAuthContext();
    // const { showToast } = useToast();

    const [snsMap, setSnsMap] = useState({});
    const handleCreate = () =>{
        navigate("/city-hall/publicity/create")
    }

    const handleSNS = async (wallets) => {
        const sns_map = await getMultiSNS(wallets);
        setSnsMap(sns_map);
    };

    useEffect(() => {
        getList()
    }, [page]);

    const go2page = (_page) => {
        setPage(_page + 1);
    };

    const getList = async() =>{
        store.dispatch(saveLoading(true));
        try{
            let rt = await getPublicity(page,size)
            const {data:{page:pg,rows,total}} = rt;

            setPage(pg)
            setTotal(total)
            setList(rows)

            handleSNS(rows.filter((d) => !!d.creator).map((d) => d.creator));

        }catch(error){
            console.error(error)
            toast.danger(`${"Credit.CalculateFailed"}: ${error}`);
        }finally {
            store.dispatch(saveLoading(false));
        }

    }


    const handleDetail = (id) =>{

        navigate("/publicity/detail/"+id);
    }


    const formatSNS = (wl) => {
        const wallet = wl.toLowerCase();
        const name = snsMap[wallet] ? snsMap[wallet]:wallet;
        console.log(snsMap[wallet])
        return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
    };

    return <Layout
        title={t("publicity.title")}
        headBgColor={`var(--background-color)`}
        bgColor="var(--background-color)"
        headerProps={{ backPath: "/governance" }}
    >
        <Box>


        <TopLine>
            <li>
                <ExportButton onClick={()=>handleCreate()}>创建</ExportButton>
            </li>
        </TopLine>

        {
            !list?.length && <NoItem />
        }
        {
            !!list?.length &&  list.map((item, index) => (
                <LinkBox key={index} onClick={() => handleDetail(item?.id)}>
                    <CardBox>
                        <CardHeaderStyled>
                            <Title>{item?.title}</Title>
                        </CardHeaderStyled>
                        <CardBody>
                            <AvaBox>
                                {/*<div className="left">*/}
                                {/*  <UserAvatar src={DefaultAvatarIcon} alt="" />*/}
                                {/*</div>*/}
                                <div className="right">
                                    <div className="name">{formatSNS(item.creator)}</div>
                                    <div className="date">{formatTime(item?.createAt * 1000)}</div>
                                </div>
                            </AvaBox>
                        </CardBody>

                    </CardBox>
                </LinkBox>

            ))
        }

        {/*{*/}
        {/*    list.length > 1 && <div>*/}
        {/*        <Pagination itemsPerPage={size} total={total} current={page - 1} handleToPage={go2page} />*/}
        {/*    </div>*/}
        {/*}*/}

        </Box>
    </Layout>
}
