import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VisitorTrackingService } from "../../../../services/visitor-tracking.service";
import { VisitorInfo } from "../../../../models/visitor.model";

@Component({
  selector: "app-visitors",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./visitors.component.html",
  styleUrl: "./visitors.component.scss",
})
export class VisitorsComponent implements OnInit {
  visitors: VisitorInfo[] = [];
  filteredVisitors: VisitorInfo[] = [];
  searchTerm = "";
  filterDevice = "all";
  filterCountry = "all";
  countries: string[] = [];

  constructor(private visitorService: VisitorTrackingService) {}

  ngOnInit(): void {
    this.loadVisitors();
    this.visitorService.visitors$.subscribe(() => {
      this.loadVisitors();
    });
  }

  private loadVisitors(): void {
    this.visitors = this.visitorService.getVisitors();
    this.filteredVisitors = [...this.visitors];
    this.extractCountries();
  }

  private extractCountries(): void {
    const countrySet = new Set<string>();
    this.visitors.forEach((v) => {
      if (v.location?.country) {
        countrySet.add(v.location.country);
      }
    });
    this.countries = Array.from(countrySet).sort();
  }

  applyFilters(): void {
    this.filteredVisitors = this.visitors.filter((visitor) => {
      // Search filter
      const matchesSearch =
        this.searchTerm === "" ||
        visitor.location?.country
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        visitor.device.browser
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        visitor.device.type
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      // Device filter
      const matchesDevice =
        this.filterDevice === "all" ||
        visitor.device.type.toLowerCase() === this.filterDevice.toLowerCase();

      // Country filter
      const matchesCountry =
        this.filterCountry === "all" ||
        visitor.location?.country === this.filterCountry;

      return matchesSearch && matchesDevice && matchesCountry;
    });
  }

  clearData(): void {
    if (confirm("Are you sure you want to clear all visitor data?")) {
      this.visitorService.clearVisitors();
    }
  }

  exportData(): void {
    const data = this.visitorService.exportVisitors();
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
