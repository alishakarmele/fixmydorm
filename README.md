# 🏠 FixMyDorm

> **AI-powered hostel grievance, maintenance & daily-life platform for college students in India.**

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Powered-orange?logo=amazon-aws)](https://aws.amazon.com/)

---

## 📋 Problem Statement

Student hostel complaints are currently scattered across WhatsApp groups, paper registers, and verbal requests — leading to:

- **Lost complaints** that never get addressed
- **No accountability** for resolution timelines
- **Duplicate submissions** wasting management bandwidth
- **Zero transparency** for students on complaint status
- **Language barriers** between students and maintenance staff
- **No data** for identifying systemic issues

**FixMyDorm** solves this by providing a single, AI-powered platform where students can submit, track, and escalate complaints while management gets a prioritized, organized, multilingual dashboard — with smart automation handling urgent escalations.

---

## ✨ Core Features

### 🎫 Smart Complaint System *(Student Experience)*
- Submit complaints with text + image attachments
- **🎙️ Voice-to-Ticket:** Record a voice note to describe the issue; audio is routed through **Amazon Transcribe** to convert speech-to-text before the transcript is sent to Amazon Bedrock for classification and priority assignment
- **AI-powered** automatic categorization & priority assignment via Amazon Bedrock
- **Duplicate detection** to prevent redundant tickets
- Real-time status tracking from submission to resolution
- Students receive resolution notes translated into their preferred language via **Amazon Translate**

### 📊 Management Dashboard *(Management Experience)*
- Central view of all complaints, filterable by category, priority, hostel, and status
- **🌐 Multilingual View:** Complaints submitted in English are automatically translated into the regional language for maintenance staff via **Amazon Translate**; staff resolution notes are translated back to the student's preferred language
- Assign complaints to staff members
- Update status and respond directly to students

### 🧱 The Wall – Anonymous Grievance Board
- Post grievances anonymously
- Upvote issues and mark "Affected Too"
- Official management responses on public posts
- **🛡️ Image Moderation:** All images uploaded to The Wall are automatically scanned by **Amazon Rekognition**; explicit or inappropriate content is blocked before it appears publicly

### 📦 Lost & Found
- Report lost or found items with photos
- **AI-powered matching** between lost and found entries via Amazon Bedrock
- **Image Verification:** Amazon Rekognition verifies that uploaded photos visually match the item described in the text
- Claim flow with verification

### 🚪 Early Leave / Late Entry Requests
- Submit requests for events (marathon, movies, etc.)
- Approval workflow for wardens/management

### 🍽️ Mess Menu
- View daily and weekly mess menus
- Rate meals and submit feedback

### 🤖 AI Help Agent
- In-app chatbot for hostel-related questions
- Guides students through the complaint process
- Powered by Amazon Bedrock (Claude)

---

## 🛠️ Tech Stack

| Layer           | Technology                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| **Frontend**    | Next.js 16 (App Router) + TypeScript                                       |
| **Styling**     | Tailwind CSS v4 + shadcn/ui                                                |
| **Auth**        | Amazon Cognito (student & management pools)                                |
| **Hosting**     | Vercel / AWS Amplify Hosting                                               |
| **API**         | Next.js API Routes (Edge-compatible)                                       |
| **Database**    | Amazon DynamoDB                                                            |
| **Storage**     | Amazon S3 (image & audio uploads)                                          |
| **AI / ML**     | Amazon Bedrock (Claude — classify, deduplicate, match, chat)               |
| **Vision**      | Amazon Rekognition (image moderation & content verification)               |
| **Speech**      | Amazon Transcribe (voice-to-text for ticket creation)                      |
| **Translation** | Amazon Translate (multilingual dashboards & student responses)             |
| **Workflows**   | AWS Step Functions (ticket routing orchestration)                          |
| **Alerts**      | Amazon SNS (emergency SMS to warden for urgent issues)                     |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Frontend                                │
│                Next.js 16 (App Router) + Tailwind               │
│              Hosted on Vercel / AWS Amplify                      │
└──────────┬───────────────────────────────────────┬──────────────┘
           │                                       │
           ▼                                       ▼
┌─────────────────────┐               ┌────────────────────────┐
│   Amazon Cognito    │               │   Next.js API Routes   │
│   (Authentication)  │               │   (Server Functions)   │
│   • Student Pool    │               └──────────┬─────────────┘
│   • Mgmt Pool       │                          │
└─────────────────────┘                          │
                                  ┌──────────────┼──────────────┐
                                  │              │              │
                                  ▼              ▼              ▼
                     ┌─────────────────┐  ┌──────────┐  ┌─────────────────┐
                     │  Amazon S3      │  │ Rekognition│  │ Amazon Transcribe│
                     │  (Images/Audio) │  │ Moderation │  │ Voice → Text    │
                     └────────┬────────┘  └────┬─────┘  └────────┬────────┘
                              │               │                   │
                              └───────────────┴───────────────────┘
                                              │
                                             ▼
                              ┌──────────────────────────┐
                              │   AWS Step Functions      │
                              │   (Ticket Orchestration)  │
                              │                           │
                              │  ┌─────────┐ ┌─────────┐ │
                              │  │ URGENT  │ │ NORMAL  │ │
                              │  │ branch  │ │ branch  │ │
                              │  └────┬────┘ └────┬────┘ │
                              └───────┼────────────┼──────┘
                                      │            │
                              ┌───────▼──┐  ┌──────▼───────────────┐
                              │Amazon SNS│  │    Amazon Bedrock     │
                              │Emergency │  │  (Claude AI Engine)  │
                              │SMS Warden│  │  • Classify          │
                              └──────────┘  │  • Prioritize        │
                                            │  • Detect Dupes      │
                                            │  • Match L&F Items   │
                                            │  • Help Agent Chat   │
                                            └──────────┬───────────┘
                                                       │
                                                       ▼
                                         ┌─────────────────────────┐
                                         │   Amazon Translate       │
                                         │  EN ↔ Regional Language  │
                                         └──────────┬──────────────┘
                                                    │
                                                    ▼
                                         ┌─────────────────────────┐
                                         │   Amazon DynamoDB        │
                                         │   • fixmydorm-complaints │
                                         │   • fixmydorm-wall       │
                                         │   • fixmydorm-lost-found │
                                         │   • fixmydorm-leave-reqs │
                                         └─────────────────────────┘
```

---

## ☁️ AWS Implementation Map

| Feature | AWS Service | How It's Used |
|---------|-------------|---------------|
| Authentication | **Amazon Cognito** | Email-based sign-up/sign-in, student & management groups |
| Image & Audio Storage | **Amazon S3** | Presigned URLs for direct uploads; trigger moderation on upload |
| Complaint AI | **Amazon Bedrock** (Claude) | Classify category, assign priority, detect duplicates |
| **Image Moderation** | **Amazon Rekognition** | Scan S3 uploads on The Wall for explicit content; verify complaint photos match descriptions |
| **Voice-to-Ticket** | **Amazon Transcribe** | Convert student voice recordings to text → feed transcript to Bedrock for classification |
| **Multilingual** | **Amazon Translate** | Auto-translate complaints EN→regional for staff; translate resolution notes back to student language |
| **Smart Escalation** | **AWS Step Functions** | Orchestrate ticket routing: urgent branch → SNS alert; standard branch → DynamoDB triage |
| **Emergency Alerts** | **Amazon SNS** | Send SMS to hostel warden when Bedrock flags a complaint as "critical/urgent" |
| Database | **Amazon DynamoDB** | All tables with PAY_PER_REQUEST billing |
| AI Chat | **Amazon Bedrock** (Claude) | Conversational help agent with hostel context |

---

## 🔄 User & Development Flow

### Student Complaint Flow

```
Student opens complaint form
         │
         ├── [Text input] → submitted as-is
         │
         └── [Voice input] ──► Amazon Transcribe ──► transcript text
                                                           │
                                                           ▼
                                              [Optional image upload]
                                                           │
                                                           ▼
                                              Amazon S3 (presigned upload)
                                                           │
                                                           ▼
                                              Amazon Rekognition
                                         (verify image matches description)
                                                           │
                                                           ▼
                                              Amazon Bedrock (Claude)
                                     ┌─────────────────────────────────┐
                                     │ • Category (plumbing, electrical…) │
                                     │ • Priority (low / medium / urgent) │
                                     │ • Duplicate check                   │
                                     └──────────────┬──────────────────┘
                                                    │
                                                    ▼
                                         AWS Step Functions
                                         (ticket routing)
                                        /                \
                                   URGENT              STANDARD
                                     │                     │
                                     ▼                     ▼
                              Amazon SNS            DynamoDB triage
                          (SMS → Warden)            queue (normal flow)
```

### Management Flow

```
Management Dashboard loads
         │
         ▼
DynamoDB complaint fetch
         │
         ▼
Amazon Translate (EN → Regional Language for maintenance staff)
         │
         ▼
Staff reviews, updates resolution notes
         │
         ▼
Amazon Translate (Regional → Student's preferred language)
         │
         ▼
Student notified with translated resolution
```

### The Wall Image Flow

```
Student uploads image to The Wall
         │
         ▼
Amazon S3 (upload via presigned URL)
         │
         ▼
Amazon Rekognition (content moderation scan)
         │
    ┌────┴────┐
  SAFE     UNSAFE
    │          │
    ▼          ▼
 Post goes  Blocked —
  live      user notified
```

---

## 📅 Development Phases

### Phase 0 – Project Scaffolding ✅
- [x] Initialize Next.js + TypeScript + Tailwind project
- [x] Set up folder structure
- [x] Create README, .gitignore, environment template
- [x] Define TypeScript types for all features

### Phase 1 – Authentication & Layout ✅
- [x] Set up Amazon Cognito (email-based User Pool + public App Client)
- [x] Implement sign-up / sign-in / sign-out / verify flows
- [x] Create user groups: `students` and `management`
- [x] Build shared layout (navbar, sidebar, footer)
- [x] Protected routes based on user role

### Phase 2 – Complaint System ✅
- [x] Complaint submission form (text + image upload to S3)
- [x] API routes for CRUD operations
- [x] DynamoDB table: `fixmydorm-complaints` (PK: id, GSI: studentId-index, status-index)
- [x] AI categorization & priority via Bedrock
- [x] Duplicate detection via Bedrock
- [x] Student complaint tracker view

### Phase 3 – Management Dashboard ✅
- [x] Dashboard with complaint overview & stats cards
- [x] Filter by category / priority / status / search
- [x] Assign complaints to staff
- [x] Update status & respond to students

### Phase 4 – The Wall ✅
- [x] Anonymous post submission
- [x] Upvote & "Affected Too" functionality
- [x] Official management responses
- [ ] **Amazon Rekognition** image moderation on upload *(roadmap)*

### Phase 5 – Lost & Found ✅
- [x] Report lost / found items with photos
- [x] Filter by type (lost/found/all) + search
- [ ] **Amazon Rekognition** photo-description verification *(roadmap)*

### Phase 6 – Early Leave / Late Entry ✅
- [x] Request submission form (early leave / late entry)
- [x] Status tracking for students
- [ ] Approval workflow for management *(roadmap)*

### Phase 7 – Mess Menu & Ratings ✅
- [x] Daily menu display (breakfast, lunch, snacks, dinner)
- [x] Meal rating & feedback

### Phase 8 – AI Help Agent ✅
- [x] In-app chatbot UI with message history
- [x] Bedrock-powered conversational agent
- [x] Keyword fallback when Bedrock unavailable

### Phase 9 – Voice-to-Ticket *(Roadmap)*
- [ ] Voice recorder UI component in complaint form
- [ ] Audio upload to S3
- [ ] **Amazon Transcribe** job triggered on upload
- [ ] Transcript fed into existing Bedrock classification pipeline

### Phase 10 – Multilingual Dashboards *(Roadmap)*
- [ ] Language preference setting in user profile
- [ ] **Amazon Translate** on complaint fetch for management view
- [ ] **Amazon Translate** on resolution notes before delivery to student
- [ ] Language selector in UI

### Phase 11 – Smart Escalation *(Roadmap)*
- [ ] **AWS Step Functions** state machine for ticket routing
- [ ] Urgent branch: trigger **Amazon SNS** SMS to warden
- [ ] Standard branch: normal DynamoDB triage queue
- [ ] Integrate Step Functions invocation into complaint creation API

### Phase 12 – Image Moderation *(Roadmap)*
- [ ] **Amazon Rekognition** on S3 upload trigger for Wall posts
- [ ] Block explicit content before display
- [ ] Rekognition label matching for complaint photo verification

### Phase 13 – Polish & Scale
- [ ] Performance optimization & code splitting
- [ ] Mobile responsiveness audit
- [ ] CI/CD pipeline (GitHub Actions → Vercel)
- [ ] Final testing & bug fixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **AWS Account** (eu-north-1)

### Installation

```bash
# Clone the repository
git clone https://github.com/alishakarmele/fixmydorm.git
cd fixmydorm

# Install dependencies
npm install

# Add private AWS credentials (public Cognito vars already in .env)
cp .env.example .env.local
# Edit .env.local with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_AWS_REGION` | ✅ | `eu-north-1` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | ✅ | Cognito User Pool ID |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | ✅ | Cognito App Client ID (no secret) |
| `AWS_ACCESS_KEY_ID` | ✅ Server | IAM access key (server-side only) |
| `AWS_SECRET_ACCESS_KEY` | ✅ Server | IAM secret key (server-side only) |
| `DYNAMODB_TABLE_COMPLAINTS` | ✅ | `fixmydorm-complaints` |
| `DYNAMODB_TABLE_WALL` | ✅ | `fixmydorm-wall` |
| `DYNAMODB_TABLE_LOST_FOUND` | ✅ | `fixmydorm-lost-found` |
| `DYNAMODB_TABLE_LEAVE` | ✅ | `fixmydorm-leave-requests` |
| `NEXT_PUBLIC_S3_BUCKET` | ✅ | `fixmydorm-uploads` |
| `BEDROCK_MODEL_ID` | optional | Claude model ID |

> `NEXT_PUBLIC_*` Cognito vars are committed in `.env` — no setup needed for auth on any machine.

### Available Scripts

| Command         | Description               |
| --------------- | ------------------------- |
| `npm run dev`   | Start development server  |
| `npm run build` | Build for production      |
| `npm run start` | Start production server   |
| `npm run lint`  | Run ESLint                |

---

## 📁 Project Structure

```
fixmydorm/
├── app/
│   ├── (protected)/            # Auth-gated pages
│   │   ├── dashboard/          # Student dashboard
│   │   ├── complaints/         # Complaint list, new, detail
│   │   ├── management/         # Management dashboard & complaint management
│   │   ├── wall/               # Anonymous grievance board
│   │   ├── lost-found/         # Lost & Found
│   │   ├── leave-requests/     # Early leave / late entry
│   │   ├── mess-menu/          # Daily mess menu
│   │   └── ai-help/            # AI chatbot
│   ├── api/                    # Next.js API routes
│   │   ├── complaints/         # Complaint CRUD
│   │   ├── wall/               # Wall posts + actions
│   │   ├── lost-found/         # Lost & Found CRUD
│   │   ├── leave-requests/     # Leave request CRUD
│   │   ├── upload/             # S3 presigned URL generation
│   │   └── chat/               # Bedrock AI chat
│   ├── auth/                   # Login, signup, verify pages
│   ├── globals.css             # Olive/cream/peach design system
│   └── page.tsx                # Landing page
├── components/
│   ├── complaints/             # Complaint-specific components
│   └── layout/                 # Navbar, sidebar, footer
├── lib/
│   ├── aws/                    # AWS SDK wrappers
│   │   ├── dynamodb.ts         # DynamoDB helpers
│   │   ├── s3.ts               # S3 presigned URLs
│   │   └── bedrock.ts          # Bedrock AI client
│   ├── auth/                   # Amplify config & auth context
│   └── constants.ts            # App-wide constants
├── scripts/
│   └── aws-setup.sh            # One-shot AWS resource creation
├── types/index.ts              # All TypeScript types
├── .env                        # Public Cognito vars (committed)
├── .env.local                  # Private AWS keys (gitignored)
└── vercel.json                 # Vercel deployment config
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
