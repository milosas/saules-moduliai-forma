import { google } from "googleapis";
import { LOCAL_PRODUCTS } from "./products-data";

// --- Google Sheets Auth (reuses pattern from google-sheets.ts) ---

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

// --- Product types ---

export interface Product {
  id: string;
  tipas: string;
  gamintojas: string;
  modelis: string;
  galia: number;
  efektyvumas?: number;
  technologija?: string;
  garantija_metu: number;
  kaina_eur: number;
  nuotrauka_url?: string;
  pastabos?: string;
  // Inverter-specific
  ac_galia_kw?: number;
  mppt_kiekis?: number;
  faziskumas?: string;
  // Battery-specific
  talpa_kwh?: number;
  max_iskrovimo_galia_kw?: number;
  ciklu_skaicius?: number;
  // EV-specific
  jungtis?: string;
  smart_funkcijos?: string;
}

// --- In-memory product cache (15 min TTL) ---

let productCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function fetchAllProducts(): Promise<Product[]> {
  if (productCache && Date.now() - productCache.timestamp < CACHE_TTL) {
    return productCache.data;
  }

  const sheetsId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetsId || !email || !key) {
    return LOCAL_PRODUCTS;
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetsId,
    range: "Produktai!A2:P",
  });

  const rows = response.data.values || [];

  const products: Product[] = rows.map((row) => ({
    id: row[0] || "",
    tipas: row[1] || "",
    gamintojas: row[2] || "",
    modelis: row[3] || "",
    galia: parseFloat(row[4]) || 0,
    efektyvumas: row[5] ? parseFloat(row[5]) : undefined,
    technologija: row[6] || undefined,
    garantija_metu: parseInt(row[7]) || 0,
    kaina_eur: parseFloat(row[8]) || 0,
    nuotrauka_url: row[9] || undefined,
    pastabos: row[10] || undefined,
    ac_galia_kw: row[11] ? parseFloat(row[11]) : undefined,
    mppt_kiekis: row[12] ? parseInt(row[12]) : undefined,
    faziskumas: row[13] || undefined,
    talpa_kwh: row[14] ? parseFloat(row[14]) : undefined,
    max_iskrovimo_galia_kw: row[15] ? parseFloat(row[15]) : undefined,
  }));

  productCache = { data: products, timestamp: Date.now() };
  return products;
}

// --- Tool: get_products ---

export async function getProducts(params: {
  product_type: string;
  min_galia_kw?: number;
  max_galia_kw?: number;
}): Promise<Product[]> {
  const allProducts = await fetchAllProducts();

  const typeMap: Record<string, string> = {
    modulis: "Modulis",
    inverteris: "Inverteris",
    kaupiklis: "Kaupiklis",
    ev_stotele: "EV stotele",
  };

  const targetType = typeMap[params.product_type] || params.product_type;

  let filtered = allProducts.filter(
    (p) => p.tipas.toLowerCase() === targetType.toLowerCase()
  );

  if (params.min_galia_kw !== undefined) {
    const minW = params.min_galia_kw * 1000;
    filtered = filtered.filter((p) => {
      const galia = p.tipas === "Modulis" ? p.galia : (p.ac_galia_kw || p.galia) * 1000;
      return galia >= minW * 0.8; // 20% tolerance
    });
  }

  if (params.max_galia_kw !== undefined) {
    const maxW = params.max_galia_kw * 1000;
    filtered = filtered.filter((p) => {
      const galia = p.tipas === "Modulis" ? p.galia : (p.ac_galia_kw || p.galia) * 1000;
      return galia <= maxW * 1.2; // 20% tolerance
    });
  }

  return filtered;
}

// --- Tool: calculate_system ---

export interface CalculationResult {
  galia_kwp: number;
  moduliu_skaicius: number;
  metine_gamyba_kwh: number;
  metinis_sutaupymas_eur: number;
  apva_subsidija_eur: number;
  orientacijos_koeficientas: number;
}

const ORIENTATION_COEFFICIENTS: Record<string, number> = {
  pietus: 1.0,
  pietrytai: 0.95,
  pietvakariai: 0.95,
  rytai: 0.85,
  vakarai: 0.85,
  kita: 0.8,
};

export function calculateSystem(params: {
  menesines_sanaudos_kwh: number;
  stogo_orientacija: string;
  stogo_plotas_m2?: number;
  tarifas_eur?: number;
}): CalculationResult {
  const koef = ORIENTATION_COEFFICIENTS[params.stogo_orientacija] || 0.85;
  const tarifas = params.tarifas_eur || 0.22;

  const galia_kwp = Math.round(((params.menesines_sanaudos_kwh * 12) / 1050 / koef) * 100) / 100;
  const moduliu_skaicius = Math.ceil(galia_kwp / 0.445);
  const metine_gamyba_kwh = Math.round(galia_kwp * 1050);
  const metinis_sutaupymas_eur = Math.round(metine_gamyba_kwh * tarifas);
  const apva_subsidija_eur = 3051;

  return {
    galia_kwp,
    moduliu_skaicius,
    metine_gamyba_kwh,
    metinis_sutaupymas_eur,
    apva_subsidija_eur,
    orientacijos_koeficientas: koef,
  };
}

// --- Tool: escalate_to_human ---

export function escalateToHuman(reason: string) {
  return {
    reason,
    contacts: {
      pardavimai: "+370 630 82999",
      servisas: "+370 636 90999",
      email: "info@ldaenergia.lt",
    },
  };
}
