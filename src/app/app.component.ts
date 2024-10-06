import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from './packages.service';
import { HttpClientModule } from '@angular/common/http';
import { Package, PackageWithDependencies } from './models/package.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HttpClientModule],
})
export class AppComponent implements OnInit {
  packages: Package[] = [];
  result: PackageWithDependencies[] = [];
  hoveredCards: string[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.getPackageInfo();
  }

  getPackageInfo(): void {
    this.result = [];
    this.packageService.getPackages().subscribe((packages) => {
      this.packages = packages;

      this.packages.forEach((pkg) => {
        this.packageService
          .getPackageDependencies(pkg.id)
          .subscribe((dependencies) => {
            this.result.push({
              id: pkg.id,
              dependencies: dependencies,
              weeklyDownloads: pkg.weeklyDownloads,
              dependencyCount: pkg.dependencyCount,
            });
          });
      });
    });
  }

  onHover(pkgId: string): void {
    const hoveredPackage = this.result.find((pkg) => pkg.id === pkgId);
    if (hoveredPackage) {
      this.hoveredCards = hoveredPackage.dependencies;
    }
  }

  onLeave(): void {
    this.hoveredCards = [];
  }

  isDependentOnHovered(pkgId: string): boolean {
    return this.hoveredCards.includes(pkgId);
  }

  sortPackages(): void {
    this.result.sort((a, b) => a.id.localeCompare(b.id));
  }

  reloadWidget(): void {
    this.ngOnInit();
  }

  splitPackageName(pkgId: string): {
    firstPart: string | null;
    secondPart: string;
  } {
    if (pkgId.includes('/')) {
      const parts = pkgId.split('/');
      return { firstPart: parts[0], secondPart: parts[1] };
    }
    return { firstPart: null, secondPart: pkgId };
  }

  formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return Math.floor(value / 1_000_000) + 'M';
    } else if (value >= 1_000) {
      return Math.floor(value / 1_000) + 'K';
    }
    return value.toString();
  }
}
