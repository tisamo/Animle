import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverPopupComponent } from './game-over-popup.component';

describe('GameOverPopupComponent', () => {
  let component: GameOverPopupComponent;
  let fixture: ComponentFixture<GameOverPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameOverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
