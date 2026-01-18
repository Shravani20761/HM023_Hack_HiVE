# YouTube Content Management – Fullstack Build Prompt

## 1. Objective
Build a full-featured **YouTube Content Management module** inside an existing web platform that already has authentication, frontend, and backend in place. The system should allow users to connect their YouTube channel securely and manage their content directly from the platform.

The module must support:
- Secure YouTube OAuth connection
- Channel verification
- Video listing and metadata management
- Video upload
- Analytics dashboard
- Token lifecycle management
- Production‑grade error handling and UX feedback

This document acts as a **single source prompt** for frontend, backend, and infrastructure requirements.

---

## 2. Tech Stack Assumptions

### Frontend
- React (Vite or CRA)
- TailwindCSS
- State management (Context / Redux / Zustand)
- Axios or Fetch API

### Backend
- Node.js
- Express / Fastify
- MongoDB (token + user mapping)
- Google APIs SDK

### Infrastructure
- HTTPS enabled
- Environment‑based configuration
- Background job support (cron / queue)

---

## 3. Functional Scope Overview

### User Capabilities
- Connect / Disconnect YouTube account
- View connected channel details
- List uploaded videos
- Edit video title, description, tags
- Upload new videos
- View analytics and performance metrics

### System Capabilities
- OAuth token exchange & refresh
- Secure token storage
- Quota‑aware API calls
- Graceful error recovery

---

## 4. Frontend Requirements

### 4.1 YouTube Connection Flow

**Page / Component:** `ConnectYouTube`

#### UI Behavior
- Primary CTA: **"Connect YouTube"**
- Redirect user to backend OAuth endpoint
- Display connection status (Connected / Not Connected)
- Show channel name and thumbnail after success

#### UX Requirements
- Tab‑friendly navigation
- Loader during redirect and callback validation
- Toast on success / failure
- Error modal for OAuth rejection
- Microinteraction animation on successful connection confirmation

---

### 4.2 Channel Overview Dashboard

**Page:** `YouTubeDashboard`

#### Data Display
- Channel name
- Subscriber count
- Total views
- Total videos

#### UX Requirements
- Skeleton loaders for stats
- Auto refresh button with subtle animation
- Error toast on API failure

---

### 4.3 Video Management

**Page:** `VideoManager`

#### Features
- Paginated video list
- Thumbnail, title, privacy status
- Edit metadata inline or via modal
- Save changes via backend

#### UX Requirements
- Editable fields with focus microinteractions
- Loader per row update
- Success toast on save
- Error modal on failed update
- Keyboard navigation for all editable fields

---

### 4.4 Video Upload

**Page:** `UploadVideo`

#### Features
- File picker (mp4, mov)
- Title, description, tags
- Privacy selection

#### UX Requirements
- Progress bar upload indicator
- Disable submit until valid
- Animated success state on completion
- Toast notification when upload finishes
- Error modal for quota or network issues

---

### 4.5 Analytics Dashboard

**Page:** `YouTubeAnalytics`

#### Metrics
- Views
- Watch time
- Average view duration
- CTR

#### UX Requirements
- Chart loaders
- Smooth transitions between date ranges
- Tooltip microinteractions
- Error fallback UI

---

## 5. Backend Requirements

### 5.1 OAuth Integration

#### Endpoints
- `GET /auth/youtube`
- `GET /auth/youtube/callback`

#### Responsibilities
- Generate Google OAuth URL
- Handle callback code exchange
- Store access + refresh tokens
- Associate channel ID with platform user

---

### 5.2 Token Management Service

#### Responsibilities
- Detect token expiry
- Auto refresh access token
- Handle revoked access
- Fail gracefully and notify frontend

---

### 5.3 YouTube API Proxy Layer

#### Endpoints
- `GET /youtube/channel`
- `GET /youtube/videos`
- `PUT /youtube/video/:id`
- `POST /youtube/upload`
- `GET /youtube/analytics`

#### Responsibilities
- Centralize YouTube API calls
- Enforce quota usage tracking
- Normalize API responses

---

### 5.4 Database Schema

#### User Collection
```json
{
  "_id": "...",
  "email": "...",
  "youtube": {
    "channelId": "UCxxx",
    "accessToken": "encrypted",
    "refreshToken": "encrypted",
    "expiry": "timestamp",
    "connectedAt": "timestamp"
  }
}
```

---

## 6. Security & Compliance Requirements

- HTTPS only OAuth redirects
- Encrypt tokens at rest
- Never expose tokens to frontend
- Allow user to disconnect YouTube
- Remove tokens on disconnect
- Follow Google API User Data Policy

---

## 7. Error Handling Strategy

### Common Errors
- Token expired
- Insufficient permissions
- Quota exceeded
- Network failure

### Handling Rules
- Auto retry refreshable errors
- User‑friendly error messages
- Log raw errors internally
- Display non‑technical messages in UI

---

## 8. Background Jobs

### Jobs
- Daily analytics sync
- Token validation check
- Quota usage monitoring

---

## 9. Environment Variables

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
YOUTUBE_API_KEY=
```

---

## 10. Future Enhancements (Non‑Blocking)

- AI‑based title & description suggestions
- Best upload time recommendations
- Shorts detection and clipping
- Competitor benchmarking

---

## 11. Definition of Done

- User can fully manage YouTube content without leaving platform
- OAuth flow is secure and stable
- UI is responsive, accessible, and feedback‑rich
- System survives token expiry and quota limits
- Code is production‑ready and extensible

