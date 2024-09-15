// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/TokenMigration.sol";
import "../contracts/test/TestUSDT.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract TokenMigrationTest is Test {
    address public constant OLD_USDT = 0x55d398326f99059fF775485246999027B3197955;
    address public constant MOCK_USER = 0x0000000000000000000000000000000000001234;

    TokenMigration migration;
    TestUSDT testUSDT;

    function setUp() public {
        vm.createSelectFork("bsc");
        testUSDT = new TestUSDT();
        migration = new TokenMigration(address(this), OLD_USDT, address(testUSDT));
    }

    function testMigration() public {
        vm.expectRevert("OLD_USDT not approved");
        migration.migrate(100 ether);

        testUSDT.approve(address(migration), 100 ether);

        vm.startPrank(MOCK_USER);
        deal(OLD_USDT, MOCK_USER, 10000 ether);

        IERC20(OLD_USDT).approve(address(migration), 100 ether);
        migration.migrate(100 ether);

        assertEq(testUSDT.balanceOf(MOCK_USER), 100 ether);
        vm.stopPrank();
    }

    function testRescue() public {
        deal(OLD_USDT, address(migration), 10000 ether);

        migration.rescue(OLD_USDT, MOCK_USER, 100 ether);

        vm.prank(MOCK_USER);
        vm.expectRevert();
        migration.rescue(OLD_USDT, MOCK_USER, 100 ether);
    }
}

