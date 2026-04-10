# AssignHub Tech Stack Overview

This file is a quick reference for:

- what tech stack this project uses
- how data moves through the app
- what each major folder does
- what libraries and dependencies are installed
- which packages appear to be present but are not central to the current flow

## 1. Project Type

This project is a MERN-style application:

- MongoDB for data storage
- Express for the backend API
- React for the frontend UI
- Node.js as the runtime for the backend

It is structured as a small monorepo using npm workspaces:

- root workspace: manages `frontend` and `backend`
- `frontend/`: React client
- `backend/`: Express API server

## 2. High-Level Architecture

The app has two main sides:

### Frontend

- Built with React
- Runs with Create React App (`react-scripts`)
- Uses `axios` to call backend API routes
- Stores auth token and user data in `localStorage`
- Uses React Router for page navigation

### Backend

- Built with Express
- Connects to MongoDB through Mongoose
- Exposes REST API routes under `/api/*`
- Handles auth, assignments, users, wallets, password reset, and marketplace data
- Uses JWT tokens for authenticated requests

### Database

- MongoDB stores users, assignments, applications, messages, bids, reviews, and transactions

## 3. Folder Responsibility

### Root

- `package.json`
  Purpose: npm workspace config for frontend and backend

- `README.md`
  Purpose: setup and run instructions

- `TECH_STACK_OVERVIEW.md`
  Purpose: this architecture and dependency guide

### Frontend

- `frontend/src/pages`
  Route-level screens like login, register, marketplace, dashboards, profile, wallet

- `frontend/src/components`
  Shared visual components like navigation, hero sections, footer, landing sections

- `frontend/src/services`
  API access layer used by pages and components

- `frontend/src/styles`
  CSS files for pages and components

### Backend

- `backend/config`
  Database and third-party service configuration

- `backend/routes`
  Express route definitions

- `backend/controllers`
  Request handlers and business logic

- `backend/models`
  Mongoose schemas and data models

- `backend/services`
  External integration logic, such as Adzuna marketplace fetch logic

- `backend/middleware`
  Reusable request middleware like auth and async error handling

- `backend/utils`
  Helper functions like token creation and email sending

## 4. How Data Flows Through The App

## Frontend Request Flow

1. A user opens a page such as marketplace, login, or profile.
2. A React page calls a frontend service from `frontend/src/services`.
3. That service uses the shared `axios` instance from `frontend/src/services/api.js`.
4. If a token exists in `localStorage`, the API client adds `Authorization: Bearer <token>`.
5. The request goes to the backend route, usually under `/api/...`.
6. The backend controller reads or updates MongoDB using Mongoose models.
7. The backend returns JSON.
8. The frontend stores or renders the response.

## Auth Flow

Current auth storage behavior:

- token is stored in `localStorage`
- user data is stored in `localStorage`
- `api.js` attaches the token to protected requests
- if a protected request returns `401`, the client clears stored auth and redirects to `/login`

Backend auth flow:

1. User submits email and password.
2. `POST /api/auth/login` checks MongoDB for the user.
3. Password is compared using `bcryptjs`.
4. On success, the backend returns a JWT token and user payload.
5. Frontend stores token and user locally.

Files involved:

- `frontend/src/pages/Login.jsx`
- `frontend/src/services/auth.js`
- `frontend/src/services/api.js`
- `backend/routes/auth.js`
- `backend/controllers/authController.js`
- `backend/middleware/auth.js`
- `backend/models/User.js`

## Marketplace Data Flow

The marketplace page can show:

- local assignments from MongoDB
- optional external Adzuna jobs

Flow:

1. `frontend/src/pages/Marketplace.jsx` loads marketplace data.
2. It calls:
   - `getAssignments()`
   - `getAdzunaMarketplaceAssignments()`
3. Backend route `/api/assignments` returns MongoDB assignments.
4. Backend route `/api/assignments/external/adzuna` optionally returns external jobs.
5. Frontend merges and filters those results before rendering.

Files involved:

- `frontend/src/pages/Marketplace.jsx`
- `frontend/src/services/assignments.js`
- `backend/routes/assignments.js`
- `backend/controllers/assignmentController.js`
- `backend/services/adzunaMarketplaceService.js`
- `backend/models/Assignment.js`

## Profile Data Flow

1. Frontend profile page loads.
2. `getMe()` requests `/api/auth/me`.
3. Backend validates JWT.
4. Backend returns current user data from MongoDB.
5. When profile is edited, frontend sends updated fields to `/api/auth/updatedetails`.
6. Backend validates and updates the user record.

Files involved:

- `frontend/src/pages/Profile.jsx`
- `frontend/src/services/auth.js`
- `backend/controllers/authController.js`
- `backend/models/User.js`

## Posting Assignment Flow

1. User fills the post assignment form.
2. Frontend sends assignment payload to `/api/assignments`.
3. Backend builds the assignment object.
4. Backend stores poster snapshot, skills, attachments, budget, deadline, and provider id.
5. Assignment is saved to MongoDB.
6. Provider stats are incremented in the user document.

Files involved:

- `frontend/src/pages/PostAssignment.jsx`
- `frontend/src/services/assignments.js`
- `backend/controllers/assignmentController.js`
- `backend/models/Assignment.js`
- `backend/models/User.js`

## 5. Main Data Models

## User

Defined in `backend/models/User.js`

Stores:

- name
- email
- hashed password
- role: `worker` or `provider`
- avatar
- bio
- college ID
- skills
- rating and review counts
- wallet info
- worker/provider stats
- verification status
- password reset OTP fields
- login timestamps

Special model logic:

