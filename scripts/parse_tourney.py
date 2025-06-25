import json
import pandas as pd
from pathlib import Path


def extract_game_ids_with_timestamps(json_path, output_excel_path):
    with open(json_path, "r") as f:
        data = json.load(f)

    game_entries = []
    for event in data["data"]["schedule"]["events"]:
        start_time_str = event.get("startTime")
        if not start_time_str:
            continue

        # parse timestamp and add 12 hours
        start_time = pd.to_datetime(start_time_str)
        game_window_time = start_time + pd.Timedelta(hours=12)

        # extract the two participating team codes
        match = event.get("match", {})
        teams = match.get("teams", [])
        if len(teams) < 2:
            continue
        team1_code = teams[0].get("code")
        team2_code = teams[1].get("code")

        # pull games from the top-level "games" list
        games = event.get("games", [])
        if not games:
            continue

        for game in games:
            # skip games without any VODs (e.g., empty best-of-3 slots)
            vods = game.get("vods", [])
            if not vods:
                continue

            game_id = game.get("id")
            if game_id:
                game_entries.append({
                    "game_id": game_id,
                    "game_window_timestamp": game_window_time.isoformat(),
                    "team1_code": team1_code,
                    "team2_code": team2_code
                })

    # write out to Excel
    df = pd.DataFrame(game_entries)
    Path(output_excel_path).parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(output_excel_path, index=False)

    print(f"found {len(game_entries)} valid game entries.")
    print(f"saved game list to {output_excel_path}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("usage: python parse_tourney.py <input.json> <output.xlsx>")
    else:
        extract_game_ids_with_timestamps(sys.argv[1], sys.argv[2])