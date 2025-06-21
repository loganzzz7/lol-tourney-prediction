import json
import pandas as pd
from pathlib import Path

def parse_game_window_to_excel(json_path, output_excel_path):
    with open(json_path, "r") as f:
        game_data = json.load(f)

    final_frame = game_data['frames'][-1]

    def aggregate_team_stats(participants, team_ids):
        team_players = [p for p in participants if p['participantId'] in team_ids]
        return {
            "kills": sum(p["kills"] for p in team_players),
            "deaths": sum(p["deaths"] for p in team_players),
            "assists": sum(p["assists"] for p in team_players),
            "avgKDA": round(sum((p["kills"] + p["assists"]) / max(p["deaths"], 1) for p in team_players) / len(team_players), 2),
            "totalGold": sum(p["totalGoldEarned"] for p in team_players),
            "totalCS": sum(p["creepScore"] for p in team_players),
            "avgLevel": round(sum(p["level"] for p in team_players) / len(team_players), 2),
            "wardsPlaced": sum(p["wardsPlaced"] for p in team_players),
            "wardsDestroyed": sum(p["wardsDestroyed"] for p in team_players),
        }

    blue_ids = [1, 2, 3, 4, 5]
    red_ids = [6, 7, 8, 9, 10]

    blue_stats = aggregate_team_stats(final_frame["participants"], blue_ids)
    red_stats = aggregate_team_stats(final_frame["participants"], red_ids)

    row_data = {
        **{f"blue_{k}": v for k, v in blue_stats.items()},
        **{f"red_{k}": v for k, v in red_stats.items()},
        "label": 1 if blue_stats["totalGold"] > red_stats["totalGold"] else 0
    }

    df = pd.DataFrame([row_data])
    Path(output_excel_path).parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(output_excel_path, index=False)
    print(f"saved parsed features to {output_excel_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("input: python parse_game_window.py <input.json> <output.xlsx>")
    else:
        parse_game_window_to_excel(sys.argv[1], sys.argv[2])