- hashes password before save
- generates JWT token
- compares passwords
- generates password reset OTP

## Assignment

Defined in `backend/models/Assignment.js`

Stores:

- title
- description
- subject
- category
- assignment type
- difficulty
- pricing type
- budget
- deadline
- skills required
- estimated time
- attachments
- poster snapshot
- provider reference
- status
- applications
- hired workers

## Other Backend Models

These exist and support additional marketplace features:

- `Application.js`
  Worker applications to assignments

- `Bid.js`
  Bidding-related records

- `Message.js`
  Messaging or chat-related data

- `Review.js`
  Ratings and review data

- `Transaction.js`
  Wallet and payment-related records

## 6. Major Backend Routes

The backend mounts these route groups in `backend/app.js`:

- `/api/auth`
- `/api/users`
- `/api/assignments`
- `/api/bids`
- `/api/messages`
- `/api/payments`
- `/api/reviews`

Important routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `PUT /api/auth/updatedetails`
- `GET /api/assignments`
- `GET /api/assignments/:id`
- `POST /api/assignments`
- `POST /api/assignments/:id/apply`
- `GET /api/assignments/external/adzuna`
- `GET /api/users/:id/wallet`
- `GET /api/users/:id/transactions`
- `POST /api/users/:id/withdraw`

## 7. Frontend Dependencies

These come from `frontend/package.json`.

## Core Frontend Libraries

- `react`
  Core UI library

- `react-dom`
  React renderer for the browser

- `react-router-dom`
  Page routing and navigation

- `react-scripts`
  Create React App build and dev tooling

- `axios`
  HTTP client for backend API requests

## State and Data Libraries

- `redux`
  Global state management library

- `@reduxjs/toolkit`
  Standard Redux tooling with simpler patterns

- `react-redux`
  React bindings for Redux

- `zustand`
  Lightweight state management library

Current note:

- the app currently relies mostly on component state and service calls
- Redux and Zustand are installed, but they are not the main driver of the current visible flow

## Form and UI Utilities

- `react-hook-form`
  Form management library

- `@headlessui/react`
  Accessible unstyled UI primitives

- `react-hot-toast`
  Toast notification library

- `date-fns`
  Date formatting and date utilities

Current note:

- some of these are present as project dependencies even if not heavily used in the current code paths

## Testing Libraries

- `@testing-library/react`
  React component testing

- `@testing-library/dom`
  DOM testing helpers

- `@testing-library/jest-dom`
  Extra Jest matchers for DOM assertions

- `@testing-library/user-event`
  Simulates real user interactions in tests

## Performance

- `web-vitals`
  Frontend performance metrics helper

## 8. Backend Dependencies

These come from `backend/package.json`.

## Core Backend Libraries

- `express`
  HTTP server and routing framework

- `mongoose`
  MongoDB ODM used for schemas, models, and database queries

- `dotenv`
  Loads environment variables from `.env`

- `cors`
  Allows frontend-backend cross-origin communication

- `helmet`
  Adds common HTTP security headers

- `morgan`
  Request logging in development

## Auth and Security

- `bcryptjs`
  Password hashing and comparison

- `jsonwebtoken`
  JWT creation and verification

- `express-mongo-sanitize`
  Helps prevent Mongo query injection

- `express-rate-limit`
  Rate limiting for API protection

- `express-validator`
  Request payload validation utilities

- `cookie-parser`
  Parses cookies on incoming requests

Current note:

- `cookie-parser`, `express-rate-limit`, and `express-validator` are installed, but the current app logic shown in this repo does not rely heavily on them yet

## File Upload / Media / Email / Payments / Realtime

- `multer`
  Multipart form and upload handling

- `cloudinary`
  Image/media storage integration

- `nodemailer`
  Email sending, used for password reset OTP flow

- `stripe`
  Payment integration

- `socket.io`
  Realtime messaging/events support

Current note:

- these are part of the platform direction, but not every package is equally active in the current visible app flow

## Dev Dependency

- `nodemon`
  Restarts the backend automatically during development

## 9. Environment Variables

## Backend Environment

Typical backend variables:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `EMAIL_SERVICE`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `CLIENT_URL`
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`
- `ADZUNA_COUNTRY`

## Frontend Environment

- `REACT_APP_API_URL`
- `REACT_APP_SOCKET_URL`

Important behavior:

- CRA reads frontend env vars at build time
- if frontend env vars change, the frontend needs to be restarted or rebuilt

## 10. Current Runtime Behavior Notes

- The frontend currently talks to the backend through `axios`
- The backend blocks `/api/*` requests when MongoDB is not connected
- Auth is token-based through local storage and request headers
- Marketplace data is public
- Other pages may still call protected API endpoints even if the route itself is open

That means:

- a page can open successfully in React
- but some parts of its data can still fail if the user is not authenticated

## 11. Good Files To Read First

If you want to understand the project quickly, start here:

- `README.md`
- `frontend/src/App.js`
- `frontend/src/services/api.js`
- `frontend/src/services/auth.js`
- `frontend/src/services/assignments.js`
- `backend/app.js`
- `backend/routes/auth.js`
- `backend/routes/assignments.js`
- `backend/controllers/authController.js`
- `backend/controllers/assignmentController.js`
- `backend/models/User.js`
- `backend/models/Assignment.js`

## 12. Summary In One Paragraph

AssignHub is a React + Express + MongoDB assignment marketplace. The frontend renders pages and calls backend APIs using Axios. The backend handles auth, assignments, user profile data, wallets, and external marketplace integration through Express controllers and Mongoose models. User auth is based on JWT tokens stored in local storage, and MongoDB is the main source of truth for users, assignments, and related marketplace activity.
