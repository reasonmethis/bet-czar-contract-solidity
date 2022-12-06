//import {IState} from "../StateReducer"
import { ethers } from "ethers";
// We import the contract's artifacts and address here
import BetCzarArtifact from "../contracts/BetCzar.json";

import {
  betInfoInitVals,
  BetStatus,
  RpcCallErrorStatus,
  RpcCallErrorT,
} from "./interfaces";

const getReadContractInstance = (provider: ethers.providers.Web3Provider, contractAddress: string) =>
  new ethers.Contract(contractAddress, BetCzarArtifact.abi, provider);

// This is an utility method that turns an RPC error into a human readable
// message.
const parseRpcCallError = (error: any): RpcCallErrorT => {
  let res = "";
  let errStatus = RpcCallErrorStatus.OTHER_ERROR;
  if (error.code !== undefined) {
    errStatus = RpcCallErrorStatus.RPC_ERROR; //TODO: more robust check
    if (error.method)
      res = `RPC error in method ${error.method} with code ${error.code}`;
    else res = `RPC error with code ${error.code}`;
  }
  if (error.message) {
    res = res ? `${res}: "${error.message}"` : error.message;
  }
  return { status: errStatus, msg: res };
};

export const fetchBetInfo = async (
  betId: number,
  provider: ethers.providers.Web3Provider | undefined,
  contractAddress: string | undefined
) => {
  //let betInfo = BetInfoInitVals; //PITFALL - this, in combination with the
  //next several lines, would modify BetInfoInitVals. Setting its type to readonly
  //helps catch this at compile time
  const betInfo = { ...betInfoInitVals }; //see above
  try {
    const betCzar = getReadContractInstance(provider!, contractAddress!);
    const res = await betCzar.bets(betId);
    //we extract the info and populate betInfo
    betInfo.betId = betId.toString();
    betInfo.bettor1 = res.bettor1;
    betInfo.bettor2 = res.bettor2;
    betInfo.judge = res.judge;
    betInfo.amt1 = res.amt1.toString();
    betInfo.amt2 = res.amt2.toString();
    betInfo.status = res.status;
    betInfo.error = { status: RpcCallErrorStatus.NO_ERROR, msg: "" };
  } catch (error) {
    betInfo.error = parseRpcCallError(error);
    console.log(betInfo.error);
  }
  return betInfo;
};
