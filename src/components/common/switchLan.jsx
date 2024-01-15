import styled from "styled-components";
import {useTranslation} from "react-i18next";
import AppConfig from "../../AppConfig";
import { requestSetDeviceLanguage, getPushDevice } from "api/push";
import {useSelector} from "react-redux";

const LanBox = styled.div`
  display: flex;
  --bs-offcanvas-height:auto;
`

const LastBox = styled.ul`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  li{
    border-bottom: 1px solid #eee;
    padding:10px;
    &:last-child{
      border-bottom: 0;
    }
  }
`

export default function SwitchLan(props){
    const {show,handleClose} = props;

    const { i18n } = useTranslation();
    const userToken = useSelector(state=> state.userToken);

    const changeLan = (index) => {
      const v = AppConfig.Lan[index].value;
      i18n.changeLanguage(v);
      if (userToken) {
        try {
          requestSetDeviceLanguage({ device: getPushDevice(), language: v });
        } catch (error) {
          logError("Set Device Language Failed", error);
        }
      }
      handleClose()
    }

    return <div>
        <LanBox show={show} onHide={handleClose} placement="bottom">
            <LastBox>
                {AppConfig.Lan.map((l, i) => (
                    <li key={i} onClick={()=>changeLan(i)}>
                        <div>{l.name}</div>
                    </li>
                ))}
            </LastBox>
        </LanBox>
    </div>
}
