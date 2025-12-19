export interface VisitorInfo {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  page: string;
  referrer: string;
  userAgent: string;
  device: {
    type: string;
    os: string;
    browser: string;
    screenResolution: string;
  };
  location?: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  interactions: Interaction[];
  sessionDuration?: number;
}

export interface Interaction {
  type: "click" | "scroll" | "form_submit" | "page_view";
  timestamp: number;
  element?: string;
  data?: any;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { page: string; count: number }[];
  deviceStats: { type: string; count: number }[];
  locationStats: { country: string; count: number }[];
  hourlyStats: { hour: number; count: number }[];
}
