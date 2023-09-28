import Layout from "../components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Box = styled.div`
    padding: 20px;
`

export default function My(){

    const navigate = useNavigate();
    const toGo = (url) =>{
        navigate(url)
    }

    return <Layout noHeader>
        <Box>

            <div onClick={()=>toGo('/setting')}>
                setting
            </div>

        </Box>
    </Layout>
}
