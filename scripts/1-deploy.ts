import { ethers } from 'hardhat';
import fs from "fs";
import {toHuman} from "./helper";
const log = console.log

const contractName = 'TokenMigration';

// TODO
let LP_PROVIDER = '';
// TODO
// const OLD_USDT = '0x55d398326f99059fF775485246999027B3197955';  // MAINNET
const OLD_USDT = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'; // TESTNET
// TODO
// const NEW_USDT = ''; // MAINNET
const NEW_USDT = '0x92C618b53e31a3eEc1D511556F48A2e06AF0F590'; // TESTNET

const main = async () => {
    const { chainId } = await ethers.provider.getNetwork();
    const signers = await ethers.getSigners();
    const operator = signers[0];
    if (!LP_PROVIDER) {
      LP_PROVIDER = operator.address;
    }

    const balance = await ethers.provider.getBalance(operator.address);
    log('operator.address: ', operator.address, toHuman(balance));

    const DeployArgs: string[] = [
      LP_PROVIDER,
      OLD_USDT,
      NEW_USDT,
    ]
    const contract = await ethers.deployContract(contractName, DeployArgs, operator);
    const contractAddress = await contract.getAddress()
    log('await contract.getAddress()', contractAddress);

    const tx = contract.deploymentTransaction();
    let deployments = {
        ChainId: chainId.toString(),

        Operator: operator.address,
        TokenMigration: contractAddress,

        DeployArgs,
        LP_PROVIDER,
        OLD_USDT,
        NEW_USDT,

        DeployTxHash: tx ? tx.hash : '',
    };
    log(`deployments`, JSON.stringify(deployments, null, 2));

    const deploymentDir = __dirname + `/../deployment`;
    if (!fs.existsSync(deploymentDir)) {
        fs.mkdirSync(deploymentDir, { recursive: true });
    }
    fs.writeFileSync(`${deploymentDir}/${chainId}-deployment.json`, JSON.stringify(deployments, null, 2))
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
