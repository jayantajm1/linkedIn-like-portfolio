import { Injectable } from "@angular/core";
import { VisitorInfo, AnalyticsData } from "../models/visitor.model";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  calculateAnalytics(visitors: VisitorInfo[]): AnalyticsData {
    if (visitors.length === 0) {
      return this.getEmptyAnalytics();
    }

    return {
      totalVisits: visitors.length,
      uniqueVisitors: this.countUniqueVisitors(visitors),
      avgSessionDuration: this.calculateAvgSessionDuration(visitors),
      bounceRate: this.calculateBounceRate(visitors),
      topPages: this.getTopPages(visitors),
      deviceStats: this.getDeviceStats(visitors),
      locationStats: this.getLocationStats(visitors),
      hourlyStats: this.getHourlyStats(visitors),
    };
  }

  private getEmptyAnalytics(): AnalyticsData {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      topPages: [],
      deviceStats: [],
      locationStats: [],
      hourlyStats: [],
    };
  }

  private countUniqueVisitors(visitors: VisitorInfo[]): number {
    const uniqueIds = new Set(visitors.map((v) => v.id));
    return uniqueIds.size;
  }

  private calculateAvgSessionDuration(visitors: VisitorInfo[]): number {
    const durations = visitors
      .filter((v) => v.sessionDuration && v.sessionDuration > 0)
      .map((v) => v.sessionDuration!);

    if (durations.length === 0) return 0;
    const sum = durations.reduce((acc, d) => acc + d, 0);
    return Math.round(sum / durations.length);
  }

  private calculateBounceRate(visitors: VisitorInfo[]): number {
    const bounces = visitors.filter(
      (v) =>
        !v.sessionDuration ||
        v.sessionDuration < 10 ||
        v.interactions.length <= 1
    ).length;

    return visitors.length > 0
      ? Math.round((bounces / visitors.length) * 100)
      : 0;
  }

  private getTopPages(
    visitors: VisitorInfo[]
  ): { page: string; count: number }[] {
    const pageCounts = visitors.reduce((acc, v) => {
      acc[v.page] = (acc[v.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getDeviceStats(
    visitors: VisitorInfo[]
  ): { type: string; count: number }[] {
    const deviceCounts = visitors.reduce((acc, v) => {
      const type = v.device.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deviceCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getLocationStats(
    visitors: VisitorInfo[]
  ): { country: string; count: number }[] {
    const locationCounts = visitors
      .filter((v) => v.location?.country)
      .reduce((acc, v) => {
        const country = v.location!.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getHourlyStats(
    visitors: VisitorInfo[]
  ): { hour: number; count: number }[] {
    const hourlyCounts: Record<number, number> = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyCounts[i] = 0;
    }

    // Count visitors per hour
    visitors.forEach((v) => {
      const hour = new Date(v.timestamp).getHours();
      hourlyCounts[hour]++;
    });

    return Object.entries(hourlyCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour);
  }

  getVisitorsByDay(
    visitors: VisitorInfo[],
    days: number = 7
  ): { date: string; count: number }[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const dayCounts: Record<string, number> = {};

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(now - i * dayMs);
      const dateStr = date.toLocaleDateString();
      dayCounts[dateStr] = 0;
    }

    // Count visitors per day
    visitors.forEach((v) => {
      const date = new Date(v.timestamp).toLocaleDateString();
      if (dayCounts.hasOwnProperty(date)) {
        dayCounts[date]++;
      }
    });

    return Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  }
}
