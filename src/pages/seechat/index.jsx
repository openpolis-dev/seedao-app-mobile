import Layout from "../../components/layout/layout";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {ChatInterface} from "./ChatInterface";

const Container = styled.div`
  box-sizing: border-box;
  padding-inline: 10px;
    min-height: 100%;
`;

export default function SeeChat() {
    const navigate = useNavigate();
    return <Layout
        noTab
        title="SeeChat"
        headBgColor={`var(--background-color)`}
        bgColor="var(--background-color)"
        handleBack={() => {
            navigate("/home");
        }}
    >
        <Container>
            <ChatInterface />
        </Container>
    </Layout>
}
