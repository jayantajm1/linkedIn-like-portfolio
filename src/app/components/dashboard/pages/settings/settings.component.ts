import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent {
  trackingEnabled = true;
  geoLocationEnabled = true;
  interactionsTracking = true;
  dataRetentionDays = 90;
  password = "admin123";

  saveSettings(): void {
    // Save settings to localStorage
    const settings = {
      trackingEnabled: this.trackingEnabled,
      geoLocationEnabled: this.geoLocationEnabled,
      interactionsTracking: this.interactionsTracking,
      dataRetentionDays: this.dataRetentionDays,
      password: this.password,
    };
    localStorage.setItem("dashboard_settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  }

  resetSettings(): void {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      this.trackingEnabled = true;
      this.geoLocationEnabled = true;
      this.interactionsTracking = true;
      this.dataRetentionDays = 90;
      this.password = "admin123";
      this.saveSettings();
    }
  }
}
