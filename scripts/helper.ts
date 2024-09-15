import { ethers } from 'hardhat';
import { execSync } from 'child_process';

const log = console.log;

export const unit = ethers.WeiPerEther;

export const deployContract = async (factoryPath: string, ...args: any) => {
    const factory = await ethers.getContractFactory(factoryPath);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment()
    return contract;
};

export const getCommitId = async (): Promise<string> => {
    try {
        const result = execSync('git rev-parse HEAD');
        log('getCommitId', result.toString().trim());
        return result.toString().trim();
    } catch (e) {
        console.error('getCommitId error', e);
        return '';
    }
};

export const toHuman = (x: bigint, decimals?: number) => {
    if (!decimals) decimals = 18;
    return ethers.formatUnits(x, decimals);
};

export async function sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
