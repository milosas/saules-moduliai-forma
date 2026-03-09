# AI Produktu Atranka

## Tikslas

Automatiskai atrinkti geriausius saules elektrines komponentus pagal kliento poreikius, naudojant AI (OpenAI GPT) produktu analizei ir rekomendacijoms. Atrinkti modulius, inverterius, kaupiklius ir EV stoteles.

---

## Ivestys (Inputs)

### Kliento duomenys (is n8n workflow)

| Laukas | Tipas | Aprasymas |
|--------|-------|-----------|
| tipas | string | namams / verslui / ukiui |
| menesines_sanaudos_kwh | number | Menesines elektros sanaudos |
| stogo_orientacija | string | pietus / pieryciu / pietvakriu / rytai / vakarai / kita |
| stogo_plotas_m2 | number | Stogo plotas kvadratiniais metrais |
| apskaiciuota_galia_kwp | number | Rekomenduojama galia kWp |
| moduliu_sk | number | Apskaiciuotas moduliu skaicius |
| domina_kaupiklis | boolean | Ar domina energijos kaupiklis |
| domina_ev | boolean | Ar domina EV ikrovimo stotele |
| papildoma_info | string | Kliento pageidavimai |

### Produktu duomenu baze (Google Sheets)

**Produktu tipai ir stulpeliai:**

**Modulis (saules panele):**
- ID, Tipas (Modulis), Gamintojas, Modelis
- Galia W, Efektyvumas %, Technologija (mono/poly/bifacial)
- Matmenys, Svoris kg
- Gamintojo garantija metu, Galios garantija metu
- Kaina EUR
- Pastabos, Nuotrauka URL

**Inverteris:**
- ID, Tipas (Inverteris), Gamintojas, Modelis
- Max DC galia kW, AC galia kW, Max efektyvumas %
- MPPT kiekis, Faziskumas (1f/3f)
- Garantija metu, Kaina EUR
- Pastabos

**Kaupiklis (baterija):**
- ID, Tipas (Kaupiklis), Gamintojas, Modelis
- Talpa kWh, Max iskrovimo galia kW
- Ciklu skaicius, Garantija metu
- Kaina EUR, Pastabos

**EV stotele:**
- ID, Tipas (EV stotele), Gamintojas, Modelis
- Max galia kW, Jungtis (Type2/CCS)
- Smart funkcijos, Garantija metu
- Kaina EUR, Pastabos

---

## Irankiai / Skriptai (Tools/Scripts)

| Irankis | Paskirtis |
|---------|-----------|
| n8n Google Sheets node | Nuskaito produktu duomenis |
| n8n OpenAI node | AI produktu atranka |
| n8n Function node | Galios apskaiciavimas ir duomenu transformacija |

---

## Procesas

### 1. Galios apskaiciavimas

```
Rekomenduojama galia (kWp) = Menesines sanaudos (kWh) x 12 / 1050
```

Orientacijos koeficientai:
| Orientacija | Koeficientas |
|-------------|-------------|
| Pietus | 1.0 |
| Pieryciu/Pietvakriu | 0.95 |
| Rytai/Vakarai | 0.85 |
| Kita | 0.80 |

**Pavyzdys:** 300 kWh/men, pietu orientacija = 300 * 12 / 1050 = 3.43 kWp

### 2. Produktu filtravimas (pirmine atranka)

Pries siunciant i AI, filtruojami produktai:

**Moduliai:**
1. Moduliu sk. * modulio galia W / 1000 turi buti +-20% nuo apskaiciuotos galios kWp
2. Bendras moduliu plotas turi tilpti i stogo plota

**Inverteriai:**
1. AC galia turi buti >= apskaiciuotos galios kWp
2. AC galia turi buti <= 1.3 * apskaiciuotos galios kWp (inverteris neturi buti per didelis)
3. Faziskumas: 1f iki 5 kWp, 3f nuo 5 kWp

**Kaupikliai (jei domina):**
1. Talpa kWh: rekomenduojama 1-2x dienos vartojimas (menesines / 30)
2. Max iskrovimo galia >= 3 kW

**EV stoteles (jei domina):**
1. Visos turimos EV stoteles pateikiamos

### 3. AI atranka (OpenAI)

#### System prompt

