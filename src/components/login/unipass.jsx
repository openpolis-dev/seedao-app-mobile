import {Button} from "react-bootstrap";
import { UniPassProvider } from "@unipasswallet/ethereum-provider";
import {ethers} from "ethers";
import {useState} from "react";

export default function Unipass(){

    const [addr,setAddr] = useState();
    const [provider,setProvider] = useState();

    const getP = async() =>{
        const upProvider = new UniPassProvider({
            chainId: 97,
            returnEmail: false,
            appSetting: {
                appName: 'test dapp',
                appIcon: 'your icon url',
            },
            rpcUrls: {
                mainnet: "https://mainnet.infura.io/v3/",
                polygon: "https://polygon.llamarpc.com",
                bscTestnet:"https://data-seed-prebsc-1-s1.binance.org:8545"
                // bscMainnet: "your bsc mainnet rpc url",
                // rangersMainnet: "your rangers mainnet rpc url",
                // arbitrumMainnet: "your arbitrum mainnet rpc url",
                //
                // polygonMumbai: "your polygon testnet rpc url",
                // goerli: "your goerli testnet rpc url",
                // bscTestnet: "your bsc testnet rpc url",
                // rangersRobin: "your rangers testnet rpc url",
                // arbitrumTestnet: "your arbitrum testnet rpc url",
            },
        });
        await upProvider.connect();
        const provider = new ethers.BrowserProvider(upProvider, "any");
        setProvider(provider);

    }

    const connect = async() =>{
        try{
            await getP()
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            console.log("provider address", address);
            setAddr(address)

        }catch (e) {
            console.error(e)
        }



    }

    return <div>
        <div>---{addr}----</div>
        <Button  onClick={()=>connect()}>Unipass</Button>
    </div>
}
