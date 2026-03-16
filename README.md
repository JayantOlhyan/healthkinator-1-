# 🏥 Healthkinator

**AI-Powered Symptom Assessment Mobile Application**

Healthkinator is an interactive, Akinator-style symptom checker that uses adaptive questioning to assess symptoms, infer probable medical conditions, and recommend telemedicine consultations.

---

## 🎯 Features

### Core Functionality
- ✅ **Adaptive AI Questioning** - Dynamic yes/no/unsure symptom assessment
- ✅ **Voice Input** - Speech-to-text using Google Speech API
- ✅ **Multilingual Support** - English, Spanish, Hindi, French
- ✅ **Offline Mode** - Queue responses and sync when online
- ✅ **Encrypted Reports** - AES-256 encrypted health records
- ✅ **Telemedicine Integration** - Book appointments directly
- ✅ **Dark Mode** - Eye-friendly UI
- ✅ **Freemium Model** - Basic free, premium features

### Security & Compliance
- 🔒 OAuth 2.0 Authentication
- 🔒 End-to-End Encryption
- 🔒 JWT Token-based Sessions
- 🔒 HIPAA-like Security Practices
- 🔒 Audit Logging

---

## 📁 Project Structure

```
healthkinator/
├── frontend/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/         # UI screens
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # React Navigation
│   │   ├── services/        # API & storage services
│   │   ├── store/           # Redux state management
│   │   ├── utils/           # Helpers & encryption
│   │   ├── locales/         # i18n translations
│   │   └── theme/           # Dark/light theme
│   ├── android/
│   ├── ios/
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Encryption, cloud storage
│   │   └── config/          # Environment config
│   ├── tests/
│   └── package.json
│
├── ai/                       # FastAPI AI microservice
│   ├── app/
│   │   ├── models/          # ML models
│   │   ├── routers/         # API routes
│   │   ├── services/        # Decision engine
│   │   ├── schemas/         # Pydantic models
│   │   └── utils/           # Training helpers
│   ├── data/                # Training datasets
│   ├── trained_models/      # Saved models
│   ├── tests/
│   └── requirements.txt
│
├── docs/                     # Architecture & API docs
├── docker/                   # Docker configurations
└── scripts/                  # Deployment & setup scripts
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 6+
- React Native CLI
- Xcode (iOS) / Android Studio (Android)
- AWS/GCP account (for cloud storage)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/healthkinator.git
cd healthkinator
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on `http://localhost:3000`

### 3️⃣ Setup AI Microservice
```bash
cd ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env
python app/main.py
```

AI service runs on `http://localhost:8000`

### 4️⃣ Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URLs

# iOS
npx pod-install
npm run ios

# Android
npm run android
```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/healthkinator
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=32-byte-hex-key-for-aes256
OAUTH_GOOGLE_CLIENT_ID=your-google-oauth-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-oauth-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=healthkinator-reports
AWS_REGION=us-east-1
AI_SERVICE_URL=http://localhost:8000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### AI Service (.env)
```bash
ENVIRONMENT=development
MODEL_PATH=./trained_models
CONFIDENCE_THRESHOLD=0.65
MAX_QUESTIONS=20
```

### Frontend (.env)
```bash
API_BASE_URL=http://localhost:3000
AI_BASE_URL=http://localhost:8000
GOOGLE_SPEECH_API_KEY=your-google-speech-key
GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-id
STRIPE_PUBLISHABLE_KEY=your-stripe-key
SENTRY_DSN=your-sentry-dsn
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: String,
  oauth: { provider, providerId },
  subscription: { tier, expiresAt },
  createdAt: Date,
  updatedAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  symptoms: [String],
  responses: [{ question, answer }],
  conditions: [{ name, probability, confidence }],
  reportUrl: String,
  encrypted: Boolean,
  createdAt: Date
}
```

---

## 🧪 Testing

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

### AI Service
```bash
cd ai
pytest tests/
pytest --cov=app tests/
```

### Frontend
```bash
cd frontend
npm test
npm run test:e2e
```

---

## 🐳 Docker Deployment

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📱 Build for Production

### iOS
```bash
cd frontend/ios
xcodebuild -workspace Healthkinator.xcworkspace \
  -scheme Healthkinator \
  -configuration Release \
  -archivePath build/Healthkinator.xcarchive \
  archive
```

### Android
```bash
cd frontend/android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 Security Notes

1. **Never commit .env files** - Use .env.example as template
2. **Rotate JWT secrets** regularly in production
3. **Use HTTPS** for all API communications
4. **Enable MongoDB authentication** in production
5. **Implement rate limiting** on all endpoints
6. **Encrypt sensitive data** at rest and in transit
7. **Regular security audits** and dependency updates
8. **HIPAA compliance** - consult legal for healthcare data

---

## 🌐 API Documentation

API documentation available at:
- Backend: `http://localhost:3000/api-docs`
- AI Service: `http://localhost:8000/docs`

---

## 📈 Monitoring & Logging

- **Application Logs**: Winston (backend), Loguru (AI)
- **Error Tracking**: Sentry integration
- **Analytics**: Custom analytics collection
- **Performance**: New Relic / DataDog integration ready

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## ⚠️ Disclaimer

**Healthkinator is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers.**

---

## 👥 Support

- Email: support@healthkinator.com
- Documentation: https://docs.healthkinator.com
- Issues: GitHub Issues

---

**Built with ❤️ for better healthcare accessibility**
