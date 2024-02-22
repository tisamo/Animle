import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardedElementComponent } from './guarded-element.component';

describe('GuardedElementComponent', () => {
  let component: GuardedElementComponent;
  let fixture: ComponentFixture<GuardedElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardedElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuardedElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
