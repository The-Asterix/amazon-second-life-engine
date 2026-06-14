# ♻️ Second Life Commerce Engine

**A Smart Image-Grading Returns Flow** Built for the **Amazon HackOn 6.0** 48-Hour Virtual Hackathon.

## 🚀 Overview
[cite_start]Retail returns present a multi-billion dollar challenge, impacting both operating costs and global sustainability[cite: 26]. The Second Life Commerce Engine is an automated, AI-driven returns evaluation system. A major problem with returns is fraud. So, before grading the item, our Bedrock Vision pipeline runs a Zero-Fraud check. It authenticates the image's EXIF metadata to ensure it's not a downloaded photo, and it uses OCR to match the physical serial number in the photo with the original Order ID. Only if the Fraud Risk is LOW, it proceeds to grading and awards Green Credits.

[cite_start]Instead of a standard text-based return form, this system utilizes Amazon Bedrock (Claude Vision) to analyze user-uploaded photos of returned items in real-time[cite: 31, 68, 69]. [cite_start]It automatically grades the cosmetic condition, categorizes the optimal route (Restock, Refurbish, Donate, or Recycle), and dynamically calculates a "Green Credit" reward for the user[cite: 70].

## 🛠️ Tech Stack & Architecture
[cite_start]This project utilizes a modern, serverless-ready architecture designed for rapid deployment and enterprise scalability[cite: 196]:

* [cite_start]**Backend / AI Engine:** Python 3, FastAPI, `boto3` [cite: 175, 189, 190]
* [cite_start]**Generative AI:** Amazon Bedrock (Claude 3 Sonnet Vision Model) [cite: 69]
* [cite_start]**Frontend UI:** JavaScript, React [cite: 188, 192]
* [cite_start]**Cloud Infrastructure (Target):** AWS (Lambda, API Gateway, DynamoDB, Amplify) [cite: 45, 47, 50]

## 📂 Modular Repository Structure
[cite_start]We implemented a strict modular architecture to separate routing, business logic, and UI components[cite: 157, 166, 167].

```text
amazon-second-life-engine/
├── backend-evaluator/        # Python FastAPI Backend
│   ├── main.py               # API Gateway & Route Definitions
│   ├── grading_service.py    # Core Amazon Bedrock Integration Logic
│   └── requirements.txt      # Python dependencies
└── frontend-web/             # React Application
    ├── src/
    │   ├── components/       # Reusable UI widgets (Uploaders, Loaders)
    │   └── App.jsx           # Main Application View
    └── package.json          # JS dependencies