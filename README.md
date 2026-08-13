# 🌾 Hawkins Farm

> **An AI-powered digital marketplace for farmers and buyers**

Hawkins Farm is a full-stack agriculture platform that brings together **farmers, buyers, AI/ML services, weather information, crop recognition, price prediction, auctions, and an AI farming assistant** into a single digital platform.

The project is built with a modular architecture using **React, FastAPI, Python, TensorFlow/Keras, Machine Learning, WebSockets, and AI services**.

---

## 📸 Project Preview

<p align="center">
  <img src="images/img1f.png" width="24%" />
  <img src="images/img6f.png" width="24%" />
  <img src="images/img3f.png" width="24%" />
  <img src="images/img4f.png" width="24%" />
</p>
## 🚀 What Hawkins Farm Provides

Hawkins Farm is designed to help farmers make better decisions and connect with buyers through technology.

### 🌱 1. AI Crop Recognition

The platform can identify crops/commodities from an uploaded image using a trained deep-learning classification model.

**Current model:**

- MobileNetV3Small
- TensorFlow / Keras
- Image classification
- 49 crop/commodity classes
- FastAPI inference endpoint

Example:

```json
{
  "crop": "Cucumber",
  "confidence": 45.26
}
```

The current dataset contains **4,596 images across 49 classes**.

Example classes include:

`Apple`, `Mango`, `Tomato`, `Potato`, `Rice`, `Wheat`, `Cucumber`, `Carrot`, `Brinjal`, `Cabbage`, `Cauliflower`, `Grapes`, `Orange`, `Papaya`, `Pomegranate`, `Peanut`, `Moong`, `Masur Dal`, `Tur Dal`, and many more.

---

### 🌦️ 2. Weather Integration

Farmers can retrieve weather information for a selected location through the backend.

The weather module is designed to provide useful information such as:

- Current temperature
- Weather condition
- Humidity
- Wind information
- Location-based weather data

---

### 📈 3. Crop Price Prediction

The platform includes a machine-learning price prediction module intended to help farmers understand potential market prices and make better selling decisions.

Potential prediction features include:

- Crop/commodity
- Historical prices
- Market/mandi
- Location
- Seasonal trends
- Demand/supply information
- Weather-related factors

---

### 🤖 4. AI Farming Assistant

Hawkins Farm includes an AI assistant designed specifically for agriculture-related queries.

The assistant can help users with:

- Crop-related questions
- Farming guidance
- Market information
- Weather-related questions
- General agricultural information
- Farmer-focused recommendations

---

### 🔨 5. Real-Time Auction System

The auction module is designed for real-time farmer/buyer interaction.

**Technology:**

- FastAPI
- WebSockets
- Real-time bidding
- Backend event handling

This allows auction updates to be delivered to connected users without repeatedly refreshing the page.

---

### 🛒 6. Digital Marketplace

The main objective of Hawkins Farm is to create a digital marketplace where:

```text
Farmer
   ↓
List Agricultural Product
   ↓
Buyer Discovers Product
   ↓
Auction / Purchase
   ↓
Digital Agricultural Marketplace
```

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       FARMER         │
                         │        / BUYER       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │       Vite           │
                         └──────────┬───────────┘
                                    │
                       REST API     │     WebSocket
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       FastAPI Server         │
                    │                              │
                    │  • Marketplace               │
                    │  • Weather                   │
                    │  • Auction                   │
                    │  • AI Assistant              │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │        ML Service            │
                    │                              │
                    │  • Crop Recognition          │
                    │  • Price Prediction           │
                    │  • Model Inference            │
                    └──────────────────────────────┘
```

---

# 📁 Project Structure

The current repository is organized as follows:

```text
Hawkins_Farm/
│
├── client/                       # React + Vite frontend
│
├── images/                       # Frontend screenshots / project images
│
├── ml-service/                   # Machine Learning service
│   │
│   ├── models/                   # Trained ML models
│   │
│   ├── app.py                    # ML FastAPI application
│   ├── convert_model.py          # Model conversion / preparation
│   ├── labels.json               # Crop class labels
│   └── requirements.txt          # ML dependencies
│
├── server/                       # Main FastAPI backend
│
├── .gitignore
│
└── README.md
```

---

# 🧠 Machine Learning Pipeline

## Crop Recognition

```text
                    Crop Image
                         │
                         ▼
                Image Preprocessing
                         │
                         ▼
                  MobileNetV3Small
                         │
                         ▼
                   Classification
                         │
                         ▼
               Predicted Crop Class
                         │
                         ▼
                 Confidence Score
