import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsPage } from './game-details.page';

describe('GameDetailsPage', () => {
  let component: GameDetailsPage;
  let fixture: ComponentFixture<GameDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
