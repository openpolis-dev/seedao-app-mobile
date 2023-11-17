import Layout from "../components/layout/layout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Share } from "react-bootstrap-icons";
import { useEffect, useMemo, useState } from "react";
import store from "../store";
import { saveLoading } from "../store/reducer";
import { getProjectApplications } from "../api/applications";
import { formatTime } from "../utils/time";
import { useNavigate } from "react-router-dom";
import BgImg from "../assets/images/homebg.png";
import AppConfig from "../AppConfig";
import axios from "axios";
import { getTreasury } from "../api/treasury";
import { ethers } from "ethers";

import { formatNumber } from "../utils/number";
import PublicJs from "../utils/publicJs";
import CopyBox from "../components/common/copy";
import VAULTS from "constant/vault";

export default function Assets() {
  const { t } = useTranslation();

  const [totalBalance, setTotalBalance] = useState("0.00");
  const [totalSigner, setTotalSigner] = useState(0);
  const [vaultsMap, setVaultsMap] = useState({});
  const [nftData, setNftData] = useState({
    floorPrice: 0,
    totalSupply: 0,
  });

  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(false);
  const [status3, setStatus3] = useState(false);
  const [status4, setStatus4] = useState(false);

  const [asset, setAsset] = useState({
    token_remain_amount: 0,
    token_total_amount: 0,
    credit_remain_amount: 0,
    credit_total_amount: 0,
    credit_used_amount: 0,
    token_used_amount: 0,
  });

  const [totalSCR, setTotalSCR] = useState("0");
  const { SCR_CONTRACT } = AppConfig;
  const SCR_PRICE = 0.3;

  const SCRValue = useMemo(() => {
    return Number(totalSCR) * SCR_PRICE;
  }, [totalSCR]);

  const SAFE_CHAIN = {
    [1]: {
      short: "eth",
      name: "Ethereum",
    },
    [137]: {
      short: "matic",
      name: "Polygon",
    },
  };

  const getVaultBalance = async ({ chainId, address }) => {
    return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}/balances/usd?trusted=true`);
  };

  const getVaultInfo = async ({ chainId, address }) => {
    return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}`);
  };

  useEffect(() => {
    getAssets();
    getVaultsInfo();
    getFloorPrice();
    getSCR();
  }, []);

  useEffect(() => {
    store.dispatch(saveLoading(status1 || status2 || status3 || status4));
  }, [status1, status2, status3, status4]);

  const getAssets = async () => {
    // store.dispatch(saveLoading(true));
    setStatus4(true);
    try {
      const res = await getTreasury();
      setAsset({
        token_remain_amount: Number(res.data.token_remain_amount),
        token_total_amount: Number(res.data.token_total_amount),
        credit_remain_amount: Number(res.data.credit_remain_amount),
        credit_used_amount: Number(res.data.credit_used_amount),
        credit_total_amount: Number(res.data.credit_total_amount),
        token_used_amount: Number(res.data.token_used_amount),
      });
    } catch (error) {
      console.error("getTreasury error", error);
    } finally {
      setStatus4(false);
      // store.dispatch(saveLoading(false));
    }
  };

  const getVaultsInfo = async () => {
    const vaults_map = {};
    const users = [];
    let _total = 0;
    // store.dispatch(saveLoading(true));
    setStatus1(true);
    try {
      const reqs = VAULTS.map((item) => getVaultBalance(item));
      const results = await Promise.allSettled(reqs);
      results.forEach((res, index) => {
        if (res.status === "fulfilled") {
          const _v = Number(res.value.data?.fiatTotal || 0);
          vaults_map[VAULTS[index].id] = {
            balance: _v.toFixed(2),
          };
          _total += _v;
        }
      });
    } catch (error) {
      console.error("getVaultBalance error", error);
    }
    try {
      const reqs = VAULTS.map((item) => getVaultInfo(item));
      const results = await Promise.allSettled(reqs);
      results.forEach((res, index) => {
        if (res.status === "fulfilled") {
          const _id = VAULTS[index].id;
          if (!vaults_map[_id]) {
            vaults_map[_id] = {};
          }
          vaults_map[_id].total = res.value.data?.owners.length || 0;
          vaults_map[_id].threshold = res.value.data?.threshold || 0;
          users.push(...res.value.data?.owners.map((item) => item.value));
        }
      });
    } catch (error) {
      console.error("getVaultInfo error", error);
    } finally {
      setStatus1(false);
      // store.dispatch(saveLoading(false));
    }
    setTotalSigner([...new Set(users)].length);
    setTotalBalance(_total.toFixed(2));
    setVaultsMap(vaults_map);
  };

  const getFloorPrice = async () => {
    // store.dispatch(saveLoading(true));
    setStatus3(true);
    try {
      const url = "https://restapi.nftscan.com/api/v2/statistics/collection/0x23fda8a873e9e46dbe51c78754dddccfbc41cfe1";
      // const {XAPIKEY} = AppConfig;
      const res = await axios.get(url, {
        headers: {
          "X-API-KEY": "laP3Go52WW4oBXdt7zhJ7aoj",
        },
      });
      setNftData({
        floorPrice: res.data?.data?.floor_price || 0,
        totalSupply: res.data?.data?.items_total || 0,
      });
    } catch (error) {
      console.error("getFloorPrice error", error);
    } finally {
      setStatus3(false);
      // store.dispatch(saveLoading(false));
    }
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE",
    );
    // store.dispatch(saveLoading(true));
    setStatus2(true);
    try {
      const contract = new ethers.Contract(
        SCR_CONTRACT,
        [
          {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        provider,
      );
      const supply = await contract.totalSupply();
      setTotalSCR(ethers.utils.formatEther(supply));
    } catch (error) {
      console.error("getSCR error", error);
    } finally {
      setStatus2(false);
      // store.dispatch(saveLoading(false));
    }
  };

  const linkTo = (v) => {
    window.open(`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`);
  };

  return (
    <Layout title={t("Menus.Vault")} bgColor="var(--primary-color)" headBgColor="var(--primary-color)" headColor="#FFF">
      <TotalAssets>
        <div className="value">${formatNumber(Number(totalBalance))}</div>
        <div className="label">{t("Vault.TotalAssets")}</div>
      </TotalAssets>
      <WalletBox>
        {VAULTS.map((v, index) => (
          <WalletItem key={index}>
            <WalletItemLeft>
              <div className="name">{t(v.name)}</div>
              <Addr>{PublicJs.AddressToShow(v.address, 4)}</Addr>
              <img src={v.icon} alt="" onClick={() => linkTo(v)} />
              <div className="signer">
                {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}
              </div>
            </WalletItemLeft>
            <WalletItemValue>${formatNumber(vaultsMap[v.id]?.balance || 0.0)}</WalletItemValue>
            {/* <FirstLine>
              <Tag>
                {SAFE_CHAIN[v.chainId].name} {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}
              </Tag>
            </FirstLine>
            <LineBox>
              <FirstLine>
                <CopyBox text={v.address} />
              </FirstLine>
            </LineBox> */}
          </WalletItem>
        ))}
      </WalletBox>
      <Box>
        <FlexBox>
          <CardItem>
            <Tit>{t("Assets.SupplySCR")}</Tit>
            <Num>{formatNumber(totalSCR)}</Num>
            <BtmLine>
              <div>≈ {formatNumber(SCRValue.toFixed(2))} U</div>
              <div>(1SCR ≈ {SCR_PRICE} U)</div>
            </BtmLine>
            <div className="decorBg">SEE</div>
          </CardItem>
          <CardItem>
            <Tit>{t("Assets.SupplySGN")}</Tit>
            <Num>{formatNumber(nftData.totalSupply)}</Num>
            <BtmLine>
              <div>{t("Assets.FloorPrice")}</div>
              <div>{nftData.floorPrice} ETH</div>
            </BtmLine>
            <div className="decorBg">DAO</div>
          </CardItem>
          <CardItem>
            <Tit>{t("Assets.SeasonUseUSD")}</Tit>
            {/*<Num>{(asset.token_total_amount || 0) - (asset.token_remain_amount||0)}</Num>*/}
            <Num>{formatNumber(asset.token_used_amount)}</Num>
            <BtmLine>
              <div>{t("Assets.SeasonBudget")}</div>
              <div>{formatNumber(asset.token_total_amount)}</div>
            </BtmLine>
            <div className="decorBg">SEE</div>
          </CardItem>
          <CardItem>
            <Tit>
              <div>{t("Assets.SeasonUsedSCR")}</div>
              <div>{t("Assets.SCRTip")}</div>
            </Tit>
            {/*<Num>{(asset.credit_total_amount || 0) - (asset.credit_remain_amount || 0)}</Num>*/}
            <Num>{formatNumber(asset.credit_used_amount)}</Num>
            <BtmLine>
              <div>{t("Assets.SeasonBudget")}</div>
              <div>{asset.credit_total_amount}</div>
            </BtmLine>
            <div className="decorBg">DAO</div>
          </CardItem>
        </FlexBox>
      </Box>
    </Layout>
  );
}

