import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathSearchComponent } from './math-search.component';

describe('MathSearchComponent', () => {
  let component: MathSearchComponent;
  let fixture: ComponentFixture<MathSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MathSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MathSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
