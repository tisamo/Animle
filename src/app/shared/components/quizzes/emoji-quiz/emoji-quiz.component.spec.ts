import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiQuizComponent } from './emoji-quiz.component';

describe('EmojiQuizComponent', () => {
  let component: EmojiQuizComponent;
  let fixture: ComponentFixture<EmojiQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmojiQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
