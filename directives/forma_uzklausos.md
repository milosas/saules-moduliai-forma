# Formos Uzklausu Apdorojimas

## Tikslas

Priimti kliento uzklausas per web forma ir perduoti n8n workflow'ui apdorojimui. Forma leidzia klientams nurodyti savo poreikius (saules elektrines tipas, stogo parametrai, kontaktine informacija), o sistema automatiskai perduoda duomenis tolesniam apdorojimui.

---

## Ivestys (Inputs)

### Formos laukai

**Bendri laukai (visiems tipams):**

| Laukas | Tipas | Privalomas | Validacija |
|--------|-------|------------|------------|
| Vardas | text | Taip | Min 2 simboliai |
| El. pastas | email | Taip | RFC 5322 formatas |
| Telefonas | tel | Taip | Lietuvos formatas: +370XXXXXXXX arba 8XXXXXXXX |
| Tipas | select | Taip | Vienas is: namams, verslui, ukiui |
| Menesines sanaudos kWh | number | Taip | 50-5000 kWh |
| Stogo tipas | select | Taip | Vienas is: skardinnis, cerpinis, plokscias, kitas |
| Stogo orientacija | select | Taip | Vienas is: pietus, pieryciu, pietvakriu, rytai, vakarai, kita |
| Stogo plotas m2 | number | Taip | 10-500 m2 |
| Seseliai | select | Ne | Vienas is: nera, menki, vidutiniai, dideli |
| Tarifas | select | Ne | Vienas is: standartinis, dvizonis, trizonis |
| Papildoma info | textarea | Ne | Max 1000 simboliu |

**Papildomi laukai (checkbox/select):**

| Laukas | Tipas | Aprasymas |
|--------|-------|-----------|
| dominaKaupiklis | checkbox | Ar domina energijos kaupiklis (baterija) |
| dominaAPVA | checkbox | Ar domina APVA subsidija |
| dominaEV | checkbox | Ar domina EV ikrovimo stotele |
| dominaServisas | checkbox | Ar domina prieziuros paslauga |

### Galios skaiciavimas

```
Rekomenduojama galia (kWp) = Menesines sanaudos (kWh) x 12 / 1050
```

- 1050 kWh/kWp - vidutine metine saules energijos gamyba Lietuvoje 1 kWp galiai
- Koeficientas koreguojamas pagal stogo orientacija:
  - Pietus: 1.0 (bazinis)
  - Pieryciu/Pietvakriu: 0.95
  - Rytai/Vakarai: 0.85
  - Kita: 0.80

**Pavyzdys:** 300 kWh/men, pietu orientacija = 300 * 12 / 1050 / 1.0 = 3.43 kWp

---

## Irankiai / Skriptai (Tools/Scripts)

| Irankis | Paskirtis |
|---------|-----------|
| `frontend/app/page.tsx` | Formos UI komponentas (Next.js) |
| `frontend/app/api/submit/route.ts` | API endpoint formos duomenu priemimui |
| n8n Webhook | Priima duomenis is Next.js API |

---

## Procesas

### 1. Formos pildymas (frontend)

1. Klientas atidaro forma
2. Pasirenka saules elektrines tipa (namams/verslui/ukiui)
3. Nurodo stogo parametrus (tipas, orientacija, plotas)
4. Nurodo menesines elektros sanaudas
5. Pasirenka papildomas paslaugas (kaupiklis, APVA, EV, servisas)
6. Uzklausa galima siusti tik kai visi privalomi laukai uzpildyti

### 2. Formos pateikimas (API route)

1. Frontend siuncia POST request i `/api/submit`
2. API route atlieka server-side validacija
3. Apskaiciuoja galia: `menesinesSanaudos * 12 / 1050 / orientacijos_koeficientas`
4. Apskaiciuoja moduliu skaiciu: `Math.ceil(galia_kWp / 0.445)` (standartinis 445W modulis)
5. Apskaiciuoja metine gamyba: `galia_kWp * 1050`
6. Suformuoja JSON ir siuncia i n8n webhook

### 3. JSON struktura siunciama i n8n

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
  "papildoma_info": "Noreciau suzinoti apie APVA subsidija",
  "data": "2026-03-08T10:30:00Z"
}
```

### 4. n8n webhook konfiguracija

- **Metodas:** POST
- **URL:** https://n8n.blingo.lt/webhook/lda-saules-uzklausos
- **Authentication:** Header-based token (`X-Webhook-Token`)
- **Content-Type:** application/json

---

## Isvestys (Outputs)

- **Sekminga:** Klientas mato patvirtinimo zinute "Jusu uzklausa priimta! Komercini pasiulyma gausite el. pastu per 5 minutes."
- **Klaida:** Klientas mato klaidos zinute su galimybe bandyti dar karta

---

## Krasztiniu Atveju Valdymas (Edge Cases)

### Dubliuotos uzklausos
- Formoje naudojamas `submitting` state kuris neleidzia pakartotinai spausti mygtuko
- n8n workflow tikrina ar per paskutines 24h nebuvo uzklausos su tuo paciu el. pastu

### Neteisingas el. pastas
- Frontend validacija: HTML5 email input + regex patikrinimas
- Backend validacija: RFC 5322 formatas
- Klaidos zinute: "Iveskite teisinga el. pasto adresa"

### Trukstami laukai
- Frontend: required atributas + vizualus indikatorius
- Backend: grazina 400 status su nurodytais trukstamais laukais

### Tinklo klaidos
- Frontend: try/catch aplink fetch, rodo klaidos zinute
- Retry logika: automatinis pakartojimas 1 karta po 3 sekundziu
- Jei n8n webhook nepasiekiamas: API route grazina 503, frontend rodo "Bandykite veliau"

### Nevalidi menesinis vartojimas
- Min: 50 kWh (mazesni neturi prasmes saules elektrinei)
- Max: 5000 kWh (didesniems reikia individualaus skaiciavimo)
- Klaidos zinute: "Menesines sanaudos turi buti tarp 50 ir 5000 kWh"

### Stogo plotas per mazas
- Minimali rekomenduojama ploto reiksme: galios_kWp * 5 m2 (vienas modulis uzima ~2 m2, bet reikia tarpu)
- Jei stogo plotas per mazas rekomenduojamai galiai: rodomas ispejimas "Jusu stogo plotas gali buti nepakankamas rekomenduojamai galiai. Susisieksime del detalesnes analaizes."
