import Layout from "../components/layout/layout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import store from "../store";
import { saveLoading } from "../store/reducer";
import AppConfig from "../AppConfig";
import axios from "axios";
import { getTreasury } from "../api/treasury";
import { ethers } from "ethers";

import { formatNumber } from "../utils/number";
import PublicJs from "../utils/publicJs";
import CopyBox from "../components/common/copy";
import VAULTS from "constant/vault";
import CardIcon1 from "assets/Imgs/vault/cardIcon1.svg";
import CardIcon2 from "assets/Imgs/vault/cardIcon2.svg";
import ApplicantsSection from "components/vault/applications";

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
      const url = "https://restapi.nftscan.com/api/v2/statistics/collection/0x30093266e34a816a53e302be3e59a93b52792fd4";
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

  const handleBg = () => {
    document.querySelector("body").style.background = "var(--primary-color)";
  }

  return (
    <Layout
      title={t("Menus.Vault")}
      bgColor="var(--background-color)"
      headBgColor="var(--primary-color)"
      headColor="#fff"
    >
      <TopBox>
        <TotalAssets>
          <div className="value">${formatNumber(Number(totalBalance))}</div>
          <div className="label">{t("Vault.TotalAssets")}</div>
        </TotalAssets>
        <WalletBox>
          {VAULTS.map((v, index) => (
            <WalletItem key={index}>
              <WalletItemLeft>
                <div className="name">{t(v.name)}</div>
                <CopyBox style={{ width: "65px" }} text={v.address} >
                  <Addr>{PublicJs.AddressToShow(v.address, 4)}</Addr>
                </CopyBox>
                <img src={v.icon} alt="" onClick={() => linkTo(v)} />
                <div className="signer">
                  {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}
                </div>
              </WalletItemLeft>
              <WalletItemValue>${formatNumber(vaultsMap[v.id]?.balance || 0.0)}</WalletItemValue>
            </WalletItem>
          ))}
        </WalletBox>
      </TopBox>

      <BottomBox>
        <FlexBox>
          <CardItem>
            <img src={CardIcon1} alt="" />
            <Num>{formatNumber(totalSCR)}</Num>
            <Tit>{t("Vault.SupplySCR")}</Tit>
          </CardItem>
          <CardItem>
            <img src={CardIcon2} alt="" />
            <Num>{formatNumber(nftData.totalSupply)}</Num>
            <Tit>{t("Vault.SupplySeed")}</Tit>
          </CardItem>
        </FlexBox>
        <ApplicantsSection handleBg={handleBg} />
      </BottomBox>
    </Layout>
  );
}

const TopBox = styled.div`
  background: var(--primary-color);
  padding-bottom: 18px;
`

const TotalAssets = styled.div`
  text-align: center;

  .value {
    font-size: 26px;
    font-weight: 600;
    color: #ffffff;
    line-height: 34px;
    padding-top: 8px;
    font-family: 'Poppins-SemiBold';
  }
  .label {
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    margin-top: 3px;
  }
`;

const WalletItem = styled.li`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  line-height: 50px;
  &:last-child{
    border-bottom: 0;
  }
`;

const WalletItemLeft = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 400;
  .name {
    min-width: 130px;
    font-weight: 600;
    color: #eee5ff;
    flex: 3;
  }
  .signer {
    width: 35px;
  }
  img {
    margin-right: 4px;
    margin-left: 9px;
  }
`;
const WalletItemValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #ff7193;
  font-family: 'Poppins-Medium';
`;

const BottomBox = styled.div`
  padding: 20px;
  background-color: var(--background-color);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  margin-top: -18px;
`;

const Num = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  line-height: 26px;
  margin-top: 5px;
  font-family: 'Poppins-SemiBold';
`;
const Tit = styled.div`
  font-size: 12px;
  color: var(--font-light-color);
`;

const FlexBox = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 22px;
`;

const CardItem = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  flex: 1;
`;

const WalletBox = styled.ul`
  color: #fff;
  margin-top: 20px;
  padding-inline: 20px;
  padding-bottom: 10px;
`;

const Addr = styled.div`
  font-size: 12px;
  margin-right: 9px;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
