import { toHuman } from './helper';
const { ethers, run } = require('hardhat');
const log = console.log;

const main = async () => {
    const { chainId } = await ethers.provider.getNetwork();
    log('chainId', chainId);
    const contracts: any = require(`../deployment/${chainId}-deployment.json`);

    const [operator] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(operator.address);
    log('operator.address: ', operator.address, toHuman(balance));

    try {
        await run('verify:verify', {
            address: contracts.TokenMigration,
            contract: 'contracts/TokenMigration.sol:TokenMigration',
            constructorArguments: contracts.DeployArgs,
        });
    } catch (e) {
        log('verify TokenMigration error', e);
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
