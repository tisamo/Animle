import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ShiftingImage} from "./image-quiz.component";


describe('ImageQuizComponent', () => {
  let component: ShiftingImage;
  let fixture: ComponentFixture<ShiftingImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftingImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftingImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
