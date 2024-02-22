import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionQuizComponent } from './description-quiz.component';

describe('DescriptionQuizComponent', () => {
  let component: DescriptionQuizComponent;
  let fixture: ComponentFixture<DescriptionQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescriptionQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
