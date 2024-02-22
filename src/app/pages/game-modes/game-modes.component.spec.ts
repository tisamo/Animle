import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameModesComponent } from './game-modes.component';

describe('GameModesComponent', () => {
  let component: GameModesComponent;
  let fixture: ComponentFixture<GameModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameModesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
