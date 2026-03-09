# Admin Dashboard

## Tikslas

Leisti administratoriams peržiūrėti ir valdyti saulės elektrinių užklausas, stebėti email sekos būseną ir matyti bendrąją statistiką per web sąsają.

---

## Įvestys (Inputs)

### Duomenų šaltinis
- **Google Sheets API** - "Užklausos" lapas
- Stulpeliai:
  - ID, Data, Vardas, El. paštas, Telefonas, Tipas
  - Mėnesinės sąnaudos kWh, Stogo tipas, Stogo orientacija, Stogo plotas m2
  - Šešėliai, Tarifas
  - Domina kaupiklis, Domina APVA, Domina EV, Domina servisas
  - Apskaičiuota galia kWp, Modulių sk., Metinė gamyba kWh
  - Papildoma info, AI Rekomendacijos
  - Pasiūlymo statusas, Follow-up D1, Follow-up D3, Follow-up D5
  - Pastabos

### Autentifikacija
- Vienas bendras slaptažodis administratoriams
- Saugomas `.env` faile kaip `ADMIN_PASSWORD`

---

## Įrankiai / Skriptai (Tools/Scripts)

| Įrankis | Paskirtis |
|---------|-----------|
| `frontend/app/dashboard/page.tsx` | Dashboard pagrindinis puslapis |
| `frontend/app/api/auth/route.ts` | Login API endpoint |
| `frontend/app/api/inquiries/route.ts` | Užklausų duomenų API |
| Google Sheets API (googleapis) | Duomenų nuskaitymas |

---

## Procesas

### 1. Prisijungimas (Login)

1. Administratorius atidaro `/dashboard`
2. Jei nėra aktyvios sesijos - nukreipiamas į login formą
3. Įveda slaptažodį
4. API tikrina ar slaptažodis atitinka `ADMIN_PASSWORD`
5. Sėkmingo prisijungimo atveju - išsaugomas session token (cookie)
6. Nukreipiamas į dashboard

**Sesijos galiojimas:** 24 valandos
**Slaptažodžio bandymai:** Max 5 per minutę (rate limiting)

### 2. Pagrindinis vaizdas (Main View)

#### Statistikos kortelės (viršuje)

| Kortelė | Reikšmė | Apskaičiavimas |
|-------|---------|----------------|
| Visos užklausos | Skaičius | COUNT(visos eilutės) |
| Šiandien | Skaičius | COUNT(kur Data = šiandien) |
| Laukia atsakymo | Skaičius | COUNT(kur statusas = "Išsiųsta" arba "Seka baigta") |
| Užsakyta | Skaičius | COUNT(kur statusas = "Užsakyta") |

#### Užklausų lentelė

**Stulpeliai:**

| Stulpelis | Rodomos reikšmės |
|-----------|-------------------|
| # | Eilės numeris |
| Data | Formatuota data (YYYY-MM-DD HH:mm) |
| Vardas | Kliento vardas |
| Tipas | Saulės elektrinės tipas (su spalvota etikete) |
| Galia | kWp |
| Mėnesinės sąnaudos | kWh |
| Statusas | Būsenos badge (spalvotas) |
| Veiksmai | "Peržiūrėti" mygtukas |

**Statusų spalvos:**
- Nauja (pilka)
- Išsiųsta (mėlyna)
- Seka baigta (geltona)
- Atsakė (žalia)
- Užsakyta (žalia, ryškesnė)
- Atsisakė (raudona)

**Rikiavimas:** Pagal datą, naujausios viršuje

### 3. Filtravimas

| Filtras | Tipas | Reikšmės |
|---------|-------|----------|
| Tipas | select | Visi / namams / verslui / ūkiui |
| Data nuo | date | Datos pasirinkimas |
| Data iki | date | Datos pasirinkimas |
| Statusas | select | Visi / Nauja / Išsiųsta / Seka baigta / Atsakė / Užsakyta / Atsisakė |
| Domina kaupiklis | select | Visi / Taip / Ne |
| Domina APVA | select | Visi / Taip / Ne |

