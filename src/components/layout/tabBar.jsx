import {useEffect} from "react";
import store from "../../store";
import {saveAccount} from "../../store/reducer";
import styled from "styled-components";
import {House,Person} from "react-bootstrap-icons";
import {NavLink} from "react-router-dom"
import {useTranslation} from "react-i18next";

const Box = styled.div`
    background: #fff;
  position: fixed;
  padding: 5px 20px;
  bottom: 0;
  left: 0;
  z-index: 9;
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  width: 100%;
  display: flex;
  align-items: center;
`

const ItemBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  a{
    width: 50%;
    display: inline-block;
    &.active{
      color: var(--bs-primary);
    }
  }
    dl{

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  dt{
    font-size: 20px;
  }
 dd{
    font-size: 10px;
  }
`

export default function TabBar(){
    const { t } = useTranslation();


    // useEffect(() => {
    //     store.dispatch(saveAccount("123"))
    // }, []);
    return <Box>
        <ItemBox >
            <NavLink className={({ isActive }) => isActive ?"active":""} to="/home">
                <dl>
                    <dt>
                        <House />
                    </dt>
                    <dd>{t('mobile.my.home')}</dd>
                </dl>
            </NavLink>

            <NavLink className={({ isActive }) => isActive ?"active":""} to="/explore">
                <dl>
                    <dt>
                        <Person />
                    </dt>
                    <dd>探索</dd>
                </dl>
            </NavLink>
            <NavLink className={({ isActive }) => isActive ?"active":""} to="/online-event">
                <dl>
                    <dt>
                        <Person />
                    </dt>
                    <dd>治理</dd>
                </dl>
            </NavLink>
            <NavLink className={({ isActive }) => isActive ?"active":""} to="/assets">
                <dl>
                    <dt>
                        <Person />
                    </dt>
                    <dd>金库</dd>
                </dl>
            </NavLink>
            <NavLink className={({ isActive }) => isActive ?"active":""} to="/user/profile">
                <dl>
                    <dt>
                        <Person />
                    </dt>
                    <dd>{t('mobile.my.my')}</dd>
                </dl>
            </NavLink>

        </ItemBox>
    </Box>
}
