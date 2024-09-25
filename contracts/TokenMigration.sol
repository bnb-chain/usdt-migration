// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TokenMigration is Ownable2Step {
    using SafeERC20 for IERC20;

    uint256 public constant OLD_USDT_DECIMALS = 18;
    uint256 public constant NEW_USDT_DECIMALS = 6;
    uint256 public constant USDT_CONVERT_UINT_RATE = 10**(OLD_USDT_DECIMALS - NEW_USDT_DECIMALS);

    /* ---------------------- immutable constants ----------------------*/
    address public immutable LP_PROVIDER;
    IERC20 public immutable OLD_USDT;
    IERC20 public immutable NEW_USDT;

    constructor(address _migrationLpProvider, address _oldUSDT, address _newUSDT) Ownable(_migrationLpProvider) {
        require(_migrationLpProvider != address(0) && _oldUSDT != address(0) && _newUSDT != address(0), "zero address");
        require(_oldUSDT != _newUSDT, "same USDT");

        require(IERC20Metadata(_oldUSDT).decimals() == OLD_USDT_DECIMALS, "invalid OLD_USDT decimals");
        require(IERC20Metadata(_newUSDT).decimals() == NEW_USDT_DECIMALS, "invalid NEW_USDT decimals");

        LP_PROVIDER = _migrationLpProvider;
        OLD_USDT = IERC20(_oldUSDT);
        NEW_USDT = IERC20(_newUSDT);
    }

    /* ---------------------- onlyOwner ----------------------*/
    function rescue(address _token, address _recipient, uint256 _amount) external onlyOwner {
        require(_amount > 0, "zero amount");
        require(_recipient != address(0), "zero _recipient");

        IERC20(_token).safeTransfer(_recipient, _amount);
    }

    /* ---------------------- external ----------------------*/
    function migrate(uint256 _oldUsdtAmount) external {
        uint256 _newUsdtAmount = _oldUsdtAmount / USDT_CONVERT_UINT_RATE;
        require(_newUsdtAmount > 0, "zero new usdt amount");

        OLD_USDT.safeTransferFrom(msg.sender, LP_PROVIDER, _oldUsdtAmount);
        NEW_USDT.safeTransferFrom(LP_PROVIDER, msg.sender, _newUsdtAmount);
    }
}
