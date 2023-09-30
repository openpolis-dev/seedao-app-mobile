import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import { ChevronDoubleRight } from "react-bootstrap-icons"
import PublicJs from "../utils/publicJs";
import NoItem from "../components/noItem";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import store from "../store";
import { saveLoading } from "../store/reducer";
import {getProjectApplications} from "../api/applications";
import {formatTime} from "../utils/time";
import {useNavigate} from "react-router-dom";
import BgImg from '../assets/images/homebg.png';

const Box = styled.div`
    padding: 20px;
`

const CardBox = styled.div`
    background: #666;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &.total{
    background: url(${BgImg}) top no-repeat;
    background-size: 100%;
    background-attachment: fixed;
  }
  .vaultInner {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background: rgba(161, 110, 255, 0.2);
    padding: 20px;
    backdrop-filter: blur(5px);
  }
`
const Num = styled.div`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
`
const Tit = styled.div`
    font-size: 12px;
`

const DetailBox = styled.div`
    display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  font-size: 12px;
`
const FlexBox = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`
const CardItem = styled(CardBox)`
    width: 48%;
  margin-bottom: 20px;
  padding: 30px;
  color: #fff;
  position: relative;
  &:first-child {
    background: linear-gradient(to right, #9d72fa, #6961fa);
  }
  &:nth-child(2) {
    background: linear-gradient(to right, #f1a6b6, #8f69d2);

  }
  &:nth-child(3) {
    background: linear-gradient(to right, #3bdabe, #44b5f4);
    
  }
  &:nth-child(4) {
    background: linear-gradient(to right, #f9a488, #fe7c7c);
  }

  .decorBg {
    position: absolute;
    right: 0;
    bottom:-25px;
    font-size: 85px;
    font-family: 'Jost-Bold';
    opacity: 0.04;
    color: #000;
    width: 100%;
    text-align: center;
    letter-spacing: -5px;
  }
`

const TitBox = styled.div`
    font-weight: bold;
`

const ListBox = styled.div`
`

const BtmBox = styled.ul`
   padding-top: 20px;
    li{
      background: #fff;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  .line{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:first-child{
      margin-bottom: 10px;
    }
  }
`


const StatusBox = styled.div`
    font-weight: bold;
  color: var(--bs-primary);
  font-size: 16px;
`

const TimeBox = styled.div`
    font-size: 12px;
`

export default function Assets(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const loading = useSelector(state=> state.loading);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        getRecords()
    }, [page]);

    const getRecords = async () => {
        store.dispatch(saveLoading(true));
        try {
            const res = await getProjectApplications(
                {
                    page,
                    size: pageSize,
                    sort_field: 'created_at',
                    sort_order: 'desc',
                    entity: 'project',
                    type:"new_reward",
                }
            );
            setTotal(res.data.total);
            const _list = res.data.rows.map((item) => ({
                ...item,
                created_date: formatTime(item.created_at),
                transactions: item.transaction_ids.split(','),
            }));
            const arr = list.concat(_list);
            setList(arr);
        } catch (error) {
            console.error('getRecords error', error);
        } finally {
            store.dispatch(saveLoading(false));
        }
    };

    const handlePage = (num) => {
        setPage(num + 1);
    };

    const toGo = () =>{
        navigate("/vault")
    }

    return <Layout title={t('menus.assets')} noTab>
        <Box>
            <CardBox className="total">
                <div className="vaultInner">
                    <Tit>{t('Assets.TotalBalance')}</Tit>
                    <Num>0</Num>
                    <DetailBox onClick={()=>toGo()}>
                        <div>{t('Assets.Detail')}</div>
                        <ChevronDoubleRight />
                    </DetailBox>
                </div>

            </CardBox>
            <FlexBox>
                <CardItem>
                    <Tit>{t('Assets.SupplySCR')}</Tit>
                    <Num>0</Num>
                    <DetailBox>
                        <div>{t('Assets.Detail')}</div>
                        <ChevronDoubleRight />
                    </DetailBox>
                    <div className="decorBg">SEE</div>
                </CardItem>
                <CardItem>
                    <Tit>{t('Assets.TotalBalance')}</Tit>
                    <Num>0</Num>
                    <DetailBox>
                        <div>{t('Assets.Detail')}</div>
                        <ChevronDoubleRight />
                    </DetailBox>
                    <div className="decorBg">DAO</div>
                </CardItem>
                <CardItem>
                    <Tit>{t('Assets.TotalBalance')}</Tit>
                    <Num>0</Num>
                    <DetailBox>
                        <div>{t('Assets.Detail')}</div>
                        <ChevronDoubleRight />
                    </DetailBox>
                    <div className="decorBg">SEE</div>
                </CardItem>
                <CardItem>
                    <Tit>{t('Assets.TotalBalance')}</Tit>
                    <Num>0</Num>
                    <DetailBox>
                        <div>{t('Assets.Detail')}</div>
                        <ChevronDoubleRight />
                    </DetailBox>
                    <div className="decorBg">DAO</div>
                </CardItem>
            </FlexBox>
            <ListBox>
                <TitBox>{t('Project.Record')}</TitBox>
                <BtmBox>

                    {
                        !!list.length && list.map((item,index)=>(
                            <li key={index}>
                                <div className="line">
                                    <div>{PublicJs.AddressToShow(item.target_user_wallet)}</div>
                                    <div>{item.credit_amount ? `${t('My.Points')} ${item.credit_amount}`:''}</div>
                                </div>
                                <div className="line">
                                    <TimeBox>{item.created_date}</TimeBox>
                                    <StatusBox>{item.status}</StatusBox>
                                </div>
                            </li>
                        ))
                    }
                    {
                        !list.length && !loading && <NoItem />
                    }
                </BtmBox>
            </ListBox>
        </Box>
    </Layout>
}
