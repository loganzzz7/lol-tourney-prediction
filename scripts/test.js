import APIClient from "@viriato/lol-esports-api";

const client = new APIClient({
  headers: {
    "x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z",
  },
});

async function main() {
  const leagueTournaments = await client.leagues.getTournaments(
    "98767991325878492"
  );

  console.log("Raw MSI result:");
  console.dir(leagueTournaments, { depth: null });
}

main().catch(console.error);