# AssignHub MERN

AssignHub is a MERN-based assignment marketplace. It includes a React frontend, an Express/MongoDB backend, authentication flows, wallet/profile endpoints, and a marketplace view that can combine your local assignments with an external Upwork feed when configured.

## Stack

- Frontend: React, React Router, Axios, CRA dev server
- Backend: Express, Mongoose, JWT auth
- Database: MongoDB Atlas or local MongoDB
- Optional external marketplace feed: Upwork GraphQL API

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
- Worker and provider dashboard screens
- Wallet and transaction endpoints
- Optional Upwork marketplace import feed

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
UPWORK_ACCESS_TOKEN=
UPWORK_ORG_ID=
```

Frontend env in [`frontend/.env`](/workspaces/assignhub-mern/frontend/.env):

```env
REACT_APP_API_URL=/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Notes:

- If you use MongoDB Atlas, make sure your IP is allowed in Atlas Network Access.
- If your MongoDB password contains special characters, URL-encode it in `MONGO_URI`.
- `UPWORK_ACCESS_TOKEN` is optional. Without it, the marketplace falls back to local assignments only.

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
- `GET /api/assignments/external/upwork`

Users:

- `GET /api/users/:id/wallet`
- `GET /api/users/:id/transactions`
- `POST /api/users/:id/withdraw`

## Upwork Marketplace Integration

The app can pull real marketplace jobs from Upwork through:

- `GET /api/assignments/external/upwork`

To enable it:

1. Request an Upwork API key/app
2. Complete the OAuth flow to obtain an access token
3. Set `UPWORK_ACCESS_TOKEN` in [`backend/.env`](/workspaces/assignhub-mern/backend/.env)
4. Restart the backend

Without this token, the frontend shows local assignments only and displays a notice that the Upwork feed is unavailable.

Official references:

- Upwork developer docs: https://www.upwork.com/developer/documentation/graphql/api/docs/index.html
- Upwork API key request: https://support.upwork.com/hc/en-us/articles/17995842326931--Request-an-API-key

## Authentication Notes

- Protected routes redirect unauthenticated users to the login page
- Account creation stores JWT and user data in local storage
- Forgot-password sends an OTP email when email config is valid
- In development, if email is not configured, the OTP is returned in the API response

## Common Issues

MongoDB not connecting:

- Check `MONGO_URI`
- Confirm Atlas IP whitelist / Network Access
- Confirm DB username/password
- Restart backend after editing `.env`

Frontend can’t reach backend:

- Make sure backend is running on port `5000`
- Frontend uses CRA proxy to `/api`

Upwork feed unavailable:

- `UPWORK_ACCESS_TOKEN` is missing or invalid
- Upwork app/OAuth flow is not configured yet

## Current Limitations

- Several backend modules like bids, messages, payments, and reviews are still placeholders
- Some UI pages are still scaffolds or partial implementations
- The Upwork integration currently expects a manually supplied access token

## Next Recommended Steps

1. Add persistent token storage and OAuth callback flow for Upwork
2. Finish real assignment detail/apply screens
3. Complete wallet withdrawal UI flow
4. Replace placeholder API modules with real implementations
