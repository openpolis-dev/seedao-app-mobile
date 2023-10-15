import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {ChevronRight} from "react-bootstrap-icons"
import {useTranslation} from "react-i18next";

const Box = styled.div`
    padding: 10px 20px;
`

const Item = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-block: 15px;
  font-size: 14px;
`

export default function My(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toGo = (url) =>{
        navigate(url)
    }

    return <Layout noHeader>
        <Box>

            <Item onClick={()=>toGo('/user/profile')}>
                <div>
                    {t('My.MyProfile')}
                </div>
                <ChevronRight />
            </Item>
            <Item onClick={()=>toGo('/user/vault')}>
                <div>
                    {t('My.MyAccount')}
                </div>
                <ChevronRight />
            </Item>
            <Item onClick={()=>toGo('/setting')}>
                <div>
                    {t('mobile.my.setting')}
                </div>
                <ChevronRight />
            </Item>


        </Box>
    </Layout>
}
