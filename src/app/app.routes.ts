import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        loadComponent: () =>
          import(
            "./components/dashboard/pages/overview/overview.component"
          ).then((m) => m.OverviewComponent),
      },
      {
        path: "visitors",
        loadComponent: () =>
          import(
            "./components/dashboard/pages/visitors/visitors.component"
          ).then((m) => m.VisitorsComponent),
      },
      {
        path: "analytics",
        loadComponent: () =>
          import(
            "./components/dashboard/pages/analytics/analytics.component"
          ).then((m) => m.AnalyticsComponent),
      },
      {
        path: "reports",
        loadComponent: () =>
          import("./components/dashboard/pages/reports/reports.component").then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: "settings",
        loadComponent: () =>
          import(
            "./components/dashboard/pages/settings/settings.component"
          ).then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
