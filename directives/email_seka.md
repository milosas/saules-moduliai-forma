# Email Sekos Valdymas

## Tikslas

Automatiskai siusti komercini pasiulyma ir follow-up email seka klientui po uzklausos pateikimo, siekiant padidinti konversiju. Saules elektrines pasiulymu seka su LDA Energija branding.

---

## Ivestys (Inputs)

### Kliento duomenys

| Laukas | Saltinis |
|--------|---------|
| Vardas | Uzklausos forma |
| El. pastas | Uzklausos forma |
| Tipas | Uzklausos forma (namams/verslui/ukiui) |
| Menesines sanaudos, galia kWp | Apskaiciuota is formos |
| Stogo parametrai | Uzklausos forma |
| AI Rekomendacijos | AI atrankos rezultatas |
| Follow-up datos | Google Sheets "Uzklausos" lapas |

---

## Irankiai / Skriptai (Tools/Scripts)

| Irankis | Paskirtis |
|---------|-----------|
| n8n Gmail node | Email siuntimas |
| n8n Schedule Trigger | Kas 1 valanda tikrina follow-up datas |
| n8n Google Sheets node | Skaito/raso follow-up statusus |
| n8n Function node | HTML template generavimas (email-templates.js) |

---

## Procesas

### Email seka (4 email'ai)

#### D0 - Saules elektrines pasiulymas (iskart po formos)

**Laikas:** Iskart kai AI atranka baigta (per ~2 min po formos pateikimo)
**Triggeris:** n8n main workflow - po AI atrankos zingsnio

