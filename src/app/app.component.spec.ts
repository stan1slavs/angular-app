import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { PackageService } from './packages.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let packageService: PackageService;

  const mockPackages = [
    { id: '@angular/core', weeklyDownloads: 1200000, dependencyCount: 5 },
    { id: 'rxjs', weeklyDownloads: 600000, dependencyCount: 2 },
  ];

  const mockDependencies = ['@angular/common', '@angular/compiler'];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent],
      providers: [PackageService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    packageService = TestBed.inject(PackageService);

    spyOn(packageService, 'getPackages').and.returnValue(of(mockPackages));
    spyOn(packageService, 'getPackageDependencies').and.returnValue(
      of(mockDependencies)
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load packages on init', () => {
    component.ngOnInit();
    expect(component.packages.length).toBe(2);
    expect(component.result.length).toBe(2);
    expect(component.result[0].id).toBe('@angular/core');
    expect(component.result[0].dependencies).toEqual(mockDependencies);
  });

  it('should format number correctly', () => {
    expect(component.formatNumber(1500000)).toBe('1M');
    expect(component.formatNumber(900000)).toBe('900K');
    expect(component.formatNumber(999)).toBe('999');
  });

  it('should split package name correctly', () => {
    const result = component.splitPackageName('@angular/core');
    expect(result.firstPart).toBe('@angular');
    expect(result.secondPart).toBe('core');
  });

  it('should highlight dependencies on hover', () => {
    component.onHover('@angular/core');
    expect(component.hoveredCards).toEqual(mockDependencies);
  });

  it('should clear hovered dependencies on leave', () => {
    component.hoveredCards = mockDependencies;
    component.onLeave();
    expect(component.hoveredCards.length).toBe(0);
  });

  it('should sort packages by name', () => {
    component.result = [
      {
        id: 'rxjs',
        dependencies: [],
        weeklyDownloads: 600000,
        dependencyCount: 2,
      },
      {
        id: '@angular/core',
        dependencies: [],
        weeklyDownloads: 1200000,
        dependencyCount: 5,
      },
    ];
    component.sortPackages();
    expect(component.result[0].id).toBe('@angular/core');
    expect(component.result[1].id).toBe('rxjs');
  });

  it('should reload widget', () => {
    spyOn(component, 'ngOnInit');
    component.reloadWidget();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should not highlight a package if it is not dependent on hovered', () => {
    component.onHover('@angular/core');
    expect(component.isDependentOnHovered('rxjs')).toBeFalse();
  });

  it('should highlight a package if it is dependent on hovered', () => {
    component.onHover('@angular/core');
    expect(component.isDependentOnHovered('@angular/common')).toBeTrue();
  });
});