Filtrai taikomi kliento pusėje (client-side), nes duomenų kiekis mažas.

### 4. Detali peržiūra (Detail View)

Paspaudus "Peržiūrėti" atsidaro modalas arba naujas puslapis su:

**Kliento informacija:**
- Vardas, el. paštas, telefonas
- Užklausos data

**Saulės elektrinės parametrai:**
- Tipas (namams/verslui/ūkiui)
- Mėnesinės sąnaudos kWh
- Stogo tipas, orientacija, plotas m2
- Šešėliai, tarifas
- Apskaičiuota galia kWp, modulių sk., metinė gamyba kWh
- Papildomos paslaugos: kaupiklis, APVA, EV, servisas
- Papildoma informacija

**AI Rekomendacijos:**
- Rekomenduojami moduliai (iš JSON): vieta, gamintojas, modelis, galia W, efektyvumas, garantija, kaina, priežastis
- Rekomenduojami inverteriai
- Rekomenduojami kaupikliai (jei aktualus)
- Rekomenduojamos EV stotelės (jei aktualus)

**Email sekos statusas:**
- D0 Komercinis pasiūlymas: [Išsiųsta / Neišsiųsta] [data]
- D1 Follow-up #1: [Išsiųsta / Laukia / Neišsiųsta] [data]
- D3 Follow-up #2: [Išsiųsta / Laukia / Neišsiųsta] [data]
- D5 Follow-up #3: [Išsiųsta / Laukia / Neišsiųsta] [data]

**Pastabos:** Tekstinis laukas su galimybe redaguoti

### 5. Duomenų atnaujinimas

- **Refresh mygtukas:** Viršutiniame dešiniame kampe
- Paspaudus - pakartotinis API call į Google Sheets
- Loading indikatorius kol duomenys atnaujinami
- Automatinio atnaujinimo nėra (siekiant taupyti API kvotų)

---

## Išvestys (Outputs)

- Interaktyvi web sąsaja `/dashboard` adresu
- Realaus laiko (per refresh) statistika ir užklausų sąrašas
- Detali kiekvienos užklausos peržiūra su AI rekomendacijomis

---

## Kraštinių Atvejų Valdymas (Edge Cases)

### Tuščias sąrašas (Empty State)
- Kai nėra nei vienos užklausos: rodyti žinutę "Kol kas nėra užklausų. Kai klientai užpildys formą, užklausos atsiras čia."
- Statistikos kortelės rodo 0

### Daug įrašų (Performance)
- Iki 1000 užklausų: viskas veikia normaliai (client-side filtravimas)
- Virš 1000: pagalvoti apie paginaciją (ateities optimizacija)
- Google Sheets API grąžina max 1000 eilučių vienu kartu pagal numatytuosius nustatymus

### Sesijos pabaiga
- Po 24h: automatiškai nukreipiamas į login
- Cookie ištrinamas, reikia prisijungti iš naujo

### Google Sheets API klaidos
- Jei API nepasiekiamas: rodyti klaidos žinutę "Nepavyko gauti duomenų. Bandykite vėliau."
- Retry mygtukas šalia klaidos žinutės
- Nėra cache - kiekvienas refresh yra naujas API call

### Mobilus vaizdas
- Lentelė responsive: horizontalus scrollinimas mažuose ekranuose
- Statistikos kortelės išsidėsto vertikaliai
- Filtrai collapse į vieną eilutę

### AI Rekomendacijų rodymas
- JSON parseimas kliento pusėje
- Jei JSON nevalidus: rodyti raw tekstą su žinute "Nepavyko apdoroti rekomendacijų"
- Jei rekomendacijų mažiau nei 3: rodyti kiek yra
- Rodyti atskiras sekcijas: moduliai, inverteriai, kaupikliai, EV stotelės
