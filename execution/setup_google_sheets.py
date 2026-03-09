"""
Setup Google Sheets for the solar panel proposal system.

Creates two worksheets in the specified Google Sheet:
1. "Produktai" - Product catalog with solar energy specifications
2. "Uzklausos" - Customer inquiry tracking

Requires:
- GOOGLE_SHEETS_ID in .env
- credentials.json (service account) in project root
"""

import os
import sys
from pathlib import Path

import gspread
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

# Project root is one level up from execution/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(PROJECT_ROOT / ".env")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

PRODUKTAI_HEADERS = [
    "ID",
    "Tipas",
    "Gamintojas",
    "Modelis",
    "Galia W",
    "Talpa kWh",
    "Efektyvumas %",
    "Garantija metai",
    "Kaina EUR",
    "Matmenys",
    "Svoris kg",
    "Pastabos",
    "Nuotrauka URL",
]

UZKLAUSOS_HEADERS = [
    "ID",
    "Data",
    "Vardas",
    "El. pastas",
    "Telefonas",
    "Tipas",
    "Menesines sanaudos kWh",
    "Stogo tipas",
    "Stogo orientacija",
    "Stogo plotas m2",
    "Seseliai",
    "Tarifas EUR/kWh",
    "Domina kaupiklis",
    "Domina APVA",
    "Apskaiciuota galia kWp",
    "Paneliu skaicius",
    "Metine gamyba kWh",
    "Metinis sutaupymas EUR",
    "APVA subsidija EUR",
    "Papildoma info",
    "AI Rekomendacijos",
    "Pasiulymo statusas",
    "Follow-up D1",
    "Follow-up D3",
    "Follow-up D5",
    "Pastabos",
]


def get_client():
    """Authenticate and return a gspread client."""
    creds_path = PROJECT_ROOT / "credentials.json"
    if not creds_path.exists():
        print(f"ERROR: credentials.json not found at {creds_path}")
        sys.exit(1)

    credentials = Credentials.from_service_account_file(str(creds_path), scopes=SCOPES)
    return gspread.authorize(credentials)


def setup_worksheet(spreadsheet, title, headers):
    """Create or verify a worksheet with the given headers."""
    # Check if worksheet already exists
    existing = [ws.title for ws in spreadsheet.worksheets()]

    if title in existing:
        print(f"  Worksheet '{title}' already exists - verifying headers...")
        worksheet = spreadsheet.worksheet(title)
        current_headers = worksheet.row_values(1)
        if current_headers == headers:
            print(f"  Headers match. No changes needed.")
        else:
            print(f"  Updating headers...")
            worksheet.update("A1", [headers])
    else:
        print(f"  Creating worksheet '{title}'...")
        worksheet = spreadsheet.add_worksheet(title=title, rows=1000, cols=len(headers))
        worksheet.update("A1", [headers])

    # Format headers: bold + freeze first row
    worksheet.format("A1:Z1", {
        "textFormat": {"bold": True},
        "backgroundColor": {"red": 0.9, "green": 0.9, "blue": 0.9},
    })
    worksheet.freeze(rows=1)
    print(f"  Worksheet '{title}' ready with {len(headers)} columns.")
    return worksheet


def main():
    sheets_id = os.getenv("GOOGLE_SHEETS_ID")
    client = get_client()

    if not sheets_id:
        print("No GOOGLE_SHEETS_ID found. Creating new spreadsheet...")
        spreadsheet = client.create("LDA Energija - Saulės elektrinės")
        spreadsheet.share("", perm_type="anyone", role="writer")
        sheets_id = spreadsheet.id
        # Save to .env
        env_path = PROJECT_ROOT / ".env"
        env_content = env_path.read_text() if env_path.exists() else ""
        if "GOOGLE_SHEETS_ID=" in env_content:
            lines = env_content.split("\n")
            lines = [f"GOOGLE_SHEETS_ID={sheets_id}" if l.startswith("GOOGLE_SHEETS_ID=") else l for l in lines]
            env_path.write_text("\n".join(lines))
        else:
            with open(env_path, "a") as f:
                f.write(f"\nGOOGLE_SHEETS_ID={sheets_id}\n")
        # Also update frontend/.env.local
        frontend_env = PROJECT_ROOT / "frontend" / ".env.local"
        if frontend_env.exists():
            fe_content = frontend_env.read_text()
            if "GOOGLE_SHEETS_ID=" in fe_content:
                lines = fe_content.split("\n")
                lines = [f"GOOGLE_SHEETS_ID={sheets_id}" if l.startswith("GOOGLE_SHEETS_ID=") else l for l in lines]
                frontend_env.write_text("\n".join(lines))
        print(f"Created spreadsheet: {spreadsheet.title}")
        print(f"ID: {sheets_id}")
    else:
        print("Connecting to Google Sheets...")
        spreadsheet = client.open_by_key(sheets_id)

    print(f"Connected to: {spreadsheet.title}")

    # Remove default "Sheet1" if our sheets don't exist yet
    existing = [ws.title for ws in spreadsheet.worksheets()]

    # Detect existing sheet names (case-insensitive matching)
    existing = {ws.title.lower(): ws.title for ws in spreadsheet.worksheets()}
    produktai_name = existing.get("produktai", "Produktai")
    uzklausos_name = existing.get("uzklausos", "Uzklausos")

    print(f"\nSetting up '{produktai_name}' worksheet...")
    setup_worksheet(spreadsheet, produktai_name, PRODUKTAI_HEADERS)

    print(f"\nSetting up '{uzklausos_name}' worksheet...")
    setup_worksheet(spreadsheet, uzklausos_name, UZKLAUSOS_HEADERS)

    # Remove default Sheet1 if it exists and we have our sheets
    existing = [ws.title for ws in spreadsheet.worksheets()]
    if "Sheet1" in existing and len(existing) > 1:
        print("\nRemoving default 'Sheet1'...")
        spreadsheet.del_worksheet(spreadsheet.worksheet("Sheet1"))

    print("\nSetup complete!")
    print(f"Spreadsheet URL: https://docs.google.com/spreadsheets/d/{sheets_id}")


if __name__ == "__main__":
    main()
