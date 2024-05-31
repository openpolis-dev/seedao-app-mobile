import Layout from "../../components/layout/layout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import store from "../../store";
import { saveLoading } from "../../store/reducer";
import AppConfig from "../../AppConfig";
import { ethers } from "ethers";

import { getShortDisplay } from "../../utils/number";
import PublicJs from "../../utils/publicJs";
import CopyBox from "../../components/common/copy";
import CardIcon1 from "assets/Imgs/vault/cardIcon1.svg";
import CardIcon2 from "assets/Imgs/vault/cardIcon2.svg";
import ApplicantsSection from "components/vault/applications";
import getConfig from "constant/envCofnig";
import { getVaultBalance } from "api/publicData";
import EthereumIcon from "assets/Imgs/network/ethereum.webp";
import PolygonIcon from "assets/Imgs/network/polygon.webp";

const SAFE_CHAIN = {
  1: {
    short: "eth",
    name: "Ethereum",
  },
  137: {
    short: "matic",
    name: "Polygon",
  },
};

const getChainIcon = (chainId) => {
  switch (chainId) {
    case 1:
      return EthereumIcon;
    case 137:
      return PolygonIcon;
    default:
      return "";
  }
};

const getVaultName = (address) => {
  switch (address) {
    case "0x7FdA3253c94F09fE6950710E5273165283f8b283":
      return "Vault.CommunityVault";
    case "0x4876eaD85CE358133fb80276EB3631D192196e24":
      return "Vault.CommunityVault";
    case "0x70F97Ad9dd7E1bFf40c3374A497a7583B0fAdd25":
      return "Vault.CityHallVault";
    case "0x444C1Cf57b65C011abA9BaBEd05C6b13C11b03b5":
      return "Vault.IncubatorVault";
    default:
      return "";
  }
};

export default function Assets() {
  const { t } = useTranslation();

  const [totalBalance, setTotalBalance] = useState("0.00");
  const [vaultsMap, setVaultsMap] = useState({});
  const [nftData, setNftData] = useState({
    floorPrice: 0,
    totalSupply: 0,
  });

  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(false);
  const [status3, setStatus3] = useState(false);

  const [totalSCR, setTotalSCR] = useState("0.00");
  const { SCR_CONTRACT } = AppConfig;
  const [wallets, setWallets] = useState([]);

  const getVaultData = async () => {
    try {
      setStatus1(true);
      const res = await getVaultBalance();
      setWallets(res.data.wallets);
      let v = 0;
      res.data.wallets.forEach((w) => (v += Number(w.fiatTotal)));
      setTotalBalance(v.format());
    } catch (error) {
      logError(error);
    } finally {
      setStatus1(false);
    }
  };

  useEffect(() => {
    getVaultData();
    getFloorPrice();
    getSCR();
  }, []);

  useEffect(() => {
    store.dispatch(saveLoading(status1 || status2 || status3));
  }, [status1, status2, status3]);

  const getFloorPrice = async () => {
    setStatus3(true);
    try {
      fetch(`${getConfig().INDEXER_ENDPOINT}/insight/erc721/total_supply/0x30093266E34a816a53e302bE3e59a93B52792FD4`)
        .then((res) => res.json())
        .then((r) => {
          setNftData({
            floorPrice: "0",
            totalSupply: r.totalSupply,
          });
        });
    } catch (error) {
      logError("getFloorPrice error", error);
    } finally {
      setStatus3(false);
    }
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(getConfig().NETWORK.rpcs[0]);
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
      setTotalSCR(Number(ethers.utils.formatEther(supply)).format());
    } catch (error) {
      logError("getSCR error", error);
    } finally {
      setStatus2(false);
      // store.dispatch(saveLoading(false));
    }
  };

  const linkTo = (v) => {
    window.open(`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.wallet}`);
  };

  const handleBg = () => {
    document.querySelector("body").style.background = "var(--primary-color)";
  };

  return (
    <Layout
      title={t("Menus.Vault")}
      bgColor="var(--background-color)"
      headBgColor="var(--primary-color)"
      headColor="#fff"
    >
      <TopBox>
        <TotalAssets>
          <div className="value">${getShortDisplay(totalBalance, 2)}</div>
          <div className="label">{t("Vault.TotalAssets")}</div>
        </TotalAssets>
        <WalletBox>
          {wallets.map((v) => (
            <WalletItem key={v.wallet}>
              <WalletItemLeft>
                <div className="name">{t(getVaultName(v.wallet))}</div>
                <CopyBox style={{ width: "78px" }} text={v.wallet}>
                  <Addr>{PublicJs.AddressToShow(v.wallet)}</Addr>
                </CopyBox>
                <img src={getChainIcon(v.chainId)} alt="" onClick={() => linkTo(v)} />
                <div className="signer">
                  {v.threshold}/{v.owners}
                </div>
              </WalletItemLeft>
              <WalletItemValue>${Number(v.fiatTotal).format()}</WalletItemValue>
            </WalletItem>
          ))}
        </WalletBox>
      </TopBox>

      <BottomBox>
        <FlexBox>
          <CardItem>
            <img src={CardIcon1} alt="" />
            <Num>{totalSCR}</Num>
            <Tit>{t("Vault.SupplySCR")}</Tit>
          </CardItem>
          <CardItem>
            <img src={CardIcon2} alt="" />
            <Num>{nftData.totalSupply}</Num>
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
`;

const TotalAssets = styled.div`
  text-align: center;

  .value {
    font-size: 26px;
    font-weight: 600;
    color: #ffffff;
    line-height: 34px;
    padding-top: 8px;
    font-family: "Poppins-SemiBold";
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
  &:last-child {
    border-bottom: 0;
  }
`;

const WalletItemLeft = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 400;
  align-items: center;
  .name {
    min-width: 120px;
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
    width: 14px;
    height: 14px;
    position: relative;
    top: -1px;
  }
`;
const WalletItemValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #ff7193;
  font-family: "Poppins-Medium";
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
  font-family: "Poppins-SemiBold";
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
