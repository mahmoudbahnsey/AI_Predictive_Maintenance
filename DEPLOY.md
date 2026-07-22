# VoltIQ — Firebase Hosting + Security Deployment

## Prerequisites
- Firebase project created
- Firebase Hosting + Realtime Database enabled

## One-time setup

```powershell
npm install
npm run build
npm install -g firebase-tools
firebase login
firebase init
```

During `firebase init`:
- Hosting → public: `dist`, SPA: Yes
- Database → choose your project

## Deploy Application + Security Rules (CRITICAL)

```powershell
# 1. Build the React app
npm run build

# 2. Deploy Hosting + Realtime Database Rules together
firebase deploy
```

This will deploy:
- The web app
- `database.rules.json` (very important for permissions & security)

You can also deploy rules only:
```powershell
firebase deploy --only database
```

## Your live URL

https://voltiq-dashboard.web.app/   (your current hosting site)

## VERY IMPORTANT: Bootstrap the First Administrator

Because new users are created with `status: "pending"`, you need at least one approved admin to approve others.

### Recommended bootstrap method:

1. After the first person registers (they will be stuck on "pending").
2. Go to Firebase Console → Realtime Database.
3. Navigate to the `users` node.
4. Find the UID of the person who should be the first admin.
5. Edit / create the record like this:

```json
{
  "your-uid-here": {
    "email": "admin@company.com",
    "role": "admin",
    "status": "approved",
    "createdAt": 1700000000000
  }
}
```

6. That user can now log in and will have full admin rights (Users page, Logs, etc.).

From that point forward, the admin can approve all other users through the UI.

## Security Model Summary

- New accounts are **always** created with `status: pending`.
- Only users with `status: "approved"` + `role: "admin"` can:
  - Read the full user list
  - Change roles/status of other users
  - Read activity logs
- Database rules (`database.rules.json`) enforce this at the server level.
- Client-side (React) also double-checks before showing admin UI or allowing actions.
- If an admin suspends/rejects a user who is currently logged in, they are **immediately forced out**.

## Environment Variables

Never commit real `.env`. Use `.env.example` for the team.

## Future Hardening Recommendations

- Move user approval + role management to a Cloud Function (using Admin SDK) for even stronger security.
- Add Firebase App Check.
- Enable email verification in Firebase Auth.
- Add 2FA / Google Sign-in for admins.
