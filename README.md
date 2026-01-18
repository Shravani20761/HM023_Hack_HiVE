# HackMatrix (HackHive) 🚀

**A Comprehensive Campaign & Content Management System for Modern Creators.**

HackMatrix is a powerful, full-stack web application designed to streamline the entire content lifecycle—from campaign planning and team collaboration to content creation, publishing, and analytics. Built with a focus on automation and Role-Based Access Control (RBAC), it empowers teams to manage their digital presence efficiently across platforms like YouTube.

---

## 🌟 Key Features (What You Can Do Now)

### 1. 📊 Advanced Campaign Management
- **Create & Track Campaigns:** Organize marketing efforts into distinct campaigns.
- **Team Collaboration:** Assign roles and manage team members within specific campaigns.

### 2. 🔐 Role-Based Access Control (RBAC)
- **Granular Permissions:** Secure access with tailored roles:
  - **System Admin:** Full platform control.
  - **Campaign Manager:** Manages specific campaigns and teams.
  - **Content Creator:** Drafts and edits content.
  - **Reviewer:** Approves or rejects content before publishing.

### 3. 📝 End-to-End Content Workflow
- **Lifecycle Management:** Move content through stages: `Draft` -> `Review` -> `Approved` -> `Published`.
- **Feedback Loops:** internal commenting and feedback systems to refine content.
- **Version History:** Track changes and revert to previous versions if needed.

### 4. 🤖 AI-Powered Marketing Studio
We are building a comprehensive AI layer to assist every role in the marketing team.

#### **Available Now (Current Implementation)**
These tools are fully functional and integrated into the workflow:
- **AI Script Writer:** Generates engaging video scripts based on campaign context and prompts.
- **AI Caption Helper:** Creates platform-optimized captions (Instagram, YouTube, etc.) from content drafts.
- **AI Sentiment Analysis:** Automatically analyzes audience feedback to detect positive, negative, or neutral sentiment.

#### **Coming Next (Future Roadmap)**
Based on our detailed [Functional Specification](ai_powered_marketing_studio_functional_specification_detailed%20(2).md), we are adding specialized tools for each role:
- **Admin:** *AI Campaign Planner* (Goals to Themes), *Workload Analyzer* (Bottleneck detection).
- **Creator:** *AI Research Assistant* (Trend/Keyword analysis).
- **Editor:** *Subtitle Generator*, *Thumbnail Generator*, *Quality Checker*.
- **Marketer:** *Best-Time Scheduler*, *AI Email Generator* (HTML emails), *Tone Adapter*.
- **Manager:** *Trend Detector*, *Auto-Reply Assistant*.

### 5. 📹 YouTube Integration (Deep Integration)
> [!NOTE]
> **Deployment Note:** For security reasons, the YouTube integration features are **not available in the public deployed link**. They are fully functional when running the application locally with your own API credentials.

**How we implemented it:**
We utilized **Google's OAuth 2.0** for secure, user-centric authentication, ensuring that the application only accesses what the user permits. The backend leverages the **YouTube Data API v3** to perform actions on behalf of the user. Token management (handling access and refresh tokens) is securely coupled with our **Appwrite** backend, ensuring that connections persist even when the user is offline.

- **Channel Management:** Link and manage YouTube channels directly.
- **Video Management:** Upload, update, and manage videos.
- **Scheduling:** Schedule video uploads for optimal times.
- **Analytics:** View detailed metrics (Views, Likes, Comments) within the dashboard.

### 6. 🗂️ Asset Management
- **Centralized Library:** Store and organize images and media files using **ImageKit**.
- **Link & Unlink:** Easily attach assets to specific content pieces.

---

## 🛠️ Technology Stack

We selected this stack to ensure scalability, performance, and a seamless developer experience:

### Backend 🔙
- **Node.js & Express.js:** Provides a robust, non-blocking runtime for high-performance APIs.
- **PostgreSQL (`pg`):** A reliable, relational database for structured data (users, campaigns, content) and complex queries.
- **Appwrite:** Handles secure authentication and backend services, accelerating development.
- **Google APIs:** Enables deep integration with YouTube for channel and video management.
- **OpenAI API:** Powers the intelligent content generation and analysis features.
- **Middleware:**
  - `cors`, `cookie-parser`: Secure request handling.
  - `dotenv`: Environment variable management.

### Frontend 🖥️
- **React 19:** The latest version of the library for building dynamic, responsive user interfaces.
- **Vite:** Next-generation build tool for lightning-fast development and optimized production builds.
- **Tailwind CSS:** Utility-first framework for rapid, distinct, and modern UI capabilities.
- **React Router v7:** Robust client-side routing.
- **Axios:** efficient HTTP client for API communication.
- **Appwrite SDK:** Client-side integration for authentication and database interactions.

---

## 🚀 Future Aspects (Roadmap)

To further empower creators, we are planning the following integrations:

### 📸 Instagram & WhatsApp Integration (Future)
We aim to expand our "Direct Integration" philosophy to other major platforms.
- **Instagram:** Replicating our YouTube success with OAuth integration for managing Posts, Reels, and Analytics directly from our dashboard.
- **WhatsApp:** Utilizing the Meta API to enable direct content distribution to broadcast lists and community groups.

### 📧 Email Marketing Integration (SendGrid)
We will integrate the **SendGrid Framework** to automate communication and marketing.
- **Workflow Notifications:** Automatically notify team members when content status changes (e.g., "Ready for Review", "Needs Edits").
- **Marketing Blasts:** Send newsletters and campaign updates directly to your mailing list.

---

## 🔮 Vision: The Providing Strong Foundation

**HackMatrix is not just a tool; it's a foundation.**

We have built a robust, scalable architecture for managing content, campaigns, and teams. By solving the core problems of **structured data management** and **workflow automation**, we have laid the groundwork for the next evolution: **Autonomous AI Agents**.

With this strong foundation, our future AI assistants won't just generate text; they will have the power to **act**. Imagine an AI that drafts a script, creates the video assets, schedules the YouTube upload, and posts the Instagram teaser—all autonomously, built upon the solid direct integrations we have established today.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Appwrite Instance
- Google Cloud Project (for YouTube APIs)
- OpenAI API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/hackmatrix.git
    cd hackmatrix
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file with your credentials (PORT, DB_URL, APPWRITE_PROJECT_ID, etc.)
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---
*Built with ❤️ by the HackHive Team*
