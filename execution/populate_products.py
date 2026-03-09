"""
Populate the Produktai sheet with ~50 real solar energy products.

Includes solar modules (~20), inverters (~15), battery storage (~10),
and EV chargers (~5) with realistic specs for the Lithuanian market
from LDA Energija partners.

Requires:
- GOOGLE_SHEETS_ID in .env
- credentials.json (service account) in project root
- "Produktai" worksheet already created (run setup_google_sheets.py first)
"""

import os
import sys
from pathlib import Path

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

# fmt: off
# Format: [ID, Tipas, Gamintojas, Modelis, Galia_W, Talpa_kWh, Efektyvumas_pct, Garantija_metai, Kaina_EUR, Matmenys, Svoris_kg, Pastabos, Nuotrauka_URL]
PRODUCTS = [
    # ---- MODULIAI (20 products) ----
    # JinkoSolar Tiger Neo N-type
    ["SM-001", "Modulis", "JinkoSolar", "Tiger Neo N-type 440W", 440, "", 21.8, 25, 145, "1762x1134x30", 21.5, "N-type monokristalinis, bifacial", ""],
    ["SM-002", "Modulis", "JinkoSolar", "Tiger Neo N-type 445W", 445, "", 22.0, 25, 150, "1762x1134x30", 21.7, "N-type monokristalinis, bifacial, aukstesnis efektyvumas", ""],
    ["SM-003", "Modulis", "JinkoSolar", "Tiger Neo N-type 550W", 550, "", 21.3, 25, 195, "2278x1134x30", 26.1, "Didesnis modulis, tinka dideliems stogams", ""],
    ["SM-004", "Modulis", "JinkoSolar", "Tiger Neo N-type 580W", 580, "", 22.4, 25, 210, "2278x1134x30", 27.5, "Premium N-type, aukstas efektyvumas", ""],
    # JaSolar
    ["SM-005", "Modulis", "JaSolar", "JAM72S30-545", 545, "", 21.1, 25, 185, "2274x1134x35", 27.2, "MBB PERC technologija, patikimas", ""],
    ["SM-006", "Modulis", "JaSolar", "JAM60S21-375", 375, "", 20.3, 25, 130, "1769x1052x35", 20.8, "Kompaktiskas modulis, tinka mazesniems stogams", ""],
    ["SM-007", "Modulis", "JaSolar", "JAM54S31-420", 420, "", 21.5, 25, 155, "1722x1134x30", 21.0, "Deep Blue 3.0, N-type", ""],
    ["SM-008", "Modulis", "JaSolar", "JAM72D40-580", 580, "", 22.5, 30, 220, "2278x1134x30", 28.0, "Bifacial dvipusis, 30 metu garantija", ""],
    # Longi
    ["SM-009", "Modulis", "Longi", "Hi-MO 6 440W", 440, "", 22.0, 25, 155, "1722x1134x30", 21.3, "HPDC technologija, anti-PID", ""],
    ["SM-010", "Modulis", "Longi", "Hi-MO 5 550W", 550, "", 21.3, 25, 195, "2256x1133x35", 27.5, "Didesnis formatas, geras efektyvumas", ""],
    # Trina Solar
    ["SM-011", "Modulis", "Trina Solar", "Vertex S+ 445W", 445, "", 22.2, 25, 160, "1762x1134x30", 21.8, "N-type TOPCon, aukstas efektyvumas", ""],
    ["SM-012", "Modulis", "Trina Solar", "Vertex S 400W", 400, "", 20.8, 25, 135, "1754x1096x30", 21.0, "Populiarus modelis, gera kaina", ""],
    # Canadian Solar
    ["SM-013", "Modulis", "Canadian Solar", "HiKu6 445W", 445, "", 21.8, 25, 150, "1762x1134x30", 21.5, "TOPCon N-type, patikimas gamintojas", ""],
    ["SM-014", "Modulis", "Canadian Solar", "BiHiKu7 580W", 580, "", 22.3, 25, 215, "2278x1134x30", 28.2, "Bifacial, dideliam stogui ar zemei", ""],
    # Risen
    ["SM-015", "Modulis", "Risen", "Titan S 440W", 440, "", 21.8, 25, 140, "1762x1134x30", 21.5, "Gera kainos ir kokybes santykis", ""],
    ["SM-016", "Modulis", "Risen", "Titan 550W", 550, "", 21.2, 25, 185, "2278x1134x30", 27.0, "Didelis modulis, ekonomiskas", ""],
    # DMEGC
    ["SM-017", "Modulis", "DMEGC", "DM445M10-54HBB", 445, "", 22.0, 25, 135, "1762x1134x30", 21.5, "N-type, konkurencinga kaina", ""],
    # Q Cells
    ["SM-018", "Modulis", "Q Cells", "Q.PEAK DUO ML-G11 400W", 400, "", 20.6, 25, 165, "1754x1096x32", 21.2, "Vokiska kokybe, Q.ANTUM DUO Z", ""],
    # Generic modules
    ["SM-019", "Modulis", "Hyundai", "HiE-S445HG 445W", 445, "", 21.9, 25, 148, "1762x1134x30", 21.6, "Pietų Korėjos kokybė, PERC", ""],
    ["SM-020", "Modulis", "Astronergy", "ASTRO N5 440W", 440, "", 21.7, 25, 142, "1762x1134x30", 21.4, "N-type TOPCon, gera garantija", ""],

    # ---- INVERTERIAI (15 products) ----
    # Sungrow
    ["INV-001", "Inverteris", "Sungrow", "SG3.0RT", 3000, "", 97.8, 10, 850, "370x480x175", 14.5, "Trijų fazių, kompaktiškas", ""],
    ["INV-002", "Inverteris", "Sungrow", "SG5.0RT", 5000, "", 98.0, 10, 1050, "370x480x175", 15.5, "Trijų fazių, populiariausias modelis", ""],
    ["INV-003", "Inverteris", "Sungrow", "SG8.0RT", 8000, "", 98.3, 10, 1350, "370x480x175", 16.0, "Trijų fazių, vidutinei sistemai", ""],
    ["INV-004", "Inverteris", "Sungrow", "SG10RT", 10000, "", 98.4, 10, 1550, "370x480x175", 16.5, "Trijų fazių, didelei sistemai", ""],
    ["INV-005", "Inverteris", "Sungrow", "SG15RT", 15000, "", 98.5, 10, 1950, "440x540x185", 18.5, "Trijų fazių, komercinėms sistemoms", ""],
    # Huawei
    ["INV-006", "Inverteris", "Huawei", "SUN2000-3KTL-M1", 3000, "", 98.0, 10, 900, "365x390x145", 10.0, "Vienos fazės, optimizatorių palaikymas", ""],
    ["INV-007", "Inverteris", "Huawei", "SUN2000-6KTL-M1", 6000, "", 98.2, 10, 1200, "365x390x145", 10.5, "Trijų fazių, AFCI apsauga", ""],
    ["INV-008", "Inverteris", "Huawei", "SUN2000-10KTL-M1", 10000, "", 98.4, 10, 1600, "525x470x145", 14.0, "Trijų fazių, FusionSolar app", ""],
    # Fox ESS (hybrid)
    ["INV-009", "Inverteris", "Fox ESS", "H3-5.0-E", 5000, "", 97.5, 10, 1400, "516x440x184", 20.0, "Hibridinis, bateriju palaikymas", ""],
    ["INV-010", "Inverteris", "Fox ESS", "H3-8.0-E", 8000, "", 97.8, 10, 1750, "516x440x184", 21.0, "Hibridinis, trijų fazių", ""],
    ["INV-011", "Inverteris", "Fox ESS", "H3-12.0-E", 12000, "", 98.0, 10, 2100, "516x440x184", 22.0, "Hibridinis, didelei sistemai su kaupikliu", ""],
    # Fronius
    ["INV-012", "Inverteris", "Fronius", "Primo GEN24 5.0", 5000, "", 98.1, 10, 1300, "530x430x160", 17.0, "Austriska kokybe, hibridinis", ""],
    ["INV-013", "Inverteris", "Fronius", "Symo GEN24 10.0", 10000, "", 98.2, 10, 1800, "530x430x160", 19.5, "Trijų fazių hibridinis, premium", ""],
    # GoodWe
    ["INV-014", "Inverteris", "GoodWe", "GW5000-MS", 5000, "", 97.6, 10, 950, "350x442x161", 14.0, "Vienos fazės, kompaktiškas", ""],
    ["INV-015", "Inverteris", "GoodWe", "GW10K-ET", 10000, "", 98.0, 10, 1450, "516x440x184", 20.0, "Trijų fazių, ET hibridinis", ""],

    # ---- KAUPIKLIAI (10 products) ----
    # Sungrow
    ["BAT-001", "Kaupiklis", "Sungrow", "SBR064", "", 6.4, 96, 10, 3200, "670x440x185", 56, "LFP baterija, modulinė sistema", ""],
    ["BAT-002", "Kaupiklis", "Sungrow", "SBR096", "", 9.6, 96, 10, 4500, "670x440x275", 84, "LFP, 3 moduliai, plečiama", ""],
    ["BAT-003", "Kaupiklis", "Sungrow", "SBR128", "", 12.8, 96, 10, 5800, "670x440x365", 112, "LFP, 4 moduliai, namų ūkiui", ""],
    ["BAT-004", "Kaupiklis", "Sungrow", "SBR256", "", 25.6, 96, 10, 10500, "670x440x725", 224, "LFP, 8 moduliai, didelei sistemai", ""],
    # Huawei
    ["BAT-005", "Kaupiklis", "Huawei", "LUNA2000-5-S0", "", 5.0, 97, 10, 3000, "670x150x600", 63.8, "LFP, modulinė, 1 modulis", ""],
    ["BAT-006", "Kaupiklis", "Huawei", "LUNA2000-10-S0", "", 10.0, 97, 10, 5500, "670x150x960", 114, "LFP, 2 moduliai, optimali talpa", ""],
    ["BAT-007", "Kaupiklis", "Huawei", "LUNA2000-15-S0", "", 15.0, 97, 10, 7800, "670x150x1320", 164, "LFP, 3 moduliai, didelei sistemai", ""],
    # Fox ESS
    ["BAT-008", "Kaupiklis", "Fox ESS", "ECS2900-H3", "", 5.76, 95, 10, 2800, "600x440x180", 52, "LFP, kompaktiškas, namams", ""],
    ["BAT-009", "Kaupiklis", "Fox ESS", "ECS4800-H5", "", 10.24, 95, 10, 4800, "600x440x360", 96, "LFP, dviguba talpa", ""],
    # BYD
    ["BAT-010", "Kaupiklis", "BYD", "HVS 5.1", "", 5.12, 96, 10, 3100, "585x298x640", 57, "Premium LFP, modulinė sistema", ""],

    # ---- EV STOTELĖS (5 products) ----
    ["EV-001", "EV stotele", "ABB", "Terra AC W7-G5", 7000, "", "", 3, 650, "268x256x112", 3.2, "7 kW AC ikrovimas, Type 2", ""],
    ["EV-002", "EV stotele", "ABB", "Terra AC W11-G5", 11000, "", "", 3, 850, "268x256x112", 3.3, "11 kW AC ikrovimas, Type 2", ""],
    ["EV-003", "EV stotele", "ABB", "Terra AC W22-G5", 22000, "", "", 3, 1350, "268x256x112", 3.5, "22 kW AC ikrovimas, trijų fazių", ""],
    ["EV-004", "EV stotele", "Easee", "Easee Home", 22000, "", "", 3, 750, "260x245x106", 1.5, "7-22 kW reguliuojamas, kompaktiškas dizainas", ""],
    ["EV-005", "EV stotele", "Wallbox", "Pulsar Plus", 22000, "", "", 3, 700, "163x163x82", 1.3, "7-22 kW, mažiausias rinkoje, app valdymas", ""],
]
# fmt: on


