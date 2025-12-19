import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Chart, registerables } from "chart.js";
import { VisitorTrackingService } from "../../../../services/visitor-tracking.service";
import { AnalyticsService } from "../../../../services/analytics.service";

Chart.register(...registerables);

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./analytics.component.html",
  styleUrl: "./analytics.component.scss",
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild("visitorsChart") visitorsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("devicesChart") devicesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("locationsChart")
  locationsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("hoursChart") hoursChartRef!: ElementRef<HTMLCanvasElement>;

  private visitorsChart: Chart | null = null;
  private devicesChart: Chart | null = null;
  private locationsChart: Chart | null = null;
  private hoursChart: Chart | null = null;

  constructor(
    private visitorService: VisitorTrackingService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Charts will be initialized after view init
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  private initCharts(): void {
    const visitors = this.visitorService.getVisitors();
    const analytics = this.analyticsService.calculateAnalytics(visitors);
    const dailyStats = this.analyticsService.getVisitorsByDay(visitors, 7);

    // Visitors over time chart
    if (this.visitorsChartRef) {
      const ctx = this.visitorsChartRef.nativeElement.getContext("2d");
      if (ctx) {
        this.visitorsChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: dailyStats.map((d) => d.date),
            datasets: [
              {
                label: "Visitors",
                data: dailyStats.map((d) => d.count),
                borderColor: "#0a66c2",
                backgroundColor: "rgba(10, 102, 194, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    }

    // Devices chart
    if (this.devicesChartRef && analytics.deviceStats.length > 0) {
      const ctx = this.devicesChartRef.nativeElement.getContext("2d");
      if (ctx) {
        this.devicesChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: analytics.deviceStats.map((d) => d.type),
            datasets: [
              {
                data: analytics.deviceStats.map((d) => d.count),
                backgroundColor: ["#0a66c2", "#00a0dc", "#57ad68", "#f5c26b"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

    // Locations chart
    if (this.locationsChartRef && analytics.locationStats.length > 0) {
      const ctx = this.locationsChartRef.nativeElement.getContext("2d");
      if (ctx) {
        this.locationsChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: analytics.locationStats.map((l) => l.country),
            datasets: [
              {
                label: "Visitors by Country",
                data: analytics.locationStats.map((l) => l.count),
                backgroundColor: "#0a66c2",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    }

    // Peak hours chart
    if (this.hoursChartRef) {
      const ctx = this.hoursChartRef.nativeElement.getContext("2d");
      if (ctx) {
        this.hoursChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: analytics.hourlyStats.map((h) => `${h.hour}:00`),
            datasets: [
              {
                label: "Visits per Hour",
                data: analytics.hourlyStats.map((h) => h.count),
                backgroundColor: "#00a0dc",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.visitorsChart) this.visitorsChart.destroy();
    if (this.devicesChart) this.devicesChart.destroy();
    if (this.locationsChart) this.locationsChart.destroy();
    if (this.hoursChart) this.hoursChart.destroy();
  }
}
