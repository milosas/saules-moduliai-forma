# Email Sekos Valdymas

## Tikslas

Automatiškai siųsti komercinį pasiūlymą ir follow-up email seką klientui po užklausos pateikimo, siekiant padidinti konversijų. Saulės elektrinės pasiūlymų seka su LDA Energija branding.

---

## Įvestys (Inputs)

### Kliento duomenys

| Laukas | Šaltinis |
|--------|---------|
| Vardas | Užklausos forma |
| El. paštas | Užklausos forma |
| Tipas | Užklausos forma (namams/verslui/ūkiui) |
| Mėnesinės sąnaudos, galia kWp | Apskaičiuota iš formos |
| Stogo parametrai | Užklausos forma |
| AI Rekomendacijos | AI atrankos rezultatas |
| Follow-up datos | Google Sheets "Užklausos" lapas |

---

## Įrankiai / Skriptai (Tools/Scripts)

| Įrankis | Paskirtis |
|---------|-----------|
| n8n Gmail node | Email siuntimas |
| n8n Schedule Trigger | Kas 1 valandą tikrina follow-up datas |
| n8n Google Sheets node | Skaito/rašo follow-up statusus |
| n8n Function node | HTML template generavimas (email-templates.js) |

---

## Procesas

### Email seka (4 email'ai)

#### D0 - Saulės elektrinės pasiūlymas (iškart po formos)

**Laikas:** Iškart kai AI atranka baigta (per ~2 min po formos pateikimo)
**Triggeris:** n8n main workflow - po AI atrankos žingsnio

