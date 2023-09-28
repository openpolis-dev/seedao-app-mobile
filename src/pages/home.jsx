import {useSelector} from "react-redux";
import Layout from "components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const BoxInner = styled.div`
    display: flex;
  flex-direction: column;
`

const Top = styled.div`
`

const BBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  dl{
    background: #fff;
    width: 50%;
    
  }
`

export default function Home(){
    const account = useSelector(state=> state.account);
    const navigate = useNavigate();

    const toGo = (url) =>{
        navigate(url)
    }

    return <Layout noHeader={true}>
        {/*<BoxInner>Home,{account}</BoxInner>*/}
        <BoxInner>
            <Top>on boarding</Top>
            <BBox>
                <dl>
                    <dt></dt>
                    <dd>Proposal</dd>
                </dl>
                <dl>
                    <dt></dt>
                    <dd>Project</dd>
                </dl>
                <dl>
                    <dt></dt>
                    <dd>Guild</dd>
                </dl>
                <dl>
                    <dt></dt>
                    <dd>Vault</dd>
                </dl>
            </BBox>
        </BoxInner>
    </Layout>
}
