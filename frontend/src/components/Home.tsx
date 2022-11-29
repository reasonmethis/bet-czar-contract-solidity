import { BigNumber, ethers } from "ethers";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { IState } from "../StateReducer";
import { PageHeading } from "./PageHeading";

interface HomeLoaderData {
  date: string;
}

export async function homeLoader(): Promise<HomeLoaderData> {
  //await sleep(1000); //hm, causes ugly rerender
  return {
    date: new Date().toISOString(),
  };
}
type OneBetPropsT = {
  event: ethers.Event;
};
type BetListPropsT = {
  events: ethers.Event[];
};

type HomePropsT = {
  state: IState;
};

const OneBet = ({ event }: OneBetPropsT) => {
  //   console.log("OneBet, event", event);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (
    changeEvent: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    //console.log(isExpanded, expanded);
    setExpanded(isExpanded);
  };
  if (!event.args!) return <div>Corrupted bet</div>;

  const totalWagers = ethers.utils.formatEther(
    BigNumber.from(event.args.amt1).add(BigNumber.from(event.args.amt2))
  );
  return (
    <Box sx={{ marginBottom: "4px" }}>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="bet-content"
          id="bet-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Bet Id: {`${event.args[0] ?? "NA"}`}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Total wagers {totalWagers} ETH
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Bettor 1: {`${event.args[1]}`}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Bettor 2: {`${event.args[2]}`}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
            paragraph
          >
            Judge: &nbsp; &nbsp;{`${event.args[3]}`}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Bettor 1's wager: {`${ethers.utils.formatEther(event.args[4])} ETH`}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Bettor 2's wager: {`${ethers.utils.formatEther(event.args[5])} ETH`}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const BetList = ({ events }: BetListPropsT) => {
  //console.log("BetList, events", events);
  return events.length === 0 ? (
    <>
      <Typography variant="body2" color="text.secondary">
        No bets in this category
      </Typography>
      <Box sx={{ marginBottom: "8px" }}></Box>
    </>
  ) : (
    <>
      {events.map((event) => (
        <OneBet key={event.args![0]} event={event}></OneBet>
      ))}
      <Box sx={{ marginBottom: "8px" }}></Box>
    </>
  );
};

export const Home = ({ state }: HomePropsT) => {
  //let data = useLoaderData() as HomeLoaderData;
  return (
    <>
      <PageHeading text="Dashboard"></PageHeading>
      {!state.address ? (
        <Typography variant="subtitle1" color="text.secondary">
          Once you are connected, you will see all of your bets here.
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Bets where you are Bettor 1
          </Typography>
          {state.allBets === undefined ? (
            <Typography variant="body2" color="text.secondary">
              Fetching...
            </Typography>
          ) : (
            <BetList events={state.allBets[0]}></BetList>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Bets where you are Bettor 2
          </Typography>
          {state.allBets === undefined ? (
            <Typography variant="body2" color="text.secondary">
              Fetching...
            </Typography>
          ) : (
            <BetList events={state.allBets[1]}></BetList>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Bets where you are Judge
          </Typography>
          {state.allBets === undefined ? (
            <Typography variant="body2" color="text.secondary">
              Fetching...
            </Typography>
          ) : (
            <BetList events={state.allBets[2]}></BetList>
          )}
        </>
      )}
      {/* <p>Last loaded at: {data.date}</p> */}
    </>
  );
};