```
Tu esi saules elektriniu ekspertas Lietuvoje. Tavo uzduotis - is pateiktu produktu atrinkti geriausius variantus klientui ir juos sureitinguoti.

Vertinimo kriterijai (svarbumo tvarka):
1. Galios atitikimas (30%) - moduliu sk. x galia W turi atitikti reikiama kWp
2. Efektyvumas % (25%) - didesnis efektyvumas = maziau vietos stoge
3. Kainos ir kokybes santykis (20%) - kaina atsizvelgiant i galimybes
4. Garantijos trukme (10%) - ilgesne garantija = geriau
5. Gamintojo patikimumas (10%) - zinomi gamintojai (Sungrow, Huawei, JA Solar, Longi, Canadian Solar)
6. Suderinamumas (5%) - moduliu ir inverterio suderinamumas

Pateik rezultata TIKTAI JSON formatu, be jokio papildomo teksto.
```

#### User prompt template

```
Kliento poreikiai:
- Tipas: {tipas}
- Menesines sanaudos: {menesines_sanaudos_kwh} kWh
- Stogo orientacija: {stogo_orientacija}
- Stogo plotas: {stogo_plotas_m2} m2
- Reikalinga galia: {apskaiciuota_galia_kwp} kWp
- Moduliu skaicius: {moduliu_sk}
- Domina kaupiklis: {domina_kaupiklis}
- Domina EV stotele: {domina_ev}
- Papildomi pageidavimai: {papildoma_info}

Galimi moduliai:
{moduliu_sarasas_json}

Galimi inverteriai:
{inverteriu_sarasas_json}

{kaupikliu_sekcija}
{ev_stoteliu_sekcija}

Atrink TOP 3-5 modulius ir 1-2 inverterius. Jei klientas domisi kaupikliu - atrink 1-2 kaupiklius. Jei domisi EV - atrink 1 EV stotele.

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
        "priezastis": "Trumpas paaiskiniimas kodel rekomenduojama"
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
        "priezastis": "Optimalus galios atitikimas, auksciausia efektyvumas"
      }
    ],
    "kaupikliai": [],
    "ev_stoteles": []
  }
}
```

---

## Isvestys (Outputs)

- Rekomenduojamu produktu sarasas JSON formatu (moduliai, inverteriai, kaupikliai, EV stoteles)
- Kiekvienas produktas su pozicija, specifikacijomis ir trumpu paaiskinamu
- Saugoma Google Sheets "Uzklausos" lapo stulpelyje "AI Rekomendacijos"

---

## Krasztiniu Atveju Valdymas (Edge Cases)

### Nera atitinkanciu produktu
- Jei po filtravimo liko < 3 moduliai: isplesti galios diapazono filtra iki +-40% ir bandyti dar karta
- Jei po filtravimo liko 0 produktu: siusti AI visus turimus modulius ir leisti jam parinkti artimiausia
- Jei nera tinkamo inverterio: siulyti artimiausia didesni inverteri

### Biudzeto apribojimai
- Jei kliento papildomoje info minimas biudzetas (pvz. "iki 5000 EUR"), AI atsizvelgia i tai reitinguojant
- Biudzetas nera grieztas filtras - AI gali rekomenduoti ir brangesnius variantus su paaiskinamu

### Stogo plotas per mazas
- Jei stogo plotas netelpa reikiamam moduliu kiekiui: AI rekomenduoja mazesnes galios sistema ir ispeja
- Alternatyviai siulo aukstesnes galios modulius (pvz. 500W vietoj 445W)

### AI atsakymo klaidos
- Jei AI grazina ne JSON: pakartoti uzklausa 1 karta su grieztesu prompt
- Jei AI grazina maziau nei 3 modulius: priimti kiek grazino
- Jei AI neatsako per 30s: timeout, grazinti pirminius 3 modulius surikiuotus pagal efektyvuma

### Produktu duomenu bazes atnaujinimas
- Produktai saugomi Google Sheets atskiuose lapuose: "Moduliai", "Inverteriai", "Kaupikliai", "EV stoteles"
- Naujus produktus galima prideti tiesiogiai i Google Sheets
- Butini laukai: ID, Tipas, Gamintojas, Modelis, Galia, Kaina EUR
- ID formatas: SM-XXX (moduliai), INV-XXX (inverteriai), BAT-XXX (kaupikliai), EV-XXX (EV stoteles)
- Po pridejimo/atnaujinimo nereikia jokiu papildomu veiksmu - n8n nuskaitys naujausius duomenis automatiskai
