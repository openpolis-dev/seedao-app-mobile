import {useSelector} from "react-redux";
import Layout from "components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {Box2Heart, PieChart, People, CashCoin} from "react-bootstrap-icons";
import LogoImg from "../assets/images/logo.png";
import {Button} from "react-bootstrap"

const BoxInner = styled.div`
    display: flex;
  flex-direction: column;
  height: 100%;
`

const Top = styled.div`
    margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  button{
    border-radius: 40px;
    font-size: 11px;
    padding-inline:20px;
  }
`

const BBox = styled.div`
  display: flex;
  margin: 0 20px;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .inner{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  dl{
    background: #fff;
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 25px 0;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  }
  dt{
    font-size: 26px;
    padding-bottom: 10px;
  }
  dd{
    font-size: 14px;
  }
`

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  img{
    width: 70%;
    margin: 0 auto;
  }

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
            <Top>
                <Button onClick={()=>toGo("/board")} size="sm">{t('mobile.my.onBoard')}</Button>
            </Top>
            <BBox>
                <LogoBox>
                    <img src={LogoImg} alt=""/>
                </LogoBox>
                <div className="inner">
                    <dl onClick={()=>toGo("/proposal")}>
                        <dt>
                            <Box2Heart />
                        </dt>
                        <dd>{t('menus.Proposal')}</dd>
                    </dl>
                    <dl onClick={()=>toGo("/project")}>
                        <dt>
                            <PieChart />
                        </dt>
                        <dd>{t('menus.Project')}</dd>
                    </dl>
                    <dl onClick={()=>toGo("/guild")}>
                        <dt>
                            <People />
                        </dt>
                        <dd>{t('menus.Guild')}</dd>
                    </dl>
                    <dl onClick={()=>toGo("/assets")}>
                        <dt>
                            <CashCoin />
                        </dt>
                        <dd>{t('menus.assets')}</dd>
                    </dl>
                </div>
            </BBox>
        </BoxInner>
    </Layout>
}
