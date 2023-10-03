import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import AppConfig from "../AppConfig";
import PublicJs from "../utils/publicJs";
import { Share } from "react-bootstrap-icons";
import BgImg from '../assets/images/homebg.png';
import CopyBox from "components/common/copy";
import store from "../store";
import axios from "axios";
import { saveLoading } from "../store/reducer";
import { formatNumber } from "utils/number";

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
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  background: url(${BgImg}) top no-repeat;
  background-size: 100%;
  background-attachment: fixed;

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



const FlexBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 15px;
    li{
      width: 33%;
      text-align: center;
      border-right: 1px solid #ccc;
      font-size: 12px;
      &:last-child{
        border-right: 0;
      }
    }
`

const UlBox = styled.ul`
  margin-top: 20px;
    li{
      border-bottom: 1px solid #ddd;
      padding: 20px 0;
    }
`
const LineBox = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`

const FirstLine = styled.div`
  display: flex;
  align-items: center;
  .iconBox{
    margin-inline: 20px;
    font-size: 18px;
  }
`

const Num = styled.div`
    font-weight: bold;
  font-size: 16px;
`

const TopBox = styled.div`
    width: 100%;
`

const Tit = styled.div`
    font-size: 12px;
`

const NumBal = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`

const Tag = styled.div`
    background: var(--bs-primary);
    margin-left: 10px;
    font-size: 12px;
    color: #fff;
    padding: 0 10px;
    border-radius: 10px;
`

const Addr = styled.div`
    font-size: 12px;
  margin-right: 20px;
`

const TitTop = styled.div`
    font-size: 14px;
    font-weight: bold;
`
export default function VaultBalance(){
    const { t } = useTranslation();
    const [totalBalance, setTotalBalance] = useState('0.00');
    const [totalSigner, setTotalSigner] = useState(0);
    const { VAULTS } = AppConfig;
    const [vaultsMap, setVaultsMap] = useState({});


    const SAFE_CHAIN = {
        [1]: {
            short: 'eth',
            name: 'Ethereum',
        },
        [137]: {
            short: 'matic',
            name: 'Polygon',
        },
    };

    const linkTo = (v) =>{
        window.open(`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`)
    }

    const getVaultBalance = async ({ chainId, address }) => {
        return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}/balances/usd?trusted=true`);
    };
    const getVaultInfo = async ({ chainId, address }) => {
        return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}`);
    };

    useEffect(() => {
        getVaultsInfo();
    }, []);
    const getVaultsInfo = async () => {
        const vaults_map = {};
        const users= [];
        let _total = 0;
        store.dispatch(saveLoading(true));
        try {
            const reqs = VAULTS.map((item) => getVaultBalance(item));
            const results = await Promise.allSettled(reqs);
            results.forEach((res, index) => {
                if (res.status === 'fulfilled') {
                    const _v = Number(res.value.data?.fiatTotal || 0);
                    vaults_map[VAULTS[index].id] = {
                        balance: _v.toFixed(2),
                    };
                    _total += _v;
                }
            });
        } catch (error) {
            console.error('getVaultBalance error', error);
        }
        try {
            const reqs = VAULTS.map((item) => getVaultInfo(item));
            const results = await Promise.allSettled(reqs);
            results.forEach((res, index) => {
                if (res.status === 'fulfilled') {
                    const _id = VAULTS[index].id;
                    if (!vaults_map[_id]) {
                        vaults_map[_id] = {};
                    }
                    vaults_map[_id].total = res.value.data?.owners.length || 0;
                    vaults_map[_id].threshold = res.value.data?.threshold || 0;
                    users.push(...res.value.data?.owners.map((item) => item.value));
                }
            });
        } catch (error) {
            console.error('getVaultInfo error', error);
        }finally {
            store.dispatch(saveLoading(false));
        }
        setTotalSigner([...new Set(users)].length);
        setTotalBalance(_total.toFixed(2));
        setVaultsMap(vaults_map);
    };


    return <Layout noTab title={t('menus.assets')}>
        <Box>
            <CardBox>
                <div className="vaultInner">
                    <TopBox>
                        <Tit>{t('Assets.TotalBalance')}</Tit>
                        <NumBal>${totalBalance}</NumBal>
                    </TopBox>
                    <FlexBox>
                        <li>
                            <div>{t('Assets.Wallet')}</div>
                            <div>4</div>
                        </li>
                        <li>
                            <div>{t('Assets.MultiSign')}</div>
                            <div>{totalSigner}</div>
                        </li>
                        <li>
                            <div>{t('Assets.Chain')}</div>
                            <div>2</div>
                        </li>
                    </FlexBox>
                </div>
            </CardBox>
            <UlBox>
                {
                    VAULTS.map((v,index)=>(<li key={index}>
                        <FirstLine>
                            <TitTop>{t(v.name)}</TitTop>
                            <Tag>{SAFE_CHAIN[v.chainId].name}  {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}</Tag>
                        </FirstLine>
                        <LineBox>
                            <FirstLine>
                                <Addr>{PublicJs.AddressToShow(v.address)}</Addr>
                                <CopyBox text="123"/>
                                <Share onClick={()=>linkTo(v)} className="iconBox" />
                            </FirstLine>
                            <Num>
                                ${formatNumber(vaultsMap[v.id]?.balance || 0.0)}
                            </Num>
                        </LineBox>
                    </li>))
                }

            </UlBox>
        </Box>
    </Layout>
}
