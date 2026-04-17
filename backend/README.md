# ARIA — AI-Powered Email Triage API

> Backend service that analyzes emails and intelligently classifies them by urgency, category, and required action using AI.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your API key to .env
#    Edit .env and set GEMINI_API_KEY=your_key_here
#    (or switch to OpenAI — set AI_PROVIDER=openai and OPENAI_API_KEY)

# 3. Start development server
npm run dev
```

Server runs at `http://localhost:3000`

---

## API Endpoints

| Method | Path               | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/`                | API info & links                     |
| GET    | `/api/health`      | Health check + uptime + memory stats |
| GET    | `/api/schema`      | Full request/response schema (docs)  |
| POST   | `/api/triage`      | Triage a single email                |
| POST   | `/api/triage/batch`| Triage up to 50 emails at once       |

---

## Single Email Triage — `POST /api/triage`

### Request Body

```json
{
  "subject": "Need Q4 budget approval before board meeting",
  "from": "ceo@company.com",
  "body": "Hi, the board meeting is at 2pm today and I need your budget approval before then.",
  "senderName": "John Smith",
  "userEmail": "you@company.com",
  "to": "you@company.com",
  "cc": ["finance@company.com"],
  "receivedAt": "2026-04-17T09:00:00Z",
  "isReply": false,
  "threadLength": 1
}
```

**Required fields:** `subject`, `from`, `body`
**Optional fields:** `to`, `cc`, `receivedAt`, `userEmail`, `senderName`, `isReply`, `threadLength`

### Response

```json
{
  "success": true,
  "message": "Email triaged successfully",
  "data": {
    "triageId": "a1b2c3d4-...",
    "priority_score": 98,
    "category": "urgent_action",
    "urgency_level": "critical",
    "action": "reply",
    "reason": "CEO needs budget approval with specific deadline (before 2pm) for board meeting",
    "key_info": "Budget approval needed before 2pm board meeting today",
    "estimated_time": "15min",
    "sender_type": "boss",
    "requires_response": true,
    "deadline": "2pm today",
    "red_flags": [],
    "metadata": {
      "processedAt": "2026-04-17T13:00:00.000Z",
      "processingTimeMs": 1234,
      "aiProvider": "gemini",
      "emailSubject": "Need Q4 budget approval before board meeting",
      "emailFrom": "ceo@company.com"
    }
  },
  "timestamp": "2026-04-17T13:00:00.000Z"
}
```

---

## Batch Triage — `POST /api/triage/batch`

### Request Body

```json
{
  "emails": [
    { "subject": "...", "from": "...", "body": "..." },
    { "subject": "...", "from": "...", "body": "..." }
  ]
}
```

Max 50 emails per batch. Returns individual results + summary statistics.

---

## Response Envelope

ALL responses share this shape:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... },
  "timestamp": "ISO 8601"
}
```

On error:

```json
{
  "success": false,
  "message": "What went wrong",
  "details": [ { "field": "subject", "message": "subject is required" } ],
  "timestamp": "ISO 8601"
}
```

---

## Classification Schema

### Categories
| Category        | Meaning                              |
|-----------------|--------------------------------------|
| `urgent_action` | Needs response/decision TODAY        |
| `needs_reply`   | Should respond within 24-48 hours    |
| `fyi`           | Informational, no action needed      |
| `promotional`   | Marketing, newsletters, sales        |
| `noise`         | Auto-notifications, spam, junk       |

### Urgency Levels
`critical` → `high` → `medium` → `low` → `none`

### Actions
`reply` · `review` · `schedule` · `archive` · `delete`

### Sender Types
`boss` · `coworker` · `client` · `vendor` · `automated` · `marketing` · `unknown`

### Time Estimates
`1min` · `5min` · `15min` · `30min+`

---

## Environment Variables

| Variable                  | Default           | Description                         |
|---------------------------|-------------------|-------------------------------------|
| `PORT`                    | `3000`            | Server port                         |
| `NODE_ENV`                | `development`     | Environment                         |
| `AI_PROVIDER`             | `gemini`          | `"openai"` or `"gemini"`            |
| `GEMINI_API_KEY`          | —                 | Google AI Studio API key            |
| `GEMINI_MODEL`            | `gemini-1.5-flash`| Gemini model                        |
| `OPENAI_API_KEY`          | —                 | OpenAI API key                      |
| `OPENAI_MODEL`            | `gpt-4o-mini`     | OpenAI model                        |
| `RATE_LIMIT_WINDOW_MS`    | `900000` (15min)  | Rate limit window                   |
| `RATE_LIMIT_MAX_REQUESTS` | `100`             | Max requests per window             |
| `CORS_ORIGINS`            | `*`               | Allowed CORS origins (comma-sep)    |
| `LOG_LEVEL`               | `info`            | Logging level                       |

---

## Project Structure

```
Red_Track/
├── src/
│   ├── server.js                    # Entry point
│   ├── config/
│   │   └── index.js                 # Environment config + validation
│   ├── controllers/
│   │   └── triageController.js      # Request/response handlers
│   ├── middleware/
│   │   ├── errorHandler.js          # Global error + 404 handler
│   │   ├── rateLimiter.js           # Rate limiting (general + triage)
│   │   └── validator.js             # Input validation rules
│   ├── routes/
│   │   └── index.js                 # Route definitions
│   ├── services/
│   │   ├── aiProvider.js            # AI provider factory (strategy pattern)
│   │   ├── promptBuilder.js         # System prompt + user prompt construction
│   │   ├── triageService.js         # Core triage logic + batch processing
│   │   └── providers/
│   │       ├── geminiProvider.js     # Google Gemini integration
│   │       └── openaiProvider.js     # OpenAI integration
│   └── utils/
│       ├── logger.js                # Winston logger (dev + prod formats)
│       └── response.js              # Standardized API response helpers
├── .env                             # Environment variables (git-ignored)
├── .env.example                     # Template for env vars
├── .gitignore
├── package.json
└── README.md
```

## Rate Limits

- **General:** 100 requests / 15 minutes across all endpoints
- **Triage:** 20 requests / minute for `/api/triage` and `/api/triage/batch`

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI:** Google Gemini / OpenAI (swappable)
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting
- **Logging:** Winston