```

The trained model is served through a FastAPI-based ML service.

### ML Service

```text
ml-service/
│
├── models/
├── app.py
├── convert_model.py
├── labels.json
└── requirements.txt
```

`labels.json` stores the mapping between model output classes and their crop names.

---

# 🔌 API Architecture

The backend is divided into modules so that each feature can be developed and maintained independently.

| Module               | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `/crop`              | Crop recognition                             |
| `/weather`           | Weather information                          |
| `/auction`           | Auction functionality                        |
| WebSocket `/auction` | Real-time bidding                            |
| Price Prediction     | ML-based price estimation                    |
| AI Assistant         | Agriculture-focused conversational assistant |

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

## Backend

- Python
- FastAPI
- REST APIs
- WebSockets
- Uvicorn

## AI / Machine Learning

- Python
- TensorFlow
- Keras
- MobileNetV3Small
- Scikit-learn
- Machine Learning regression models
- LangChain
- LLM-based AI assistant

## Development

- Git
- GitHub
- VS Code
- Python Virtual Environment
- npm

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Hawkins_Farm
```

---

## 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 3. Backend Setup

Open a new terminal:

```bash
cd server

python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app:app --reload
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 4. ML Service Setup

Open another terminal:

```bash
cd ml-service

python -m venv .venv
```

Activate the environment:

```bash
.venv\Scripts\activate
```

Install ML dependencies:

```bash
pip install -r requirements.txt
```

Run the ML service:

```bash
uvicorn app:app --reload --port 8001
```

---

# 🔐 Environment Variables

API keys and secrets should be stored in `.env` files and must **never be committed to GitHub**.

Example:

```env
WEATHER_API_KEY=your_weather_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Make sure `.env` is included in `.gitignore`.

---

# 🔄 Git Collaboration Workflow

Hawkins Farm is developed collaboratively using Git branches.

Example:

```text
main
│
├── feature/crop-recognition
├── feature/ml-service
├── feature/weather
└── feature/auction
```

Recommended workflow:

```bash
git checkout -b feature/your-feature

git add .

git commit -m "Add your feature"

git push origin feature/your-feature
```

Then create a Pull Request to merge the feature into `main`.

---

# 📊 Current Project Modules

| Feature              | Status                       |
| -------------------- | ---------------------------- |
| React Frontend       | 🟢 In Development            |
| FastAPI Backend      | 🟢 In Development            |
| Crop Recognition     | 🟢 Implemented               |
| Weather Integration  | 🟡 In Development            |
| Price Prediction     | 🟡 In Development            |
| AI Farming Assistant | 🟢 Implemented / Integrating |
| Real-Time Auction    | 🟡 In Development            |
| Marketplace          | 🟡 In Development            |

---

# 🔮 Future Enhancements

- 📍 GPS-based local mandi discovery
- 📊 Live mandi price integration
- 📈 Advanced time-series price forecasting
- 🌾 Personalized crop recommendations
- 🛰️ Satellite-based crop monitoring
- 📱 Mobile application
- 🔔 Crop price and weather alerts
- 🌐 Hindi and regional-language support
- 🔐 Authentication and role-based access
- 💳 Online payment integration
- ☁️ Cloud deployment
- 🔄 CI/CD pipeline
- 📦 Order and inventory management

---

# 🎯 Project Vision

The long-term vision of Hawkins Farm is to build a **smart digital agriculture ecosystem** where farmers can access technology-driven insights without needing multiple separate platforms.

```text
             HAWKINS FARM
                   │
       ┌───────────┼───────────┐
       │           │           │
      AI          ML        Marketplace
       │           │           │
   Assistant   Prediction    Auction
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
            Better Decisions
                   │
                   ▼
          Empowered Farmers
```

---

# 👨‍💻 Contributors

| Contributor     | Contribution                     |
| --------------- | -------------------------------- |
| **Avinash7037** | Full-Stack / Project Development |
| **Deepak4053**  | AI/ML & Backend Development      |

---

# 📌 Project Status

🚧 **Hawkins Farm is actively under development.**

The project is being developed as a collaborative full-stack + AI/ML agriculture platform. APIs, UI components, and ML services are continuously being improved.

---

# ⭐ Why Hawkins Farm?

Hawkins Farm combines multiple modern technologies into one real-world application:

**🌾 Agriculture + 🤖 AI + 🧠 Machine Learning + ⚡ FastAPI + ⚛️ React + 🔨 WebSockets**

The goal is to use software and AI to solve practical problems in agriculture and create a more accessible digital marketplace for farmers and buyers.

---

## 📄 License

This project is currently maintained as a collaborative academic/software project.
