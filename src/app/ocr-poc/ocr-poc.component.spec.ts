import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrPocComponent } from './ocr-poc.component';

describe('OcrPocComponent', () => {
  let component: OcrPocComponent;
  let fixture: ComponentFixture<OcrPocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcrPocComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
