# LinkedIn-Style Portfolio - Angular Version

A modern, LinkedIn-inspired portfolio website built with Angular 17+, featuring comprehensive visitor analytics and dashboard.

## Features

### Portfolio

- 🎨 LinkedIn-inspired modern design
- 📱 Fully responsive layout
- ⚡ Fast performance with Angular standalone components
- 🎯 Clean and professional UI

### Analytics Dashboard

- 📊 Real-time visitor tracking
- 📈 Interactive charts and visualizations
- 🗺️ Geographic location tracking
- 📱 Device and browser analytics
- ⏱️ Session duration monitoring
- 🔐 Password-protected access (default: admin123)

### Dashboard Pages

1. **Overview** - Quick stats and recent visitors
2. **Visitors** - Detailed visitor list with filters
3. **Analytics** - Charts and visualizations
4. **Reports** - Export and reporting (coming soon)
5. **Settings** - Dashboard configuration

## Tech Stack

- **Framework**: Angular 17+ (Standalone Components)
- **Language**: TypeScript 5.4+
- **Styling**: SCSS
- **Charts**: Chart.js 4.4
- **Backend**: Firebase/Firestore (optional)
- **Email**: EmailJS
- **State Management**: RxJS

## Prerequisites

- Node.js >= 18.18.1
- npm >= 10.8.3
- Angular CLI 17+

## Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Firebase (Optional)**
   Edit `src/environments/environment.ts` and add your Firebase config:

```typescript
export const environment = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    // ... other config
  },
};
```

3. **Configure EmailJS (Optional)**
   Add your EmailJS credentials to `src/environments/environment.ts`

## Development

Start the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

## Build

Build for production:

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/                    # Main portfolio page
│   │   └── dashboard/               # Analytics dashboard
│   │       ├── dashboard.component.*
│   │       └── pages/
│   │           ├── overview/        # Dashboard overview
│   │           ├── visitors/        # Visitors list & filters
│   │           ├── analytics/       # Charts & visualizations
│   │           ├── reports/         # Reports page
│   │           └── settings/        # Settings page
│   ├── services/
│   │   ├── visitor-tracking.service.ts   # Visitor tracking logic
│   │   ├── analytics.service.ts          # Analytics calculations
│   │   └── firebase.service.ts           # Firebase integration
│   ├── models/
│   │   └── visitor.model.ts         # Data models
│   ├── app.component.*
│   ├── app.config.ts                # App configuration
│   └── app.routes.ts                # Routing configuration
├── environments/
│   ├── environment.ts               # Dev environment
│   └── environment.prod.ts          # Prod environment
├── assets/                          # Static assets
├── styles.scss                      # Global styles
└── index.html
```

## Usage

### Accessing the Dashboard

1. Navigate to `/dashboard`
2. Enter password (default: `admin123`)
3. View analytics and visitor data

### Changing Dashboard Password

Go to Dashboard → Settings → Security → Change password

### Visitor Tracking

Visitor tracking starts automatically when users visit your portfolio. It collects:

- Date and time
- Geographic location (IP-based)
- Device type and OS
- Browser information
- Page views
- Session duration
- User interactions

### Data Storage

By default, visitor data is stored in localStorage (up to 100 visitors). For unlimited storage:

1. Set up Firebase/Firestore
2. Configure Firebase credentials in environment files
3. Data will automatically sync to cloud

### Exporting Data

In the Visitors page, click "Export Data" to download visitor data as JSON.

## Configuration

### Analytics Settings

Configure tracking options in Dashboard → Settings:

- Enable/disable visitor tracking
- Toggle geo-location tracking
- Configure interaction tracking
- Set data retention period

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Add your web app and copy the config
4. Update `src/environments/environment.ts`

## Deployment

### Deploy to Firebase Hosting

```bash
ng build --configuration production
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to GitHub Pages

```bash
ng build --configuration production --base-href "/your-repo-name/"
npx angular-cli-ghpages --dir=dist/linkedin-portfolio/browser
```

### Deploy to Netlify

1. Build: `ng build --configuration production`
2. Publish directory: `dist/linkedin-portfolio/browser`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this for your own portfolio!

## Support

For issues or questions, please create an issue in the GitHub repository.

## Roadmap

- [ ] PDF report generation
- [ ] Email report scheduling
- [ ] Real-time analytics
- [ ] A/B testing features
- [ ] Integration with Google Analytics
- [ ] Custom event tracking
- [ ] Heatmap visualization

---

Built with ❤️ using Angular
