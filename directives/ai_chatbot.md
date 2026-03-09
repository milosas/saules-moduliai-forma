# AI Chatbot

## Tikslas

Teikti klientams 24/7 pagalbą per AI chatbotą svetainėje. Chatbotas atsako į DUK, rekomenduoja produktus su nuotraukomis ir kainomis, skaičiuoja saulės sistemos galią, ir perduoda sudėtingus atvejus konsultantui.

---

## Techninis sprendimas

### Frontend komponentai
- `components/chatbot/ChatWidget.tsx` - Floating mygtukas + chat langas
- `components/chatbot/ChatWindow.tsx` - Pagrindinis chat langas (header, žinutės, input)
- `components/chatbot/ChatMessage.tsx` - Žinutės burbulas
- `components/chatbot/ProductCard.tsx` - Produkto kortelė (nuotrauka, specs, kaina)
- `components/chatbot/CalculationResult.tsx` - Galios skaičiavimo rezultatas
- `components/chatbot/EscalationCard.tsx` - Kontaktų forma + telefonai
- `components/chatbot/TypingIndicator.tsx` - Animuoti taškai

### API Routes
- `app/api/chat/route.ts` - Pagrindinis chat endpoint (POST, SSE streaming)
- `app/api/chat/escalate/route.ts` - Escalation kontaktų išsaugojimas

### Lib failai
- `lib/chatbot-config.ts` - System prompt, tool definitions, konstantos
- `lib/chatbot-tools.ts` - Produktų gavimas iš Google Sheets, galios skaičiavimas

### Integracija
- ChatWidget importuotas `layout.tsx` - rodomas visuose puslapiuose

---

## AI Backend

- **Modelis:** OpenAI GPT-4o-mini
- **Temperatūra:** 0.7
- **Max tokens:** 1000

### Tool Calling (3 įrankiai)
1. `get_products` - gauna produktus iš Google Sheets pagal tipą ir galią
2. `calculate_system` - skaičiuoja rekomenduojamą saulės sistemos galią
3. `escalate_to_human` - perduoda pokalbį konsultantui

### Produktų cache
- In-memory cache su 15 min TTL
- Visi produktai skaitomi iš Google Sheets "Produktai" lapo

---

## Konfigūracija

### Environment variables (frontend/.env.local)
```
OPENAI_API_KEY=sk-...           # OpenAI API raktas
N8N_CHAT_ESCALATION_WEBHOOK=    # n8n webhook URL escalation duomenims (neprivalomas)
```

### Limitas
- Max 30 žinučių per sesiją
- Pokalbio istorija: paskutinės 20 žinučių siunčiamos AI

---

## Escalation logika

Chatbotas perduoda konsultantui kai:
- Klientas prašo žmogaus
- AI negali atsakyti
- Klientas nori oficialaus pasiūlymo
- Klientas praneša apie serviso problemą

Escalation kortelėje:
- Mygtukais "Skambinti" (tel: link) ir "El. paštas" (mailto: link)
- Kontaktų forma (vardas, telefonas, žinutė)
- Duomenys siunčiami į n8n webhook (jei sukonfigūruotas)

---

## Edge Cases

### OpenAI API klaida
- Rodomas klaidos pranešimas su telefono numeriu

### Google Sheets nepasiekiamas
- Produktų cache naudojamas jei dar galioja
- Kitų atveju AI atsako be produktų kortelių

### Per ilgas pokalbis
- Po 30 žinučių rodomas limito pranešimas su kontaktiniu telefonu
