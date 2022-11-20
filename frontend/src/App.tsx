import { ethers } from "ethers";
import { useEffect, useReducer, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Header from "./components/Header";

import "./App.css";
import { NoWallet } from "./components/NoWallet";
import { Action, stateInit, stateReducer } from "./StateReducer";

// This is the Hardhat Network id that we set in our hardhat.config.js.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "1337";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

declare let window: any; //without this Typescript complains that window doesn't have
//attr ethereum. There are probably better approaches (maybe ones in https://stackoverflow.com/questions/70961190/property-ethereum-does-not-exist-on-type-window-typeof-globalthis-error), but
//this one seems to work. It's taken from https://dev.to/yakult/a-beginers-guide-four-ways-to-play-with-ethersjs-354a
function App() {
  const [state, dispatchState] = useReducer(stateReducer, stateInit);
  const pollDataIntervalRef = useRef<NodeJS.Timer | undefined>();
  const [fetchingFlg, setFetchingFlg] = useState(false);

  useEffect(() => {
    console.log("ff", fetchingFlg, state.address, !!state.provider);

    const updateBalance = async () => {
      //force ts to accept provider. We don't need to check it above
      //because if address is defined then provider is defined too -
      //they reset together. Force address to be accepted since we check it
      //above
      const balance = await state.provider!.getBalance(state.address!);
      setFetchingFlg(false);
      console.log(balance);
      dispatchState({
        type: Action.SET_BALANCE,
        payload: ethers.utils.formatEther(balance),
      });
    };

    if (fetchingFlg && state.address) {
      updateBalance().catch(console.error); //TODO DEAL WITH FLG if err
    } else {
      // if we do run updatebalance we set fetchingflg to false only after fetch is
      //done (to avoid another one starting when the previous one is still awaiting)
      //but if we don't run we can set it to false right away
      setFetchingFlg(false);
    }
  }, [fetchingFlg]);

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
    // This method initializes the dapp

    // We first store the user's address in the component's state
    dispatchState({ type: Action.SET_ADDRESS, payload: userAddress });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    // We first initialize ethers by creating a provider using window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //console.log(provider? "got pov":"--")
    //debugger;
    dispatchState({
      type: Action.SET_PROVIDER,
      payload: provider,
    });
    //NOTE: state.provider is still not set, dispatchState doesn't set things immediately
    //console.log(state.provider) - would still be undefined

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    /*this._token = new ethers.Contract(
          contractAddress.Token,
          TokenArtifact.abi,
          this._provider.getSigner(0)
        );*/
    //this._getTokenData();
    _startPollingData();
  };

  const _startPollingData = () => {
    if (!pollDataIntervalRef.current) {
      pollDataIntervalRef.current = setInterval(
        () => setFetchingFlg(true),
        1000
      );
    }
    // We run it once immediately so we don't have to wait for it
    setFetchingFlg(true);
  };

  const _stopPollingData = () => {
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
      _stopPollingData();
      dispatchState({ type: Action.RESET });
    });
  };

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
      <h1>Welcome to BetCzar</h1>
      {state.address ? (
        <>
          <h3>test: {!!state.provider ? "have provider" : "no provider"}</h3>
          <h3>Address: {state.address}</h3>
          <h3>Balance: {state.balance ?? "Fetching..."}</h3>
        </>
      ) : (
        connectBtn
      )}
    </>
  );
}

export default App;
