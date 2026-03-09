# AI Chatbot

## Tikslas

Teikti klientams 24/7 pagalba per AI chatbota svetaineje. Chatbotas atsako i DUK, rekomenduoja produktus su nuotraukomis ir kainomis, skaiciuoja saules sistemos galia, ir perduoda sudetingus atvejus konsultantui.

---

## Techninis sprendimas

### Frontend komponentai
- `components/chatbot/ChatWidget.tsx` - Floating mygtukas + chat langas
- `components/chatbot/ChatWindow.tsx` - Pagrindinis chat langas (header, zinutes, input)
- `components/chatbot/ChatMessage.tsx` - Zinutes burbulas
- `components/chatbot/ProductCard.tsx` - Produkto kortele (nuotrauka, specs, kaina)
- `components/chatbot/CalculationResult.tsx` - Galios skaiciavimo rezultatas
- `components/chatbot/EscalationCard.tsx` - Kontaktu forma + telefonai
- `components/chatbot/TypingIndicator.tsx` - Animuoti taskai

### API Routes
- `app/api/chat/route.ts` - Pagrindinis chat endpoint (POST, SSE streaming)
- `app/api/chat/escalate/route.ts` - Escalation kontaktu issaugojimas

### Lib failai
- `lib/chatbot-config.ts` - System prompt, tool definitions, konstantos
- `lib/chatbot-tools.ts` - Produktu gavimas is Google Sheets, galios skaiciavimas

### Integracija
- ChatWidget importuotas `layout.tsx` - rodomas visuose puslapiuose

---

## AI Backend

- **Modelis:** OpenAI GPT-4o-mini
- **Temperatura:** 0.7
- **Max tokens:** 1000

### Tool Calling (3 irankiai)
1. `get_products` - gauna produktus is Google Sheets pagal tipa ir galia
2. `calculate_system` - skaiciuoja rekomenduojama saules sistemos galia
3. `escalate_to_human` - perduoda pokalbio konsultantui

### Produktu cache
- In-memory cache su 15 min TTL
- Visi produktai skaitomi is Google Sheets "Produktai" lapo

---

## Konfiguracija

### Environment variables (frontend/.env.local)
```
OPENAI_API_KEY=sk-...           # OpenAI API raktas
N8N_CHAT_ESCALATION_WEBHOOK=    # n8n webhook URL escalation duomenims (neprivalomas)
```

### Limitas
- Max 30 ziuciu per sesija
- Pokalbio istorija: paskutines 20 ziuciu siunciamos AI

---

## Escalation logika

Chatbotas perduoda konsultantui kai:
- Klientas praso zmogaus
- AI negali atsakyti
- Klientas nori oficialaus pasiulymo
- Klientas pranesu apie serviso problema

Escalation korteleje:
- Mygtukais "Skambinti" (tel: link) ir "El. pastas" (mailto: link)
- Kontaktu forma (vardas, telefonas, zinute)
- Duomenys siunciami i n8n webhook (jei sukonfigruotas)

---

## Edge Cases

### OpenAI API klaida
- Rodomas klaidos pranesimas su telefono numeriu

### Google Sheets nepasiekiamas
- Produktu cache naudojamas jei dar galioja
- Kitu atveju AI atsako be produktu korteliu

### Per ilgas pokalbis
- Po 30 ziuciu rodomas limito pranesimas su kontaktiniu telefonu
