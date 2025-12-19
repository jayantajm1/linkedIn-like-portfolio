import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from "@angular/router";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  isAuthenticated = false;
  password = "";
  errorMessage = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if already authenticated
    const auth = sessionStorage.getItem("dashboard_auth");
    if (auth === "true") {
      this.isAuthenticated = true;
    }
  }

  login(passwordInput: string): void {
    if (passwordInput === "admin123") {
      this.isAuthenticated = true;
      sessionStorage.setItem("dashboard_auth", "true");
      this.errorMessage = "";
    } else {
      this.errorMessage = "Invalid password!";
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    sessionStorage.removeItem("dashboard_auth");
    this.router.navigate(["/"]);
  }
}
