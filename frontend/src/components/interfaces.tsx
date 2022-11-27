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
};

export type DepositPropsT = {
  state: IState;
  onSubmit: (vals: DepositValsT) => void;
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
}
export type BetInfoT = {
  bettor1: string;
  bettor2: string;
  judge: string;
  amt1: string;
  amt2: string;
  status: BetStatus;
};
