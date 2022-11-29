import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";

export const ADDR_LEN = contractAddress.BetCzar.length;

export const validateAddr = (addr: string): string | undefined => {
  if (addr.length != ADDR_LEN) {
    return `Address must have ${ADDR_LEN} characters`;
  }
};

export const validateAmt = (numStr: string): string | undefined => {
  const num = +numStr;
  if (Number.isNaN(num)) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    return "Invalid number";
  }
  if (num < 0) {
    return "Amount cannot be negative";
  }
};

export const validateUint = (numStr: string): string | undefined => {
  const num = +numStr;
  if (Number.isNaN(num)) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    return "Invalid number";
  }
  if (num < 0 || !Number.isInteger(num)) {
    return "Number must be a non-negative integer";
  }
};
export const sleep = async (delay: number) =>
  new Promise((r) => setTimeout(r, delay));

export const shortenHash = (st: string) => {
  return st.slice(0, 4) + "..." + st.slice(st.length - 4);
};

export const roundAmt = (amt: string, decimals: number) => {
  //https://docs.ethers.io/v5/api/utils/display-logic/#utils-parseEther
  //for now ignore the possibility that the number could be too big
  //https://ethereum.stackexchange.com/questions/84004/ethers-formatetherwei-with-max-4-decimal-places
  const pow10 = Math.pow(10, decimals);
  let num = +amt;
  if (Number.isNaN(num)) return amt;
  num = Math.round(num * pow10) / pow10;
  return num.toString();
};

export const generateNewPrivateKey = () => {
  const wallet = ethers.Wallet.createRandom();
  console.log("address:", wallet.address);
  console.log("mnemonic:", wallet.mnemonic.phrase);
  console.log("privateKey:", wallet.privateKey);
};
