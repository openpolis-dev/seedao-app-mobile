import styled from "styled-components";
import {Offcanvas} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import AppConfig from "../../AppConfig";

const LanBox = styled(Offcanvas)`
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

    const {i18n} = useTranslation();
    const changeLan = (index) =>{
        i18n.changeLanguage(AppConfig.Lan[index].value);
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
