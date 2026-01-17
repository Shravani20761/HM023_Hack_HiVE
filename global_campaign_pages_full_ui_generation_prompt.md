# Antigravity Prompt – Global & Campaign Pages (RBAC-Aware UI)

## Objective
Generate **all required UI pages** for a campaign-centric marketing platform.

The output must allow **multiple frontend developers to work independently**, while strictly respecting **backend-driven RBAC**.

⚠️ **Important Constraints**
- Use **React with plain JavaScript only** (NO TypeScript)
- Authentication is handled via **Appwrite**
- RBAC decisions come ONLY from backend APIs
- Frontend must never hardcode roles

---

## Core RBAC Rule (MANDATORY)

> Pages are accessible, but **features inside pages are permission-gated**.

Frontend must:
1. Call capability APIs
2. Render UI conditionally
3. Disable (not hide) restricted actions
4. Rely on backend for final enforcement

---

## Capability APIs

### System-Level Capabilities
```
GET /api/system/capabilities
```
```json
{
  "canCreateCampaign": true,
  "canManageIntegrations": false
}
```

### Campaign-Level Capabilities
```
GET /api/campaigns/:id/capabilities
```
```json
{
  "canCreateContent": true,
  "canEditContent": false,
  "canPublish": false,
  "canViewAnalytics": true,
  "canAssignRoles": false
}
```

---

# GLOBAL PAGES (Non-Campaign Scoped)

---

## 1. Main Dashboard (`/dashboard`)

### Purpose
High-level overview of work and campaigns.

### Features
- List of campaigns user is part of
- Role badge per campaign
- Pending tasks count
- Analytics summary (if permitted)

### RBAC
- Analytics widgets only if `canViewAnalytics === true`

### APIs
```
GET /api/dashboard
```

### UX Requirements
- Page loader
- Empty state
- Keyboard navigation
- Hover microinteractions

---

## 2. Campaign List (`/campaigns`)

### Purpose
List all campaigns accessible to the user.

### Features
- Campaign name
- Status
- User role
- Search & filter

### RBAC
- Everyone can view
- Create button only if `canCreateCampaign === true`

### APIs
```
GET /api/campaigns
```

---

## 3. Create Campaign (`/campaigns/create`)

### Purpose
Create a campaign and assign initial roles.

### Features
- Campaign metadata form
- Team role assignment
- Validation

### RBAC
- Accessible only if `canCreateCampaign === true`

### APIs
```
POST /api/campaigns
```

---

## 4. Settings / Integrations (`/settings/integrations`)

### Purpose
Manage platform connections (Instagram, Facebook, YouTube, Email).

### Features
- Connect/disconnect accounts
- Token health status
- Platform list

### RBAC
- Only system admins

### APIs
```
GET /api/integrations
POST /api/integrations/connect
```

---

# CAMPAIGN-SCOPED PAGES (Core)

---

## 5. Campaign Overview (`/campaigns/:id`)

### Purpose
Central navigation & campaign summary.

### Features
- Campaign details
- Timeline summary
- Navigation tabs

### RBAC
- Read-only for all roles
- Edit metadata only if admin

### APIs
```
GET /api/campaigns/:id
```

---

## 6. Content Workflow (`/campaigns/:id/content`)

### Purpose
End-to-end content lifecycle management.

### Features
- Content list
- Upload raw content
- Edit content
- Approve / reject

### RBAC
- Upload: `canCreateContent`
- Edit: `canEditContent`
- Approve: `canPublish`

### APIs
```
GET /api/campaigns/:id/content
POST /api/content
PUT /api/content/:id
```

---

## 7. Asset Manager (`/campaigns/:id/assets`)

### Purpose
Centralized asset library.

### Features
- Upload assets
- Tag assets
- Reuse assets

### RBAC
- Upload: creator/editor/admin
- Delete: admin only

### APIs
```
GET /api/assets
POST /api/assets
```

---

## 8. Scheduler & Publishing (`/campaigns/:id/schedule`)

### Purpose
Schedule & publish content.

### Features
- Calendar view
- Platform selector
- Publish logs

### RBAC
- Schedule & publish: `canPublish`

### APIs
```
POST /api/schedule
GET /api/schedule
```

---

## 9. Feedback Inbox (`/campaigns/:id/feedback`)

### Purpose
Unified audience feedback management.

### Features
- Comment list
- Reply
- Moderate
- Sentiment badge

### RBAC
- View: `canViewFeedback`
- Reply: marketer/admin

### APIs
```
GET /api/feedback
POST /api/feedback/reply
```

---

## 10. Analytics & Insights (`/campaigns/:id/analytics`)

### Purpose
Performance analysis & trends.

### Features
- Metrics dashboard
- Platform comparison
- AI insights

### RBAC
- View only if `canViewAnalytics === true`

### APIs
```
GET /api/analytics
```

---

## 11. Campaign Team / RBAC (`/campaigns/:id/team`)

### Purpose
Manage campaign team & roles.

### Features
- User list
- Role assignment
- Remove users

### RBAC
- Access only if `canAssignRoles === true`

### APIs
```
GET /api/campaigns/:id/team
POST /api/campaigns/:id/assign-role
```

---

## UI / UX GLOBAL REQUIREMENTS (MANDATORY)

- Fully **tab-friendly**
- Page-level and action-level loaders
- Toasts for success & error
- Inline validation messages
- Disabled states with tooltips
- Microinteractions for final actions

---

## Development Rules

- One page = one frontend ticket
- Use backend capabilities for RBAC
- Never trust frontend-only checks
- Keep pages self-contained

---

### END OF ANTIGRAVITY PROMPT

