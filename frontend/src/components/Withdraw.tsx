import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ethers } from "ethers";
import {
  betInfoInitVals,
  BetStatus,
  betStatusDescriptions,
  RpcCallErrorStatus,
  WithdrawPropsT,
} from "./interfaces";
import { fetchBetInfo } from "./operations";
import { SelectBetForm } from "./SelectBetForm";

const statusTypographyvariant = "subtitle2";

type WithdrawBtnProps = {
  is1: boolean;
  userIsBoth: boolean;
  isWon: boolean;
  isCancelled: boolean;
};

export const Withdraw = (props: WithdrawPropsT) => {
  const [betInfo, setBetInfo] = useState({ ...betInfoInitVals });
  const [betId, setBetId] = useState(-1);

  useEffect(() => {
    if (props.state.txBeingSent || betId < 0) return;
    //if txbeingsent changed from something to nothing then maybe
    //the bet status changed, so refetch
    const func = async () => {
      const newBetInfo = await fetchBetInfo(betId, props.state.provider);
      setBetInfo({ ...newBetInfo });
    };
    func();
  }, [props.state.txBeingSent]);

  useEffect(() => {
    setBetInfo({ ...betInfoInitVals });
  }, [betId]);

  //console.log("def dep btn, betid = ", betId, "status =", betInfo.status);
  const WithdrawBtn = ({
    is1,
    isCancelled,
    isWon,
    userIsBoth,
  }: WithdrawBtnProps) => {
    let text = "Withdraw";
    if (userIsBoth && isCancelled) text += " as Bettor " + (is1 ? "1" : "2");

    return (
      <Button
        variant="contained"
        onClick={() => {
          props.onSubmit({
            betId: betInfo.betId,
            isBettor1: is1,
            isWon,
            isCancelled,
          });
        }}
      >
        {text}
      </Button>
    );
  };

  let [
    isFetching,
    isRpcErr,
    isOtherErr,
    isFetched,
    canWithdraw1,
    canWithdraw2,
    isCancelled,
    isWon,
  ] = [false, false, false, false, false, false, false, false];

  const isBettor1 = props.state.address?.toLowerCase() === betInfo.bettor1.toLowerCase();
  const isBettor2 = props.state.address?.toLowerCase() === betInfo.bettor2.toLowerCase()

  if (betId >= 0)
    if (betInfo.error.status === RpcCallErrorStatus.UNDEFINED)
      isFetching = true;
    else if (betInfo.error.status === RpcCallErrorStatus.RPC_ERROR)
      isRpcErr = true;
    else if (betInfo.error.status === RpcCallErrorStatus.OTHER_ERROR)
      isOtherErr = true;
    else {
      isFetched = true;
      canWithdraw1 =
        isBettor1 &&
        [
          BetStatus.WAITING_FOR2,
          BetStatus.WON1,
          BetStatus.CANCELED,
          BetStatus.CLAIMED_REFUND2,
        ].includes(betInfo.status);
        console.log(isBettor1, canWithdraw1, betInfo.status);
      canWithdraw2 =
        isBettor2 &&
        [
          BetStatus.WAITING_FOR1,
          BetStatus.WON2,
          BetStatus.CANCELED,
          BetStatus.CLAIMED_REFUND1,
        ].includes(betInfo.status);
      isCancelled = [
        BetStatus.CANCELED,
        BetStatus.CLAIMED_REFUND1,
        BetStatus.CLAIMED_REFUND2,
      ].includes(betInfo.status);
      isWon = [BetStatus.WON1, BetStatus.WON2].includes(betInfo.status);
    }

  return (
    <>
      {/* PITFALL - I tried having a local function SelectBet be defined above and return
    the below SelectBetForm component, so that I can use it here for readability, but
    this caused a problem: every time the interval triggered a new update, the form
    was rerendered completely and whatever was in the input box would disappear.
    So it looks like the rerender of the Header component (happening because the fetching 
    flag changed) caused the rerender of this component (because it's this 
    component's parent), which then caused that local function to be completely 
    rebuilt, which then caused the previous version of SelectBetForm to completely
    unmount and the new one to mount, and React wasn't able to see that they are the 
    same. Or something to that effect 
    */}
      <SelectBetForm
        isDisabled={!props.state.address}
        onSubmit={(vals) => {
          setBetId(+vals.betId);
          const func = async () => {
            const newBetInfo = await fetchBetInfo(
              +vals.betId,
              props.state.provider
            );
            // PITFALL - have to use the spread operator because otherwise it doesn't rerender
            // it looks like the above call always returns the same reference - that would explain
            // why React doesn't detect a state change if I don't use the spread operator
            setBetInfo({ ...newBetInfo });
          };
          func();
        }}
      />
      {isFetching && (
        <Typography variant={statusTypographyvariant}>
          Fetching bet info...
        </Typography>
      )}
      {isRpcErr && (
        <Typography variant={statusTypographyvariant}>
          Status: Query error. Please check your bet id and try again
        </Typography>
      )}
      {isOtherErr && (
        <Typography variant={statusTypographyvariant}>
          Could not fetch bet info. Please check your connection and try again
        </Typography>
      )}
      {isFetched && (
        <>
          <Typography variant={statusTypographyvariant}>
            Status: {betStatusDescriptions[betInfo.status]}
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            sx={{ gridColumnGap: "32px", padding: "16px 0" }}
          >
            <>
              {canWithdraw1 !== canWithdraw2 && (
                <WithdrawBtn
                  is1={canWithdraw1}
                  isWon={isWon}
                  isCancelled={isCancelled}
                  userIsBoth={isBettor1 && isBettor2}
                />
              )}
              {canWithdraw1 && canWithdraw2 && (
                <>
                  <WithdrawBtn
                    is1={true}
                    isWon={isWon}
                    isCancelled={isCancelled}
                    userIsBoth={isBettor1 && isBettor2}
                  />
                  <WithdrawBtn
                    is1={false}
                    isWon={isWon}
                    isCancelled={isCancelled}
                    userIsBoth={isBettor1 && isBettor2}
                  />
                </>
              )}
              {!canWithdraw1 && !canWithdraw2 && (
                <Typography variant="button" sx={{ color: "error.main" }}>
                  NOTHING TO WITHDRAW
                </Typography>
              )}
            </>
          </Stack>
          <Typography
            variant={statusTypographyvariant}
            sx={{ color: "text.secondary" }}
          >
            Bettor 1: {`${betInfo.bettor1}`}
          </Typography>
          <Typography
            variant={statusTypographyvariant}
            sx={{ color: "text.secondary" }}
          >
            Bettor 2: {`${betInfo.bettor2}`}
          </Typography>
          <Typography
            variant={statusTypographyvariant}
            sx={{ color: "text.secondary" }}
            paragraph
          >
            Judge: &nbsp; &nbsp;{`${betInfo.judge}`}
          </Typography>
          <Typography
            variant={statusTypographyvariant}
            sx={{ color: "text.secondary" }}
          >
            Bettor 1's wager: {`${ethers.utils.formatEther(betInfo.amt1)} ETH`}
          </Typography>
          <Typography
            variant={statusTypographyvariant}
            sx={{ color: "text.secondary" }}
          >
            Bettor 2's wager: {`${ethers.utils.formatEther(betInfo.amt2)} ETH`}
          </Typography>{" "}
        </>
      )}
    </>
  );
};
