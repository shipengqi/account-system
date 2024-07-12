import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNavItemComponent } from './header-nav-item.component';

describe('HeaderNavItemComponent', () => {
  let component: HeaderNavItemComponent;
  let fixture: ComponentFixture<HeaderNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderNavItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
