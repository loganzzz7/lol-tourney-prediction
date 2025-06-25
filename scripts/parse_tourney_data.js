import APIClient from "@viriato/lol-esports-api";
import fs from "fs";
import path from "path";
import Excel from "exceljs";
import { spawn } from "child_process";

const { writeFileSync, mkdirSync, readdirSync } = fs;
const client = new APIClient({
  headers: { "x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z" }
});

async function mergeFeatureWorkbooks() {
  const featuresDir = path.join("xlsx_data", "game_features");
  const masterPath  = path.join("xlsx_data", "all_game_features.xlsx");
  const wb           = new Excel.Workbook();
  const ws           = wb.addWorksheet("all_features");

  let headerWritten = false;
  const files = readdirSync(featuresDir).filter(f => f.endsWith(".xlsx")).sort();

  for (const file of files) {
    const tmp = new Excel.Workbook();
    await tmp.xlsx.readFile(path.join(featuresDir, file));
    const sheet = tmp.getWorksheet(1);

    if (!headerWritten) {
      ws.addRow(sheet.getRow(1).values.slice(1));
      headerWritten = true;
    }
    ws.addRow(sheet.getRow(2).values.slice(1));
  }

  await wb.xlsx.writeFile(masterPath);
  console.log(`* Merged ${files.length} sheets into ${masterPath}`);
}

async function main() {
  const wb    = new Excel.Workbook();
  const infile = path.join("xlsx_data", "lck_25S2_Tournaments.xlsx");
  await wb.xlsx.readFile(infile);
  const sheet = wb.getWorksheet(1);

  mkdirSync("data/json_game_windows",        { recursive: true });
  mkdirSync(path.join("xlsx_data", "game_features"), { recursive: true });

  for (let r = 2; r <= sheet.rowCount; r++) {
    const row       = sheet.getRow(r);
    const gameId    = row.getCell(1).value;
    const windowTs  = row.getCell(2).value;
    if (!gameId || !windowTs) continue;

    console.log(`-> fetching details for ${gameId} @ ${windowTs}`);
    let details;
    try {
      details = await client.games.getDetails(gameId.toString(), windowTs.toString());
    } catch (err) {
      console.warn(`⚠️ Skipping ${gameId}: API error (${err.message})`);
      continue;
    }

    // Decide blue vs. red codes
    let blueCode, redCode;
    // 1) Pupix-style “contestants” block?
    if (details.contestants) {
      blueCode = details.contestants.blue.code || details.contestants.blue.name;
      redCode  = details.contestants.red.code  || details.contestants.red.name;
    }
    // 2) Viriato-style “teams” array with teamId===100/200?
    else if (details.teams) {
      const b = details.teams.find(t => t.teamId === 100) || {};
      const r = details.teams.find(t => t.teamId === 200) || {};
      blueCode = b.code || b.teamKey || b.name;
      redCode  = r.code || r.teamKey || r.name;
    }
    // 3) Fallback to the schedule order (if nothing else is present)
    else {
      // if you still have schedule columns beyond col-2, you can grab them here:
      blueCode = row.getCell(3)?.value || "";
      redCode  = row.getCell(4)?.value || "";
    }

    // write raw JSON
    const rawPath = path.join("data/json_game_windows", `${gameId}.json`);
    writeFileSync(rawPath, JSON.stringify(details, null, 2));

    // invoke the Python parser with our two codes
    try {
      await new Promise((res, rej) => {
        const py = spawn("python", [
          "scripts/parse_game_window.py",
          rawPath,
          path.join("xlsx_data", "game_features", `${gameId}.xlsx`),
          blueCode,
          redCode
        ]);
        py.stdout.on("data", d => process.stdout.write(d));
        py.stderr.on("data", e => process.stderr.write(e));
        py.on("close", code => code === 0 ? res() : rej(code));
      });
    } catch (code) {
      console.warn(`⚠️ Parsing failed for ${gameId} (exit code ${code}), skipping.`);
    }
  }

  console.log("* All games fetched and parsed.");
  await mergeFeatureWorkbooks();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});