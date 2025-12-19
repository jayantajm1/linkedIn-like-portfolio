import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VisitorTrackingService } from "../../../../services/visitor-tracking.service";
import { AnalyticsService } from "../../../../services/analytics.service";
import { VisitorInfo, AnalyticsData } from "../../../../models/visitor.model";

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./overview.component.html",
  styleUrl: "./overview.component.scss",
})
export class OverviewComponent implements OnInit {
  analytics: AnalyticsData | null = null;
  recentVisitors: VisitorInfo[] = [];

  constructor(
    private visitorService: VisitorTrackingService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadData();
    // Subscribe to visitors changes
    this.visitorService.visitors$.subscribe(() => {
      this.loadData();
    });
  }

  private loadData(): void {
    const visitors = this.visitorService.getVisitors();
    this.analytics = this.analyticsService.calculateAnalytics(visitors);
    this.recentVisitors = visitors.slice(0, 5);
  }
}
