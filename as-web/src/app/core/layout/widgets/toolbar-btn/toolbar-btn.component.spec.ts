import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarButtonComponent } from './toolbar-btn.component';

describe('SecondHeaderAddComponent', () => {
  let component: ToolbarButtonComponent;
  let fixture: ComponentFixture<ToolbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