def get_client():
    """Authenticate and return a gspread client."""
    creds_path = PROJECT_ROOT / "credentials.json"
    if not creds_path.exists():
        print(f"ERROR: credentials.json not found at {creds_path}")
        sys.exit(1)

    credentials = Credentials.from_service_account_file(str(creds_path), scopes=SCOPES)
    return gspread.authorize(credentials)


def main():
    sheets_id = os.getenv("GOOGLE_SHEETS_ID")
    if not sheets_id:
        print("ERROR: GOOGLE_SHEETS_ID not set in .env")
        sys.exit(1)

    print("Connecting to Google Sheets...")
    client = get_client()
    spreadsheet = client.open_by_key(sheets_id)
    print(f"Connected to: {spreadsheet.title}")

    # Get the Produktai worksheet
    # Find produktai sheet (case-insensitive)
    existing = {ws.title.lower(): ws for ws in spreadsheet.worksheets()}
    worksheet = existing.get("produktai")
    if not worksheet:
        print("ERROR: 'Produktai'/'produktai' worksheet not found. Run setup_google_sheets.py first.")
        sys.exit(1)
    print(f"Using worksheet: '{worksheet.title}'")

    # Check if data already exists (beyond header row)
    existing_rows = len(worksheet.get_all_values())
    if existing_rows > 1:
        print(f"WARNING: Produktai sheet already has {existing_rows - 1} data rows.")
        response = input("Overwrite existing data? (y/N): ").strip().lower()
        if response != "y":
            print("Aborted.")
            return
        # Clear existing data (keep headers)
        worksheet.batch_clear(["A2:M1000"])
        print("Cleared existing data.")

    # Write all products
    print(f"Writing {len(PRODUCTS)} products...")
    worksheet.update(f"A2:M{len(PRODUCTS) + 1}", PRODUCTS)

    # Count by type
    moduliai = sum(1 for p in PRODUCTS if p[1] == "Modulis")
    inverteriai = sum(1 for p in PRODUCTS if p[1] == "Inverteris")
    kaupikliai = sum(1 for p in PRODUCTS if p[1] == "Kaupiklis")
    ev_stoteles = sum(1 for p in PRODUCTS if p[1] == "EV stotele")
    print(f"\nDone! Populated {len(PRODUCTS)} products:")
    print(f"  - Moduliai: {moduliai}")
    print(f"  - Inverteriai: {inverteriai}")
    print(f"  - Kaupikliai: {kaupikliai}")
    print(f"  - EV stotelės: {ev_stoteles}")

    # List brands
    brands = sorted(set(p[2] for p in PRODUCTS))
    print(f"\nBrands: {', '.join(brands)}")

    print(f"\nSpreadsheet URL: https://docs.google.com/spreadsheets/d/{sheets_id}")


if __name__ == "__main__":
    main()
