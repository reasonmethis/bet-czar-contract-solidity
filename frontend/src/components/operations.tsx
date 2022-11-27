//import {IState} from "../StateReducer"
import { ethers } from "ethers";
// We import the contract's artifacts and address here
import BetCzarArtifact from "../contracts/BetCzar.json";
import contractAddress from "../contracts/contract-address.json";

const getReadContractInstance = (provider: ethers.providers.Web3Provider) =>
  new ethers.Contract(contractAddress.BetCzar, BetCzarArtifact.abi, provider);

// This is an utility method that turns an RPC error into a human readable
  // message.
  const getRpcErrorMessage = (error: any): string => {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  };

export const fetchBetInfo = async (
  betId: number,
  provider: ethers.providers.Web3Provider
) => {
    const betCzar = getReadContractInstance(provider)
    try {
    const res = await betCzar.bets(betId)
    } catch(error) {
      console.log(error, getRpcErrorMessage(error));  
    }
    //console.log(res)
};
