import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNotifyItemComponent } from './header-notify-item.component';

describe('HeaderNotifyItemComponent', () => {
  let component: HeaderNotifyItemComponent;
  let fixture: ComponentFixture<HeaderNotifyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderNotifyItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNotifyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
