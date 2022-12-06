# BetCzar

This Hardhat project contains BetCzar, a Solidity contract that allows anyone to create and manage bets between two parties. I have also made a front-end app to interact with this contract: [working demo]

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
1. Using the front-end, here's a [working demo]. In that case, you will need the Metamask wallet. Then do one of the following:
 * **Least technical way.** Connect to a supported network (currently only the Goerli testnet is supported - you can get free Goerli ETH from [this POW faucet](https://goerli-faucet.pk910.de/))
 * **Alternative way.** Run a local Hardhat node and connect your Metamask to localhost:8545. This of course requires familiarity with Hardhat.
2. Without using the front-end. In that case, you only need the file BetCzar.sol. Copy its contents into a fresh project on [Remix IDE](https://remix.ethereum.org) (or some other similar environment), and it will let you interact with it using test accounts. 

[working demo]: https://reasonmethis.github.io/betczar_frontend
