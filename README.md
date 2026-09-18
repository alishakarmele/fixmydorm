# 🏠 FixMyDorm

> **AI-powered hostel grievance, maintenance & daily-life platform for college students in India.**

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Powered-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![Hackathon](https://img.shields.io/badge/WeMakeDevs-AWS%20First%20Commit-purple)](https://wemakedevs.org/)

---

## 📋 Problem Statement

Student hostel complaints are currently scattered across WhatsApp groups, paper registers, and verbal requests — leading to:

- **Lost complaints** that never get addressed
- **No accountability** for resolution timelines
- **Duplicate submissions** wasting management bandwidth
- **Zero transparency** for students on complaint status
- **No data** for identifying systemic issues

**FixMyDorm** solves this by providing a single, AI-powered platform where students can submit, track, and escalate complaints while management gets a prioritized, organized dashboard.

---

## ✨ Features

### 🎫 Smart Complaint System
- Submit complaints with text + image attachments
- **AI-powered** automatic categorization & priority assignment
- **Duplicate detection** to prevent redundant tickets
- Real-time status tracking from submission to resolution

### 📊 Management Dashboard
- Central view of all complaints, filterable by category, priority, hostel, and status
- Assign complaints to staff members
- Update status and respond directly to students

### 🧱 The Wall – Anonymous Grievance Board
- Post grievances anonymously
- Upvote issues and mark "Affected Too"
- Official management responses on public posts
- AI-powered content moderation

### 📦 Lost & Found
- Report lost or found items with photos
- **AI-powered matching** between lost and found entries
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
- Powered by Amazon Bedrock

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| **Frontend** | Next.js 16 (App Router) + TypeScript    |
| **Styling**  | Tailwind CSS v4 + shadcn/ui            |
| **Auth**     | Amazon Cognito (student & management)   |
| **Hosting**  | AWS Amplify Hosting                     |
| **API**      | Amazon API Gateway + AWS Lambda         |
| **Database** | Amazon DynamoDB                         |
| **Storage**  | Amazon S3 (image uploads)               |
| **AI/ML**    | Amazon Bedrock (classification, matching, moderation, chatbot) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│              Next.js (App Router) + Tailwind                │
│              Hosted on AWS Amplify                          │
└─────────────┬─────────────────────────────┬─────────────────┘
              │                             │
              ▼                             ▼
┌─────────────────────┐       ┌─────────────────────────┐
│   Amazon Cognito    │       │   Amazon API Gateway    │
│   (Authentication)  │       │   (REST API)            │
│   • Student Pool    │       └──────────┬──────────────┘
│   • Mgmt Pool       │                  │
└─────────────────────┘                  ▼
                              ┌─────────────────────────┐
                              │   AWS Lambda Functions   │
                              │   (Node.js/TypeScript)   │
                              └──┬──────────┬───────────┘
                                 │          │
                    ┌────────────┘          └────────────┐
                    ▼                                    ▼
        ┌─────────────────────┐             ┌───────────────────┐
        │   Amazon DynamoDB   │             │   Amazon Bedrock  │
        │   (Database)        │             │   (AI Services)   │
        │   • Complaints      │             │   • Categorize    │
        │   • Users           │             │   • Prioritize    │
        │   • Wall Posts      │             │   • Detect Dupes  │
        │   • Lost & Found    │             │   • Match Items   │
        │   • Leave Requests  │             │   • Moderate      │
        │   • Mess Menus      │             │   • Help Agent    │
        └─────────────────────┘             └───────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Amazon S3         │
        │   (Image Storage)   │
        └─────────────────────┘
```

---

## 📅 Development Phases

### Phase 0 – Project Scaffolding ✅
- [x] Initialize Next.js + TypeScript + Tailwind project
- [x] Set up folder structure (`app/`, `components/`, `lib/`, `types/`, `public/`)
- [x] Create README, .gitignore, environment template
- [x] Define TypeScript types for all features
- [x] Verify `npm run dev` works

### Phase 1 – Authentication & Layout
- [ ] Set up Amazon Cognito (User Pool + App Client)
- [ ] Implement sign-up / sign-in / sign-out flows
- [ ] Create two user groups: `students` and `management`
- [ ] Build shared layout (navbar, sidebar, footer)
- [ ] Protected routes based on user role
- [ ] Set up shadcn/ui component library

### Phase 2 – Complaint System
- [ ] Complaint submission form (text + image upload to S3)
- [ ] API Gateway + Lambda for CRUD operations
- [ ] DynamoDB table design for complaints
- [ ] AI categorization & priority via Bedrock
- [ ] Duplicate detection via Bedrock
- [ ] Student complaint tracker view

### Phase 3 – Management Dashboard
- [ ] Dashboard with complaint overview & stats
- [ ] Filter by category / priority / hostel / status
- [ ] Assign complaints to staff
- [ ] Update status & respond to students
- [ ] Analytics charts

### Phase 4 – The Wall
- [ ] Anonymous post submission
- [ ] Upvote & "Affected Too" functionality
- [ ] AI content moderation via Bedrock
- [ ] Official management responses

### Phase 5 – Lost & Found
- [ ] Report lost / found items with photos
- [ ] AI-powered matching via Bedrock
- [ ] Claim flow with verification

### Phase 6 – Early Leave / Late Entry
- [ ] Request submission form
- [ ] Approval workflow for management
- [ ] Status tracking for students

### Phase 7 – Mess Menu & Ratings
- [ ] Daily / weekly menu display
- [ ] Meal rating & feedback system

### Phase 8 – AI Help Agent
- [ ] In-app chatbot UI
- [ ] Bedrock-powered conversational agent
- [ ] Hostel FAQ knowledge base

### Phase 9 – Polish & Deploy
- [ ] AWS Amplify Hosting deployment
- [ ] Performance optimization
- [ ] Mobile responsiveness audit
- [ ] Final testing & bug fixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **AWS Account** (for Phases 1+)

### Installation

```bash
# Clone the repository
git clone https://github.com/alishakarmele/fixmydorm.git
cd fixmydorm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your AWS credentials (required from Phase 1 onwards)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start development server       |
| `npm run build` | Build for production            |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

---

## 📁 Project Structure

```
fixmydorm/
├── app/                    # Next.js App Router pages & layouts
│   ├── globals.css         # Global styles (Tailwind v4)
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Landing page
├── components/             # Reusable React components
│   └── ui/                 # shadcn/ui components (added in Phase 1)
├── lib/                    # Shared utilities & configuration
│   ├── constants.ts        # App-wide constants & config
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript type definitions
│   └── index.ts            # All shared types
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration (if needed)
├── postcss.config.mjs      # PostCSS configuration
└── package.json            # Dependencies & scripts
```

---

## 👥 Team

Built for the **WeMakeDevs AWS First Commit Hackathon** (Ship It track).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
