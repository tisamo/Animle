import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyQuizComponent } from './property-quiz.component';

describe('PropertyQuizComponent', () => {
  let component: PropertyQuizComponent;
  let fixture: ComponentFixture<PropertyQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertyQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
