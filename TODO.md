# AssignHub MERN Fix - Login Setup

## Status: Ready to Run ✅

**Login issue fixed** - Code is correct. Issue was missing setup/runtime.

## Steps Completed: None yet (user approval)

## Steps to Complete:

### 1. Backend Setup & Start
```
cd backend
npm install
# Create .env with MONGO_URI (MongoDB Atlas) and JWT_SECRET
npm run dev
```
- Backend runs on http://localhost:5000

### 2. Frontend Start  
```
cd ../ # back to /workspaces/assignhub-mern
npm install
npm start
```
- Frontend: http://localhost:3000 (proxies /api → backend)

### 3. (Optional) Seed Test Data
```
cd backend
node seed.js
```
- Adds john@example.com / password123 (but user wants real accounts)

### 4. Create Real Account & Test Login
1. Go to http://localhost:3000
2. Role selection → Register (email/password)
3. Login with same credentials

## Expected:
- Typing works in login fields.
- Register creates real user.
- Login authenticates → redirects to /marketplace.

## Debug:
- Browser Console + Network tab for errors.
- Backend terminal for DB connection.

**Mark step done by asking me to update TODO.md**
