import styled from "styled-components";
import apps from "../../constant/apps";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

const Box = styled.div`
    background: #fff;
  margin: 24px 20px;
  border-radius: 16px;
  padding: 16px 3px 0;
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.02);
`


const TitleBox = styled.div`
  font-size: 20px;
  font-family: Poppins-SemiBold;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1em;
  padding-left: 13px;
`

const TipsBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #9A9A9A;
  padding-left: 13px;
`

const UlBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 22px;
    dl{
      width: 25%;
      box-sizing: border-box;
      padding: 0 13px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  img{
    width: 62px;
    height: 62px;
    object-fit: cover;
    object-position: center;
    background: #fff;
    border-radius: 10px;
  }
  dd{
    margin-bottom: 20px;
    font-size: 12px;
    font-family: Poppins-Medium;
    font-weight: 500;
    color: #1A1323;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
`

export default function AppList(){
    const { t } = useTranslation();
    const events = useMemo(() => {
        return apps.map((item) => ({ ...item, name: t(item.name) }));
    }, [t]);

    const handleClickEvent = (data) => {
        const {link} = data;
        window.open(link, '_blank');
    };

    return <Box>
        <div>
            <TitleBox>{t("home.apps")}</TitleBox>
            <TipsBox>{t("home.appTips")}</TipsBox>
        </div>
        <UlBox>
            {
                events.map(((item,index)=>(<dl key={index}  onClick={()=>handleClickEvent(item)}>
                    <dt>
                        <img src={item.icon} alt=""/>
                    </dt>
                    <dd>{item.name}</dd>
                </dl>)))
            }

        </UlBox>
    </Box>
}
