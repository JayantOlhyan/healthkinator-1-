# 🏗️ Healthkinator Architecture

## System Overview

Healthkinator follows a **microservices architecture** with three main components:

1. **React Native Frontend** - Cross-platform mobile client
2. **Node.js + Express Backend** - REST API, authentication, business logic
3. **FastAPI AI Microservice** - ML-powered symptom assessment engine

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Client Layer                      │
│                    (React Native + Redux)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │ Symptom  │  │ Reports  │  │  Voice   │   │
│  │  Screen  │  │ Checker  │  │ History  │  │  Input   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│                   (Node.js + Express)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │ Reports  │  │  Users   │  │  Sync    │   │
│  │ Middleware│  │   API   │  │   API    │  │  Queue   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
              │                              │
              │                              │
              ▼                              ▼
┌────────────────────────┐     ┌────────────────────────────┐
│   Database Layer       │     │   AI Microservice          │
│   (MongoDB)            │     │   (FastAPI + ML Models)    │
│  ┌─────────────────┐   │     │  ┌──────────────────────┐ │
│  │ users           │   │     │  │ Decision Tree        │ │
│  │ reports         │   │     │  │ Naive Bayes          │ │
│  │ symptoms        │   │     │  │ Adaptive Questioning │ │
│  │ questions       │   │     │  │ Confidence Scoring   │ │
│  │ analytics       │   │     │  └──────────────────────┘ │
│  └─────────────────┘   │     └────────────────────────────┘
└────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────┐
│              Cloud Storage Layer (AWS S3 / GCS)            │
│              Encrypted Reports + User Uploads               │
└────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1️⃣ User Authentication Flow

```
┌──────┐                 ┌──────────┐              ┌──────────┐
│ User │                 │ Frontend │              │  Backend │
└──┬───┘                 └────┬─────┘              └────┬─────┘
   │                          │                         │
   │ Click "Login with Google"│                         │
   ├─────────────────────────►│                         │
   │                          │ POST /auth/google       │
   │                          ├────────────────────────►│
   │                          │                         │
   │                          │                    Verify with
   │                          │                    OAuth Provider
   │                          │                         │
   │                          │ JWT Token + User Data   │
   │                          │◄────────────────────────┤
   │                          │                         │
   │   Store JWT in Secure    │                         │
   │   Storage & Redux        │                         │
   │◄─────────────────────────┤                         │
   │                          │                         │
   │   Navigate to Home       │                         │
   │◄─────────────────────────┤                         │
   │                          │                         │
```

### 2️⃣ Symptom Assessment Flow

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │     │ Frontend │     │  Backend │     │    AI    │
└──┬───┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
   │              │                 │                 │
   │ Start Check  │                 │                 │
   ├─────────────►│                 │                 │
   │              │ POST /symptoms/start              │
   │              ├────────────────►│                 │
   │              │                 │ POST /ai/start  │
   │              │                 ├────────────────►│
   │              │                 │                 │
   │              │                 │ First Question  │
   │              │                 │◄────────────────┤
   │              │ Question 1      │                 │
   │              │◄────────────────┤                 │
   │              │                 │                 │
   │ Answer: Yes  │                 │                 │
   ├─────────────►│                 │                 │
   │              │ POST /symptoms/answer             │
   │              ├────────────────►│                 │
   │              │                 │ POST /ai/next   │
   │              │                 ├────────────────►│
   │              │                 │                 │
   │              │                 │ Next Question + │
   │              │                 │ Updated Probs   │
   │              │                 │◄────────────────┤
   │              │ Question 2      │                 │
   │              │◄────────────────┤                 │
   │              │                 │                 │
   │    ...repeat until confident or max questions... │
   │              │                 │                 │
   │              │                 │ POST /ai/predict│
   │              │                 ├────────────────►│
   │              │                 │                 │
   │              │                 │ Final Results   │
   │              │                 │◄────────────────┤
   │              │                 │                 │
   │              │ Results + Report│                 │
   │              │◄────────────────┤                 │
   │              │                 │                 │
   │ Show Results │                 │                 │
   │◄─────────────┤                 │                 │
   │              │                 │                 │