**Turinio struktura:**
1. Header su LDA Energija logotipu ant tamsiai melynos gradient (001959 -> 055d98)
2. Trust bar: "3000+ irengutu sistemu | Sungrow & Huawei partneriai | APVA subsidija"
3. Pasisveikinimas su vardu
4. Kliento parametru santrauka (menesinis vartojimas, stogo orientacija, stogo plotas)
5. Rekomenduojama sistema (galia kWp, moduliu sk., metine gamyba, sutaupymas)
6. APVA subsidija info sekcija (jei klientas domisi)
7. TOP 3-5 rekomenduojami produktai (lentele): Modulis, Galia W, Efektyvumas %, Garantija, Kaina EUR
8. CTA mygtukas: "Uzsisakyti konsultacija" (orandzinis #fd6d15)
9. Footer su kontaktais (LDA Energija)

**Gmail subject:** "Jusu saules elektrines pasiulymas - {Tipas}"

**Po issiuntimo:**
- Google Sheets "Pasiulymo statusas" = "Issiusta"
- "Follow-up D1" = dabartine data + 1 diena
- "Follow-up D3" = dabartine data + 3 dienos
- "Follow-up D5" = dabartine data + 5 dienos

---

#### D1 - Follow-up #1: 5 saules energijos privalumai

**Laikas:** 1 diena po komercinio pasiulymo
**Triggeris:** n8n Schedule Trigger (kas 1 valanda tikrina)

**Turinio struktura:**
1. Header su LDA Energija logotipu
2. Trust bar
3. Pasisveikinimas
4. 5 privalumai:
   - Energijos nepriklausomybe - gaminkite savo elektra
   - Elektros saskaitu mazinimas iki 80%
   - APVA subsidija - valstybes parama iki 255 EUR/kWp
   - Ekologiska energija - mazinkite CO2 pedsaka
   - Nekilnojamojo turto vertes didinimas
5. "Kaip veikia saules elektrine" sekcija (4 zingsniai)
6. CTA: "Gauti pasiulyma" (orandzinis #fd6d15)
7. Footer su kontaktais

**Gmail subject:** "5 priezastys rinktis saules elektrine"

**Po issiuntimo:**
- Google Sheets "Follow-up D1" = "Issiusta [data]"

---

#### D3 - Follow-up #2: Specialus pasiulymas + APVA

**Laikas:** 3 dienos po komercinio pasiulymo
**Triggeris:** n8n Schedule Trigger

**Turinio struktura:**
1. Header su urgency badge "Galioja 48 valandas"
2. Trust bar
3. Priminimas apie pradini pasiulyma
4. **5% nuolaida** jei uzsakymas pateikiamas per 48 valandas
5. Didelis nuolaidos badge (-5%)
6. TOP rekomenduojama konfiguracija su kainos palyginimu (originali vs su nuolaida)
7. APVA subsidijos skaiciavimas (jei aktualus):
   - Sistemos galia kWp
   - Subsidijos norma (iki 255 EUR/kWp)
   - Galima subsidija suma
   - Galutine kaina su nuolaida ir APVA
8. CTA: "Uzsisakyti su nuolaida" (orandzinis #fd6d15)
9. Footer su kontaktais

**Gmail subject:** "Specialus pasiulymas: -5% jusu saules elektrinei"

**Po issiuntimo:**
- Google Sheets "Follow-up D3" = "Issiusta [data]"

---

#### D5 - Follow-up #3: Galutinis priminimas

**Laikas:** 5 dienos po komercinio pasiulymo
**Triggeris:** n8n Schedule Trigger

**Turinio struktura:**
1. Header su LDA Energija logotipu
2. Trust bar
3. Pasisveikinimas
4. Priminimas apie pasiulyma
5. Socialinis irodymas: "3000+ namu jau naudoja saules energija su LDA Energija" (didelis skaicius)
6. Kliento atsiliepimu citata
7. Nuolaidos galiojimo priminimas
8. Galutine zinute: "Tai paskutinis musu priminimas"
9. Paprastas CTA: "Turite klausimu? Rasykite arba skambinkite"
10. Pilna kontaktine informacija su abiem telefonais:
    - Tel.: +370 630 82999
    - Servisas: +370 636 90999
    - El. p.: info@ldaenergia.lt
11. Footer su kontaktais

**Gmail subject:** "Priminimas: jusu saules elektrines pasiulymas"

**Po issiuntimo:**
- Google Sheets "Follow-up D5" = "Issiusta [data]"
- "Pasiulymo statusas" = "Seka baigta"

---

### Schedule Trigger konfiguracija

```
Tipas: Schedule Trigger
Intervalas: Kas 1 valanda
Darbo laikas: 08:00 - 20:00 (Lietuvos laiku)
```

**Trigger logika (n8n Function node):**

1. Nuskaityti visas uzklausas is Google Sheets
2. Filtruoti kur follow-up data <= dabartine data IR follow-up statusas != "Issiusta"
3. Kiekvienai tokiai uzklausai siusti atitinkama email
4. Atnaujinti Google Sheets statusa

---

### Gmail konfiguracija

- **Siuntejo pastas:** Konfigurojamas n8n Gmail credentials (info@ldaenergia.lt)
- **Reply-to:** info@ldaenergia.lt
- **Formato tipas:** HTML
- **Unsubscribe header:** Itraukiamas automatiskai

---

## Isvestys (Outputs)

- 4 email'ai issiusti per 5 dienu laikotarpi
- Google Sheets atnaujintas su kiekvieno email statusu ir data
- Galutinis statusas "Seka baigta" po D5

---

## Krasztiniu Atveju Valdymas (Edge Cases)

### Klientas jau atsake
- Jei administratorius Google Sheets pakeicia "Pasiulymo statusas" i "Atsake" arba "Uzsakyta" - sekantys follow-up nesiuniami
- Schedule trigger tikrina statusa pries siunciant

### Unsubscribe
- Jei administratorius pazymi "Pasiulymo statusas" = "Atsisake" - visi follow-up sustabdomi
- Email apacije yra nuoroda su tekstu "Jei nebenorite gauti musu zinuciu, parasykite mums"

### Email siuntimo klaida
- Jei Gmail grazina klaida: n8n retry 3 kartus su 5 min intervalu
- Jei vis tiek nepavyksta: Google Sheets stulpelyje "Pastabos" irasomas "Email klaida: [priezastis]"

### Savaigaliniai ir sventes
- Schedule trigger veikia kiekviena diena (ieskaitant savaitgalius)
- Email siuniami tik darbo valandomis: 08:00-20:00
- Jei follow-up data buvo savaitgali, email issiunciamas pirmadieni 08:00

### Daug uzklausu vienu metu
- n8n apdoroja po viena uzklausa
- Gmail API limitas: 500 email/diena (pakankamas siame etape)
- Jei pasiekiamas limitas: n8n sustoja ir praneasa administratoriui
