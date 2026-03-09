import { NextResponse } from "next/server";

const N8N_DASHBOARD_URL = "https://n8n.blingo.lt/webhook/lda-saules-dashboard-api";

interface SheetRow {
  ID?: string | number;
  Data?: string;
  Vardas?: string;
  "El. pastas"?: string;
  Telefonas?: string | number;
  Tipas?: string;
  "Menesines sanaudos kWh"?: string | number;
  "Stogo tipas"?: string;
  "Stogo orientacija"?: string;
  "Stogo plotas m2"?: string | number;
  Seseliai?: string;
  "Tarifas EUR/kWh"?: string | number;
  "Domina kaupiklis"?: string;
  "Domina APVA"?: string;
  "Apskaiciuota galia kWp"?: string | number;
  "Paneliu skaicius"?: string | number;
  "Metine gamyba kWh"?: string | number;
  "Metinis sutaupymas EUR"?: string | number;
  "APVA subsidija EUR"?: string | number;
  "Papildoma info"?: string;
  "AI Rekomendacijos"?: string;
  "Pasiulymo statusas"?: string;
  "Follow-up D1"?: string;
  "Follow-up D3"?: string;
  "Follow-up D5"?: string;
  Pastabos?: string;
  // camelCase variants from Set node
  Email?: string;
  MenesinesSanaudos?: string | number;
  StogoTipas?: string;
  StogoOrientacija?: string;
  StogoPlotas?: string | number;
  Seseliai_cc?: string;
  Tarifas?: string | number;
  DominaKaupiklis?: string;
  DominaAPVA?: string;
  ApskaiciuotaGaliaKwp?: string | number;
  PaneliuSkaicius?: string | number;
  MetineGamyba?: string | number;
  MetinisSutaupymas?: string | number;
  ApvaSubsidija?: string | number;
  PapildomaInfo?: string;
  PasiulymoStatusas?: string;
}

export async function GET() {
  try {
    const res = await fetch(N8N_DASHBOARD_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`n8n API error: ${res.status}`);
    }

    const rawData = await res.json();
    // n8n Code node wraps all rows in { uzklausos: [...] }
    const dataArray = rawData.uzklausos || (Array.isArray(rawData) ? rawData : [rawData]);
    const rows: SheetRow[] = dataArray;

    // Extract email from broken "El" nested object or "El. pastas" column
    function getEmail(row: Record<string, unknown>): string {
      if (row.Email && typeof row.Email === "string" && row.Email.length > 0) return row.Email;
      if (row["El. pastas"] && typeof row["El. pastas"] === "string" && row["El. pastas"].length > 0) return row["El. pastas"];
      // Handle broken nested object from dot in field name: El: {" pastas": "email@..."}
      if (row.El && typeof row.El === "string") {
        try {
          const parsed = JSON.parse(row.El);
          const val = parsed[" pastas"] || parsed[" paštas"] || parsed["pastas"];
          if (val) return val;
        } catch { /* ignore */ }
      }
      if (row.El && typeof row.El === "object") {
        const el = row.El as Record<string, string>;
        return el[" pastas"] || el[" paštas"] || el["pastas"] || "";
      }
      return "";
    }

    const uzklausos = rows
      .filter((row) => row.ID)
      .sort((a, b) => {
        const dateA = a.Data || "";
        const dateB = b.Data || "";
        return dateB.localeCompare(dateA);
      })
      .map((row) => {
        const tipas = row.Tipas || "";

        return {
          id: String(row.ID || ""),
          data: row.Data || "",
          vardas: row.Vardas || "",
          email: getEmail(row as Record<string, unknown>),
          telefonas: String(row.Telefonas || ""),
          tipas,
          menesinesSanaudos: String(row.MenesinesSanaudos || row["Menesines sanaudos kWh"] || ""),
          stogoTipas: row.StogoTipas || row["Stogo tipas"] || "",
          stogoOrientacija: row.StogoOrientacija || row["Stogo orientacija"] || "",
          stogoPlotas: String(row.StogoPlotas || row["Stogo plotas m2"] || ""),
          seseliai: row.Seseliai_cc || row.Seseliai || row["Seseliai"] || "",
          tarifas: String(row.Tarifas || row["Tarifas EUR/kWh"] || ""),
          dominaKaupiklis: row.DominaKaupiklis || row["Domina kaupiklis"] || "",
          dominaAPVA: row.DominaAPVA || row["Domina APVA"] || "",
          apskaiciuotaGaliaKwp: String(row.ApskaiciuotaGaliaKwp || row["Apskaiciuota galia kWp"] || ""),
          paneliuSkaicius: String(row.PaneliuSkaicius || row["Paneliu skaicius"] || ""),
          metineGamyba: String(row.MetineGamyba || row["Metine gamyba kWh"] || ""),
          metinisSutaupymas: String(row.MetinisSutaupymas || row["Metinis sutaupymas EUR"] || ""),
          apvaSubsidija: String(row.ApvaSubsidija || row["APVA subsidija EUR"] || ""),
          papildomiPageidavimai: row.PapildomaInfo || row["Papildoma info"] || "",
          aiRekomendacijos: row["AI Rekomendacijos"] || "",
          statusas: row.PasiulymoStatusas || row["Pasiulymo statusas"] || "",
          emailSekpiD1: row["Follow-up D1"] || "",
          emailSekpiD3: row["Follow-up D3"] || "",
          emailSekpiD5: row["Follow-up D5"] || "",
          pastabos: row.Pastabos || "",
        };
      });

    return NextResponse.json({ uzklausos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
