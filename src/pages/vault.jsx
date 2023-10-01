import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import store from "../store";
import { saveLoading } from "../store/reducer";
import {formatTime} from "../utils/time";
import {getUser} from "../api/user";
import {getProjectApplications} from "../api/applications";
import PublicJs from "../utils/publicJs";
import NoItem from "../components/noItem";
import ApplicantCard from "components/applicant";

const Box = styled.div`
    padding: 20px;
  font-size: 14px;
`

const TopBox = styled.div`
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
    dl{
      margin-bottom: 20px;
    }
  .flex{
    display: flex;
    align-items: center;
  }
  .tit{
    margin-right: 10px;
  }
`

const Num = styled.div`
  color: var(--bs-primary);
  font-size: 16px;
  font-weight: bold;
  margin-top: 2px;
`

const Tit = styled.div`
    font-weight: bold;
`

const BtmBox = styled.ul`
  padding-top: 20px;
  & > div {
    margin-bottom: 15px;
  }
`;

export default function Vault(){
    const {t,i18n} = useTranslation();
    const account = useSelector(state=> state.account);

    const [token, setToken] = useState();
    const [credit, setCredit] = useState();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(100);
    const [list, setList] = useState([]);
    const loading = useSelector(state=> state.loading);

    useEffect(()=>{
        toGA()
    },[])

    const toGA = async () =>{
        // await analyticsGoogle("My_Account", { account })
    }

    useEffect(()=>{
        getUserAssets()
    },[account])

    useEffect(() => {
        getRecords()
    }, [page]);



    const getUserAssets = async () => {
        store.dispatch(saveLoading(true));
        try {
            const res = await getUser();
            console.error(res)
            const assests = res.data.assets;
            const _token = assests.find((item) => item.asset_type === 'token') || {};

            setToken({
                dealt_amount: _token.dealt_amount || 0,
                processing_amount: _token.processing_amount || 0,
                total_amount: (Number(_token.dealt_amount) || 0) + (Number(_token.processing_amount) || 0),
            });
            const _credit = assests.find((item) => item.asset_type === 'credit') || {};
            setCredit({
                dealt_amount: _credit.dealt_amount || 0,
                processing_amount: _credit.processing_amount || 0,
                total_amount: (Number(_credit.dealt_amount) || 0) + (Number(_credit.processing_amount) || 0),
            });
        } catch (error) {
            console.error('get user assets error', error);
        }finally {
            store.dispatch(saveLoading(false));
        }
    };

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
                    user_wallet: account,
                }
            );
            setTotal(res.data.total);
            const _list = res.data.rows.map((item) => ({
                ...item,
                created_date: formatTime(item.created_at),
                transactions: item.transaction_ids.split(','),
            }));
            const arr = list.concat(_list);
            console.log(arr)

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
    const contentViewScroll=(e)=>{
        if(total>page*pageSize){
            handlePage(page)
        }
    }

    return <Layout noTab title={t('My.MyAccount')}>
        <Box>
            <TopBox>
                <dl>
                    <dt>Token</dt>
                    <dd className="flex">
                        <div className="tit">{t('My.Assets')}</div>
                        <Num>{token?.total_amount || 0}</Num>
                    </dd>
                </dl>
                <dl>
                    <dt>{t('My.Points')}</dt>
                    <dd>
                        <div>{t('My.Points2')}</div>
                        <Num>{credit?.total_amount || 0}</Num>
                    </dd>
                </dl>
            </TopBox>
            <div>
                <Tit>{t('Project.Record')}</Tit>
                <BtmBox>
                     {
                        list.length ? list.map((item) => (
                            <ApplicantCard data={item} key={item.applicant_id} />
                        )) : <NoItem />
                    }
                </BtmBox>
            </div>
        </Box>
    </Layout>
}
