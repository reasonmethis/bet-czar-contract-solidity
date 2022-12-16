# Bet Czar Contract

This Hardhat project contains BetCzar, a Solidity contract that allows anyone to create and manage bets between two parties. I have also made a frontend app to interact with this contract: here's the deployed [working demo] and here is its [repo](https://github.com/reasonmethis/bet-czar-frontend).

## Introduction

A single instance of the contract supports the creation of multiple "bets", distinguished by a unique id number (betId). Each bet represents a wager between two parties. Anyone can create a bet, it doesn't 
have to be one of the bettors. To create a bet, one must specify:

* The addresses of the two bettors
* The address of the judge
* The amounts each bettor must deposit if they in fact want to make this bet

After that, a deposit (in the exact correct amount) must be made on behalf of each bettor in order 
for the bet to become active. Normally, each bettor would make their own deposit, but that's not 
a requirement, anyone can deposit on their behalf. 

If only one bettor's deposit is made, the bet is still not active and that bettor is free to recall their deposit. After both deposits are made, the bet activates and the funds can only be disbursed after the outcome of the bet is decided.

The function of the judge is to decide the outcome: bettor 1 wins, bettor 2 wins, or neither. Once the judge records the outcome, anyone can trigger the disbursement of funds: the winner receives both deposits or, if neither bettor wins, each receives their original deposit. 

## Usage

There are a few ways to test it out:
1. Using the frontend. Here's a [working demo]. To use it, you will need the Metamask wallet. Then do one of the following:

   * **Least technical way.** Connect Metamask to a supported network (currently only the Goerli testnet is supported), then get yourself some free test ETH tokens. You can quickly collect 0.01ETH or so from the [Goerli POW faucet](https://goerli-faucet.pk910.de/) (there are other commonly used faucets but they require you to make a Twitter post or sign up for an Alchemy account).
   * Alternative way. Run a local Hardhat node and connect your Metamask to localhost:8545. This of course requires familiarity with Hardhat.
2. Without using the frontend. In that case, you only need the file BetCzar.sol. Copy its contents into a fresh project on [Remix IDE](https://remix.ethereum.org) (or some other similar environment), and it will let you interact with it using test accounts. 

## Technical Notes on Implementation 

### Security 

The contract protects against a re-entrancy attack by always updating state in storage **before** sending funds to a user. It also protects against one bettor blocking the other bettor from withdrawing funds (in the case of a tie/annullment) by having two separate withdrawal functions, each of which sends funds to only one bettor. By contrast, if there was just one withdrawal function that attempted to send funds to both bettors, then one bettor could "refuse" accepting payment, thus reverting the whole process and preventing both themselves and the other bettor from receiving funds. 

The contract does not use delegated calls, pseudo-random numbers, critical dependence on the order of operations, special privileges for the owner, passwords, or operations that can cause underflow or overflow, so known vulnerabilities based on these are not an issue.

### Optimizing gas costs

To save on gas, I strived to minimize storage reads and writes, as well as the number of operations the EVM would need to perform for a given task, which sometimes came at the cost of having very similar pieces of code. Here are some examples:

1. Using custom errors:<br> 
https://github.com/reasonmethis/bet-czar-contract-solidity/blob/master/contracts/BetCzar.sol#L31

2. Reading the Bet of interest first into memory so I don't query its various properties multiple times from storage, e.g.:<br>
https://github.com/reasonmethis/bet-czar-contract-solidity/blob/master/contracts/BetCzar.sol#L62

3. Putting up with code repetition to avoid creating additional structures, function calls, comparisons, e.g.:
https://github.com/reasonmethis/bet-czar-contract-solidity/blob/master/contracts/BetCzar.sol#L75<br>
https://github.com/reasonmethis/bet-czar-contract-solidity/blob/master/contracts/BetCzar.sol#L257

and other places. Of course the tradeoff is that code repetition increases deployment cost, but that wouldn't affect the users.

[working demo]: https://reasonmethis.github.io/bet-czar-frontend/
