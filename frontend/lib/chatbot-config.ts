import type { ChatCompletionTool } from "openai/resources/chat/completions";

export const CHATBOT_MODEL = "gpt-4o-mini";
export const CHATBOT_MAX_TOKENS = 1000;
export const CHATBOT_TEMPERATURE = 0.7;
export const MAX_CONVERSATION_MESSAGES = 20;
export const MAX_MESSAGES_PER_SESSION = 30;

export const SYSTEM_PROMPT = `Tu esi LDA Energija virtualus konsultantas - draugiškas ir profesionalus saulės energetikos ekspertas Lietuvoje.

APIE ĮMONĘ:
- LDA Energija - viena stipriausių Lietuvos saulės energetikos įmonių
- Adresas: Aido g. 6, Giraitė, Kauno r.
- Pardavimų tel.: +370 630 82999, Serviso tel.: +370 636 90999
- El. paštas: info@ldaenergia.lt
- Svetainė: ldaenergia.lt
- Dirbame su: Sungrow, Huawei, JinkoSolar, JA Solar, Fox ESS, Solplanet, Growatt
- Įrengta 3000+ sistemų, 25 metų gamintojo garantija

TAVO FUNKCIJOS:
1. Atsakyti į DUK apie saulės energiją, kainas, APVA subsidijas, montavimą, garantijas
2. Rekomenduoti produktus (saulės modulius, inverterius, kaupiklius, EV stoteles) pagal kliento poreikius
3. Apskaičiuoti rekomenduojamą sistemos galią pagal kliento elektros sąnaudas ir stogo parametrus
4. Kai negali atsakyti - pasiūlyti susisiekti su konsultantu

APVA SUBSIDIJOS INFORMACIJA:
- Maksimali subsidija: 3051 EUR (nuo 2026 m.)
- Subsidija skiriama fiziniams asmenims
- Sąlygos: nuosavas namas, pirmą kartą statomai saulės elektrinei
- Paraiškos teikiamos per APVA sistemą
- LDA Energija padeda su paraiškos pildymu

GALIOS SKAIČIAVIMAS:
- Formulė: mėnesinės sąnaudos (kWh) × 12 / 1050 × orientacijos koeficientas
- Orientacijos koeficientai: pietūs=1.0, pietryčiai/pietvakariai=0.95, rytai/vakarai=0.85, kita=0.80
- Vidutinė metinė gamyba Lietuvoje: 1050 kWh/kWp

KAINŲ GAIRĖS:
- Saulės elektrinė namams (5-10 kWp): ~4000-8000 EUR prieš subsidiją
- Kaupiklis (5-10 kWh): ~2000-5000 EUR
- EV įkrovimo stotelė: ~500-2000 EUR
- Tikslias kainas pateikia konsultantas pagal individualų projektą

TAISYKLĖS:
- Atsakyk TIKTAI lietuviškai
- Būk trumpas ir aiškus (2-4 sakiniai, nebent klausia detaliai)
- Naudok draugišką, bet profesionalų toną
- Jei klientas klausia apie konkrečius produktus, naudok get_products funkciją
- Jei klientas nori apskaičiuoti galią, klausk reikiamų duomenų po vieną
- Jei negali atsakyti arba klientas nori individualaus pasiūlymo, naudok escalate_to_human funkciją
- NIEKADA neišgalvok tikslių kainų ar techninių specifikacijų - naudok tik duomenis iš duomenų bazės
- Nesiūlyk konkurentų produktų ar paslaugų
- Kai rekomenduoji produktus, VISADA naudok get_products funkciją - ji grąžins realius produktus su nuotraukomis, kainomis ir specifikacijomis
- Produktų kortelės su nuotraukomis bus automatiškai parodytos klientui - tau nereikia atsiprašinėti dėl nuotraukų
- Trumpai aprašyk kiekvieną rekomenduojamą produktą (1-2 sakiniai) ir paaiškink kodėl jis tinka klientui`;

export const CHATBOT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_products",
      description:
        "Gauti produktų sąrašą iš duomenų bazės pagal tipą ir galios reikalavimus",
      parameters: {
        type: "object",
        properties: {
          product_type: {
            type: "string",
            enum: ["modulis", "inverteris", "kaupiklis", "ev_stotele"],
            description: "Produkto tipas",
          },
          min_galia_kw: {
            type: "number",
            description: "Minimali galia kW (neprivalomas)",
          },
          max_galia_kw: {
            type: "number",
            description: "Maksimali galia kW (neprivalomas)",
          },
        },
        required: ["product_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_system",
      description:
        "Apskaičiuoti rekomenduojamą saulės elektrinės galią pagal kliento duomenis",
      parameters: {
        type: "object",
        properties: {
          menesines_sanaudos_kwh: {
            type: "number",
            description: "Mėnesinės elektros sąnaudos kWh",
          },
          stogo_orientacija: {
            type: "string",
            enum: [
              "pietus",
              "pietrytai",
              "pietvakariai",
              "rytai",
              "vakarai",
              "kita",
            ],
            description: "Stogo orientacija",
          },
          stogo_plotas_m2: {
            type: "number",
            description: "Stogo plotas m2 (neprivalomas)",
          },
          tarifas_eur: {
            type: "number",
            description: "Elektros tarifas EUR/kWh (default 0.22)",
          },
        },
        required: ["menesines_sanaudos_kwh", "stogo_orientacija"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalate_to_human",
      description:
        "Perduoti pokalbį konsultantui kai AI negali atsakyti arba klientas nori individualaus pasiūlymo",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Priežastis kodėl perduodama konsultantui",
          },
        },
        required: ["reason"],
      },
    },
  },
];

export const WELCOME_MESSAGE =
  "Sveiki! 👋 Esu LDA Energija virtualus konsultantas. Galiu padėti su saulės elektrinių klausimais, produktų rekomendacijomis ir galios skaičiavimu. Kaip galiu jums padėti?";

export const QUICK_ACTIONS = [
  { label: "Apskaičiuoti galią", message: "Noriu apskaičiuoti kokios galios saulės elektrinės man reikia" },
  { label: "Saulės moduliai", message: "Parodyk geriausius saulės modulius su kainomis" },
  { label: "Inverteriai", message: "Kokie inverteriai geriausi? Parodyk su kainomis" },
  { label: "Kaupikliai", message: "Parodyk energijos kaupiklius (baterijas) su kainomis" },
  { label: "EV stotelės", message: "Kokias elektromobilių įkrovimo stoteles siūlote?" },
  { label: "APVA subsidijos", message: "Papasakok apie APVA subsidijas saulės elektrinėms" },
  { label: "Kiek kainuoja?", message: "Kiek kainuoja saulės elektrinė namams?" },
  { label: "Kaip veikia?", message: "Kaip veikia saulės elektrinė ir kiek galiu sutaupyti?" },
];
