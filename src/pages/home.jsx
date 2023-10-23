import {useSelector} from "react-redux";
import Layout from "components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LogoImg from "../assets/images/logo.png";
import {Row,Col,Card} from "react-bootstrap";
import SwiperBanner from "../components/home/swiperBanner";
import {useEffect, useMemo, useState} from "react";
import axios from 'axios';


const BoxInner = styled.div`
    display: flex;
  flex-direction: column;
  height: 100%;
`


const BBox = styled.div`
  display: flex;
  margin: 0 20px;
  flex-grow: 1;
  align-items: center;
  flex-direction: column;
  .inner{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  .btm{
    padding-bottom: 20px;
  }
  .mb{
    margin-bottom: 20px;
  }
  .btmLine{
    display: flex;
    align-items: stretch;

    .card{
      padding: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
    }
  }
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  img{
    width: 70%;
    margin: 0 auto;
  }

`

const LineBox = styled.div`
  width: 100%;
  margin-top: 20px;
  background: #fff;
  padding: 20px;
    dl{
      width: 100%;
      text-align: center;
    }
  dt{
    font-size: 16px;
  }
`

const AllBox = styled.div`
    width: 100%;
  margin-top: 30px;
`

const SwOuter = styled.div`
    margin-top: 40px;
`



export default function Home(){
    const account = useSelector(state=> state.account);

    const { t } = useTranslation();
    const [sgnHolders, setSgnHolders] = useState(0);
    const [governNodes, setGovernNodes] = useState(0);
    const [onboardingHolders, setOnboardingHolders] = useState(0);
    const [onNewHolders, setNewHolders] = useState(0);

    const SGN_CONTRACT = '0x23fda8a873e9e46dbe51c78754dddccfbc41cfe1';
    const GOV_NODE_CONTRACT = '0x9d34D407D8586478b3e4c39BE633ED3D7be1c80c';
    const CITY_HALL = 'https://seedao.notion.site/07c258913c5d4847b59271e2ae6f7c66';
    const CITY_HALL_MEMBERS = 'https://www.notion.so/3913d631d7bc49e1a0334140e3cd84f5';

    const getDatafromNftscan = (contract, base) => {
        return axios.get(`${base || 'https://polygonapi.nftscan.com'}/api/v2/statistics/collection/${contract}`, {
            headers: {
                'X-API-KEY': process.env.REACT_APP_NFTSCAN_KEY,
            },
        });
    };

    useEffect(() => {
        const getOnboardingHolders = async () => {
            try {
                const res = await getDatafromNftscan('0x0D9ea891B4C30e17437D00151399990ED7965F00');
                setOnboardingHolders(res.data?.data?.owners_total || 0);
            } catch (error) {
                console.error('[SBT] get onboading holders failed', error);
            }
        };
        const getNewHolders = async () => {
            try {
                const res = await getDatafromNftscan('0x2221F5d189c611B09D7f7382Ce557ec66365C8fc');
                setNewHolders(res.data?.data?.owners_total || 0);
            } catch (error) {
                console.error('[SBT] get new-sbt holders failed', error);
            }
        };
        getOnboardingHolders();
        getNewHolders();
    }, []);

    useEffect(() => {
        const handleSgnHolders = async () => {
            try {
                const res = await getDatafromNftscan(SGN_CONTRACT, 'https://restapi.nftscan.com');
                setSgnHolders(res.data?.data?.items_total || 0);
            } catch (error) {
                console.error('[SBT] get sgn owners failed', error);
            }
        };
        handleSgnHolders();
    }, []);


    useEffect(() => {
        const handleGovNodes = async () => {
            try {
                const res = await getDatafromNftscan(GOV_NODE_CONTRACT, 'https://restapi.nftscan.com');
                setGovernNodes(res.data?.data?.owners_total || 0);
            } catch (error) {
                console.error('[SBT] get gov nodes failed', error);
            }
        };
       handleGovNodes();
    }, []);

    const sbtHolders = useMemo(() => {
        const SBT_155 = 9;
        return governNodes + onboardingHolders + onNewHolders + SBT_155;
    }, [governNodes, onboardingHolders, onNewHolders]);

    return <Layout noHeader>
        {/*<BoxInner>Home,{account}</BoxInner>*/}
        <BoxInner>
            <BBox>
                <LogoBox>
                    <img src={LogoImg} alt=""/>
                </LogoBox>
                <div>
                    <div>
                        {t('Home.Slogan')}
                    </div>
                   <div>
                       <span>{t('Home.SloganVison')}:</span>
                       {t('Home.SloganDesc')}
                   </div>

                </div>
                <LineBox>
                    <Row>
                        <Col xs={4}>
                            <dl>
                                <dt>{t('Home.SGNHolder')}</dt>
                                <dd>{sgnHolders}</dd>
                            </dl>
                        </Col>
                        <Col xs={4}>
                            <dl>
                                <dt>{t('Home.GovernNode')}</dt>
                                <dd>{governNodes}</dd>
                            </dl>
                        </Col>
                        <Col xs={4}>
                            <dl>
                                <dt>{t('Home.SBTHolder')}</dt>
                                <dd>{sbtHolders}</dd>
                            </dl>
                        </Col>
                    </Row>
                </LineBox>
                <SwOuter>
                    <SwiperBanner />
                </SwOuter>
                <AllBox>
                    <div className="btm">{t('Home.Publicity')}</div>

                    <Row className="btm btmLine">
                        <Col><div className="card"  onClick={() => window.open(CITY_HALL, '_blank')}>{t('Home.CityHall')}</div></Col>
                        <Col><div className="card" onClick={() => window.open(CITY_HALL_MEMBERS, '_blank')}>{t('Home.CityHallMembers')}</div></Col>
                    </Row>


                    <Card body className="mb">新手营</Card>
                    <Card body className="mb">上海线下活动</Card>
                </AllBox>

            </BBox>
        </BoxInner>
    </Layout>
}
