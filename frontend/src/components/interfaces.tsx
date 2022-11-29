import { ethers } from "ethers";
import { IState } from "../StateReducer";

export const CreateBetFormInitVals = {
  bettor1: "",
  amt1: "",
  bettor2: "",
  amt2: "",
  judge: "",
};
export type CreateBetFormValsT = typeof CreateBetFormInitVals;

export type CreateBetFormPropsT = {
  isDisabled: boolean;
  onSubmit: (vals: CreateBetFormValsT) => void;
};

export type DepositValsT = {
  betId: string;
  isBettor1: boolean;
  amt: string;
};

export type DepositPropsT = {
  state: IState;
  onSubmit: (vals: DepositValsT) => void;
};
  
export type WithdrawValsT = {
  betId: string;
  isBettor1: boolean;
  isWon: boolean //then use sendWinnings 
  isCancelled: boolean //then sendRefund1/2, else recallDeposit
};

export type WithdrawPropsT = {
  state: IState;
  onSubmit: (vals: WithdrawValsT) => void;
};

export type JudgeValsT = {
  betId: string;
  isJudge: boolean;
  winner: 0 | 1 | 2
};

export type JudgePropsT = {
  state: IState;
  onSubmit: (vals: JudgeValsT) => void;
};

export const SelectBetFormInitVals = {
  betId: "",
};
export type SelectBetFormValsT = typeof SelectBetFormInitVals;

export type SelectBetFormPropsT = {
  isDisabled: boolean;
  onSubmit: (vals: SelectBetFormValsT) => void;
};

export type AllBetsT = ethers.Event[][];

export const betStatusDescriptions = [
  "New bet, waiting for bettors' deposits",
  "Waiting for Bettor 1's deposit",
  "Waiting for Bettor 2's deposit",
  "Bet in progress, waiting for judgement or forfeiture",
  "Bettor 1 won, can claim winnings",
  "Bettor 2 won, can claim winnings",
  "Bet complete, Bettor 1 claimed winnings",
  "Bet complete, Bettor 2 claimed winnings",
  "Bet cancelled by Judge, bettors can withdraw deposits",
  "Bet cancelled by Judge, Bettor 1 withdrew deposit",
  "Bet cancelled by Judge, Bettor 2 withdrew deposit",
  "Bet cancelled by Judge, bettors withdrew deposits",
  "Unknown status",
];

export enum BetStatus {
  CREATED = 0,
  WAITING_FOR1,
  WAITING_FOR2,
  PENDING,
  WON1,
  WON2,
  CLAIMED1,
  CLAIMED2,
  CANCELED,
  CLAIMED_REFUND1,
  CLAIMED_REFUND2,
  CLAIMED_REFUNDS,
  UNKNOWN,
}

export enum RpcCallErrorStatus {
  UNDEFINED,
  NO_ERROR,
  RPC_ERROR,
  OTHER_ERROR,
}

export const RpcCallErrorInitVals = {
  status: RpcCallErrorStatus.UNDEFINED,
  msg: "",
};

export type RpcCallErrorT = typeof RpcCallErrorInitVals;

const tmp = {
  betId: "",
  bettor1: "",
  bettor2: "",
  judge: "",
  amt1: "",
  amt2: "",
  status: BetStatus.UNKNOWN,
  error: RpcCallErrorInitVals as Readonly<RpcCallErrorT>,
};

export type BetInfoT = typeof tmp;
export const betInfoInitVals: Readonly<BetInfoT> = tmp;
