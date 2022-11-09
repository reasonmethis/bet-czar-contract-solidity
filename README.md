# BetCzar

This Hardhat project contains BetCzar, a Solidity contract that allows anyone to create and manage bets between two parties. 

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

The easiest way to test it out is with Remix IDE. In that case, you only need the file BetCzar.sol. 