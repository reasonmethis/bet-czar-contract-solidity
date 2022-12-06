import { ethers } from "ethers";
import { AllBetsT } from "./components/interfaces";

export enum Action {
  RESET,
  SET_NETWORK_ERR,
  SET_PROVIDER,
  SET_ADDRESS,
  SET_CONTRACT,
  SET_BALANCE,
  SET_TX_BEINGSENT,
  SET_TX_ERR,
  SET_ALL_BETS,
}

//Different actions have different payload types, so to strongly type
//our action we use a union of several types using the "tagged union" pattern
//see https://medium.com/codex/typescript-and-react-usereducer-943e4f8d1ad4 (counts
//towards Medium's free limit)
type TActionReset = {
  type: Action.RESET;
};

type TActionSetStringProperty = {
  type:
    | Action.SET_NETWORK_ERR
    | Action.SET_ADDRESS
    | Action.SET_CONTRACT
    | Action.SET_BALANCE
    | Action.SET_TX_BEINGSENT
    | Action.SET_TX_ERR;
  payload: string | undefined;
};

type TActionSetProvider = {
  type: Action.SET_PROVIDER;
  payload: ethers.providers.Web3Provider | undefined;
};

type TActionSetAllBets = {
  type: Action.SET_ALL_BETS;
  payload: AllBetsT | undefined;
};

export type TAction =
  | TActionReset
  | TActionSetStringProperty
  | TActionSetProvider
  | TActionSetAllBets;
// {
//   type: Action;
//   payload: any;
// }

export interface IState {
  balance: string | undefined;
  address: string | undefined;
  contractAddress: string | undefined;
  networkError: string | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  txBeingSent: string | undefined;
  txError: string | undefined;
  allBets: AllBetsT | undefined;
}

export const stateInit: IState = {
  balance: undefined,
  address: undefined,
  contractAddress: undefined,
  networkError: undefined,
  provider: undefined,
  txBeingSent: undefined,
  txError: undefined,
  allBets: undefined,
};

export const stateReducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case Action.RESET:
      return { ...stateInit };
    case Action.SET_NETWORK_ERR:
      return { ...state, networkError: action.payload };
    case Action.SET_PROVIDER:
      return { ...state, provider: action.payload };
    case Action.SET_ADDRESS:
      return { ...state, address: action.payload };
    case Action.SET_CONTRACT:
      return { ...state, contractAddress: action.payload };
    case Action.SET_BALANCE:
      return { ...state, balance: action.payload };
    case Action.SET_TX_BEINGSENT:
      return { ...state, txBeingSent: action.payload };
    case Action.SET_TX_ERR:
      return { ...state, txError: action.payload };
    case Action.SET_ALL_BETS:
      return { ...state, allBets: action.payload };
    default:
      return state;
  }
};
