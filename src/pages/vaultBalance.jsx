import Layout from "../components/layout/layout";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useState} from "react";
import AppConfig from "../AppConfig";
import PublicJs from "../utils/publicJs";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Clipboard2Check, Share} from "react-bootstrap-icons";
import BgImg from '../assets/images/homebg.png';


const Box = styled.div`
    padding: 20px;
`
const CardBox = styled.div`
    background: #666;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  background: url(${BgImg}) top no-repeat;
  background-size: 100%;
  background-attachment: fixed;

  .vaultInner {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background: rgba(161, 110, 255, 0.2);
    padding: 20px;
    backdrop-filter: blur(5px);
  }
`



const FlexBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 15px;
    li{
      width: 33%;
      text-align: center;
      border-right: 1px solid #ccc;
      font-size: 12px;
      &:last-child{
        border-right: 0;
      }
    }
`

const UlBox = styled.ul`
  margin-top: 20px;
    li{
      border-bottom: 1px solid #ddd;
      padding: 20px 0;
    }
`
const LineBox = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`

const FirstLine = styled.div`
  display: flex;
  align-items: center;
  .iconBox{
    margin-right: 20px;
    font-size: 18px;
  }
`

const Num = styled.div`
    font-weight: bold;
  font-size: 16px;
`

const TipsBox = styled.div`
  background: rgba(0,0,0,0.2);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`
const InnerBox = styled.div`
    background: #fff;
  padding: 10px 20px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.08);
`

const TopBox = styled.div`
    width: 100%;
`

const Tit = styled.div`
    font-size: 12px;
`

const NumBal = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`

const Tag = styled.div`
    background: var(--bs-primary);
    margin-left: 10px;
    font-size: 12px;
    color: #fff;
    padding: 0 10px;
    border-radius: 10px;
`

const Addr = styled.div`
    font-size: 12px;
  margin-right: 20px;
`

const TitTop = styled.div`
    font-size: 14px;
    font-weight: bold;
`
export default function VaultBalance(){
    const { t } = useTranslation();
    const [totalBalance, setTotalBalance] = useState('0.00');
    const [totalSigner, setTotalSigner] = useState(0);
    const { VAULTS } = AppConfig;
    const [vaultsMap, setVaultsMap] = useState({});
    const [showCopid,setShowCopid] = useState(false);

    const SAFE_CHAIN = {
        [1]: {
            short: 'eth',
            name: 'Ethereum',
        },
        [137]: {
            short: 'matic',
            name: 'Polygon',
        },
    };
    const copyTo = () =>{
        setShowCopid(true)
        // PublicJs.copyToClipboard(wallet)
        setTimeout(()=>{
            setShowCopid(false)
        },1000)

    }

    const linkTo = (v) =>{
        window.open(`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`)
    }


    return <Layout noTab title={t('menus.assets')}>
        {
            showCopid &&  <TipsBox>
                <InnerBox>
                    {t('mobile.my.wallet')} {t('mobile.copied')}
                </InnerBox>
            </TipsBox>
        }
        <Box>
            <CardBox>
                <div className="vaultInner">
                    <TopBox>
                        <Tit>{t('Assets.TotalBalance')}</Tit>
                        <NumBal>${totalBalance}</NumBal>
                    </TopBox>
                    <FlexBox>
                        <li>
                            <div>{t('Assets.Wallet')}</div>
                            <div>4</div>
                        </li>
                        <li>
                            <div>{t('Assets.MultiSign')}</div>
                            <div>{totalSigner}</div>
                        </li>
                        <li>
                            <div>{t('Assets.Chain')}</div>
                            <div>2</div>
                        </li>
                    </FlexBox>
                </div>
            </CardBox>
            <UlBox>
                {
                    VAULTS.map((v,index)=>(<li key={index}>
                        <FirstLine>
                            <TitTop>{t(v.name)}</TitTop>
                            <Tag>{SAFE_CHAIN[v.chainId].name}  {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}</Tag>
                        </FirstLine>
                        <LineBox>
                            <FirstLine>
                                <Addr>{PublicJs.AddressToShow(v.address)}</Addr>
                                <CopyToClipboard text="123" onCopy={() => copyTo("123")}>
                                    <Clipboard2Check className="iconBox" />
                                </CopyToClipboard>
                                <Share onClick={()=>linkTo(v)} className="iconBox" />
                            </FirstLine>
                            <Num>
                                ${vaultsMap[v.id]?.balance || 0.0}
                            </Num>
                        </LineBox>
                    </li>))
                }

            </UlBox>
        </Box>
    </Layout>
}
