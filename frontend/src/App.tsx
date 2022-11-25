import { ethers } from "ethers";
import { useEffect, useReducer, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Header from "./components/Header";

import "./App.css";
import { CreateBetForm } from "./components/CreateBetForm";
import { CreateBetFormValsT } from "./components/interfaces";
import { NoWallet } from "./components/NoWallet";
import { Action, stateInit, stateReducer } from "./StateReducer";

// We import the contract's artifacts and address here
import BetCzarArtifact from "./contracts/BetCzar.json";
import contractAddress from "./contracts/contract-address.json";

const DT_POLLING_IN_MS = 100000;
// This is the Hardhat Network id that we set in our hardhat.config.js.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "1337";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const ERR_ST_TX_REJECTED_BY_USER = "Transaction was rejected by user";

declare let window: any; //without this Typescript complains that window doesn't have
//attr ethereum. There are probably better approaches (maybe ones in https://stackoverflow.com/questions/70961190/property-ethereum-does-not-exist-on-type-window-typeof-globalthis-error), but
//this one seems to work. It's taken from https://dev.to/yakult/a-beginers-guide-four-ways-to-play-with-ethersjs-354a
function App() {
  const [state, dispatchState] = useReducer(stateReducer, stateInit);
  const pollDataIntervalRef = useRef<NodeJS.Timer | undefined>();
  const [fetchingFlg, setFetchingFlg] = useState(false);

  useEffect(() => {
    //we update balance only when fetchingFlg (a) changes (b) from false to true
    //(a) is accomplished via the dependency array, (b) - manually
    console.log("ff", fetchingFlg, state.address, !!state.provider);
    if (!state.address) {
      setFetchingFlg(false);
      //_stopPollingData()
      return;
    }
    _ensurePollingData(); //temp, cuz it unmounts on recompile
    if (!fetchingFlg) return;
    updateBalance()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setFetchingFlg(false);
      });
  }, [fetchingFlg]);

  useEffect(
    () => () => {
      console.log("unmount");
      _stopPollingData();
    },
    []
  );

  //Update user info
  const updateBalance = async () => {
    //force ts to accept provider. We don't need to check it above
    //because if address is defined then provider is defined too -
    //they reset together. Force address to be accepted since we check it
    //above
    const balance = await state.provider!.getBalance(state.address!);
    //setFetchingFlg(false);
    console.log(balance);
    dispatchState({
      type: Action.SET_BALANCE,
      payload: ethers.utils.formatEther(balance),
    });
  };

  // This method checks if Metamask selected network is Localhost:8545
  const checkNetwork = () => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    dispatchState({
      type: Action.SET_NETWORK_ERR,
      payload: "Please connect Metamask to Localhost:8545",
    });
    return false;
  };

  const initialize = (userAddress: string) => {
    console.log(`Initializing addr ${userAddress}`);
    // This method initializes the dapp

    // We first store the user's address in the component's state
    dispatchState({ type: Action.SET_ADDRESS, payload: userAddress });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    // We first initialize ethers by creating a provider using window.ethereum

    //TODO: THIS DOESN'T DEPEND ON USER'S ADDRESS, ONLY ON THE EXISTENCE OF THE
    //WALLET, SO MAYBE MOVE THIS PART
    //ALSO SHOULD BE ABLE TO READ INFO FROM BLOCKCHAIN WITHOUT THE USER CONNECTING
    //so can move this to useEffect that runs on load
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatchState({
      type: Action.SET_PROVIDER,
      payload: provider,
    });
    //NOTE: state.provider is still not set, dispatchState doesn't set things immediately
    //console.log(state.provider) - would still be undefined

    //this._getTokenData();
    _ensurePollingData();
  };

  const _ensurePollingData = () => {
    if (pollDataIntervalRef.current) return;
    console.log("setting interval");
    pollDataIntervalRef.current = setInterval(() => {
      setFetchingFlg(true);
    }, DT_POLLING_IN_MS);
    // We run it once immediately so we don't have to wait for it
    setFetchingFlg(true);
  };

  const _stopPollingData = () => {
    console.log("clearing interval");
    clearInterval(pollDataIntervalRef.current);
    pollDataIntervalRef.current = undefined;
  };

  const connectWallet = async () => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network (that we are connected to Hardhat network)
    if (!checkNetwork()) {
      return;
    }
    initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    //TODO should probably only set up this callback once, but what if user clicks
    //connect, then disconnect, then connect again?

    //TODO: NOT WORKING
    window.ethereum.on("accountsChanged", ([newAddress]: string[]) => {
      console.log("on accountsChanged");
      _stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        dispatchState({ type: Action.RESET });
        return;
      }
      initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    //TODO see above
    window.ethereum.on("chainChanged", ([]) => {
      console.log("chain chng");
      _stopPollingData();
      dispatchState({ type: Action.RESET });
    });
  };

  const getContractInstance = () => new ethers.Contract(
    contractAddress.BetCzar,
    BetCzarArtifact.abi,
    state.provider!.getSigner()
  );

  const getEvents = () => {
    //https://docs.ethers.io/v5/concepts/events/#events
   const betCzar = getContractInstance() 

  }

  const makeCreateBetTxPromise = (
    vals: CreateBetFormValsT
  ): Promise<ethers.providers.TransactionResponse> => {
    // We initialize the contract using the provider and the token's artifact.
    const betCzar = getContractInstance()
    //https://docs.ethers.io/v5/api/utils/display-logic/#unit-conversion
    const amt1 = ethers.utils.parseUnits(vals.amt1, "ether");
    const amt2 = ethers.utils.parseUnits(vals.amt2, "ether");
    return betCzar.createBet(
      vals.bettor1,
      vals.bettor2,
      vals.judge,
      amt1,
      amt2
    );
  };

  const sendtx = async (
    txPromise: Promise<ethers.providers.TransactionResponse>
  ) => {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    if (!state.provider) return;
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      dispatchState({ type: Action.SET_TX_ERR, payload: undefined });

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      //sgnr = state.provider.sendTransaction
      const tx = await txPromise;
      console.log(tx.hash);
      dispatchState({ type: Action.SET_TX_BEINGSENT, payload: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();
      console.log("tx receipt", receipt);

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. 
      console.log("Tx successful")
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      const errSt = getRpcErrorMessage(error);
      if (errSt === ERR_ST_TX_REJECTED_BY_USER) return;
      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      dispatchState({ type: Action.SET_TX_ERR, payload: errSt });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      dispatchState({ type: Action.SET_TX_BEINGSENT, payload: undefined });
      //Here, we update the user's balance.
      await updateBalance();
    }
  };

  // This is an utility method that turns an RPC error into a human readable
  // message.
  const getRpcErrorMessage = (error: any): string => {
    if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
      return ERR_ST_TX_REJECTED_BY_USER;
    }
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  };

  //We render the Dapp
  if (!window.ethereum) {
    return (
      <>
        <Header />
        <NoWallet />
      </>
    );
  }
  const connectBtn = (
    <>
      <Button
        variant="contained"
        onClick={() => {
          connectWallet();
        }}
      >
        Connect
      </Button>
      {/*<Button
        variant="outlined"
        onClick={() => {
          setInterval(() => setFetchingFlg(true), 2500);
        }}
      >
        Test
      </Button> */}
    </>
  );
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <h1>Welcome to BetCzar</h1>
        {state.address ? (
          <>
            {/*<h3>test: {!!state.provider ? "have provider" : "no provider"}</h3>*/}
            <h3>Address: {state.address}</h3>
            <h3>Balance: {state.balance ?? "Fetching..."}</h3>
            <CreateBetForm
              onSubmit={(vals) => {
                sendtx(makeCreateBetTxPromise(vals));
              }}
            ></CreateBetForm>
          </>
        ) : (
          connectBtn
        )}
      </Container>
    </>
  );
}

export default App;