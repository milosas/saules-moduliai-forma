# AI Produktų Atranka

## Tikslas

Automatiškai atrinkti geriausius saulės elektrinės komponentus pagal kliento poreikius, naudojant AI (OpenAI GPT) produktų analizei ir rekomendacijoms. Atrinkti modulius, inverterius, kaupiklius ir EV stoteles.

---

## Įvestys (Inputs)

### Kliento duomenys (iš n8n workflow)

| Laukas | Tipas | Aprašymas |
|--------|-------|-----------|
| tipas | string | namams / verslui / ūkiui |
| menesines_sanaudos_kwh | number | Mėnesinės elektros sąnaudos |
| stogo_orientacija | string | pietūs / pietryčių / pietvakrių / rytai / vakarai / kita |
| stogo_plotas_m2 | number | Stogo plotas kvadratiniais metrais |
| apskaiciuota_galia_kwp | number | Rekomenduojama galia kWp |
| moduliu_sk | number | Apskaičiuotas modulių skaičius |
| domina_kaupiklis | boolean | Ar domina energijos kaupiklis |
| domina_ev | boolean | Ar domina EV įkrovimo stotelė |
| papildoma_info | string | Kliento pageidavimai |

### Produktų duomenų bazė (Google Sheets)

**Produktų tipai ir stulpeliai:**

**Modulis (saulės panelė):**
- ID, Tipas (Modulis), Gamintojas, Modelis
- Galia W, Efektyvumas %, Technologija (mono/poly/bifacial)
- Matmenys, Svoris kg
- Gamintojo garantija metų, Galios garantija metų
- Kaina EUR
- Pastabos, Nuotrauka URL

**Inverteris:**
- ID, Tipas (Inverteris), Gamintojas, Modelis
- Max DC galia kW, AC galia kW, Max efektyvumas %
- MPPT kiekis, Faziškumas (1f/3f)
- Garantija metų, Kaina EUR
- Pastabos

**Kaupiklis (baterija):**
- ID, Tipas (Kaupiklis), Gamintojas, Modelis
- Talpa kWh, Max iškrovimo galia kW
- Ciklų skaičius, Garantija metų
- Kaina EUR, Pastabos

**EV stotelė:**
- ID, Tipas (EV stotelė), Gamintojas, Modelis
- Max galia kW, Jungtis (Type2/CCS)
- Smart funkcijos, Garantija metų
- Kaina EUR, Pastabos

---

## Įrankiai / Skriptai (Tools/Scripts)

| Įrankis | Paskirtis |
|---------|-----------|
| n8n Google Sheets node | Nuskaito produktų duomenis |
| n8n OpenAI node | AI produktų atranka |
| n8n Function node | Galios apskaičiavimas ir duomenų transformacija |

---

## Procesas

### 1. Galios apskaičiavimas

```
Rekomenduojama galia (kWp) = Mėnesinės sąnaudos (kWh) x 12 / 1050
```

Orientacijos koeficientai:
| Orientacija | Koeficientas |
|-------------|-------------|
| Pietūs | 1.0 |
| Pietryčių/Pietvakrių | 0.95 |
| Rytai/Vakarai | 0.85 |
| Kita | 0.80 |

**Pavyzdys:** 300 kWh/mėn, pietų orientacija = 300 * 12 / 1050 = 3.43 kWp

### 2. Produktų filtravimas (pirminė atranka)

Prieš siunčiant į AI, filtruojami produktai:

**Moduliai:**
1. Modulių sk. * modulio galia W / 1000 turi būti +-20% nuo apskaičiuotos galios kWp
2. Bendras modulių plotas turi tilpti į stogo plotą

**Inverteriai:**
1. AC galia turi būti >= apskaičiuotos galios kWp
2. AC galia turi būti <= 1.3 * apskaičiuotos galios kWp (inverteris neturi būti per didelis)
3. Faziškumas: 1f iki 5 kWp, 3f nuo 5 kWp

**Kaupikliai (jei domina):**
1. Talpa kWh: rekomenduojama 1-2x dienos vartojimas (mėnesinės / 30)
2. Max iškrovimo galia >= 3 kW

**EV stotelės (jei domina):**
1. Visos turimos EV stotelės pateikiamos

### 3. AI atranka (OpenAI)

#### System prompt

```
Tu esi saulės elektrinių ekspertas Lietuvoje. Tavo užduotis - iš pateiktų produktų atrinkti geriausius variantus klientui ir juos sureitinguoti.

Vertinimo kriterijai (svarbumo tvarka):
1. Galios atitikimas (30%) - modulių sk. x galia W turi atitikti reikiamą kWp
2. Efektyvumas % (25%) - didesnis efektyvumas = mažiau vietos stoge
3. Kainos ir kokybės santykis (20%) - kaina atsižvelgiant į galimybes
4. Garantijos trukmė (10%) - ilgesnė garantija = geriau
5. Gamintojo patikimumas (10%) - žinomi gamintojai (Sungrow, Huawei, JA Solar, Longi, Canadian Solar)
6. Suderinamumas (5%) - modulių ir inverterio suderinamumas

Pateik rezultatą TIKTAI JSON formatu, be jokio papildomo teksto.
```

