import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSiderComponent } from './layout-sider.component';

describe('LayoutSideMenuComponent', () => {
  let component: LayoutSiderComponent;
  let fixture: ComponentFixture<LayoutSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutSiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
