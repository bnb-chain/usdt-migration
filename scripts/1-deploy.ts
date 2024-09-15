import { ethers } from 'hardhat';
import fs from "fs";
import {toHuman} from "./helper";
const log = console.log

const contractName = 'TokenMigration';

// TODO
let MIGRATION_MULTI_SIG_WALLET = '';
const OLD_USDT = '0x55d398326f99059fF775485246999027B3197955';
// TODO
const NEW_USDT = '0x5092FD6ce0c5050622f829b6125E7dF5E53A6832';

const main = async () => {
    const { chainId } = await ethers.provider.getNetwork();
    const signers = await ethers.getSigners();
    const operator = signers[0];
    if (!MIGRATION_MULTI_SIG_WALLET) {
      MIGRATION_MULTI_SIG_WALLET = operator.address;
    }

    const balance = await ethers.provider.getBalance(operator.address);
    log('operator.address: ', operator.address, toHuman(balance));

    const DeployArgs: string[] = [
      MIGRATION_MULTI_SIG_WALLET,
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
        MIGRATION_MULTI_SIG_WALLET,
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
