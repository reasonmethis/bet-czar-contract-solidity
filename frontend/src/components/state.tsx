// We store multiple things in Dapp's state.
// You don't need to follow this pattern, but it's an useful example.
const initialState = {
  // The info of the token (i.e. It's Name and symbol)
  // tokenData: undefined,

  // The user's address and balance
  selectedAddress: undefined,
  //balance: undefined,

  // The ID about transactions being sent, and any possible error with them
  txBeingSent: undefined,
  transactionError: undefined,
  networkError: undefined,
};

export {initialState}
//initialState