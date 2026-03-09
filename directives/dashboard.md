# Admin Dashboard

## Tikslas

Leisti administratoriams perziureti ir valdyti saules elektriniu uzklausas, stebeti email sekos busena ir matyti bendraja statistika per web sasaja.

---

## Ivestys (Inputs)

### Duomenu saltinis
- **Google Sheets API** - "Uzklausos" lapas
- Stulpeliai:
  - ID, Data, Vardas, El. pastas, Telefonas, Tipas
  - Menesines sanaudos kWh, Stogo tipas, Stogo orientacija, Stogo plotas m2
  - Seseliai, Tarifas
  - Domina kaupiklis, Domina APVA, Domina EV, Domina servisas
  - Apskaiciuota galia kWp, Moduliu sk., Metine gamyba kWh
  - Papildoma info, AI Rekomendacijos
  - Pasiulymo statusas, Follow-up D1, Follow-up D3, Follow-up D5
  - Pastabos

### Autentifikacija
- Vienas bendras slaptazodis administratoriams
- Saugomas `.env` faile kaip `ADMIN_PASSWORD`

---

## Irankiai / Skriptai (Tools/Scripts)

| Irankis | Paskirtis |
|---------|-----------|
| `frontend/app/dashboard/page.tsx` | Dashboard pagrindinis puslapis |
| `frontend/app/api/auth/route.ts` | Login API endpoint |
| `frontend/app/api/inquiries/route.ts` | Uzklausu duomenu API |
| Google Sheets API (googleapis) | Duomenu nuskaitymas |

---

## Procesas

### 1. Prisijungimas (Login)

1. Administratorius atidaro `/dashboard`
2. Jei nera aktyvios sesijos - nukreipiamas i login forma
3. Iveda slaptazodi
4. API tikrina ar slaptazodis atitinka `ADMIN_PASSWORD`
5. Sekmingo prisijungimo atveju - issaugomas session token (cookie)
6. Nukreipiamas i dashboard

**Sesijos galiojimas:** 24 valandos
**Slaptazodzio bandymai:** Max 5 per minute (rate limiting)

### 2. Pagrindinis vaizdas (Main View)

#### Statistikos kortes (virsuje)

| Korte | Reiksme | Apskaiciavimas |
|-------|---------|----------------|
| Visos uzklausos | Skaicius | COUNT(visos eilutes) |
| Siandien | Skaicius | COUNT(kur Data = siandien) |
| Laukia atsakymo | Skaicius | COUNT(kur statusas = "Issiusta" arba "Seka baigta") |
| Uzsakyta | Skaicius | COUNT(kur statusas = "Uzsakyta") |

#### Uzklausu lentele

**Stulpeliai:**

| Stulpelis | Rodomos reikssmes |
|-----------|-------------------|
| # | Eiles numeris |
| Data | Formatuota data (YYYY-MM-DD HH:mm) |
| Vardas | Kliento vardas |
| Tipas | Saules elektrines tipas (su spalvota etikete) |
| Galia | kWp |
| Menesines sanaudos | kWh |
| Statusas | Busenos badge (spalvotas) |
| Veiksmai | "Perziureti" mygtukas |

**Statusu spalvos:**
- Nauja (pilka)
- Issiusta (melyna)
- Seka baigta (geltona)
- Atsake (zalia)
- Uzsakyta (zalia, ryskesne)
- Atsisake (raudona)

**Rikiavimas:** Pagal data, naujausios virsuje

### 3. Filtravimas

| Filtras | Tipas | Reiksmes |
|---------|-------|----------|
| Tipas | select | Visi / namams / verslui / ukiui |
| Data nuo | date | Datos pasirinkimas |
| Data iki | date | Datos pasirinkimas |
| Statusas | select | Visi / Nauja / Issiusta / Seka baigta / Atsake / Uzsakyta / Atsisake |
| Domina kaupiklis | select | Visi / Taip / Ne |
| Domina APVA | select | Visi / Taip / Ne |

Filtrai taikomi kliento puseje (client-side), nes duomenu kiekis mazas.

### 4. Detali perziura (Detail View)

Paspaudus "Perziureti" atsidaro modalas arba naujas puslapis su:

**Kliento informacija:**
- Vardas, el. pastas, telefonas
- Uzklausos data

**Saules elektrines parametrai:**
- Tipas (namams/verslui/ukiui)
- Menesines sanaudos kWh
- Stogo tipas, orientacija, plotas m2
- Seseliai, tarifas
- Apskaiciuota galia kWp, moduliu sk., metine gamyba kWh
- Papildomos paslaugos: kaupiklis, APVA, EV, servisas
- Papildoma informacija

**AI Rekomendacijos:**
- Rekomenduojami moduliai (is JSON): vieta, gamintojas, modelis, galia W, efektyvumas, garantija, kaina, priezastis
- Rekomenduojami inverteriai
- Rekomenduojami kaupikliai (jei aktualus)
- Rekomenduojamos EV stoteles (jei aktualus)

**Email sekos statusas:**
- D0 Komercinis pasiulymas: [Issiusta / Neissiusta] [data]
- D1 Follow-up #1: [Issiusta / Laukia / Neissiusta] [data]
- D3 Follow-up #2: [Issiusta / Laukia / Neissiusta] [data]
- D5 Follow-up #3: [Issiusta / Laukia / Neissiusta] [data]

**Pastabos:** Tekstinis laukas su galimybe redaguoti

### 5. Duomenu atnaujinimas

- **Refresh mygtukas:** Virsutiniame desiniame kampe
- Paspaudus - pakartotinis API call i Google Sheets
- Loading indikatorius kol duomenys atnaujinami
- Automatinio atnaujinimo nera (siekiant taupyti API kvotu)

---

## Isvestys (Outputs)

- Interaktyvi web sasaja `/dashboard` adresu
- Realaus laiko (per refresh) statistika ir uzklausu sarasas
- Detali kiekvienos uzklausos perziura su AI rekomendacijomis

---

## Krasztiniu Atveju Valdymas (Edge Cases)

### Tuscias sarasas (Empty State)
- Kai nera nei vienos uzklausos: rodyti zinute "Kol kas nera uzklausu. Kai klientai uzpildys forma, uzklausos atsiras cia."
- Statistikos kortes rodo 0

### Daug irasu (Performance)
- Iki 1000 uzklausu: viskas veikia normaliai (client-side filtravimas)
- Virs 1000: pagalvoti apie paginacija (ateities optimizacija)
- Google Sheets API grazina max 1000 eiluciu vienu kartu pagal numatytuosius nustatymus

### Sesijos pabaiga
- Po 24h: automatiskai nukreipiamas i login
- Cookie istrinamas, reikia prisijungti is naujo

### Google Sheets API klaidos
- Jei API nepasiekiamas: rodyti klaidos zinute "Nepavyko gauti duomenu. Bandykite veliau."
- Retry mygtukas salia klaidos zinutes
- Nera cache - kiekvienas refresh yra naujas API call

### Mobilus vaizdas
- Lentele responsive: horizontalus scrollinimas mazuose ekranuose
- Statistikos kortes issideseto vertikaliai
- Filtrai collapse i viena eilute

### AI Rekomendaciju rodymas
- JSON parseimas kliento puseje
- Jei JSON nevalidus: rodyti raw teksta su zinute "Nepavyko apdoroti rekomendaciju"
- Jei rekomendaciju maziau nei 3: rodyti kiek yra
- Rodyti atskiras sekcijas: moduliai, inverteriai, kaupikliai, EV stoteles