#### User prompt template

```
Kliento poreikiai:
- Tipas: {tipas}
- Mėnesinės sąnaudos: {menesines_sanaudos_kwh} kWh
- Stogo orientacija: {stogo_orientacija}
- Stogo plotas: {stogo_plotas_m2} m2
- Reikalinga galia: {apskaiciuota_galia_kwp} kWp
- Modulių skaičius: {moduliu_sk}
- Domina kaupiklis: {domina_kaupiklis}
- Domina EV stotelė: {domina_ev}
- Papildomi pageidavimai: {papildoma_info}

Galimi moduliai:
{moduliu_sarasas_json}

Galimi inverteriai:
{inverteriu_sarasas_json}

{kaupikliu_sekcija}
{ev_stoteliu_sekcija}

Atrink TOP 3-5 modulius ir 1-2 inverterius. Jei klientas domisi kaupikliu - atrink 1-2 kaupiklius. Jei domisi EV - atrink 1 EV stotelę.

Pateik JSON formatu:
{
  "rekomendacijos": {
    "moduliai": [
      {
        "vieta": 1,
        "produkto_id": "SM-001",
        "gamintojas": "...",
        "modelis": "...",
        "galia_w": 445,
        "efektyvumas": 22.1,
        "garantija_metu": 25,
        "kaina_eur": 0,
        "priezastis": "Trumpas paaiškinimas kodėl rekomenduojama"
      }
    ],
    "inverteriai": [
      {
        "vieta": 1,
        "produkto_id": "INV-001",
        "gamintojas": "...",
        "modelis": "...",
        "galia_kw": 0.0,
        "kaina_eur": 0,
        "priezastis": "..."
      }
    ],
    "kaupikliai": [],
    "ev_stoteles": []
  }
}
```

### 4. Atsakymo JSON formatas

```json
{
  "rekomendacijos": {
    "moduliai": [
      {
        "vieta": 1,
        "produkto_id": "SM-001",
        "gamintojas": "JA Solar",
        "modelis": "JAM54S31-445/MR",
        "galia_w": 445,
        "efektyvumas": 22.1,
        "garantija_metu": 25,
        "kaina_eur": 150,
        "priezastis": "Geriausias efektyvumo ir kainos santykis, patikimas gamintojas"
      }
    ],
    "inverteriai": [
      {
        "vieta": 1,
        "produkto_id": "INV-001",
        "gamintojas": "Sungrow",
        "modelis": "SG5.0RS",
        "galia_kw": 5.0,
        "kaina_eur": 800,
        "priezastis": "Optimalus galios atitikimas, aukščiausia efektyvumas"
      }
    ],
    "kaupikliai": [],
    "ev_stoteles": []
  }
}
```

---

## Išvestys (Outputs)

- Rekomenduojamų produktų sąrašas JSON formatu (moduliai, inverteriai, kaupikliai, EV stotelės)
- Kiekvienas produktas su pozicija, specifikacijomis ir trumpu paaiškinimu
- Saugoma Google Sheets "Užklausos" lapo stulpelyje "AI Rekomendacijos"

---

## Kraštinių Atvejų Valdymas (Edge Cases)

### Nėra atitinkančių produktų
- Jei po filtravimo liko < 3 moduliai: išplėsti galios diapazono filtrą iki +-40% ir bandyti dar kartą
- Jei po filtravimo liko 0 produktų: siųsti AI visus turimus modulius ir leisti jam parinkti artimiausią
- Jei nėra tinkamo inverterio: siūlyti artimiausią didesnį inverterį

### Biudžeto apribojimai
- Jei kliento papildomoje info minimas biudžetas (pvz. "iki 5000 EUR"), AI atsižvelgia į tai reitinguojant
- Biudžetas nėra griežtas filtras - AI gali rekomenduoti ir brangesnius variantus su paaiškinimu

### Stogo plotas per mažas
- Jei stogo plotas netelpa reikiamam modulių kiekiui: AI rekomenduoja mažesnės galios sistemą ir įspėja
- Alternatyviai siūlo aukštesnės galios modulius (pvz. 500W vietoj 445W)

### AI atsakymo klaidos
- Jei AI grąžina ne JSON: pakartoti užklausą 1 kartą su griežtesniu prompt
- Jei AI grąžina mažiau nei 3 modulius: priimti kiek grąžino
- Jei AI neatsako per 30s: timeout, grąžinti pirminius 3 modulius surikiuotus pagal efektyvumą

### Produktų duomenų bazės atnaujinimas
- Produktai saugomi Google Sheets atskiruose lapuose: "Moduliai", "Inverteriai", "Kaupikliai", "EV stotelės"
- Naujus produktus galima pridėti tiesiogiai į Google Sheets
- Būtini laukai: ID, Tipas, Gamintojas, Modelis, Galia, Kaina EUR
- ID formatas: SM-XXX (moduliai), INV-XXX (inverteriai), BAT-XXX (kaupikliai), EV-XXX (EV stotelės)
- Po pridėjimo/atnaujinimo nereikia jokių papildomų veiksmų - n8n nuskaitys naujausius duomenis automatiškai