const TotalAssets = styled.div`
  text-align: center;
  .value {
    font-size: 26px;
    font-family: Poppins, Poppins;
    font-weight: 600;
    color: #ffffff;
    line-height: 34px;
    margin-top: 8px;
  }
  .label {
    font-size: 12px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    margin-top: 3px;
  }
`;

const WalletItem = styled.li`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  line-height: 50px;
`;

const WalletItemLeft = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 400;
  .name {
    margin-right: 20px;
    font-weight: 600;
    color: #eee5ff;
  }
  img {
    margin-right: 4px;
  }
`;
const WalletItemValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #ff7193;
`;

const Box = styled.div`
  padding: 20px;
`;

const CardBox = styled.div`
  background: #666;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
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
    -webkit-backdrop-filter: blur(5px);
  }
`;
const Num = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const Tit = styled.div`
  font-size: 12px;
  text-align: center;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 10px;
`;

const CardItem = styled(CardBox)`
  width: 48%;
  margin-bottom: 20px;
  padding: 20px 10px;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  &:first-child {
    background: linear-gradient(to right, #9d72fa, #6961fa);
  }
  &:nth-child(2) {
    background: linear-gradient(to right, #f1a6b6, #8f69d2);
  }
  &:nth-child(3) {
    background: linear-gradient(to right, #3bdabe, #44b5f4);
  }
  &:nth-child(4) {
    background: linear-gradient(to right, #f9a488, #fe7c7c);
  }

  .decorBg {
    position: absolute;
    right: 0;
    bottom: -25px;
    font-size: 85px;
    font-family: "Jost-Bold";
    opacity: 0.04;
    color: #000;
    width: 100%;
    text-align: center;
    letter-spacing: -5px;
  }
`;

const BtmLine = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  align-items: center;
`;

const WalletBox = styled.ul`
  color: #fff;
  margin-top: 20px;
  padding-inline: 20px;
`;


const Addr = styled.div`
  font-size: 12px;
  margin-right: 9px;
`;

