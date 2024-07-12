import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeaderItemComponent } from './layout-header-item.component';

describe('LayoutHeaderItemComponent', () => {
  let component: LayoutHeaderItemComponent;
  let fixture: ComponentFixture<LayoutHeaderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutHeaderItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutHeaderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
