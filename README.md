# USDT Migration

## Quick Start
### install foundry, refer to https://book.getfoundry.sh/getting-started/installation
### build
```
$ npm i
$ forge install --no-git --no-commit foundry-rs/forge-std
```

### test
```
$ forge t
```

## Deployment
```shell
# set DEPLOYER_MNEMONIC to your MNEMONIC in .env
# make sure you have enough tBNB in your wallet on BSC testnet
$ npx hardhat run scripts/1-deploy.ts --network bsc-testnet 
# check deployments/97-deployment.json

```
