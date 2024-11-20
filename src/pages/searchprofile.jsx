import Layout from "../components/layout/layout";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import sns from "@seedao/sns-js";

import LoadingImg from "../assets/Imgs/loading.png";
import ClearIcon from "../assets/Imgs/sns/clear.svg";
import useQuerySNS from "../hooks/useQuerySNS";
import {getUsers} from "../api/user";
import UserModal from "../components/userModal";
import getConfig from "../constant/envCofnig";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    width: 100%;
`;


const Box = styled.div`
    width: 400px;
    border-radius: 16px;
    text-align: center;
    position: relative;
.rhtIpt{
    text-align: right;
    padding-right: 10px;
}
`;

const StepTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
    padding: 40px 0 5px;
`;

const Content = styled.div`
  display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    input{
        height:45px;
    }
    .submitBtn{
        width: 50%;
        margin: 30px 0;
    }
`
const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 33px;
`;
const FlexBox = styled.div`
  display: flex;
    align-items: center;
    gap: 10px;
    width: 90%;
    input{
        flex-grow: 1;
    }
`

const MintButton = styled.button`
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: var(--primary-color);
  border-radius: 16px;
  color: #fff;
  font-size: 14px;
  border-width: 0;
  &:disabled {
    background: var(--primary-color);
    border-color: transparent;
    opacity: 0.4;
  }
`;

const InputStyled = styled.input`
  height: 100%;
  border: none;
  padding: 0;
  background-color: transparent;
  flex: 1;
  &:focus-visible {
    outline: none;
  }
`;

const InputBox = styled.div`
  line-height: 53px;
  display: flex;
  align-items: center;
  font-size: 14px;
  flex: 1;
  .endfill {
    width: 56px;
  }
`;

const SearchBox = styled.div`
  /* width: 394px; */
  height: 54px;
  box-sizing: border-box;
  border: 1px solid var(--border-color-1);
  margin: 0 auto;
  border-radius: 8px;
  padding-left: 13px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  color: var(--font-color);
  gap: 4px;
    width: 100%;
`;

const SearchRight = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  .btn-clear {
    cursor: pointer;
  }
`;

const Loading = styled.img`
  user-select: none;
  width: 18px;
  height: 18px;
  animation: rotate 1s infinite linear;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;


export default function SearchProfile(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [snsName,setSnsName] = useState("");
    const [address,setAddress] = useState("");
    const [isPending, setPending] = useState(false);
    const AddressZero = "0x0000000000000000000000000000000000000000";

    const [detail, setDetail] = useState();



    const getDetail = async (address) => {
        let detail;
        setPending(true);

        const res = await getUsers([address]);
        // detail = res.data[0]?.sp;

        detail ={
            ...res.data[0]?.sp,
            ...res.data[0],

            sns:`${snsName}.seedao`
        }

        setDetail(detail);
        setPending(false);
    };


    const handleSubmit = async () =>{
        const address = await sns.resolve(`${snsName}.seedao`,getConfig().NETWORK.rpcs[0])
        if(address === AddressZero){
            // showToast(t('SNS.snsError'), ToastType.Danger);
        }else{
            await getDetail(address)
            setAddress(address)
        }

    }

    return     <Layout
        title={t('apps.snsQuery')}
        handleBack={() => {
            navigate("/home");
        }}
    >
        {detail && <UserModal user={detail} handleClose={() => setDetail(undefined)} />}
        <StepContainer>
            <div>
                <Box>
                    <StepTitle>{t('apps.snsQuery')}</StepTitle>
                    <StepDesc>{t('apps.SNSQueryDesc')}</StepDesc>
                    <Content>
                        <SearchBox>
                            <InputBox>
                                <InputStyled value={snsName} onChange={(e) => setSnsName(e.target.value)} className="rhtIpt"  />
                                <span className="endfill">.seedao</span>
                            </InputBox>
                            <SearchRight>
                                {isPending && <Loading src={LoadingImg} alt="" />}
                            </SearchRight>
                        </SearchBox>


                        <MintButton variant="primary"
                            onClick={() => handleSubmit()}
                            className="submitBtn"
                            disabled={!snsName.length}
                        >
                            {t('SNS.search')}
                            {/*{loading ? <Loading /> : <span>Parse</span>}*/}
                        </MintButton>
                    </Content>
                </Box>


            </div>


        </StepContainer>
    </Layout>
}
