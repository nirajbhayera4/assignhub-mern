# AssignHub MERN

AssignHub is a MERN-based assignment marketplace for an Indian audience. It includes a React frontend, an Express/MongoDB backend, authentication flows, wallet/profile endpoints, a richer assignment posting flow, and a marketplace view that can combine your local assignments with an external Adzuna feed when configured.

## Stack

- Frontend: React, React Router, Axios, CRA dev server
- Backend: Express, Mongoose, JWT auth
- Database: MongoDB Atlas or local MongoDB
- Optional external marketplace feed: Adzuna Jobs API

## Project Structure

```text
assignhub-mern/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
└── README.md
```

## Features

- Account creation and login
- Forgot-password flow with OTP reset
- Protected frontend routes for authenticated users
- Assignment marketplace backed by MongoDB
- Dedicated post-assignment page with:
  title, description, subject, category, assignment type, deadline, budget, difficulty, pricing model, estimated time, skills, and attachments
- Provider dashboard with assignment stats and direct post flow
- Worker and provider dashboard screens
- Profile editing with avatar, bio, skills, and college ID
- Wallet and transaction endpoints with INR display in the frontend
- Assignment status tracking: `Open`, `In Progress`, `Completed`, `Cancelled`
- Bidding-ready application model with proposed budget, estimated time, and proposal message
- Optional Adzuna marketplace import feed

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB Atlas connection string or local MongoDB

## Environment Setup

Create or update [`backend/.env`](/workspaces/assignhub-mern/backend/.env):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_real_secret
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=AssignHub <noreply@assignhub.com>
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_public
CLIENT_URL=http://localhost:3000
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
ADZUNA_COUNTRY=in
```

Frontend env in [`frontend/.env`](/workspaces/assignhub-mern/frontend/.env):

```env
REACT_APP_API_URL=/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Notes:

- If you use MongoDB Atlas, make sure your IP is allowed in Atlas Network Access.
- If your MongoDB password contains special characters, URL-encode it in `MONGO_URI`.
- `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are optional. Without them, the marketplace falls back to local assignments only.

## Install Dependencies

Backend:

```bash
cd /workspaces/assignhub-mern/backend
npm install
```

Frontend:

```bash
cd /workspaces/assignhub-mern/frontend
npm install
```

## Run the App

Start backend:

```bash
cd /workspaces/assignhub-mern/backend
node server.js
```

Start frontend:

```bash
cd /workspaces/assignhub-mern/frontend
npm start
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Current Posting Flow

After login, users can open `/post-assignment` and create richer marketplace posts. The current form supports:

- Title
- Description
- Subject
- Category: `Coding`, `Design`, `Writing`, `Presentation`, `Research`, `Other`
- Assignment type: `Homework`, `Project`, `Thesis`, `Exam Prep`, `Presentation`, `Other`
- Deadline
- Budget / reward
- Pricing type: `Fixed Price` or `Bidding`
- Estimated completion time
- Skills required
- Maximum workers
- Attachments: PDF, docs, and images
- Poster snapshot details from the logged-in profile: name, college ID, verification status, rating

To get the best result, update your profile first:

```bash
# start frontend and backend, then log in
# open the profile page and add your college ID / skills
http://localhost:3000/profile
```

## Seed Sample Data

To populate sample users and assignments:

```bash
cd /workspaces/assignhub-mern/backend
node seed.js
```

This clears existing `users` and `assignments` and inserts demo data.

## Available Scripts

Backend:

```bash
npm start
npm run dev
```

Frontend:

```bash
npm start
npm run build
npm test
```

## Main API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

Assignments:

- `GET /api/assignments`
- `GET /api/assignments/:id`
- `POST /api/assignments`
- `POST /api/assignments/:id/apply`
- `GET /api/assignments/external/adzuna`

Users:

- `GET /api/users/:id/wallet`
- `GET /api/users/:id/transactions`
- `POST /api/users/:id/withdraw`

## Adzuna Marketplace Integration

The app can pull real marketplace jobs from Adzuna through:

- `GET /api/assignments/external/adzuna`

To enable it:

1. Create an Adzuna developer app
2. Set `ADZUNA_APP_ID` in [`backend/.env`](/workspaces/assignhub-mern/backend/.env)
3. Set `ADZUNA_APP_KEY` in [`backend/.env`](/workspaces/assignhub-mern/backend/.env)
4. Optionally set `ADZUNA_COUNTRY=in` for India-focused search results
5. Restart the backend

Without these values, the frontend shows local assignments only and displays a notice that the Adzuna feed is unavailable.

The codebase currently expects Adzuna configuration, not Upwork.

## Authentication Notes

- Protected routes redirect unauthenticated users to the login page
- Account creation stores JWT and user data in local storage
- Profile updates can save avatar, bio, skills, and college ID
- Forgot-password sends an OTP email when email config is valid
- In development, if email is not configured, the OTP is returned in the API response

## Currency Notes

- The frontend now presents assignment budgets, balances, and payment amounts in Indian Rupees (`INR` / `₹`)
- The backend stores numeric amounts as regular numbers; the frontend handles INR formatting
- If you seed old sample data, values are treated as rupee amounts in the current UI

## Common Issues

MongoDB not connecting:

- Check `MONGO_URI`
- Confirm Atlas IP whitelist / Network Access
- Confirm DB username/password
- Restart backend after editing `.env`

Frontend can’t reach backend:

- Make sure backend is running on port `5000`
- Frontend uses CRA proxy to `/api`

Adzuna feed unavailable:

- `ADZUNA_APP_ID` or `ADZUNA_APP_KEY` is missing or invalid
- External feed config is not set yet

## Current Limitations

- Several backend modules like bids, messages, payments, and reviews are still placeholders or only partially wired
- Assignment posting is much richer now, but assignment detail, editing, bidding UI, reviews, and escrow still need full end-to-end flows
- Attachments are currently stored on the assignment as data URLs; this is fine for development but should move to object storage or Cloudinary for production
- The Adzuna integration is optional and depends on external API configuration

## Next Recommended Steps

1. Add assignment detail and edit screens
2. Build the actual bidding/apply UI using the proposal fields already added to the application model
3. Replace placeholder bids, reviews, messages, and payments modules with real implementations
4. Move file attachments to production-safe cloud storage
5. Add notifications, proof-of-work submission, and smart matching
