import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { VisitorInfo, Interaction } from "../models/visitor.model";

@Injectable({
  providedIn: "root",
})
export class VisitorTrackingService {
  private readonly STORAGE_KEY = "portfolio_visitors";
  private readonly MAX_LOCAL_VISITORS = 100;
  private currentVisitor: VisitorInfo | null = null;
  private visitorsSubject = new BehaviorSubject<VisitorInfo[]>([]);
  public visitors$ = this.visitorsSubject.asObservable();

  constructor() {
    this.initTracking();
  }

  private async initTracking(): Promise<void> {
    this.currentVisitor = await this.createVisitorInfo();
    this.saveVisit(this.currentVisitor);
    this.setupEventListeners();
    this.loadVisitors();
  }

  private async createVisitorInfo(): Promise<VisitorInfo> {
    const deviceInfo = this.getDeviceInfo();
    const location = await this.getLocation();

    return {
      id: this.generateId(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      page: window.location.pathname,
      referrer: document.referrer || "Direct",
      userAgent: navigator.userAgent,
      device: deviceInfo,
      location: location,
      interactions: [],
    };
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;
    let deviceType = "Desktop";

    if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) {
      deviceType = /iPad|Tablet/.test(ua) ? "Tablet" : "Mobile";
    }

    const os = this.detectOS(ua);
    const browser = this.detectBrowser(ua);
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    return { type: deviceType, os, browser, screenResolution };
  }

  private detectOS(ua: string): string {
    if (ua.includes("Win")) return "Windows";
    if (ua.includes("Mac")) return "MacOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
      return "iOS";
    return "Unknown";
  }

  private detectBrowser(ua: string): string {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome") && !ua.includes("Edge")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    return "Unknown";
  }

  private async getLocation(): Promise<any> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city,
          region: data.region,
          country: data.country_name,
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    } catch (error) {
      console.log("Location detection failed:", error);
    }
    return undefined;
  }

  private setupEventListeners(): void {
    // Track clicks
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      this.addInteraction({
        type: "click",
        timestamp: Date.now(),
        element:
          target.tagName +
          (target.id ? "#" + target.id : "") +
          (target.className ? "." + target.className.split(" ")[0] : ""),
      });
    });

    // Track page visibility change (session duration)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.currentVisitor) {
        const duration = Date.now() - this.currentVisitor.timestamp;
        this.currentVisitor.sessionDuration = Math.floor(duration / 1000);
        this.saveVisit(this.currentVisitor);
      }
    });
  }

  private addInteraction(interaction: Interaction): void {
    if (this.currentVisitor) {
      this.currentVisitor.interactions.push(interaction);
      this.saveVisit(this.currentVisitor);
    }
  }

  private saveVisit(visitor: VisitorInfo): void {
    const visitors = this.getStoredVisitors();
    const existingIndex = visitors.findIndex((v) => v.id === visitor.id);

    if (existingIndex !== -1) {
      visitors[existingIndex] = visitor;
    } else {
      visitors.unshift(visitor);

      // Limit stored visitors
      if (visitors.length > this.MAX_LOCAL_VISITORS) {
        visitors.pop();
      }
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(visitors));
    this.visitorsSubject.next(visitors);
  }

  private getStoredVisitors(): VisitorInfo[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private loadVisitors(): void {
    const visitors = this.getStoredVisitors();
    this.visitorsSubject.next(visitors);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Public methods
  getVisitors(): VisitorInfo[] {
    return this.getStoredVisitors();
  }

  getVisitorsByDateRange(startDate: Date, endDate: Date): VisitorInfo[] {
    const visitors = this.getStoredVisitors();
    return visitors.filter((v) => {
      const visitorDate = new Date(v.timestamp);
      return visitorDate >= startDate && visitorDate <= endDate;
    });
  }

  clearVisitors(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.visitorsSubject.next([]);
  }

  exportVisitors(): string {
    return JSON.stringify(this.getStoredVisitors(), null, 2);
  }
}
