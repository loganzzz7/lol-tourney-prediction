import APIClient from "@viriato/lol-esports-api";

const client = new APIClient({
  headers: {
    "x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z",
  },
});

async function main() {
  const leagues = await client.leagues.get();

  console.log("✅ Raw leagues result:");
  console.dir(leagues, { depth: null });
}

main().catch(console.error);