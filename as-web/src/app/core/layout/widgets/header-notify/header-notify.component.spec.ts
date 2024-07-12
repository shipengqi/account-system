import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNotifyComponent } from './header-notify.component';

describe('HeaderNotifyComponent', () => {
  let component: HeaderNotifyComponent;
  let fixture: ComponentFixture<HeaderNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
