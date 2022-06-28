import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCounterComponent } from './word-counter.component';

describe('WordCounterComponent', () => {
  let component: WordCounterComponent;
  let fixture: ComponentFixture<WordCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
