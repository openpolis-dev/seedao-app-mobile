import {useSelector} from "react-redux";
import Layout from "components/layout/layout";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const BoxInner = styled.div`
    display: flex;
  flex-direction: column;
  height: 100%;
`

const Top = styled.div`
`

const BBox = styled.div`
  display: flex;
  margin: 0 20px;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  .inner{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  dl{
    background: #fff;
    width: 48%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.05);
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
                <div className="inner">
                    <dl onClick={()=>toGo("/proposal")}>
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
                </div>
            </BBox>
        </BoxInner>
    </Layout>
}
