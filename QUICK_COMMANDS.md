# Quick Reference Commands

## Development

```bash
# Start development server
npm start
# or
ng serve

# Start on different port
ng serve --port 4201

# Start and open browser
ng serve --open
```

## Build

```bash
# Production build
npm run build
# or
ng build --configuration production

# Development build
ng build
```

## Testing

```bash
# Run tests
npm test
# or
ng test

# Generate code coverage
ng test --code-coverage
```

## Code Generation

```bash
# Generate a new component
ng generate component components/my-component

# Generate a new service
ng generate service services/my-service

# Generate a new interface
ng generate interface models/my-model
```

## Linting & Formatting

```bash
# Check for linting errors
ng lint

# Fix auto-fixable linting issues
ng lint --fix
```

## Deployment

```bash
# Build for production
ng build --configuration production

# Deploy to Firebase
firebase deploy

# Deploy to GitHub Pages
npm install -g angular-cli-ghpages
ng build --configuration production --base-href "/repo-name/"
npx angular-cli-ghpages --dir=dist/linkedin-portfolio/browser
```

## Useful Angular CLI Commands

```bash
# Get help
ng help

# Check Angular version
ng version

# Update Angular packages
ng update

# Update specific package
ng update @angular/core @angular/cli
```

## Dashboard Access

- URL: http://localhost:4200/dashboard
- Default Password: **admin123**

## Project Structure

```
src/
├── app/                    # Application code
│   ├── components/         # UI components
│   ├── services/          # Business logic
│   ├── models/            # TypeScript interfaces
│   └── app.routes.ts      # Route configuration
├── environments/          # Environment configs
├── assets/                # Static files
└── styles.scss            # Global styles
```

## Environment Variables

### Development

File: `src/environments/environment.ts`

### Production

File: `src/environments/environment.prod.ts`

## Firebase Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
};
```

## Troubleshooting

### Clear Angular cache

```bash
rm -rf .angular
```

### Reinstall node_modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Check for errors

```bash
ng build --configuration production
```

### Fix security vulnerabilities

```bash
npm audit fix
```

## Port Management

Default: 4200
If port is in use:

```bash
# Kill process on port 4200 (Windows)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Use different port
ng serve --port 4201
```

## Browser DevTools

- F12 - Open DevTools
- Ctrl+Shift+I - Open DevTools
- Ctrl+Shift+M - Toggle device toolbar (mobile view)

## Recommended VS Code Extensions

- Angular Language Service
- Angular Snippets
- TypeScript Importer
- Path Intellisense
- Auto Rename Tag
- Prettier - Code formatter
- ESLint
- GitLens

## NPM Scripts

```json
"start": "ng serve",
"build": "ng build",
"watch": "ng build --watch --configuration development",
"test": "ng test",
"serve": "ng serve --open"
```

## Git Commands

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Angular migration complete"

# Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

---

**Quick Start**: `npm start` → http://localhost:4200/
