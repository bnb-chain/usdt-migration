import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.24",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 10
                    }
                }
            }
        ]
    },

    networks: {
        'local': {
            url: process.env.BSC_LOCAL || "http://127.0.0.1:8545",
            accounts: {
                mnemonic: 'test test test test test test test test test test test junk',
            },
        },
        'bsc-testnet': {
            url: process.env.BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            accounts: {
                mnemonic: process.env.DEPLOYER_MNEMONIC || 'test test test test test test test test test test test junk',
            },
            gasPrice: 5e9,
        },
        'bsc': {
            url: process.env.BSC_RPC || 'https://bsc-dataseed1.binance.org',
            accounts: {
                mnemonic: process.env.DEPLOYER_MNEMONIC || 'test test test test test test test test test test test junk',
            },
            gasPrice: 1.1 * 1e9
        },
        'opbnb': {
            url: 'https://opbnb-mainnet-rpc.bnbchain.org',
            accounts: {
                mnemonic: process.env.DEPLOYER_MNEMONIC || 'test test test test test test test test test test test junk',
            },
            gasPrice: 1e8,
        },
        'opbnb-testnet': {
            url: 'https://opbnb-testnet-rpc.bnbchain.org',
            accounts: {
                mnemonic: process.env.DEPLOYER_MNEMONIC || 'test test test test test test test test test test test junk',
            },
            gasPrice: 2e8,
        },
    },
    etherscan: {
        apiKey: {
            opBNB: process.env.OPBNB_BSCSCAN_APIKEY || '',
            opBNBTestnet: process.env.OPBNB_BSCSCAN_APIKEY || '',

            bsc: process.env.BSCSCAN_APIKEY || '',
            bscTestnet: process.env.BSCSCAN_APIKEY || '',
        },
        customChains: [
            {
                network: "opBNB",
                chainId: 204, // opBNB Mainnet
                urls: {
                    apiURL: `https://api-opbnb.bscscan.com/api`,  // opBNB Mainnet
                    browserURL: "https://opbnb.bscscan.com",  // opBNB mainnet

                    // apiURL: `https://open-platform-tmp.bk.nodereal.cc/${process.env.OPBNBSCAN_APIKEY}/op-bnb-mainnet/contract/`,
                    // browserURL: "https://opbnbscan.com/",
                },
            },
            {
                network: "opBNBTestnet",
                chainId: 5611, // opBNB Testnet
                urls: {
                    apiURL: `https://api-opbnb-testnet.bscscan.com/api`,  // opBNB Testnet
                    browserURL: "https://opbnb-testnet.bscscan.com/",  // opBNB Testnet

                    // apiURL: `https://open-platform-tmp.bk.nodereal.cc/${process.env.OPBNBSCAN_APIKEY}/op-bnb-testnet/contract/`,
                    // browserURL: "https://testnet.opbnbscan.com/",
                },
            },
        ],
    },
};

export default config;