**Turinio struktūra:**
1. Header su LDA Energija logotipu ant tamsiai mėlynos gradient (001959 -> 055d98)
2. Trust bar: "3000+ įrengtų sistemų | Sungrow & Huawei partneriai | APVA subsidija"
3. Pasisveikinimas su vardu
4. Kliento parametrų santrauka (mėnesinis vartojimas, stogo orientacija, stogo plotas)
5. Rekomenduojama sistema (galia kWp, modulių sk., metinė gamyba, sutaupymas)
6. APVA subsidija info sekcija (jei klientas domisi)
7. TOP 3-5 rekomenduojami produktai (lentelė): Modulis, Galia W, Efektyvumas %, Garantija, Kaina EUR
8. CTA mygtukas: "Užsisakyti konsultaciją" (orandžinis #fd6d15)
9. Footer su kontaktais (LDA Energija)

**Gmail subject:** "Jūsų saulės elektrinės pasiūlymas - {Tipas}"

**Po išsiuntimo:**
- Google Sheets "Pasiūlymo statusas" = "Išsiųsta"
- "Follow-up D1" = dabartinė data + 1 diena
- "Follow-up D3" = dabartinė data + 3 dienos
- "Follow-up D5" = dabartinė data + 5 dienos

---

#### D1 - Follow-up #1: 5 saulės energijos privalumai

**Laikas:** 1 diena po komercinio pasiūlymo
**Triggeris:** n8n Schedule Trigger (kas 1 valandą tikrina)

**Turinio struktūra:**
1. Header su LDA Energija logotipu
2. Trust bar
3. Pasisveikinimas
4. 5 privalumai:
   - Energijos nepriklausomybė - gaminkite savo elektrą
   - Elektros sąskaitų mažinimas iki 80%
   - APVA subsidija - valstybės parama iki 255 EUR/kWp
   - Ekologiška energija - mažinkite CO2 pėdsaką
   - Nekilnojamojo turto vertės didinimas
5. "Kaip veikia saulės elektrinė" sekcija (4 žingsniai)
6. CTA: "Gauti pasiūlymą" (orandžinis #fd6d15)
7. Footer su kontaktais

**Gmail subject:** "5 priežastys rinktis saulės elektrinę"

**Po išsiuntimo:**
- Google Sheets "Follow-up D1" = "Išsiųsta [data]"

---

#### D3 - Follow-up #2: Specialus pasiūlymas + APVA

**Laikas:** 3 dienos po komercinio pasiūlymo
**Triggeris:** n8n Schedule Trigger

**Turinio struktūra:**
1. Header su urgency badge "Galioja 48 valandas"
2. Trust bar
3. Priminimas apie pradinį pasiūlymą
4. **5% nuolaida** jei užsakymas pateikiamas per 48 valandas
5. Didelis nuolaidos badge (-5%)
6. TOP rekomenduojama konfigūracija su kainos palyginimu (originali vs su nuolaida)
7. APVA subsidijos skaičiavimas (jei aktualus):
   - Sistemos galia kWp
   - Subsidijos norma (iki 255 EUR/kWp)
   - Galima subsidija suma
   - Galutinė kaina su nuolaida ir APVA
8. CTA: "Užsisakyti su nuolaida" (orandžinis #fd6d15)
9. Footer su kontaktais

**Gmail subject:** "Specialus pasiūlymas: -5% jūsų saulės elektrinei"

**Po išsiuntimo:**
- Google Sheets "Follow-up D3" = "Išsiųsta [data]"

---

#### D5 - Follow-up #3: Galutinis priminimas

**Laikas:** 5 dienos po komercinio pasiūlymo
**Triggeris:** n8n Schedule Trigger

**Turinio struktūra:**
1. Header su LDA Energija logotipu
2. Trust bar
3. Pasisveikinimas
4. Priminimas apie pasiūlymą
5. Socialinis įrodymas: "3000+ namų jau naudoja saulės energiją su LDA Energija" (didelis skaičius)
6. Kliento atsiliepimų citata
7. Nuolaidos galiojimo priminimas
8. Galutinė žinutė: "Tai paskutinis mūsų priminimas"
9. Paprastas CTA: "Turite klausimų? Rašykite arba skambinkite"
10. Pilna kontaktinė informacija su abiem telefonais:
    - Tel.: +370 630 82999
    - Servisas: +370 636 90999
    - El. p.: info@ldaenergia.lt
11. Footer su kontaktais

**Gmail subject:** "Priminimas: jūsų saulės elektrinės pasiūlymas"

**Po išsiuntimo:**
- Google Sheets "Follow-up D5" = "Išsiųsta [data]"
- "Pasiūlymo statusas" = "Seka baigta"

---

### Schedule Trigger konfigūracija

```
Tipas: Schedule Trigger
Intervalas: Kas 1 valandą
Darbo laikas: 08:00 - 20:00 (Lietuvos laiku)
```

**Trigger logika (n8n Function node):**

1. Nuskaityti visas užklausas iš Google Sheets
2. Filtruoti kur follow-up data <= dabartinė data IR follow-up statusas != "Išsiųsta"
3. Kiekvienai tokiai užklausai siųsti atitinkamą email
4. Atnaujinti Google Sheets statusą

---

### Gmail konfigūracija

- **Siuntėjo paštas:** Konfigūrojamas n8n Gmail credentials (info@ldaenergia.lt)
- **Reply-to:** info@ldaenergia.lt
- **Formato tipas:** HTML
- **Unsubscribe header:** Įtraukiamas automatiškai

---

## Išvestys (Outputs)

- 4 email'ai išsiųsti per 5 dienų laikotarpį
- Google Sheets atnaujintas su kiekvieno email statusu ir data
- Galutinis statusas "Seka baigta" po D5

---

## Kraštinių Atvejų Valdymas (Edge Cases)

### Klientas jau atsakė
- Jei administratorius Google Sheets pakeičia "Pasiūlymo statusas" į "Atsakė" arba "Užsakyta" - sekantys follow-up nesiunčiami
- Schedule trigger tikrina statusą prieš siunčiant

### Unsubscribe
- Jei administratorius pažymi "Pasiūlymo statusas" = "Atsisakė" - visi follow-up sustabdomi
- Email apačioje yra nuoroda su tekstu "Jei nebenorite gauti mūsų žinučių, parašykite mums"

### Email siuntimo klaida
- Jei Gmail grąžina klaidą: n8n retry 3 kartus su 5 min intervalu
- Jei vis tiek nepavyksta: Google Sheets stulpelyje "Pastabos" įrašomas "Email klaida: [priežastis]"

### Savaitgaliai ir šventės
- Schedule trigger veikia kiekvieną dieną (įskaitant savaitgalius)
- Email siunčiami tik darbo valandomis: 08:00-20:00
- Jei follow-up data buvo savaitgalį, email išsiunčiamas pirmadienį 08:00

### Daug užklausų vienu metu
- n8n apdoroja po vieną užklausą
- Gmail API limitas: 500 email/dieną (pakankamas šiame etape)
- Jei pasiekiamas limitas: n8n sustoja ir praneša administratoriui