```

### 3️⃣ Report Generation & Storage Flow

```
┌──────────┐         ┌──────────┐         ┌───────┐
│  Backend │         │    S3    │         │MongoDB│
└────┬─────┘         └────┬─────┘         └───┬───┘
     │                    │                    │
     │ Generate PDF       │                    │
     │ (Symptoms + Results)                    │
     ├───────────────┐    │                    │
     │               │    │                    │
     │◄──────────────┘    │                    │
     │                    │                    │
     │ Encrypt with AES-256                    │
     ├────────────────┐   │                    │
     │                │   │                    │
     │◄───────────────┘   │                    │
     │                    │                    │
     │ PUT /reports/xyz.pdf                    │
     ├───────────────────►│                    │
     │                    │                    │
     │    S3 URL          │                    │
     │◄───────────────────┤                    │
     │                    │                    │
     │ Save metadata + URL                     │
     ├────────────────────────────────────────►│
     │                    │                    │
     │           Document ID                   │
     │◄────────────────────────────────────────┤
     │                    │                    │
```

---

## Component Details

### Frontend Architecture (React Native)

```
src/
├── screens/
│   ├── AuthScreen.tsx          # Login/Signup with OAuth
│   ├── HomeScreen.tsx          # Dashboard
│   ├── SymptomCheckerScreen.tsx # Main assessment UI
│   ├── ResultsScreen.tsx       # Show diagnosis results
│   ├── ReportsScreen.tsx       # Past reports list
│   ├── TelemedicineScreen.tsx  # Book appointments
│   └── ProfileScreen.tsx       # User settings
│
├── components/
│   ├── Avatar/                 # Animated Akinator-style avatar
│   ├── QuestionCard/           # Yes/No/Unsure buttons
│   ├── VoiceInput/             # Speech-to-text component
│   ├── ProbabilityChart/       # Condition probability viz
│   └── OfflineIndicator/       # Network status
│
├── navigation/
│   └── AppNavigator.tsx        # React Navigation setup
│
├── store/
│   ├── authSlice.ts            # Auth state (Redux)
│   ├── symptomSlice.ts         # Current session state
│   ├── reportsSlice.ts         # Past reports
│   └── store.ts                # Redux store config
│
├── services/
│   ├── api.ts                  # Axios instance with interceptors
│   ├── auth.service.ts         # Auth API calls
│   ├── symptom.service.ts      # Symptom API calls
│   ├── offline.service.ts      # Queue management
│   └── storage.service.ts      # Secure local storage
│
├── utils/
│   ├── encryption.ts           # AES-256 helpers
│   ├── debounce.ts             # Input debouncing
│   └── validation.ts           # Input sanitization
│
├── locales/
│   ├── en.json
│   ├── es.json
│   ├── hi.json
│   └── fr.json
│
└── theme/
    ├── colors.ts               # Dark/light theme colors
    └── typography.ts           # Font styles
```

### Backend Architecture (Node.js + Express)

```
src/
├── controllers/
│   ├── auth.controller.ts      # Login, register, OAuth
│   ├── user.controller.ts      # Profile management
│   ├── symptom.controller.ts   # Symptom session coordination
│   ├── report.controller.ts    # Report generation
│   └── telemedicine.controller.ts # Appointment booking
│
├── models/
│   ├── User.ts                 # Mongoose user schema
│   ├── Report.ts               # Report schema
│   ├── Symptom.ts              # Symptom data schema
│   ├── Question.ts             # Question bank schema
│   └── Analytics.ts            # Usage analytics schema
│
├── middleware/
│   ├── auth.middleware.ts      # JWT verification
│   ├── validation.middleware.ts # Joi validation
│   ├── rateLimiter.middleware.ts # Rate limiting
│   ├── errorHandler.middleware.ts # Global error handler
│   └── audit.middleware.ts     # Audit logging
│
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── symptom.routes.ts
│   ├── report.routes.ts
│   └── telemedicine.routes.ts
│
├── services/
│   ├── auth.service.ts         # OAuth integration
│   ├── encryption.service.ts   # AES-256 encryption
│   ├── pdf.service.ts          # PDF generation
│   ├── ai.service.ts           # AI microservice client
│   └── notification.service.ts # Email/SMS notifications
│
├── utils/
│   ├── cloudStorage.ts         # S3/GCS wrapper
│   ├── logger.ts               # Winston logger
│   └── jwt.ts                  # JWT helpers
│
└── config/
    ├── database.ts             # MongoDB connection
    ├── oauth.ts                # OAuth providers config
    └── index.ts                # Environment variables
