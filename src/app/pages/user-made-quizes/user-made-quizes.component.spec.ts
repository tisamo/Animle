import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMadeQuizesComponent } from './user-made-quizes.component';

describe('UserMadeQuizesComponent', () => {
  let component: UserMadeQuizesComponent;
  let fixture: ComponentFixture<UserMadeQuizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMadeQuizesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMadeQuizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
