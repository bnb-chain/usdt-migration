// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TokenMigration is Ownable2Step {
    using SafeERC20 for IERC20;

    /* ---------------------- immutable constants ----------------------*/
    address public immutable LP_PROVIDER;
    IERC20 public immutable OLD_USDT;
    IERC20 public immutable NEW_USDT;

    constructor(address _migrationLpProvider, address _oldUSDT, address _newUSDT) Ownable(_migrationLpProvider) {
        require(_migrationLpProvider != address(0) && _oldUSDT != address(0) && _newUSDT != address(0), "zero address");
        require(_oldUSDT != _newUSDT, "same USDT");

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
    function migrate(uint256 _amount) external {
        require(_amount > 0, "zero amount");
        require(OLD_USDT.allowance(msg.sender, address(this)) >= _amount, "OLD_USDT not approved");
        require(NEW_USDT.allowance(LP_PROVIDER, address(this)) >= _amount, "NEW_USDT not approved");

        OLD_USDT.safeTransferFrom(msg.sender, LP_PROVIDER, _amount);
        NEW_USDT.safeTransferFrom(LP_PROVIDER, msg.sender, _amount);
    }
}