```

### AI Microservice Architecture (FastAPI)

```
app/
├── models/
│   ├── decision_tree.pkl       # Trained decision tree
│   ├── naive_bayes.pkl         # Trained Naive Bayes
│   └── symptom_encoder.pkl     # Label encoder
│
├── routers/
│   ├── assessment.py           # /start, /next, /predict endpoints
│   └── health.py               # Health check endpoint
│
├── services/
│   ├── decision_engine.py      # Adaptive questioning logic
│   ├── confidence_scorer.py    # Probability calculations
│   └── question_selector.py    # Next best question algorithm
│
├── schemas/
│   ├── symptom.py              # Pydantic models for symptoms
│   ├── question.py             # Question/Answer models
│   └── prediction.py           # Result models
│
└── utils/
    ├── model_loader.py         # Load ML models
    └── data_processor.py       # Feature engineering
```

---

## Security Architecture

### Authentication Flow

1. **OAuth 2.0** - Google/Apple Sign-In
2. **JWT Tokens** - Stored in encrypted secure storage
3. **Token Refresh** - Automatic refresh before expiry
4. **Session Management** - Redis-based session store (optional)

### Data Encryption

```
┌──────────────┐
│  User Data   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  AES-256-GCM     │  ← Encryption at Application Layer
│  Encryption      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  TLS 1.3         │  ← Encryption in Transit
│  HTTPS           │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  MongoDB         │  ← Encryption at Rest (DB Level)
│  S3 SSE          │
└──────────────────┘
```

### API Security Layers

1. **Rate Limiting** - 100 requests per 15 minutes per IP
2. **Input Validation** - Joi schemas on all endpoints
3. **SQL Injection Prevention** - Mongoose ODM
4. **XSS Prevention** - Input sanitization
5. **CORS** - Whitelist mobile app origins
6. **Audit Logging** - All sensitive operations logged

---

## Scalability Considerations

### Horizontal Scaling

- **Backend**: Stateless design, scale behind load balancer
- **AI Service**: Multiple instances for parallel predictions
- **Database**: MongoDB replica sets + sharding

### Caching Strategy

```
┌──────────┐
│ Redis    │  ← Session cache, frequent queries
└────┬─────┘
     │
     ▼
┌──────────┐
│ MongoDB  │  ← Primary data store
└──────────┘
```

### CDN Integration

- Static assets (images, fonts) served via CloudFront/CloudFlare
- Report PDFs cached at edge locations

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────────────────────┐
│                      AWS/GCP Cloud                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   ECS/EKS    │  │   ECS/EKS    │  │   Lambda     │ │
│  │   (Backend)  │  │   (AI)       │  │   (Workers)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Application Load Balancer (ALB)         │  │
│  └──────────────────────────────────────────────────┘  │
│         │                  │                  │         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  MongoDB     │  │   Redis      │  │   S3/GCS     │ │
│  │  Atlas       │  │  Elasticache │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

### Metrics Collection

- **Application Metrics**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Logs**: CloudWatch / Stackdriver
- **APM**: New Relic / DataDog

### Health Checks

- Backend: `GET /health`
- AI Service: `GET /health`
- Database: Connection pool monitoring

---

## CI/CD Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Git    │────►│ GitHub   │────►│  Docker  │────►│   ECS/   │
│   Push   │     │ Actions  │     │  Build   │     │   K8s    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Run Tests    │
              │ Lint Code    │
              │ Security Scan│
              └──────────────┘
```

---

## Future Enhancements

1. **GraphQL API** - Replace REST for better mobile performance
2. **WebSockets** - Real-time chat with doctors
3. **Federated Learning** - Train models without centralizing data
4. **Multi-tenancy** - White-label for hospitals
5. **Blockchain** - Immutable audit trail for medical records

---

**Last Updated**: 2025-11-02
