# Formos Užklausų Apdorojimas

## Tikslas

Priimti kliento užklausas per web formą ir perduoti n8n workflow'ui apdorojimui. Forma leidžia klientams nurodyti savo poreikius (saulės elektrinės tipas, stogo parametrai, kontaktinė informacija), o sistema automatiškai perduoda duomenis tolesniam apdorojimui.

---

## Įvestys (Inputs)

### Formos laukai

**Bendri laukai (visiems tipams):**

| Laukas | Tipas | Privalomas | Validacija |
|--------|-------|------------|------------|
| Vardas | text | Taip | Min 2 simboliai |
| El. paštas | email | Taip | RFC 5322 formatas |
| Telefonas | tel | Taip | Lietuvos formatas: +370XXXXXXXX arba 8XXXXXXXX |
| Tipas | select | Taip | Vienas iš: namams, verslui, ūkiui |
| Mėnesinės sąnaudos kWh | number | Taip | 50-5000 kWh |
| Stogo tipas | select | Taip | Vienas iš: skardinis, čerpinis, plokščias, kitas |
| Stogo orientacija | select | Taip | Vienas iš: pietūs, pietryčių, pietvakrių, rytai, vakarai, kita |
| Stogo plotas m2 | number | Taip | 10-500 m2 |
| Šešėliai | select | Ne | Vienas iš: nėra, menki, vidutiniai, dideli |
| Tarifas | select | Ne | Vienas iš: standartinis, dvizonis, trizonis |
| Papildoma info | textarea | Ne | Max 1000 simbolių |

**Papildomi laukai (checkbox/select):**

| Laukas | Tipas | Aprašymas |
|--------|-------|-----------|
| dominaKaupiklis | checkbox | Ar domina energijos kaupiklis (baterija) |
| dominaAPVA | checkbox | Ar domina APVA subsidija |
| dominaEV | checkbox | Ar domina EV įkrovimo stotelė |
| dominaServisas | checkbox | Ar domina priežiūros paslauga |

### Galios skaičiavimas

```
Rekomenduojama galia (kWp) = Mėnesinės sąnaudos (kWh) x 12 / 1050
```

- 1050 kWh/kWp - vidutinė metinė saulės energijos gamyba Lietuvoje 1 kWp galiai
- Koeficientas koreguojamas pagal stogo orientaciją:
  - Pietūs: 1.0 (bazinis)
  - Pietryčių/Pietvakrių: 0.95
  - Rytai/Vakarai: 0.85
  - Kita: 0.80

**Pavyzdys:** 300 kWh/mėn, pietų orientacija = 300 * 12 / 1050 / 1.0 = 3.43 kWp

---

## Įrankiai / Skriptai (Tools/Scripts)

| Įrankis | Paskirtis |
|---------|-----------|
| `frontend/app/page.tsx` | Formos UI komponentas (Next.js) |
| `frontend/app/api/submit/route.ts` | API endpoint formos duomenų priėmimui |
| n8n Webhook | Priima duomenis iš Next.js API |

---

## Procesas

### 1. Formos pildymas (frontend)

1. Klientas atidaro formą
2. Pasirenka saulės elektrinės tipą (namams/verslui/ūkiui)
3. Nurodo stogo parametrus (tipas, orientacija, plotas)
4. Nurodo mėnesines elektros sąnaudas
5. Pasirenka papildomas paslaugas (kaupiklis, APVA, EV, servisas)
6. Užklausą galima siųsti tik kai visi privalomi laukai užpildyti

### 2. Formos pateikimas (API route)

1. Frontend siunčia POST request į `/api/submit`
2. API route atlieka server-side validaciją
3. Apskaičiuoja galią: `menesinesSanaudos * 12 / 1050 / orientacijos_koeficientas`
4. Apskaičiuoja modulių skaičių: `Math.ceil(galia_kWp / 0.445)` (standartinis 445W modulis)
5. Apskaičiuoja metinę gamybą: `galia_kWp * 1050`
6. Suformuoja JSON ir siunčia į n8n webhook

### 3. JSON struktūra siunčiama į n8n

```json
{
  "vardas": "Jonas Jonaitis",
  "el_pastas": "jonas@example.com",
  "telefonas": "+37061234567",
  "tipas": "namams",
  "menesines_sanaudos_kwh": 300,
  "stogo_tipas": "skardinnis",
  "stogo_orientacija": "pietus",
  "stogo_plotas_m2": 60,
  "seseliai": "nera",
  "tarifas": "dvizonis",
  "domina_kaupiklis": true,
  "domina_apva": true,
  "domina_ev": false,
  "domina_servisas": false,
  "apskaiciuota_galia_kwp": 3.43,
  "moduliu_sk": 8,
  "metine_gamyba_kwh": 3601,
  "papildoma_info": "Norėčiau sužinoti apie APVA subsidiją",
  "data": "2026-03-08T10:30:00Z"
}
```

### 4. n8n webhook konfigūracija

- **Metodas:** POST
- **URL:** https://n8n.blingo.lt/webhook/lda-saules-uzklausos
- **Authentication:** Header-based token (`X-Webhook-Token`)
- **Content-Type:** application/json

---

## Išvestys (Outputs)

- **Sėkminga:** Klientas mato patvirtinimo žinutę "Jūsų užklausa priimta! Komercinį pasiūlymą gausite el. paštu per 5 minutes."
- **Klaida:** Klientas mato klaidos žinutę su galimybe bandyti dar kartą

---

## Kraštinių Atvejų Valdymas (Edge Cases)

### Dubliuotos užklausos
- Formoje naudojamas `submitting` state kuris neleidžia pakartotinai spausti mygtuko
- n8n workflow tikrina ar per paskutines 24h nebuvo užklausos su tuo pačiu el. paštu

### Neteisingas el. paštas
- Frontend validacija: HTML5 email input + regex patikrinimas
- Backend validacija: RFC 5322 formatas
- Klaidos žinutė: "Įveskite teisingą el. pašto adresą"

### Trūkstami laukai
- Frontend: required atributas + vizualus indikatorius
- Backend: grąžina 400 status su nurodytais trūkstamais laukais

### Tinklo klaidos
- Frontend: try/catch aplink fetch, rodo klaidos žinutę
- Retry logika: automatinis pakartojimas 1 kartą po 3 sekundžių
- Jei n8n webhook nepasiekiamas: API route grąžina 503, frontend rodo "Bandykite vėliau"

### Nevalidi mėnesinis vartojimas
- Min: 50 kWh (mažesni neturi prasmės saulės elektrinei)
- Max: 5000 kWh (didesniems reikia individualaus skaičiavimo)
- Klaidos žinutė: "Mėnesinės sąnaudos turi būti tarp 50 ir 5000 kWh"

### Stogo plotas per mažas
- Minimali rekomenduojama ploto reikšmė: galios_kWp * 5 m2 (vienas modulis užima ~2 m2, bet reikia tarpų)
- Jei stogo plotas per mažas rekomenduojamai galiai: rodomas įspėjimas "Jūsų stogo plotas gali būti nepakankamas rekomenduojamai galiai. Susisieksime dėl detalesnės analizės."
