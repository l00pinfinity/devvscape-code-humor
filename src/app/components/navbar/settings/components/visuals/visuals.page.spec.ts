import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualsPage } from './visuals.page';

describe('VisualsPage', () => {
  let component: VisualsPage;
  let fixture: ComponentFixture<VisualsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
