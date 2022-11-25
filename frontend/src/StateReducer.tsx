import { ethers } from "ethers";

export enum Action {
  RESET,
  SET_NETWORK_ERR,
  SET_PROVIDER,
  SET_ADDRESS,
  SET_BALANCE,
  SET_TX_BEINGSENT,
  SET_TX_ERR,
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
    | Action.SET_BALANCE
    | Action.SET_TX_BEINGSENT
    | Action.SET_TX_ERR;
  payload: string | undefined;
};

type TActionSetProvider = {
  type: Action.SET_PROVIDER;
  payload: ethers.providers.Web3Provider | undefined;
};

export type TAction =
  | TActionReset
  | TActionSetStringProperty
  | TActionSetProvider;
// {
//   type: Action;
//   payload: any;
// }

export interface IState {
  balance: string | undefined;
  address: string | undefined;
  networkError: string | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  txBeingSent: string | undefined;
  txError: string | undefined;
}

export const stateInit: IState = {
  balance: undefined,
  address: undefined,
  networkError: undefined,
  provider: undefined,
  txBeingSent: undefined,
  txError: undefined,
};

export const stateReducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case Action.RESET:
      return { ...stateInit };
    case Action.SET_NETWORK_ERR:
      return { ...state, networkError: action.payload };
    case Action.SET_PROVIDER:
      console.log("statereducer prov", !!action.payload);
      return { ...state, provider: action.payload };
    case Action.SET_ADDRESS:
      console.log("statereducer addr", !!action.payload);
      return { ...state, address: action.payload };
    case Action.SET_BALANCE:
      return { ...state, balance: action.payload };
    case Action.SET_TX_BEINGSENT:
      return { ...state, txBeingSent: action.payload };
    case Action.SET_TX_ERR:
      return { ...state, txError: action.payload };
    default:
      return state;
  }
};