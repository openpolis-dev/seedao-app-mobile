import {useSelector} from "react-redux";
import Layout from "components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LogoImg from "../assets/images/logo.png";
import {Row,Col,Card} from "react-bootstrap";
import SwiperBanner from "../components/home/swiperBanner";


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
    const navigate = useNavigate();
    const { t } = useTranslation();

    const toGo = (url) =>{
        navigate(url)
    }

    return <Layout noHeader>
        {/*<BoxInner>Home,{account}</BoxInner>*/}
        <BoxInner>
            <BBox>
                <LogoBox>
                    <img src={LogoImg} alt=""/>
                </LogoBox>
                <div>
                    SeeDAO 是一个致力于连接 100 万 Web3 游民的数字城邦
                    我们的愿景是：在基于地缘的民族国家之外，在赛博世界另建一片人类的生存空间
                </div>
                <LineBox>
                    <Row>
                        <Col xs={4}>
                            <dl>
                                <dt>SGN持有者</dt>
                                <dd>545</dd>
                            </dl>
                        </Col>
                        <Col xs={4}>
                            <dl>
                                <dt>治理节点</dt>
                                <dd>545</dd>
                            </dl>
                        </Col>
                        <Col xs={4}>
                            <dl>
                                <dt>SBT持有者</dt>
                                <dd>545</dd>
                            </dl>
                        </Col>
                    </Row>



                </LineBox>
                <SwOuter>
                    <SwiperBanner />
                </SwOuter>
                <AllBox>
                    <div className="btm">公示</div>

                    <Row className="btm">
                        <Col><Card body>市政厅</Card></Col>
                        <Col><Card body>市政厅成员</Card></Col>
                    </Row>


                    <Card body className="mb">新手营</Card>
                    <Card body className="mb">上海线下活动</Card>
                </AllBox>

                {/*<div className="inner">*/}
                {/*    <dl onClick={()=>toGo("/proposal")}>*/}
                {/*        <dt>*/}
                {/*            <Box2Heart />*/}
                {/*        </dt>*/}
                {/*        <dd>{t('menus.Proposal')}</dd>*/}
                {/*    </dl>*/}
                {/*    <dl onClick={()=>toGo("/project")}>*/}
                {/*        <dt>*/}
                {/*            <PieChart />*/}
                {/*        </dt>*/}
                {/*        <dd>{t('menus.Project')}</dd>*/}
                {/*    </dl>*/}
                {/*    <dl onClick={()=>toGo("/guild")}>*/}
                {/*        <dt>*/}
                {/*            <People />*/}
                {/*        </dt>*/}
                {/*        <dd>{t('menus.Guild')}</dd>*/}
                {/*    </dl>*/}
                {/*    <dl onClick={()=>toGo("/assets")}>*/}
                {/*        <dt>*/}
                {/*            <CashCoin />*/}
                {/*        </dt>*/}
                {/*        <dd>{t('menus.assets')}</dd>*/}
                {/*    </dl>*/}
                {/*</div>*/}
            </BBox>
        </BoxInner>
    </Layout>
}
