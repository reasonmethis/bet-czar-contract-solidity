// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db,0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB,1000000000000000000,2000000000000000000
contract BetCzar {
    //TODO emit events
    enum BetStatus {
        CREATED, WAITING_FOR1, WAITING_FOR2, PENDING, 
        WON1, WON2, CLAIMED1, CLAIMED2, CANCELED, CLAIMED_REFUND1, 
        CLAIMED_REFUND2, CLAIMED_REFUNDS
    }
    struct Bet {
        address bettor1;
        address bettor2;
        address judge;
        BetStatus status; //check proper packing
        uint amt1;
        uint amt2;
    }
    error InvalidId(); //cheaper than string 
    error InvalidStatus();

    address public owner;
    Bet[] public bets;

    constructor() {
        owner = msg.sender;
    }

    function getBet(uint betId) internal view returns(Bet memory bet) {
        if (betId >= bets.length) {
            revert InvalidId();
        }
        bet = bets[betId]; //would unchecked optimize?
    }

    function getStatus(uint betId) external view returns(BetStatus) {
        return getBet(betId).status;
    }
    
    function createBet(address _bettor1, address _bettor2, address _judge, 
        uint _amt1, uint _amt2) external returns(uint betId){
        //TODO sanity checks
        betId = bets.length;
        bets.push(Bet(_bettor1, _bettor2, _judge, BetStatus.CREATED, 
            _amt1, _amt2));
    }
    function deposit1(uint betId) external payable {
        //deposit for bettor1
        Bet memory bet = getBet(betId);
        require(msg.value == bet.amt1);
        if (bet.status == BetStatus.CREATED) {
            bets[betId].status = BetStatus.WAITING_FOR2;
        } else if (bet.status == BetStatus.WAITING_FOR1) {
            bets[betId].status = BetStatus.PENDING;
        } else {
            revert InvalidStatus();
        }
    }

    function deposit2(uint betId) external payable {
        //deposit for bettor2
        Bet memory bet = getBet(betId);
        require(msg.value == bet.amt2);
        if (bet.status == BetStatus.CREATED) {
            bets[betId].status = BetStatus.WAITING_FOR1;
        } else if (bet.status == BetStatus.WAITING_FOR2) {
            bets[betId].status = BetStatus.PENDING;
        } else {
            revert InvalidStatus();
        }
    }
    
    function recallDeposit(uint betId) external {
        //if we are still waiting for bettor 2's deposit, bettor 1
        //should be allowed to change their mind and recall their
        //deposit (otherwise what if bettor 2 never deposits?!)
        //and vice versa
        Bet memory bet = getBet(betId);
        uint amt;
        if (msg.sender == bet.bettor1) {
            if (bet.status != BetStatus.WAITING_FOR2) {
                revert InvalidStatus();
            }
            amt = bet.amt1;
        } else if (msg.sender == bet.bettor2) {
            if (bet.status != BetStatus.WAITING_FOR1) {
                revert InvalidStatus();
            }
            amt = bet.amt2;
        } else {
            revert("not a bettor"); //skip or replace with error
        }
        //first change status 
        bets[betId].status = BetStatus.CREATED;
        //now refund the bettor
        (bool success, bytes memory data) = msg.sender.call{value: amt}("");
        require(success, "send failed");
    }
/*
    function recall2(uint betId) external {
        Bet memory bet = getBet(betId);
        require(bet.bettor2 == msg.sender, "not bettor 2");
        if (bet.status != BetStatus.WAITING_FOR1) {
            revert InvalidStatus();
        }
        //first change status to prevent reentrancy
        bets[betId].status = BetStatus.CREATED;
        //now refund bettor 2
        (bool success, bytes memory data) = bet.bettor2.call{value: bet.amt2}("");
        require(success, "send failed");
    }
*/
    function adjudicate(uint betId, uint winner) external {
        require(winner < 3, "invalid winner"); //cancel bet
        Bet memory bet = getBet(betId);
        require(msg.sender == bet.judge, "not judge");
        require(bet.status == BetStatus.PENDING, "not pending");
        if (winner == 1) {
            bets[betId].status = BetStatus.WON1;
        } else if (winner == 2) {
            bets[betId].status = BetStatus.WON2;
        } else {
            bets[betId].status = BetStatus.CANCELED;
        }
    }

    function forfeit(uint betId) external {
        //a bettor can agree that the other bettor won,
        //in which case the judge is not needed
        Bet memory bet = getBet(betId);
        require(bet.status == BetStatus.PENDING, "not pending");
        if (msg.sender == bet.bettor1) {
            bets[betId].status = BetStatus.WON2;
        } else if (msg.sender == bet.bettor2) {
            bets[betId].status = BetStatus.WON1;
        } else {
            revert("not a bettor"); //optimize gas by not reverting?
        }
    }

    function sendWinnings(uint betId) external {
        //send funds to the winner (anyone can run it)
        Bet memory bet = getBet(betId);
        if (bet.status == BetStatus.WON1) {
            bets[betId].status = BetStatus.CLAIMED1;
            (bool success, bytes memory data) = 
                bet.bettor1.call{value: bet.amt1 + bet.amt2}("");
            require(success, "send failed");

        } else if (bet.status == BetStatus.WON2) {
            bets[betId].status = BetStatus.CLAIMED2;
            (bool success, bytes memory data) = 
                bet.bettor2.call{value: bet.amt1 + bet.amt2}("");
            require(success, "send failed");

        } else if (bet.status == BetStatus.CANCELED) {
            //refund bettors their amounts
            //in case one bettor can't accept funds for some reason still send
            //refund to the other and set a special status
            //and of course guard against reentrancy
            bets[betId].status = BetStatus.CLAIMED_REFUND1;
            (bool success, bytes memory data) = 
                bet.bettor1.call{value: bet.amt1}("");

            //This part is slightly tricky because success could be true or false.
            //we now make sure the correct current status is stored in
            //the memory variable bet.status, and set the status in storage 
            //to what it should be if the next transfer - refund to bettor 2 - 
            //succeeds. 
            if (success) {
                bet.status = BetStatus.CLAIMED_REFUND1;
                bets[betId].status = BetStatus.CLAIMED_REFUNDS;
            } else {
                //revert status change (have to do it this way - reentrancy!
                bets[betId].status = BetStatus.CLAIMED_REFUND2;
            }
            //now try to refund the second bettor
            (success, data) = 
                bet.bettor2.call{value: bet.amt2}("");
            if (!success) {
                //revert status change (have to do it this way - reentrancy!
                bets[betId].status = bet.status;
            }

        } else if (bet.status == BetStatus.CLAIMED_REFUND1) {
            // refund bettor 2 only
            bets[betId].status = BetStatus.CLAIMED_REFUNDS;
            (bool success, bytes memory data) = 
                bet.bettor2.call{value: bet.amt2}("");
            require(success, "send failed");

        } else if (bet.status == BetStatus.CLAIMED_REFUND2) {
            // refund bettor 1 only
            bets[betId].status = BetStatus.CLAIMED_REFUNDS;
            (bool success, bytes memory data) = 
                bet.bettor1.call{value: bet.amt1}("");
            require(success, "send failed");

        } else {
            revert InvalidStatus();
        }
    }
}