import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Sheets credentials not configured");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export interface Uzklausas {
  id: string;
  data: string;
  vardas: string;
  email: string;
  telefonas: string;
  tipas: string;
  menesinesSanaudos: string;
  stogoTipas: string;
  stogoOrientacija: string;
  stogoPlotas: string;
  seseliai: string;
  tarifas: string;
  dominaKaupiklis: string;
  dominaAPVA: string;
  apskaiciuotaGaliaKwp: string;
  paneliuSkaicius: string;
  metineGamyba: string;
  metinisSutaupymas: string;
  apvaSubsidija: string;
  papildomiPageidavimai: string;
  aiRekomendacijos: string;
  statusas: string;
  emailSekpiD1: string;
  emailSekpiD3: string;
  emailSekpiD5: string;
  pastabos: string;
}

export async function getUzklausos(): Promise<Uzklausas[]> {
  const sheetsId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetsId) {
    throw new Error("GOOGLE_SHEETS_ID not configured");
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetsId,
    range: "Uzklausos!A2:Z",
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0] && row[0].trim() !== "" && row[2] && row[2].trim() !== "")
    .map((row) => ({
    id: row[0],
    data: row[1] || "",
    vardas: row[2] || "",
    email: row[3] || "",
    telefonas: row[4] || "",
    tipas: row[5] || "",
    menesinesSanaudos: row[6] || "",
    stogoTipas: row[7] || "",
    stogoOrientacija: row[8] || "",
    stogoPlotas: row[9] || "",
    seseliai: row[10] || "",
    tarifas: row[11] || "",
    dominaKaupiklis: row[12] || "",
    dominaAPVA: row[13] || "",
    apskaiciuotaGaliaKwp: row[14] || "",
    paneliuSkaicius: row[15] || "",
    metineGamyba: row[16] || "",
    metinisSutaupymas: row[17] || "",
    apvaSubsidija: row[18] || "",
    papildomiPageidavimai: row[19] || "",
    aiRekomendacijos: row[20] || "",
    statusas: row[21] || "",
    emailSekpiD1: row[22] || "",
    emailSekpiD3: row[23] || "",
    emailSekpiD5: row[24] || "",
    pastabos: row[25] || "",
  }));
}

