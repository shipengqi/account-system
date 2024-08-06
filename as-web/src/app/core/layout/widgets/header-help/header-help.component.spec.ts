import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHelpComponent } from './header-help.component';

describe('HeaderHelpComponent', () => {
  let component: HeaderHelpComponent;
  let fixture: ComponentFixture<HeaderHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
