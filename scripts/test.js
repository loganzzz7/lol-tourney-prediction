import APIClient from "@viriato/lol-esports-api";
import { writeFileSync, mkdirSync } from "fs";


const client = new APIClient({
  headers: {
    "x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z",
  },
});

async function main() {
  // const leagues = await client.leagues.get();

  // LCK: 98767991310872058
  // LPL: 98767991314006698
  // LCP: 113476371197627891
  // LTA N: 113470291645289904
  // LTA S: 113475181634818701
  // LEC: 98767991302996019

  const leagueTournaments = await client.leagues.getTournaments(
    "113476371197627891"
  );

  // const lck25S2Tournaments = await client.tournaments.getCompletedEvents(
  //   "113503260417890076"
  // );

  const lcp25S2Tournaments = await client.tournaments.getCompletedEvents(
    "113503008259566005"
  );

  writeFileSync(
    "data/lcp_25S2_Tournaments.json",
    JSON.stringify(lcp25S2Tournaments, null, 2)
  );

  // const ggT1GameOne = await client.games.get("111561337007371296");

  // const detailGameWindow = await client.games.getDetails(
  //   "113503303285187383",
  //   "2025-04-12T18:00:00Z" // can either be a string or a Date
  // );

  // console.log("json saved to data folder");

  // console.log("LCK games:");
  // // console.dir(leagues, { depth: null })

  // console.dir(leagueTournaments, { depth: null });

  // console.dir(lcp25S2Tournaments, { depth: null });

  // // console.dir(ggT1GameOne, { depth: null })

  // console.dir(detailGameWindow, { depth: null })

}

main().catch(console.error);