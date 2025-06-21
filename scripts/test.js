import APIClient from "@viriato/lol-esports-api";
import { writeFileSync, mkdirSync } from "fs";


const client = new APIClient({
  headers: {
    "x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z",
  },
});

async function main() {
  const leagues = await client.leagues.get();

  // LCK: 98767991310872058
  // LPL: 98767991314006698
  // LCP: 113476371197627891
  // LTA N: 113470291645289904
  // LTA S: 113475181634818701
  // LEC: 98767991302996019

  const lckLeagueTournaments = await client.leagues.getTournaments(
    "98767991310872058"
  );

  const lckSp24Tournaments = await client.tournaments.getCompletedEvents(
    "111561337005798024"
  );

  writeFileSync(
    "data/lck_sp24_tournaments.json",
    JSON.stringify(lckSp24Tournaments, null, 2)
  );

  // lck summer 24: 112435564213994193

  // const ggT1GameOne = await client.games.get("111561337007371296");

  const lckSp24GgT1G1GameWindow = await client.games.getWindow(
    "111561337007371296",
    "2024-04-14T08:00:00Z" // can either be a string or a Date
  );

  // // save JSON to file
  // writeFileSync(
  //   "data/lck_sp24_ggt1_g1_gameWindow.json",
  //   JSON.stringify(lckSp24GgT1G1GameWindow, null, 2)
  // );

  console.log("json saved to data folder");

  // console.log("LCK games:");
  // // console.dir(leagues, { depth: null })

  // // console.dir(lckLeagueTournaments, { depth: null });

  // console.dir(lckSp24Tournaments, { depth: null });

  // // console.dir(ggT1GameOne, { depth: null })

  // console.dir(lckSp24GgT1G1GameWindow, { depth: null })

}

main().catch(console.error);