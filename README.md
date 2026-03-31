# Matrimony Mobile

Expo React Native app scaffolded from the existing `frontend/matrimony` web project.

## Included in this first mobile port

- Expo TypeScript project structure
- React Navigation stack
- Redux Toolkit + RTK Query store
- AsyncStorage-backed session persistence
- Backend-connected login flow
- Backend-connected registration flow
- OTP-based password reset flow
- Profile fetch and summary screen
- Mobile screens for About, Rules, Conclusion, Not Found, and onboarding entry
- Profile completion form backed by `/user/update/:id`
- Match discovery backed by `/user/list`
- Image upload backed by `/upload/user/dp/:userId`
- Account deletion backed by `/user/delete/:id`

## Environment

Create `project/frontend/matrimony-mobile/.env` from `.env.example`.

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3002/
```

## Install and run

```bash
npm install
npm start
```

## Notes

- This is a mobile-native foundation, not a direct 1:1 copy of the web DOM/CSS components.
- Web-only pieces such as `react-router-dom`, CSS modules/files, `react-toastify`, and browser `localStorage` were replaced with mobile-safe equivalents.
- Payment plan purchase is still the main remaining feature gap because the web app uses browser payment SDK code that needs a proper React Native payment integration.
